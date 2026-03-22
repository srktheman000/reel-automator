'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { TemplatePicker } from '@/components/template-picker/template-picker'
import { ArrowRight, ArrowLeft, Video, FileText, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import type { TemplateId } from '@/lib/ai/prompts/reel-chat'

type Step = 'context' | 'template'

const STEPS = [
  { id: 'context', label: 'Add Content' },
  { id: 'template', label: 'Choose Template' },
] as const

const MAX_CHARS = 2000

const PLACEHOLDER_EXAMPLES = [
  'My top 5 productivity hacks that saved me 3 hours a day…',
  'How I grew from 0 to 50K followers in 6 months…',
  'The one mindset shift that changed my entire business…',
]

export default function NewReelPage() {
  const router = useRouter()
  const [step, setStep] = useState<Step>('context')
  const [text, setText] = useState('')
  const [template, setTemplate] = useState<TemplateId | null>(null)
  const [creating, setCreating] = useState(false)

  const activeStepIndex = STEPS.findIndex(s => s.id === step)
  const charPercent = Math.min((text.length / MAX_CHARS) * 100, 100)
  const isNearLimit = text.length >= MAX_CHARS * 0.9

  const handleContextContinue = () => {
    if (text.trim().length < 10) return
    setStep('template')
  }

  const handleCreateReel = async () => {
    if (!template) return
    setCreating(true)
    await new Promise(r => setTimeout(r, 1200))
    router.push('/reels/reel-001')
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">

      {/* ── App shell header ────────────────────────────────────────────────── */}
      <header className="h-14 border-b border-border bg-card/70 backdrop-blur-sm sticky top-0 z-20 flex items-center px-4 sm:px-6 gap-3">

        {/* Left: back to dashboard — always visible, always clear */}
        <Link
          href="/dashboard"
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
          <span className="hidden sm:inline">Dashboard</span>
        </Link>

        {/* Breadcrumb divider + current context */}
        <div className="flex items-center gap-1.5 text-muted-foreground/40">
          <ChevronRight className="w-4 h-4" />
        </div>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-primary rounded-md flex items-center justify-center shrink-0">
            <Video className="w-3 h-3 text-primary-foreground" />
          </div>
          <span className="text-sm font-medium text-foreground">New Reel</span>
        </div>

        {/* Right: step label on desktop */}
        <div className="flex-1" />
        <span className="hidden sm:inline text-xs text-muted-foreground">
          Step {activeStepIndex + 1} of {STEPS.length} — {STEPS[activeStepIndex].label}
        </span>
      </header>

      {/* ── Content ─────────────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col items-center px-4 py-10 md:py-14">
        <div className="w-full max-w-[640px] space-y-8">

          {/* Step indicator */}
          <div className="flex items-center">
            {STEPS.map((s, i) => {
              const isActive = i === activeStepIndex
              const isDone = i < activeStepIndex
              return (
                <div key={s.id} className="flex items-center flex-1 last:flex-none">
                  <div className="flex items-center gap-2 shrink-0">
                    <div className={cn(
                      'w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold transition-all duration-200',
                      isDone && 'bg-primary text-primary-foreground',
                      isActive && 'bg-primary text-primary-foreground ring-4 ring-primary/20',
                      !isDone && !isActive && 'border-2 border-border text-muted-foreground'
                    )}>
                      {isDone ? (
                        <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                          <path d="M1 4L3.5 6.5L9 1" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      ) : i + 1}
                    </div>
                    <span className={cn(
                      'text-sm font-medium transition-colors',
                      isActive || isDone ? 'text-foreground' : 'text-muted-foreground'
                    )}>
                      {s.label}
                    </span>
                  </div>
                  {i < STEPS.length - 1 && (
                    <div className={cn(
                      'flex-1 h-px mx-4 transition-colors duration-300',
                      isDone ? 'bg-primary' : 'bg-border'
                    )} />
                  )}
                </div>
              )
            })}
          </div>

          {/* ── Step 1: Text Content ── */}
          {step === 'context' && (
            <div className="bg-card rounded-2xl border border-border shadow-sm p-6 md:p-8 space-y-5">
              <div className="space-y-1">
                <h1 className="text-xl font-semibold tracking-tight">What's your reel about?</h1>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Paste your script, story, tips, or article. The AI will structure it into a reel for you.
                </p>
              </div>

              {/* Quick-start example prompts */}
              <div className="flex flex-wrap gap-2">
                {PLACEHOLDER_EXAMPLES.map((ex, i) => (
                  <button
                    key={i}
                    onClick={() => setText(ex)}
                    className="text-[11px] px-2.5 py-1.5 rounded-lg bg-muted hover:bg-accent text-muted-foreground hover:text-foreground transition-colors border border-border/60 text-left truncate max-w-[220px]"
                  >
                    {ex}
                  </button>
                ))}
              </div>

              {/* Textarea with progress bar */}
              <div className="space-y-2">
                <div className="relative">
                  <Textarea
                    placeholder="Paste your script, article, notes, or story here…"
                    value={text}
                    onChange={e => setText(e.target.value.slice(0, MAX_CHARS))}
                    rows={10}
                    autoFocus
                    className="resize-none text-sm leading-relaxed bg-background/60 pb-7"
                  />
                  {text.length > 0 && (
                    <div className="absolute bottom-2.5 left-3 right-3 flex items-center gap-2 pointer-events-none">
                      <div className="flex-1 h-0.5 rounded-full bg-border overflow-hidden">
                        <div
                          className={cn(
                            'h-full rounded-full transition-all duration-300',
                            isNearLimit ? 'bg-orange-400' : 'bg-primary/50'
                          )}
                          style={{ width: `${charPercent}%` }}
                        />
                      </div>
                      <span className={cn(
                        'text-[10px] tabular-nums font-mono',
                        isNearLimit ? 'text-orange-500' : 'text-muted-foreground/60'
                      )}>
                        {text.length}/{MAX_CHARS}
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex items-start gap-2">
                  <FileText className="w-3.5 h-3.5 text-muted-foreground/50 mt-0.5 shrink-0" />
                  <p className="text-[11px] text-muted-foreground/60 leading-relaxed">
                    More detail = better script. Include your key points, tone, and target platform.
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                {/* Cancel — takes user back to dashboard */}
                <Link href="/dashboard">
                  <Button variant="ghost" size="sm" className="text-muted-foreground gap-1.5">
                    Cancel
                  </Button>
                </Link>
                <Button
                  onClick={handleContextContinue}
                  disabled={text.trim().length < 10}
                  className="gap-2"
                >
                  Next: Choose template
                  <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
          )}

          {/* ── Step 2: Template ── */}
          {step === 'template' && (
            <div className="space-y-5">
              <div className="bg-card rounded-2xl border border-border shadow-sm p-5 md:p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-0.5">
                    <h1 className="text-xl font-semibold tracking-tight">Choose a template</h1>
                    <p className="text-sm text-muted-foreground">
                      <span className="font-medium text-foreground">{text.length.toLocaleString()}</span> chars
                      ready · pick the style that fits your goal.
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setStep('context')}
                    className="shrink-0 text-muted-foreground text-xs"
                  >
                    Edit content
                  </Button>
                </div>
              </div>

              <TemplatePicker selected={template} onSelect={setTemplate} />

              <div className="flex items-center justify-between pt-1">
                {/* Back to step 1 — within wizard */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setStep('context')}
                  className="gap-1.5 text-muted-foreground"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Back
                </Button>

                <Button
                  onClick={handleCreateReel}
                  disabled={!template || creating}
                  className="gap-2"
                >
                  {creating ? (
                    <>
                      <div className="w-3.5 h-3.5 rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground animate-spin" />
                      Creating reel…
                    </>
                  ) : (
                    <>Create Reel <ArrowRight className="w-3.5 h-3.5" /></>
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
