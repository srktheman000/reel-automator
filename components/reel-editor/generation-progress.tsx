'use client'

import { useEffect, useState } from 'react'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'

interface StatusData {
  reel_status: string
  job_status: string | null
  total_steps: number
  done_steps: number
  error_message: string | null
  scenes: Array<{ id: string; image_status: string; audio_status: string }>
}

interface GenerationProgressProps {
  reelId: string
  onComplete: () => void
}

const STEP_LABELS: Record<string, string> = {
  pending: 'Preparing your reel…',
  'generating-blueprint': 'Writing script & planning scenes…',
  'generating-assets': 'Generating visuals & voiceover…',
  failed: 'Generation failed',
}

export function GenerationProgress({ reelId, onComplete }: GenerationProgressProps) {
  const [status, setStatus] = useState<StatusData | null>(null)
  const [polling, setPolling] = useState(true)

  useEffect(() => {
    if (!polling) return

    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/reels/${reelId}/status`)
        if (!res.ok) return
        const json = await res.json()
        const data: StatusData = json.data
        setStatus(data)

        if (data.reel_status === 'ready' || data.reel_status === 'failed') {
          setPolling(false)
          clearInterval(interval)
          if (data.reel_status === 'ready') onComplete()
        }
      } catch {
        // ignore fetch errors during polling
      }
    }, 3000)

    return () => clearInterval(interval)
  }, [reelId, polling, onComplete])

  if (!status || status.reel_status === 'ready') return null

  const percent = status.total_steps > 0
    ? Math.round((status.done_steps / status.total_steps) * 100)
    : status.reel_status === 'generating-blueprint' ? 20 : 5

  const isFailed = status.reel_status === 'failed'

  return (
    <div className={cn(
      'w-full rounded-2xl border p-5 space-y-4',
      isFailed ? 'bg-destructive/5 border-destructive/20' : 'bg-card'
    )}>
      {/* Header row */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          {!isFailed && (
            <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <div className="w-3.5 h-3.5 rounded-full border-2 border-primary border-t-transparent animate-spin" />
            </div>
          )}
          <div className="min-w-0">
            <p className={cn(
              'text-sm font-medium leading-snug truncate',
              isFailed && 'text-destructive'
            )}>
              {STEP_LABELS[status.reel_status] ?? 'Processing…'}
            </p>
            {status.reel_status === 'generating-assets' && status.total_steps > 0 && (
              <p className="text-xs text-muted-foreground mt-0.5">
                {status.done_steps} of {status.total_steps} assets complete
              </p>
            )}
          </div>
        </div>
        {!isFailed && (
          <span className="text-xs font-mono text-muted-foreground tabular-nums shrink-0">
            {percent}%
          </span>
        )}
      </div>

      {/* Progress bar */}
      {!isFailed && (
        <Progress value={percent} className="h-1.5" />
      )}

      {/* Scene asset status grid */}
      {status.reel_status === 'generating-assets' && status.scenes.length > 0 && (
        <div className="grid grid-cols-2 gap-1.5">
          {status.scenes.map((scene, i) => {
            const imgDone = scene.image_status === 'ready'
            const audDone = scene.audio_status === 'ready'
            const imgFailed = scene.image_status === 'failed'
            const audFailed = scene.audio_status === 'failed'
            return (
              <div
                key={scene.id}
                className="flex items-center gap-2 bg-muted/60 rounded-lg px-2.5 py-1.5"
              >
                <span className="text-[10px] text-muted-foreground font-mono shrink-0">
                  Scene {i + 1}
                </span>
                <div className="flex items-center gap-1 ml-auto">
                  <span className={cn('text-[10px]', imgDone ? 'text-green-600' : imgFailed ? 'text-destructive' : 'text-muted-foreground animate-pulse')}>
                    {imgDone ? '🖼' : imgFailed ? '✕' : '…'}
                  </span>
                  <span className={cn('text-[10px]', audDone ? 'text-green-600' : audFailed ? 'text-destructive' : 'text-muted-foreground animate-pulse')}>
                    {audDone ? '♪' : audFailed ? '✕' : '…'}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {status.error_message && (
        <p className="text-xs text-destructive leading-relaxed">{status.error_message}</p>
      )}
    </div>
  )
}
