'use client'

import { useState, useRef, useEffect, useMemo } from 'react'
import { useChat } from '@ai-sdk/react'
import { DefaultChatTransport } from 'ai'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { MessageSquare, X, Send } from 'lucide-react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'

interface ChatEditorWidgetProps {
  reelId: string
  sessionId: string
  onEditsApplied?: () => void
}

export function ChatEditorWidget({ reelId, sessionId, onEditsApplied }: ChatEditorWidgetProps) {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)

  const transport = useMemo(
    () => new DefaultChatTransport({ api: `/api/chat/reel/${reelId}`, body: { session_id: sessionId } }),
    [reelId, sessionId]
  )

  const { messages, sendMessage, status } = useChat({ transport })

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!input.trim() || status === 'streaming') return
    sendMessage({ text: input })
    setInput('')
    onEditsApplied?.()
  }

  return (
    <>
      {/* Floating toggle button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-primary text-primary-foreground rounded-full shadow-lg flex items-center justify-center hover:bg-primary/90 transition-all"
          aria-label="Open reel editor chat"
        >
          <MessageSquare className="w-6 h-6" />
        </button>
      )}

      {/* Chat panel */}
      {open && (
        <div className="fixed bottom-6 right-6 z-50 w-80 h-120 bg-background border rounded-2xl shadow-2xl flex flex-col overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b bg-muted/30">
            <div>
              <p className="font-semibold text-sm">Edit Reel</p>
              <p className="text-[11px] text-muted-foreground">Describe changes to make</p>
            </div>
            <Button variant="ghost" size="icon" className="w-7 h-7" onClick={() => setOpen(false)}>
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Messages */}
          <ScrollArea className="flex-1 px-3 py-2">
            {messages.length === 0 && (
              <div className="flex flex-col gap-2 mt-4">
                <p className="text-xs text-muted-foreground text-center mb-3">Try asking:</p>
                {[
                  'Make the hook more dramatic',
                  'Shorten scene 3 to 5 seconds',
                  'Add a CTA scene at the end',
                  'Regenerate the first image',
                ].map(suggestion => (
                  <button
                    key={suggestion}
                    onClick={() => setInput(suggestion)}
                    className="text-xs text-left px-3 py-2 rounded-lg bg-muted hover:bg-muted/80 text-muted-foreground transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}

            {messages.map(msg => (
              <div
                key={msg.id}
                className={cn('mb-3 flex', msg.role === 'user' ? 'justify-end' : 'justify-start')}
              >
                <div
                  className={cn(
                    'max-w-[85%] px-3 py-2 rounded-xl text-xs leading-relaxed',
                    msg.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-foreground'
                  )}
                >
                  {msg.parts
                    .filter(p => p.type === 'text')
                    .map((p, i) => <span key={i}>{p.text}</span>)}
                </div>
              </div>
            ))}

            {status === 'streaming' && (
              <div className="flex justify-start mb-3">
                <div className="bg-muted px-3 py-2 rounded-xl text-xs text-muted-foreground animate-pulse">
                  Thinking...
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </ScrollArea>

          {/* Input */}
          <form onSubmit={handleSubmit} className="flex gap-2 p-3 border-t">
            <Input
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Describe an edit..."
              disabled={status === 'streaming'}
              className="flex-1 text-xs h-8"
            />
            <Button
              type="submit"
              disabled={!input.trim() || status === 'streaming'}
              size="icon"
              className="w-8 h-8 shrink-0"
            >
              <Send className="w-3.5 h-3.5" />
            </Button>
          </form>
        </div>
      )}
    </>
  )
}
