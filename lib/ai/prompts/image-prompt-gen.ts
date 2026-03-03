import type { TemplateId } from './reel-chat'

const templateStyle: Record<TemplateId, string> = {
  educational: 'clean bright studio lighting, professional, editorial style, 8k resolution',
  marketing: 'high contrast, vibrant colors, lifestyle photography, commercial ad quality',
  entertainment: 'dynamic, colorful, high energy, pop art inspired',
  storytelling: 'cinematic, golden hour, shallow depth of field, emotional, film grain',
  'product-demo': 'clean white background, product photography, sharp detail, minimal',
}

export function buildImagePromptEnhancer(opts: {
  rawPrompt: string
  template: TemplateId
  sceneType: 'hook' | 'context' | 'value' | 'cta'
}): string {
  return `${opts.rawPrompt}, ${templateStyle[opts.template]}, vertical 9:16 aspect ratio, no text, no watermarks, photorealistic`
}
