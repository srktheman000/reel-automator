'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ReelCard } from '@/components/dashboard/reel-card'
import { DUMMY_REELS, DUMMY_USER } from '@/lib/dummy-data'
import { Plus, Sparkles, Video, BookOpen, CheckCircle2, Clock } from 'lucide-react'
import { cn } from '@/lib/utils'

const TABS = [
  { id: 'all', label: 'All reels' },
  { id: 'ready', label: 'Ready' },
  { id: 'draft', label: 'Drafts' },
  { id: 'generating', label: 'Generating' },
] as const

type TabId = typeof TABS[number]['id']

const STATS = [
  { label: 'Total reels', value: DUMMY_REELS.length, icon: Video },
  { label: 'Ready to post', value: DUMMY_REELS.filter(r => r.status === 'ready').length, icon: CheckCircle2 },
  { label: 'Drafts', value: DUMMY_REELS.filter(r => r.status === 'pending').length, icon: Clock },
]

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-24 px-4 text-center gap-5">
      <div className="w-20 h-20 rounded-3xl bg-muted flex items-center justify-center">
        <Sparkles className="w-9 h-9 text-muted-foreground/40" />
      </div>
      <div className="space-y-2 max-w-xs">
        <h3 className="text-base font-semibold text-foreground">No reels yet</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Create your first AI-generated reel in under 60 seconds.
        </p>
      </div>
      <Link href="/reels/new">
        <Button className="gap-2 rounded-full px-6">
          <Plus className="w-4 h-4" />
          Create your first reel
        </Button>
      </Link>
    </div>
  )
}

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<TabId>('all')

  const filteredReels = DUMMY_REELS.filter(reel => {
    if (activeTab === 'all') return true
    if (activeTab === 'ready') return reel.status === 'ready'
    if (activeTab === 'draft') return reel.status === 'pending'
    if (activeTab === 'generating') return reel.status === 'generating-blueprint' || reel.status === 'generating-assets'
    return true
  })

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">

      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <p className="text-xs text-muted-foreground mb-1">Welcome back,</p>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            {DUMMY_USER.name}
          </h1>
        </div>
        <Link href="/reels/new">
          <Button className="gap-2 rounded-full px-6 self-start sm:self-auto">
            <Plus className="w-4 h-4" />
            New Reel
          </Button>
        </Link>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3 sm:gap-4">
        {STATS.map(stat => {
          const Icon = stat.icon
          return (
            <div key={stat.label} className="bg-card border border-border/60 rounded-2xl p-4 sm:p-5">
              <div className="flex items-center gap-2 mb-2">
                <Icon className="w-4 h-4 text-muted-foreground" />
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
              <p className="text-2xl font-bold text-foreground tabular-nums">{stat.value}</p>
            </div>
          )
        })}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-border/60">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              'px-3 py-2.5 text-sm font-medium transition-colors relative',
              activeTab === tab.id
                ? 'text-foreground'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            {tab.label}
            {activeTab === tab.id && (
              <div className="absolute bottom-0 inset-x-0 h-0.5 bg-foreground rounded-full" />
            )}
          </button>
        ))}
      </div>

      {/* Reels grid */}
      {filteredReels.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {/* New reel card */}
          <Link href="/reels/new">
            <div className="bg-card border-2 border-dashed border-border/60 rounded-2xl aspect-[9/16] max-h-[220px] flex flex-col items-center justify-center gap-2 hover:border-border hover:bg-muted/30 transition-all cursor-pointer group">
              <div className="w-10 h-10 rounded-2xl bg-muted group-hover:bg-primary/10 flex items-center justify-center transition-colors">
                <Plus className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
              <p className="text-xs text-muted-foreground group-hover:text-foreground transition-colors font-medium">New reel</p>
            </div>
          </Link>

          {filteredReels.map(reel => (
            <ReelCard key={reel.id} reel={reel} />
          ))}
        </div>
      )}

      {/* Usage info */}
      <div className="border border-border/60 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-card">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-primary/10 rounded-xl flex items-center justify-center">
            <BookOpen className="w-4.5 h-4.5 text-primary" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">Pro plan</p>
            <p className="text-xs text-muted-foreground">Unlimited reels · AI voiceover · Watermark-free</p>
          </div>
        </div>
        <Button variant="outline" size="sm" className="rounded-xl shrink-0">
          Manage plan
        </Button>
      </div>
    </div>
  )
}
