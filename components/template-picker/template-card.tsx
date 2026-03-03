'use client'

import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import type { TemplateId } from '@/lib/ai/prompts/reel-chat'

interface TemplateInfo {
  id: TemplateId
  label: string
  description: string
  emoji: string
  accent: string
  tags: string[]
}

export const TEMPLATES: TemplateInfo[] = [
  {
    id: 'educational',
    label: 'Educational',
    description: 'Step-by-step explainer with numbered scenes and clean visuals.',
    emoji: '📚',
    accent: 'bg-blue-50 border-blue-200 hover:border-blue-400',
    tags: ['How-to', 'Tutorial', 'Tips'],
  },
  {
    id: 'marketing',
    label: 'Marketing',
    description: 'Bold, high-energy promo reel built around a clear CTA.',
    emoji: '🚀',
    accent: 'bg-yellow-50 border-yellow-200 hover:border-yellow-400',
    tags: ['Promo', 'Product', 'CTA'],
  },
  {
    id: 'entertainment',
    label: 'Entertainment',
    description: 'Punchy, shareable format with hook → escalation → punchline.',
    emoji: '🎭',
    accent: 'bg-pink-50 border-pink-200 hover:border-pink-400',
    tags: ['Fun', 'Viral', 'Story'],
  },
  {
    id: 'storytelling',
    label: 'Storytelling',
    description: 'Cinematic narrative with emotional arc and lower-third captions.',
    emoji: '🎬',
    accent: 'bg-purple-50 border-purple-200 hover:border-purple-400',
    tags: ['Narrative', 'Brand', 'Emotion'],
  },
  {
    id: 'product-demo',
    label: 'Product Demo',
    description: 'Feature showcase with clean product shots and comparison panel.',
    emoji: '🛍️',
    accent: 'bg-green-50 border-green-200 hover:border-green-400',
    tags: ['Demo', 'Features', 'SaaS'],
  },
]

interface TemplateCardProps {
  template: TemplateInfo
  selected: boolean
  onSelect: () => void
}

export function TemplateCard({ template, selected, onSelect }: TemplateCardProps) {
  return (
    <button
      onClick={onSelect}
      className={cn(
        'relative flex flex-col gap-2 p-4 rounded-xl border-2 text-left transition-all w-full',
        template.accent,
        selected && 'ring-2 ring-primary ring-offset-2'
      )}
    >
      {selected && (
        <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-bold">
          ✓
        </div>
      )}
      <span className="text-3xl">{template.emoji}</span>
      <div>
        <p className="font-semibold text-sm text-foreground">{template.label}</p>
        <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{template.description}</p>
      </div>
      <div className="flex flex-wrap gap-1 mt-1">
        {template.tags.map(tag => (
          <Badge key={tag} variant="secondary" className="text-[10px] px-1.5 py-0">{tag}</Badge>
        ))}
      </div>
    </button>
  )
}
