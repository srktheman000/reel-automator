import { tool } from 'ai'
import { z } from 'zod'
import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '@/lib/supabase/types'

type DB = SupabaseClient<Database>

export function createReelEditorTools(supabase: DB, reelId: string) {
  return {
    updateSceneScript: tool({
      description: 'Update the spoken script text and/or on-screen caption for a specific scene',
      inputSchema: z.object({
        scene_id: z.string().uuid(),
        script_text: z.string().max(300).optional(),
        caption_text: z.string().max(150).optional(),
      }),
      execute: async ({ scene_id, script_text, caption_text }) => {
        const updates: Record<string, string> = {}
        if (script_text !== undefined) updates.script_text = script_text
        if (caption_text !== undefined) updates.caption_text = caption_text

        const { error } = await supabase
          .from('reel_scenes')
          .update(updates)
          .eq('id', scene_id)
          .eq('reel_id', reelId)

        if (error) throw new Error('Failed to update scene script')
        return { updated: true, scene_id }
      },
    }),

    regenerateSceneImage: tool({
      description: 'Replace the image for a scene by updating its prompt and queuing regeneration',
      inputSchema: z.object({
        scene_id: z.string().uuid(),
        image_prompt: z.string().max(500),
      }),
      execute: async ({ scene_id, image_prompt }) => {
        const { error } = await supabase
          .from('reel_scenes')
          .update({ image_prompt, image_status: 'pending', image_url: null })
          .eq('id', scene_id)
          .eq('reel_id', reelId)

        if (error) throw new Error('Failed to queue image regeneration')
        return { queued: true, scene_id }
      },
    }),

    reorderScenes: tool({
      description: 'Change the display order of scenes. Pass all scene IDs in the desired order.',
      inputSchema: z.object({
        scene_order: z.array(z.string().uuid()).min(1),
      }),
      execute: async ({ scene_order }) => {
        const updates = scene_order.map((id, index) =>
          supabase
            .from('reel_scenes')
            .update({ sort_order: index })
            .eq('id', id)
            .eq('reel_id', reelId)
        )
        await Promise.all(updates)
        return { reordered: true, count: scene_order.length }
      },
    }),

    updateSceneTiming: tool({
      description: 'Adjust how long a scene plays by changing its start and end time in seconds',
      inputSchema: z.object({
        scene_id: z.string().uuid(),
        start_sec: z.number().min(0),
        end_sec: z.number().min(0),
      }),
      execute: async ({ scene_id, start_sec, end_sec }) => {
        if (end_sec <= start_sec) throw new Error('end_sec must be greater than start_sec')

        const { error } = await supabase
          .from('reel_scenes')
          .update({ start_sec, end_sec })
          .eq('id', scene_id)
          .eq('reel_id', reelId)

        if (error) throw new Error('Failed to update scene timing')
        return { updated: true, scene_id }
      },
    }),

    addScene: tool({
      description: 'Insert a new scene into the reel at a specified position',
      inputSchema: z.object({
        after_scene_id: z.string().uuid().nullable(),
        type: z.enum(['hook', 'context', 'value', 'cta']),
        script_text: z.string().max(300),
        caption_text: z.string().max(150).optional(),
        image_prompt: z.string().max(500),
        duration_sec: z.number().min(2).max(15),
        start_sec: z.number().min(0),
      }),
      execute: async ({ after_scene_id, type, script_text, caption_text, image_prompt, duration_sec, start_sec }) => {
        const { data: existingScenes } = await supabase
          .from('reel_scenes')
          .select('id, sort_order')
          .eq('reel_id', reelId)
          .order('sort_order', { ascending: true })

        let insertIndex = existingScenes?.length ?? 0
        if (after_scene_id && existingScenes) {
          const afterIdx = existingScenes.findIndex(s => s.id === after_scene_id)
          if (afterIdx !== -1) insertIndex = afterIdx + 1
        }

        // Shift subsequent scenes
        if (existingScenes) {
          const toShift = existingScenes.slice(insertIndex)
          await Promise.all(
            toShift.map(s =>
              supabase
                .from('reel_scenes')
                .update({ sort_order: s.sort_order + 1 })
                .eq('id', s.id)
            )
          )
        }

        const { data, error } = await supabase
          .from('reel_scenes')
          .insert({
            reel_id: reelId,
            sort_order: insertIndex,
            type,
            script_text,
            caption_text: caption_text ?? null,
            image_prompt,
            start_sec,
            end_sec: start_sec + duration_sec,
            image_status: 'pending',
            audio_status: 'pending',
          })
          .select('id')
          .single()

        if (error) throw new Error('Failed to add scene')
        return { created: true, scene_id: data.id }
      },
    }),

    deleteScene: tool({
      description: 'Remove a scene from the reel permanently',
      inputSchema: z.object({
        scene_id: z.string().uuid(),
      }),
      execute: async ({ scene_id }) => {
        const { error } = await supabase
          .from('reel_scenes')
          .delete()
          .eq('id', scene_id)
          .eq('reel_id', reelId)

        if (error) throw new Error('Failed to delete scene')
        return { deleted: true, scene_id }
      },
    }),
  }
}
