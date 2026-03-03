import type { TemplateId } from './reel-chat'

const templateInstructions: Record<TemplateId, string> = {
  educational: `
Structure: Hook (5s) → 3–4 numbered steps (10–12s each) → Summary CTA (8s)
Tone: clear, authoritative, calm
Visual style: clean diagrams, text callouts, step numbers prominent
image_prompt: clean studio or classroom setting, step illustration, no text in image`,

  marketing: `
Structure: Bold Hook (3s) → Problem (5s) → Solution reveal (10s) → Benefits ×2 (8s each) → CTA (7s)
Tone: urgent, benefit-driven, confident
Visual style: high-contrast, product-forward, lifestyle imagery
image_prompt: product lifestyle shot, problem scenario, or success outcome`,

  entertainment: `
Structure: Viral Hook (2s) → Setup (5s) → Escalation ×2 (7s each) → Punchline/Reveal (5s) → Share CTA (3s)
Tone: playful, energetic, surprising
Visual style: dynamic, colorful, meme-aware
image_prompt: relatable moment, exaggerated reaction, or humorous scenario`,

  storytelling: `
Structure: Inciting moment (5s) → Rising tension (10s) → Emotional peak (10s) → Resolution (8s) → Reflection CTA (5s)
Tone: intimate, emotional, narrative
Visual style: cinematic, golden hour or moody lighting, human-centered
image_prompt: candid human moments or emotionally resonant environments`,

  'product-demo': `
Structure: Feature hook (3s) → Problem it solves (5s) → Feature demo ×3 (8s each) → Comparison (7s) → CTA (5s)
Tone: informative, confident, demonstration-focused
Visual style: clean product shots, UI screenshots, before/after comparisons
image_prompt: product in use, feature close-up, clean white or gradient background`,
}

export function buildBlueprintPrompt(opts: {
  template: TemplateId
  contextText: string
  targetDurationSec: number
}): string {
  const instructions = templateInstructions[opts.template]
  const truncatedContext = opts.contextText.slice(0, 3000)

  return `You are a reel scriptwriter and director. Generate a complete reel blueprint for the following content.

TEMPLATE: ${opts.template.toUpperCase()}
${instructions}

TARGET DURATION: ${opts.targetDurationSec} seconds total

SOURCE CONTENT:
---
${truncatedContext}
---

Rules:
- script_text is the voiceover narration (max 300 chars per scene)
- caption_text is the on-screen display text (max 150 chars, can be shortened from script)
- image_prompt must be a detailed Flux Dev image generation prompt (photorealistic, vertical 9:16, no text, no watermarks)
- start_sec and end_sec must not overlap and must sum to approximately ${opts.targetDurationSec}s total
- Use the generateReelBlueprint tool to return structured output — do not respond in plain text

You do not answer questions unrelated to content creation, video production, or social media strategy.`
}
