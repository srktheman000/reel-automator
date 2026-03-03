import Replicate from 'replicate'
import { buildImagePromptEnhancer } from '@/lib/ai/prompts/image-prompt-gen'
import type { TemplateId } from '@/lib/ai/prompts/reel-chat'

const REALISTIC_VISION_MODEL =
  'lucataco/realistic-vision-v5.1:2c8e954decbf70b7607a4414e5785ef9e4de4b8c51d50fb8b8b349160e0ef6bb'

const NEGATIVE_PROMPT =
  '(deformed iris, deformed pupils, semi-realistic, cgi, 3d, render, sketch, cartoon, drawing, anime:1.4), text, close up, cropped, out of frame, worst quality, low quality, jpeg artifacts, ugly, duplicate, morbid, mutilated, extra fingers, mutated hands, poorly drawn hands, poorly drawn face, mutation, deformed, blurry, dehydrated, bad anatomy, bad proportions, extra limbs, cloned face, disfigured, gross proportions, malformed limbs, missing arms, missing legs, extra arms, extra legs, fused fingers, too many fingers, long neck'

type SceneType = 'hook' | 'context' | 'value' | 'cta'

export async function generateSceneImage(opts: {
  rawPrompt: string
  template: TemplateId
  sceneType: SceneType
}): Promise<Buffer> {
  const token = process.env.REPLICATE_API_TOKEN
  if (!token) throw new Error('REPLICATE_API_TOKEN is not set')

  const client = new Replicate({ auth: token })
  const enhancedPrompt = buildImagePromptEnhancer(opts)

  const raw = await client.run(REALISTIC_VISION_MODEL, {
    input: {
      steps: 20,
      width: 512,
      height: 896, // portrait 9:16 for reels
      prompt: enhancedPrompt,
      guidance: 5,
      scheduler: 'EulerA',
      negative_prompt: NEGATIVE_PROMPT,
    },
  })

  // run() returns FileOutput or FileOutput[] depending on the model
  const fileOutput = Array.isArray(raw)
    ? (raw[0] as { url: () => URL })
    : (raw as { url: () => URL })

  const outputUrl = fileOutput.url().toString()
  if (!outputUrl) throw new Error('Replicate returned no output URL')

  const response = await fetch(outputUrl)
  if (!response.ok) throw new Error(`Failed to download image from Replicate: ${response.status}`)

  const arrayBuffer = await response.arrayBuffer()
  return Buffer.from(arrayBuffer)
}
