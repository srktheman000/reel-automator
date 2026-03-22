'use client'

import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { MoreHorizontal, Sparkles, Download, Trash2, Clock, CheckCircle2, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useState } from 'react'
import type { DummyReel } from '@/lib/dummy-data'

const TEMPLATE_LABELS: Record<string, string> = {
  educational: 'Educational',
  marketing: 'Marketing',
  entertainment: 'Entertainment',
  storytelling: 'Storytelling',
  'product-demo': 'Product Demo',
}

const STATUS_CONFIG = {
  ready: {
    label: 'Ready',
    icon: CheckCircle2,
    className: 'text-green-400',
  },
  pending: {
    label: 'Draft',
    icon: Clock,
    className: 'text-muted-foreground',
  },
  'generating-blueprint': {
    label: 'Writing…',
    icon: Loader2,
    className: 'text-blue-400 animate-spin',
  },
  'generating-assets': {
    label: 'Generating…',
    icon: Loader2,
    className: 'text-blue-400 animate-spin',
  },
  failed: {
    label: 'Failed',
    icon: Clock,
    className: 'text-destructive',
  },
}

interface ReelCardProps {
  reel: DummyReel
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr)
  const now = new Date()
  const diffMs = now.getTime() - d.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 7) return `${diffDays}d ago`
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export function ReelCard({ reel }: ReelCardProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const status = STATUS_CONFIG[reel.status as keyof typeof STATUS_CONFIG] ?? STATUS_CONFIG.pending
  const StatusIcon = status.icon

  return (
    <div className="group relative bg-card border border-border/60 rounded-2xl overflow-hidden hover:border-border transition-all duration-200 hover:shadow-md">
      {/* Thumbnail - 9:16 reel preview */}
      <Link href={`/reels/${reel.id}`}>
        <div className="relative aspect-[9/16] max-h-[220px] overflow-hidden bg-muted">
          {/* Gradient mock thumbnail */}
          <div className={`absolute inset-0 bg-gradient-to-b ${reel.thumbnail_color} opacity-80`} />
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 px-4 text-center">
            <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white/70" />
            </div>
            <p className="text-white text-xs font-semibold line-clamp-2 leading-snug">
              {reel.title}
            </p>
          </div>

          {/* Duration badge */}
          {reel.duration_sec > 0 && (
            <div className="absolute bottom-2 right-2 bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded font-mono">
              0:{String(reel.duration_sec).padStart(2, '0')}
            </div>
          )}

          {/* Hover overlay */}
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-3 py-1.5">
              <span className="text-white text-xs font-medium">Open editor</span>
            </div>
          </div>
        </div>
      </Link>

      {/* Card info */}
      <div className="p-3.5 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <Link href={`/reels/${reel.id}`} className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-foreground truncate hover:text-foreground/80 transition-colors">
              {reel.title}
            </h3>
          </Link>

          {/* Context menu */}
          <div className="relative shrink-0">
            <button
              onClick={() => setMenuOpen(v => !v)}
              className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
              aria-label="More options"
            >
              <MoreHorizontal className="w-4 h-4" />
            </button>

            {menuOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
                <div className="absolute right-0 top-8 z-20 bg-popover border border-border rounded-xl shadow-lg py-1 min-w-[140px]">
                  {reel.status === 'ready' && (
                    <button className="flex items-center gap-2.5 w-full px-3 py-2 text-xs hover:bg-muted transition-colors text-left">
                      <Download className="w-3.5 h-3.5" /> Export MP4
                    </button>
                  )}
                  <button className="flex items-center gap-2.5 w-full px-3 py-2 text-xs hover:bg-muted transition-colors text-left text-destructive">
                    <Trash2 className="w-3.5 h-3.5" /> Delete
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant="secondary" className="text-[10px] px-1.5 py-0 font-medium">
            {TEMPLATE_LABELS[reel.template] ?? reel.template}
          </Badge>
          <div className={cn('flex items-center gap-1 text-[10px]', status.className)}>
            <StatusIcon className={cn('w-3 h-3', (reel.status === 'generating-blueprint' || reel.status === 'generating-assets') && 'animate-spin')} />
            {status.label}
          </div>
          <span className="text-[10px] text-muted-foreground ml-auto">
            {formatDate(reel.updated_at)}
          </span>
        </div>

        {/* Action: Generate if pending */}
        {reel.status === 'pending' && (
          <Link href={`/reels/${reel.id}`}>
            <Button size="sm" className="w-full h-8 rounded-xl text-xs gap-1.5 mt-1">
              <Sparkles className="w-3 h-3" />
              Generate Reel
            </Button>
          </Link>
        )}
      </div>
    </div>
  )
}
