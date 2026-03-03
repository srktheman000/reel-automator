import { tool } from 'ai'
import { z } from 'zod'

const sceneSchema = z.object({
  sort_order: z.number().int().min(0),
  type: z.enum(['hook', 'context', 'value', 'cta']),
  script_text: z.string().max(300),
  caption_text: z.string().max(150),
  image_prompt: z.string().max(500),
  start_sec: z.number().min(0),
  end_sec: z.number().min(0),
})

export const blueprintToolSchema = z.object({
  title: z.string().max(80),
  total_sec: z.number().min(15).max(90),
  scenes: z.array(sceneSchema).min(3).max(8),
})

export type BlueprintOutput = z.infer<typeof blueprintToolSchema>

// Factory so the route can inject supabase + reelId via closure
export function createBlueprintTool(opts: {
  onSave: (blueprint: BlueprintOutput) => Promise<void>
}) {
  return tool({
    description: 'Generate a structured reel blueprint with scenes, timing, and image prompts',
    inputSchema: blueprintToolSchema,
    execute: async (blueprint) => {
      await opts.onSave(blueprint)
      return { saved: true, sceneCount: blueprint.scenes.length }
    },
  })
}
