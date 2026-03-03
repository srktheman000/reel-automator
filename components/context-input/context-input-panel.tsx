'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Upload, FileText, Type } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ContextInputPanelProps {
  sessionId: string
  onContextCreated: (contextId: string, charCount: number) => void
}

export function ContextInputPanel({ sessionId, onContextCreated }: ContextInputPanelProps) {
  const [text, setText] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [dragOver, setDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleTextSubmit = async () => {
    if (!text.trim()) return
    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/contexts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ source_type: 'text', session_id: sessionId, text: text.trim() }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error ?? 'Failed to save context')
      onContextCreated(json.data.id, json.data.char_count)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const handlePDFSubmit = async () => {
    if (!file) return
    setLoading(true)
    setError(null)

    try {
      const form = new FormData()
      form.append('session_id', sessionId)
      form.append('file', file)

      const res = await fetch('/api/contexts', { method: 'POST', body: form })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error ?? 'Failed to parse PDF')
      onContextCreated(json.data.id, json.data.char_count)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const dropped = e.dataTransfer.files[0]
    if (dropped?.type === 'application/pdf') setFile(dropped)
    else setError('Only PDF files are accepted')
  }

  return (
    <div className="space-y-4">
      <Tabs defaultValue="text">
        <TabsList className="w-full">
          <TabsTrigger value="text" className="flex-1 gap-1.5">
            <Type className="w-3.5 h-3.5" /> Text
          </TabsTrigger>
          <TabsTrigger value="pdf" className="flex-1 gap-1.5">
            <FileText className="w-3.5 h-3.5" /> PDF
          </TabsTrigger>
        </TabsList>

        <TabsContent value="text" className="mt-3 space-y-3">
          <Textarea
            placeholder="Paste your script, notes, article, or any content you want to turn into a reel..."
            value={text}
            onChange={e => setText(e.target.value)}
            rows={8}
            className="resize-none text-sm"
          />
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">{text.length.toLocaleString()} chars</span>
            <Button onClick={handleTextSubmit} disabled={!text.trim() || loading} size="sm">
              {loading ? 'Saving...' : 'Use this context'}
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="pdf" className="mt-3 space-y-3">
          <div
            onDragOver={e => { e.preventDefault(); setDragOver(true) }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleFileDrop}
            onClick={() => fileInputRef.current?.click()}
            className={cn(
              'border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors',
              dragOver ? 'border-primary bg-primary/5' : 'border-muted-foreground/30 hover:border-primary/50'
            )}
          >
            <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-3" />
            {file ? (
              <p className="text-sm font-medium">{file.name}</p>
            ) : (
              <>
                <p className="text-sm font-medium">Drop PDF here or click to browse</p>
                <p className="text-xs text-muted-foreground mt-1">Max 20,000 characters extracted</p>
              </>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="application/pdf"
              className="hidden"
              onChange={e => {
                const f = e.target.files?.[0]
                if (f) setFile(f)
              }}
            />
          </div>

          {file && (
            <div className="flex justify-end">
              <Button onClick={handlePDFSubmit} disabled={loading} size="sm">
                {loading ? 'Extracting text...' : 'Parse & use PDF'}
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  )
}
