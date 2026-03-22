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
  hook:    'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
  context: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  value:   'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
  cta:     'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300',
}

export function SceneCard({ scene, index, signedImageUrl, isSelected, onClick }: SceneCardProps) {
  const duration = Number(scene.end_sec) - Number(scene.start_sec)

  return (
    <button
      onClick={onClick}
      aria-selected={isSelected}
      className={cn(
        'w-full flex gap-3 p-3 rounded-xl border text-left transition-all duration-150',
        'hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
        isSelected
          ? 'border-primary/40 bg-accent ring-1 ring-primary/30'
          : 'border-transparent hover:border-border'
      )}
    >
      {/* Thumbnail — 9:16 aspect ratio thumbnail */}
      <div className="relative shrink-0 w-12 h-[4.5rem] rounded-lg overflow-hidden bg-muted">
        {signedImageUrl ? (
          <Image
            src={signedImageUrl}
            alt={`Scene ${index + 1}`}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground/50">
            {scene.image_status === 'generating'
              ? <span className="animate-pulse text-lg">⏳</span>
              : scene.image_status === 'failed'
              ? <span className="text-destructive text-lg">!</span>
              : <span className="text-lg opacity-30">▶</span>}
          </div>
        )}
        <div className="absolute bottom-0.5 right-0.5 bg-black/70 text-white text-[9px] px-1 py-px rounded font-mono">
          {duration.toFixed(0)}s
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 py-0.5">
        <div className="flex items-center gap-1.5 mb-1.5">
          <span className="text-[10px] text-muted-foreground font-mono tabular-nums">
            {String(index + 1).padStart(2, '0')}
          </span>
          <span className={cn(
            'text-[10px] font-semibold px-1.5 py-px rounded-sm tracking-wide uppercase',
            TYPE_COLORS[scene.type]
          )}>
            {TYPE_LABELS[scene.type]}
          </span>
          {scene.audio_status === 'ready' && (
            <span className="ml-auto text-[10px] text-muted-foreground">♪</span>
          )}
        </div>
        <p className="text-[11px] text-foreground line-clamp-3 leading-relaxed">
          {scene.caption_text ?? scene.script_text ?? <span className="text-muted-foreground italic">No content yet</span>}
        </p>
      </div>
    </button>
  )
}
