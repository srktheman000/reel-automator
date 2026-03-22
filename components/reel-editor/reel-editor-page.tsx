'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { SceneList } from './scene-list'
import { RemotionPreview } from './remotion-preview'
import { GenerationProgress } from './generation-progress'
import { ExportButton } from './export-button'
import { ChatEditorWidget } from '@/components/chat-editor/chat-editor-widget'
import { useReel } from '@/lib/hooks/use-reel'
import { ArrowLeft, Sparkles, Layers, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Reel, ReelScene } from '@/lib/supabase/types'
import type { TemplateId } from '@/lib/ai/prompts/reel-chat'

interface ReelEditorPageProps {
  initialReel: Reel & { scenes: ReelScene[] }
  signedImageUrls: Record<string, string>
  signedAudioUrls: Record<string, string>
}

const TEMPLATE_LABELS: Record<string, string> = {
  educational: 'Educational',
  marketing: 'Marketing',
  entertainment: 'Entertainment',
  storytelling: 'Storytelling',
  'product-demo': 'Product Demo',
}

export function ReelEditorPage({ initialReel, signedImageUrls: initImageUrls, signedAudioUrls: initAudioUrls }: ReelEditorPageProps) {
  const router = useRouter()
  const { reel, refreshReel } = useReel(initialReel)
  const [selectedSceneId, setSelectedSceneId] = useState<string | undefined>(reel.scenes[0]?.id)
  const [imageUrls, setImageUrls] = useState(initImageUrls)
  const [audioUrls, setAudioUrls] = useState(initAudioUrls)
  const [generating, setGenerating] = useState(
    reel.status === 'generating-blueprint' || reel.status === 'generating-assets'
  )
  const [sceneDrawerOpen, setSceneDrawerOpen] = useState(false)

  const handleGenerate = async () => {
    setGenerating(true)
    try {
      await fetch(`/api/reels/${reel.id}/generate`, { method: 'POST' })
    } catch {
      setGenerating(false)
    }
  }

  const handleGenerationComplete = useCallback(async () => {
    setGenerating(false)
    await refreshReel()
    try {
      const res = await fetch(`/api/reels/${reel.id}`)
      const json = await res.json()
      const scenes: ReelScene[] = json.data?.scenes ?? []
      const imagePaths = scenes.map((s: ReelScene) => s.image_url).filter(Boolean) as string[]
      const audioPaths = scenes.map((s: ReelScene) => s.audio_url).filter(Boolean) as string[]

      const [imgRes, audRes] = await Promise.all([
        imagePaths.length > 0
          ? fetch(`/api/media/signed-urls`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ paths: imagePaths }) })
          : null,
        audioPaths.length > 0
          ? fetch(`/api/media/signed-urls`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ paths: audioPaths }) })
          : null,
      ])

      if (imgRes?.ok) setImageUrls(await imgRes.json().then((j: { data?: Record<string, string> }) => j.data ?? {}))
      if (audRes?.ok) setAudioUrls(await audRes.json().then((j: { data?: Record<string, string> }) => j.data ?? {}))
    } catch {
      // ignore refresh errors
    }
  }, [reel.id, refreshReel])

  const isReady = reel.status === 'ready'
  const isPending = reel.status === 'pending'
  const totalDurationSec = Number(reel.duration_sec ?? 60)
  const templateLabel = TEMPLATE_LABELS[reel.template ?? ''] ?? reel.template

  return (
    <div className="flex flex-col h-screen bg-background overflow-hidden">

      {/* ── Top navigation ── */}
      <header className="h-14 border-b flex items-center px-3 md:px-6 gap-2 shrink-0 bg-card/70 backdrop-blur-sm z-20">
        {/* Left: breadcrumb — Dashboard › Reel title */}
        <button
          onClick={() => router.push('/dashboard')}
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors group shrink-0"
          aria-label="Back to Dashboard"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
          <span className="hidden sm:inline">Dashboard</span>
        </button>

        <ChevronRight className="w-4 h-4 text-muted-foreground/40 shrink-0" />

        <div className="min-w-0 flex items-center gap-2 flex-1">
          <h1 className="font-semibold text-sm truncate max-w-[140px] md:max-w-[300px] text-foreground">
            {reel.title ?? 'Untitled Reel'}
          </h1>
          {templateLabel && (
            <Badge variant="secondary" className="hidden sm:inline-flex text-[10px] font-medium shrink-0">
              {templateLabel}
            </Badge>
          )}
        </div>

        {/* Right: actions */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Mobile scene list toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="w-8 h-8 md:hidden"
            onClick={() => setSceneDrawerOpen(true)}
            aria-label="View scenes"
          >
            <Layers className="w-4 h-4" />
          </Button>

          {isPending && (
            <Button
              onClick={handleGenerate}
              disabled={generating}
              size="sm"
              className="gap-1.5"
            >
              {generating ? (
                <>
                  <div className="w-3.5 h-3.5 rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground animate-spin" />
                  <span className="hidden sm:inline">Generating…</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Generate</span>
                </>
              )}
            </Button>
          )}
          {isReady && (
            <ExportButton reelId={reel.id} reelTitle={reel.title} />
          )}
        </div>
      </header>

      {/* ── Main layout ── */}
      <div className="flex flex-1 overflow-hidden">

        {/* ── Scene panel (desktop sidebar) ── */}
        <aside className="hidden md:flex w-72 border-r flex-col shrink-0 bg-background">
          <div className="h-11 px-4 flex items-center justify-between border-b shrink-0">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
              Scenes
            </span>
            <span className="text-xs text-muted-foreground font-mono">
              {reel.scenes.length}
            </span>
          </div>
          <div className="flex-1 overflow-hidden">
            <SceneList
              scenes={reel.scenes}
              signedImageUrls={imageUrls}
              selectedSceneId={selectedSceneId}
              onSelectScene={setSelectedSceneId}
            />
          </div>
        </aside>

        {/* ── Preview center ── */}
        <main className="flex-1 flex flex-col items-center justify-start overflow-y-auto bg-muted/20 p-4 md:p-6 gap-5">

          {/* Generation progress */}
          {generating && (
            <div className="w-full max-w-md">
              <GenerationProgress reelId={reel.id} onComplete={handleGenerationComplete} />
            </div>
          )}

          {/* Remotion player */}
          {isReady && reel.scenes.length > 0 ? (
            <div className="w-full max-w-[280px] md:max-w-xs">
              <div className="rounded-[18px] overflow-hidden shadow-lg ring-1 ring-black/10">
                <RemotionPreview
                  template={reel.template as TemplateId}
                  scenes={reel.scenes}
                  signedImageUrls={imageUrls}
                  signedAudioUrls={audioUrls}
                  totalDurationSec={totalDurationSec}
                />
              </div>
            </div>
          ) : !generating && (
            <div className="flex flex-col items-center justify-center h-full min-h-[320px] gap-4 text-center">
              <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center">
                <Video className="w-7 h-7 text-muted-foreground/40" />
              </div>
              <div className="space-y-1.5 max-w-xs">
                <p className="text-sm font-medium text-muted-foreground">Ready to generate</p>
                <p className="text-xs text-muted-foreground/70 leading-relaxed">
                  Click <strong className="text-muted-foreground font-semibold">Generate</strong> to let the AI write your script, create scenes, and produce your reel.
                </p>
              </div>
              {isPending && (
                <Button onClick={handleGenerate} disabled={generating} className="gap-2 mt-1">
                  <Sparkles className="w-4 h-4" />
                  Generate Reel
                </Button>
              )}
            </div>
          )}
        </main>
      </div>

      {/* ── Mobile bottom action bar ── */}
      <div className="md:hidden h-16 border-t bg-background/80 backdrop-blur-sm flex items-center px-4 gap-3 shrink-0">
        <Button
          variant="ghost"
          size="sm"
          className="gap-1.5 flex-none"
          onClick={() => setSceneDrawerOpen(true)}
        >
          <Layers className="w-4 h-4" />
          <span className="text-xs">Scenes</span>
        </Button>
        {isPending && (
          <Button
            onClick={handleGenerate}
            disabled={generating}
            className="flex-1 gap-2"
          >
            <Sparkles className="w-4 h-4" />
            {generating ? 'Generating…' : 'Generate Reel'}
          </Button>
        )}
        {isReady && (
          <div className="flex-1 flex justify-end">
            <ExportButton reelId={reel.id} reelTitle={reel.title} />
          </div>
        )}
      </div>

      {/* ── Mobile scene drawer ── */}
      {sceneDrawerOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/40 z-30 md:hidden"
            onClick={() => setSceneDrawerOpen(false)}
          />
          <div className={cn(
            'fixed bottom-0 left-0 right-0 z-40 md:hidden',
            'bg-card rounded-t-[18px] shadow-2xl border-t',
            'flex flex-col max-h-[70vh]'
          )}>
            <div className="flex items-center justify-center pt-2.5 pb-1">
              <div className="w-9 h-1 rounded-full bg-border" />
            </div>
            <div className="px-4 py-3 flex items-center justify-between border-b">
              <h2 className="text-sm font-semibold">Scenes</h2>
              <button
                onClick={() => setSceneDrawerOpen(false)}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                Done
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              <SceneList
                scenes={reel.scenes}
                signedImageUrls={imageUrls}
                selectedSceneId={selectedSceneId}
                onSelectScene={(id) => {
                  setSelectedSceneId(id)
                  setSceneDrawerOpen(false)
                }}
              />
            </div>
          </div>
        </>
      )}

      {/* ── Floating AI chat editor ── */}
      <ChatEditorWidget
        reelId={reel.id}
        sessionId={reel.session_id}
        onEditsApplied={refreshReel}
      />
    </div>
  )
}
