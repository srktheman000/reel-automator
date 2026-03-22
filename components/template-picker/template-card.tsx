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
    accent: 'bg-blue-50 border-blue-200 hover:border-blue-400 dark:bg-blue-950/40 dark:border-blue-800 dark:hover:border-blue-600',
    tags: ['How-to', 'Tutorial', 'Tips'],
  },
  {
    id: 'marketing',
    label: 'Marketing',
    description: 'Bold, high-energy promo reel built around a clear CTA.',
    emoji: '🚀',
    accent: 'bg-yellow-50 border-yellow-200 hover:border-yellow-400 dark:bg-yellow-950/40 dark:border-yellow-800 dark:hover:border-yellow-600',
    tags: ['Promo', 'Product', 'CTA'],
  },
  {
    id: 'entertainment',
    label: 'Entertainment',
    description: 'Punchy, shareable format with hook → escalation → punchline.',
    emoji: '🎭',
    accent: 'bg-pink-50 border-pink-200 hover:border-pink-400 dark:bg-pink-950/40 dark:border-pink-800 dark:hover:border-pink-600',
    tags: ['Fun', 'Viral', 'Story'],
  },
  {
    id: 'storytelling',
    label: 'Storytelling',
    description: 'Cinematic narrative with emotional arc and lower-third captions.',
    emoji: '🎬',
    accent: 'bg-purple-50 border-purple-200 hover:border-purple-400 dark:bg-purple-950/40 dark:border-purple-800 dark:hover:border-purple-600',
    tags: ['Narrative', 'Brand', 'Emotion'],
  },
  {
    id: 'product-demo',
    label: 'Product Demo',
    description: 'Feature showcase with clean product shots and comparison panel.',
    emoji: '🛍️',
    accent: 'bg-green-50 border-green-200 hover:border-green-400 dark:bg-green-950/40 dark:border-green-800 dark:hover:border-green-600',
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
      role="radio"
      aria-checked={selected}
      className={cn(
        'relative flex flex-col gap-3 p-5 rounded-2xl border-2 text-left transition-all duration-150 w-full',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        template.accent,
        selected && 'ring-2 ring-primary ring-offset-2 ring-offset-background'
      )}
    >
      {selected && (
        <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-primary flex items-center justify-center text-primary-foreground shadow-sm">
          <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
            <path d="M1 4L3.5 6.5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      )}
      <span className="text-2xl leading-none">{template.emoji}</span>
      <div className="space-y-1">
        <p className="font-semibold text-sm text-foreground">{template.label}</p>
        <p className="text-xs text-muted-foreground leading-relaxed">{template.description}</p>
      </div>
      <div className="flex flex-wrap gap-1">
        {template.tags.map(tag => (
          <Badge key={tag} variant="secondary" className="text-[10px] px-2 py-px font-medium">{tag}</Badge>
        ))}
      </div>
    </button>
  )
}
