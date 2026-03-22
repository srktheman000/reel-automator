'use client'

import { TemplateCard, TEMPLATES } from './template-card'
import type { TemplateId } from '@/lib/ai/prompts/reel-chat'

interface TemplatePickerProps {
  selected: TemplateId | null
  onSelect: (id: TemplateId) => void
}

export function TemplatePicker({ selected, onSelect }: TemplatePickerProps) {
  return (
    <div role="radiogroup" aria-label="Reel templates" className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {TEMPLATES.map(template => (
        <TemplateCard
          key={template.id}
          template={template}
          selected={selected === template.id}
          onSelect={() => onSelect(template.id)}
        />
      ))}
    </div>
  )
}
