'use client'

import { useEffect, useState } from 'react'
import { Progress } from '@/components/ui/progress'

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

  if (!status) return null
  if (status.reel_status === 'ready') return null

  const percent = status.total_steps > 0
    ? Math.round((status.done_steps / status.total_steps) * 100)
    : 0

  const statusLabel: Record<string, string> = {
    'pending': 'Preparing...',
    'generating-blueprint': 'Writing reel script & planning scenes...',
    'generating-assets': `Generating images & audio (${status.done_steps}/${status.total_steps})`,
    'failed': 'Generation failed',
  }

  return (
    <div className="w-full space-y-3 p-4 bg-muted/50 rounded-xl border">
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground font-medium">
          {statusLabel[status.reel_status] ?? 'Processing...'}
        </span>
        <span className="font-mono text-xs text-muted-foreground">{percent}%</span>
      </div>
      <Progress value={percent} className="h-2" />

      {status.reel_status === 'generating-assets' && status.scenes.length > 0 && (
        <div className="flex gap-2 flex-wrap mt-2">
          {status.scenes.map((scene, i) => (
            <div key={scene.id} className="flex items-center gap-1 text-xs text-muted-foreground">
              <span>Scene {i + 1}</span>
              <span>{scene.image_status === 'ready' ? '🖼️' : scene.image_status === 'failed' ? '❌' : '⏳'}</span>
              <span>{scene.audio_status === 'ready' ? '🔊' : scene.audio_status === 'failed' ? '❌' : '⏳'}</span>
            </div>
          ))}
        </div>
      )}

      {status.error_message && (
        <p className="text-xs text-destructive">{status.error_message}</p>
      )}
    </div>
  )
}
