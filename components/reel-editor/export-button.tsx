'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Download } from 'lucide-react'

interface ExportButtonProps {
  reelId: string
  reelTitle: string | null
}

export function ExportButton({ reelId, reelTitle }: ExportButtonProps) {
  const [exporting, setExporting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleExport = async () => {
    setExporting(true)
    setError(null)

    try {
      const res = await fetch(`/api/reels/${reelId}/export`, { method: 'POST' })

      if (!res.ok) {
        const json = await res.json().catch(() => ({}))
        setError((json as { error?: string }).error ?? 'Export failed. Please try again.')
        return
      }

      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${reelTitle ?? 'reel'}.mp4`
      a.click()
      URL.revokeObjectURL(url)
    } catch (err) {
      console.error('[ExportButton]', err)
      setError('Export failed. Please try again.')
    } finally {
      setExporting(false)
    }
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <Button onClick={handleExport} disabled={exporting} className="gap-2">
        <Download className="w-4 h-4" />
        {exporting ? 'Exporting...' : 'Export MP4'}
      </Button>
      {error && <p className="text-xs text-destructive text-right max-w-48">{error}</p>}
    </div>
  )
}
