import { useState, useEffect, useCallback } from 'react'

interface GenerationStatus {
  reel_status: string
  job_status: string | null
  total_steps: number
  done_steps: number
  error_message: string | null
}

export function useGenerationPoll(reelId: string, initialStatus: string) {
  const [status, setStatus] = useState<GenerationStatus>({
    reel_status: initialStatus,
    job_status: null,
    total_steps: 0,
    done_steps: 0,
    error_message: null,
  })
  const [polling, setPolling] = useState(
    initialStatus !== 'ready' && initialStatus !== 'failed'
  )

  const stopPolling = useCallback(() => setPolling(false), [])

  useEffect(() => {
    if (!polling) return

    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/reels/${reelId}/status`)
        if (!res.ok) return
        const json = await res.json()
        const data: GenerationStatus = json.data
        setStatus(data)

        if (data.reel_status === 'ready' || data.reel_status === 'failed') {
          setPolling(false)
        }
      } catch {
        // ignore transient errors
      }
    }, 3000)

    return () => clearInterval(interval)
  }, [reelId, polling])

  return { status, polling, stopPolling }
}
