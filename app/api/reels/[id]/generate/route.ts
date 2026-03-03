import { NextResponse } from 'next/server'
import { z } from 'zod'
import { generateText } from 'ai'
import { createClient } from '@/lib/supabase/server'
import { ANALYSIS_MODEL } from '@/lib/ai/models'
import { buildBlueprintPrompt } from '@/lib/ai/prompts/blueprint-generation'
import { createBlueprintTool, type BlueprintOutput } from '@/lib/ai/tools/blueprint'
import { generateSceneImage } from '@/lib/reels/replicate-client'
import { synthesizeSpeech } from '@/lib/reels/tts-client'
import { uploadBuffer } from '@/lib/reels/storage-helpers'
import type { TemplateId } from '@/lib/ai/prompts/reel-chat'
import type { Database } from '@/lib/supabase/types'
import type { SupabaseClient } from '@supabase/supabase-js'

export const maxDuration = 60

const idSchema = z.string().uuid()

type DB = SupabaseClient<Database>

export async function POST(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id: reelId } = await params
  const parsed = idSchema.safeParse(reelId)

  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid reel ID' }, { status: 400 })
  }

  const supabase = await createClient()

  // Fetch reel + context
  const { data: reel, error: reelError } = await supabase
    .from('reels')
    .select('id, template, context_id, status')
    .eq('id', parsed.data)
    .single()

  if (reelError || !reel) {
    return NextResponse.json({ error: 'Reel not found' }, { status: 404 })
  }

  if (!reel.context_id) {
    return NextResponse.json({ error: 'Reel has no context attached' }, { status: 400 })
  }

  if (reel.status === 'generating-blueprint' || reel.status === 'generating-assets') {
    return NextResponse.json({ error: 'Generation already in progress' }, { status: 409 })
  }

  const { data: context, error: contextError } = await supabase
    .from('reel_contexts')
    .select('raw_text')
    .eq('id', reel.context_id)
    .single()

  if (contextError || !context) {
    return NextResponse.json({ error: 'Context not found' }, { status: 404 })
  }

  // Create generation job
  const { data: job, error: jobError } = await supabase
    .from('generation_jobs')
    .upsert({ reel_id: parsed.data, status: 'queued', total_steps: 0, done_steps: 0 }, { onConflict: 'reel_id' })
    .select('id')
    .single()

  if (jobError || !job) {
    console.error('[POST /api/reels/[id]/generate] Job creation error', jobError)
    return NextResponse.json({ error: 'Failed to create generation job' }, { status: 500 })
  }

  // Update reel status
  await supabase
    .from('reels')
    .update({ status: 'generating-blueprint' })
    .eq('id', parsed.data)

  await supabase
    .from('generation_jobs')
    .update({ status: 'running', started_at: new Date().toISOString() })
    .eq('id', job.id)

  // Run pipeline in background (fire-and-forget within the request lifetime)
  runGenerationPipeline({
    supabase,
    reelId: parsed.data,
    jobId: job.id,
    template: reel.template as TemplateId,
    contextText: context.raw_text,
  }).catch(err => {
    console.error('[generate pipeline error]', err)
  })

  return NextResponse.json({ data: { job_id: job.id, status: 'queued' } }, { status: 202 })
}

async function runGenerationPipeline(opts: {
  supabase: DB
  reelId: string
  jobId: string
  template: TemplateId
  contextText: string
}) {
  const { supabase, reelId, jobId, template, contextText } = opts

  let sceneInserts: BlueprintOutput['scenes'] = []

  try {
    // Step 1: Generate blueprint
    let savedBlueprint: BlueprintOutput | null = null

    const blueprintTool = createBlueprintTool({
      onSave: async (blueprint) => {
        savedBlueprint = blueprint

        const scenesToInsert = blueprint.scenes.map(scene => ({
          reel_id: reelId,
          sort_order: scene.sort_order,
          type: scene.type,
          script_text: scene.script_text,
          caption_text: scene.caption_text,
          image_prompt: scene.image_prompt,
          start_sec: scene.start_sec,
          end_sec: scene.end_sec,
        }))

        await supabase.from('reel_scenes').delete().eq('reel_id', reelId)
        const { error } = await supabase.from('reel_scenes').insert(scenesToInsert)
        if (error) throw error

        await supabase
          .from('reels')
          .update({
            status: 'generating-assets',
            title: blueprint.title,
            total_scenes: blueprint.scenes.length,
            duration_sec: blueprint.total_sec,
          })
          .eq('id', reelId)

        const totalSteps = blueprint.scenes.length * 2
        await supabase
          .from('generation_jobs')
          .update({ total_steps: totalSteps })
          .eq('id', jobId)
      },
    })

    await generateText({
      model: ANALYSIS_MODEL,
      system: buildBlueprintPrompt({ template, contextText, targetDurationSec: 60 }),
      prompt: 'Generate the reel blueprint now.',
      tools: { generateReelBlueprint: blueprintTool },
      toolChoice: 'required',
    })

    if (!savedBlueprint) throw new Error('Blueprint tool was not called')
    // Type assertion: TypeScript loses narrowing for closure-captured variables
    sceneInserts = (savedBlueprint as BlueprintOutput).scenes

    // Step 2: Fetch inserted scene IDs
    const { data: scenes, error: scenesError } = await supabase
      .from('reel_scenes')
      .select('id, sort_order, script_text, image_prompt, type')
      .eq('reel_id', reelId)
      .order('sort_order', { ascending: true })

    if (scenesError || !scenes) throw scenesError ?? new Error('No scenes found after insert')

    // Step 3: Generate images + audio per scene in parallel
    await Promise.allSettled(
      scenes.map(scene =>
        Promise.allSettled([
          generateImage(supabase, scene, reelId, template, jobId),
          generateAudio(supabase, scene, reelId, jobId),
        ])
      )
    )

    // Step 4: Mark as done
    const allScenes = await supabase
      .from('reel_scenes')
      .select('image_status, audio_status')
      .eq('reel_id', reelId)

    const failed = (allScenes.data ?? []).filter(
      s => s.image_status === 'failed' || s.audio_status === 'failed'
    )
    const finalStatus = failed.length > (scenes.length / 2) ? 'failed' : 'ready'

    await supabase.from('reels').update({ status: finalStatus }).eq('id', reelId)
    await supabase
      .from('generation_jobs')
      .update({ status: finalStatus === 'ready' ? 'done' : 'failed', finished_at: new Date().toISOString() })
      .eq('id', jobId)
  } catch (err) {
    console.error('[runGenerationPipeline]', err)
    await supabase
      .from('reels')
      .update({ status: 'failed' })
      .eq('id', reelId)
    await supabase
      .from('generation_jobs')
      .update({
        status: 'failed',
        error_message: err instanceof Error ? err.message : 'Unknown error',
        finished_at: new Date().toISOString(),
      })
      .eq('id', jobId)
  }
}

async function generateImage(
  supabase: DB,
  scene: { id: string; type: string; image_prompt: string | null },
  reelId: string,
  template: TemplateId,
  jobId: string
) {
  await supabase
    .from('reel_scenes')
    .update({ image_status: 'generating' })
    .eq('id', scene.id)

  try {
    const imageBuffer = await generateSceneImage({
      rawPrompt: scene.image_prompt ?? `${scene.type} scene for a ${template} reel`,
      template,
      sceneType: scene.type as 'hook' | 'context' | 'value' | 'cta',
    })

    const storagePath = `${reelId}/scenes/${scene.id}/image.jpg`
    await uploadBuffer(supabase, { buffer: imageBuffer, path: storagePath, contentType: 'image/jpeg' })

    await supabase
      .from('reel_scenes')
      .update({ image_url: storagePath, image_status: 'ready' })
      .eq('id', scene.id)
  } catch (err) {
    console.error(`[generateImage] scene ${scene.id}`, err)
    await supabase
      .from('reel_scenes')
      .update({ image_status: 'failed' })
      .eq('id', scene.id)
  }

  await incrementDoneSteps(supabase, jobId)
}

async function generateAudio(
  supabase: DB,
  scene: { id: string; script_text: string },
  reelId: string,
  jobId: string
) {
  await supabase
    .from('reel_scenes')
    .update({ audio_status: 'generating' })
    .eq('id', scene.id)

  try {
    const audioBuffer = await synthesizeSpeech({ text: scene.script_text })
    const storagePath = `${reelId}/scenes/${scene.id}/audio.mp3`
    await uploadBuffer(supabase, { buffer: audioBuffer, path: storagePath, contentType: 'audio/mpeg' })

    await supabase
      .from('reel_scenes')
      .update({ audio_url: storagePath, audio_status: 'ready' })
      .eq('id', scene.id)
  } catch (err) {
    console.error(`[generateAudio] scene ${scene.id}`, err)
    await supabase
      .from('reel_scenes')
      .update({ audio_status: 'failed' })
      .eq('id', scene.id)
  }

  await incrementDoneSteps(supabase, jobId)
}

async function incrementDoneSteps(supabase: DB, jobId: string) {
  try {
    const { data } = await supabase
      .from('generation_jobs')
      .select('done_steps')
      .eq('id', jobId)
      .single()

    if (data) {
      await supabase
        .from('generation_jobs')
        .update({ done_steps: data.done_steps + 1 })
        .eq('id', jobId)
    }
  } catch (err) {
    console.error('[incrementDoneSteps]', err)
  }
}
