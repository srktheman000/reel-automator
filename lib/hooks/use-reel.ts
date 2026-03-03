import { useState, useCallback } from 'react'
import type { Reel, ReelScene } from '@/lib/supabase/types'

export function useReel(initial: Reel & { scenes: ReelScene[] }) {
  const [reel, setReel] = useState(initial)

  const refreshReel = useCallback(async () => {
    try {
      const res = await fetch(`/api/reels/${initial.id}`)
      if (!res.ok) return
      const json = await res.json()
      setReel(json.data)
    } catch {
      // ignore
    }
  }, [initial.id])

  const updateScene = useCallback((sceneId: string, updates: Partial<ReelScene>) => {
    setReel(prev => ({
      ...prev,
      scenes: prev.scenes.map(s => s.id === sceneId ? { ...s, ...updates } : s),
    }))
  }, [])

  return { reel, refreshReel, updateScene }
}
