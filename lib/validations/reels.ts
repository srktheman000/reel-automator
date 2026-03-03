import { z } from 'zod'

export const templateSchema = z.enum([
  'educational',
  'marketing',
  'entertainment',
  'storytelling',
  'product-demo',
])

export const createReelSchema = z.object({
  session_id: z.string().uuid(),
  context_id: z.string().uuid(),
  template: templateSchema,
  title: z.string().max(80).optional(),
})

export const updateReelSchema = z.object({
  title: z.string().max(80).optional(),
})

export const updateSceneSchema = z.object({
  script_text: z.string().max(300).optional(),
  caption_text: z.string().max(150).nullable().optional(),
  image_prompt: z.string().max(500).nullable().optional(),
  start_sec: z.number().min(0).optional(),
  end_sec: z.number().min(0).optional(),
  sort_order: z.number().int().min(0).optional(),
})
