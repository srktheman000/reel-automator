'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ContextInputPanel } from '@/components/context-input/context-input-panel'
import { TemplatePicker } from '@/components/template-picker/template-picker'
import { Separator } from '@/components/ui/separator'
import { ArrowRight, CheckCircle2 } from 'lucide-react'
import type { TemplateId } from '@/lib/ai/prompts/reel-chat'

type Step = 'context' | 'template'

export default function NewReelPage() {
  const router = useRouter()
  const [step, setStep] = useState<Step>('context')
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [contextId, setContextId] = useState<string | null>(null)
  const [contextCharCount, setContextCharCount] = useState(0)
  const [template, setTemplate] = useState<TemplateId | null>(null)
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Create a session on mount
  useEffect(() => {
    fetch('/api/sessions', { method: 'POST' })
      .then(res => res.json())
      .then(json => setSessionId(json.id))
      .catch(() => setError('Failed to start session'))
  }, [])

  const handleContextCreated = (id: string, charCount: number) => {
    setContextId(id)
    setContextCharCount(charCount)
    setStep('template')
  }

  const handleCreateReel = async () => {
    if (!sessionId || !contextId || !template) return
    setCreating(true)
    setError(null)

    try {
      const res = await fetch('/api/reels', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session_id: sessionId, context_id: contextId, template }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error ?? 'Failed to create reel')
      router.push(`/reels/${json.data.id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
      setCreating(false)
    }
  }

  if (!sessionId) {
    return (
      <div className="flex items-center justify-center min-h-screen text-muted-foreground text-sm">
        Loading...
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold">Create New Reel</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Add your content and pick a template to get started.
          </p>
        </div>

        {/* Step indicators */}
        <div className="flex items-center gap-3 mb-8 text-sm">
          <div className={`flex items-center gap-1.5 font-medium ${contextId ? 'text-primary' : step === 'context' ? 'text-foreground' : 'text-muted-foreground'}`}>
            {contextId ? <CheckCircle2 className="w-4 h-4" /> : <span className="w-5 h-5 rounded-full border-2 border-current flex items-center justify-center text-xs">1</span>}
            Add Context
          </div>
          <ArrowRight className="w-4 h-4 text-muted-foreground" />
          <div className={`flex items-center gap-1.5 font-medium ${step === 'template' ? 'text-foreground' : 'text-muted-foreground'}`}>
            <span className="w-5 h-5 rounded-full border-2 border-current flex items-center justify-center text-xs">2</span>
            Pick Template
          </div>
        </div>

        <Separator className="mb-8" />

        {/* Step 1: Context */}
        {step === 'context' && (
          <div>
            <h2 className="font-semibold mb-1">Add your content</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Paste text, notes, or upload a PDF. The AI will generate your reel from this.
            </p>
            <ContextInputPanel sessionId={sessionId} onContextCreated={handleContextCreated} />
          </div>
        )}

        {/* Step 2: Template */}
        {step === 'template' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="font-semibold mb-1">Choose a template</h2>
                <p className="text-sm text-muted-foreground">
                  Context saved ({contextCharCount.toLocaleString()} chars). Now pick how your reel should look and feel.
                </p>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setStep('context')}>
                Edit context
              </Button>
            </div>

            <TemplatePicker selected={template} onSelect={setTemplate} />

            {error && <p className="text-xs text-destructive mt-3">{error}</p>}

            <div className="mt-6 flex justify-end">
              <Button
                onClick={handleCreateReel}
                disabled={!template || creating}
                className="gap-2"
              >
                {creating ? 'Creating...' : 'Create Reel'}
                {!creating && <ArrowRight className="w-4 h-4" />}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
