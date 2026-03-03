'use client'

import Image from 'next/image'
import { cn } from '@/lib/utils'
import type { ReelScene } from '@/lib/supabase/types'

interface SceneCardProps {
  scene: ReelScene
  index: number
  signedImageUrl?: string
  isSelected?: boolean
  onClick?: () => void
}

const TYPE_LABELS: Record<string, string> = {
  hook: 'Hook',
  context: 'Context',
  value: 'Value',
  cta: 'CTA',
}

const TYPE_COLORS: Record<string, string> = {
  hook: 'bg-orange-100 text-orange-700',
  context: 'bg-blue-100 text-blue-700',
  value: 'bg-green-100 text-green-700',
  cta: 'bg-purple-100 text-purple-700',
}

export function SceneCard({ scene, index, signedImageUrl, isSelected, onClick }: SceneCardProps) {
  const duration = Number(scene.end_sec) - Number(scene.start_sec)

  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full flex gap-3 p-3 rounded-xl border text-left transition-all hover:bg-accent',
        isSelected && 'ring-2 ring-primary bg-accent'
      )}
    >
      {/* Thumbnail */}
      <div className="relative shrink-0 w-14 h-20 rounded-lg overflow-hidden bg-muted">
        {signedImageUrl ? (
          <Image
            src={signedImageUrl}
            alt={`Scene ${index + 1}`}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">
            {scene.image_status === 'generating' ? '⏳' :
             scene.image_status === 'failed' ? '❌' : '?'}
          </div>
        )}
        <div className="absolute bottom-1 right-1 bg-black/60 text-white text-[10px] px-1 rounded">
          {duration.toFixed(0)}s
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs text-muted-foreground font-mono">#{index + 1}</span>
          <span className={cn('text-[10px] font-semibold px-1.5 py-0.5 rounded-full', TYPE_COLORS[scene.type])}>
            {TYPE_LABELS[scene.type]}
          </span>
          {scene.audio_status === 'ready' && <span className="text-xs">🔊</span>}
        </div>
        <p className="text-xs text-foreground line-clamp-3 leading-relaxed">
          {scene.caption_text ?? scene.script_text}
        </p>
      </div>
    </button>
  )
}
