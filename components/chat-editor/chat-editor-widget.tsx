"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageSquare, X, Send, Sparkales } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface ChatEditorWidgetProps {
  reelId: string;
  sessionId: string;
  onEditsApplied?: () => void;
}

const SUGGESTIONS = [
  "Make the hook more dramatic and punchy",
  "Shorten scene 3 to 5 seconds",
  "Add a stronger CTA at the end",
  "Rewrite in a more casual tone",
];

export function ChatEditorWidget({
  reelId,
  sessionId,
  onEditsApplied,
}: ChatEditorWidgetProps) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: `/api/chat/reel/${reelId}`,
        body: { session_id: sessionId },
      }),
    [reelId, sessionId],
  );

  const { messages, sendMessage, status } = useChat({ transport });

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!input.trim() || status === "streaming") return;
    sendMessage({ text: input });
    setInput("");
    onEditsApplied?.();
  }

  return (
    <>
      {/* Floating action button (collapsed) */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          aria-label='Open reel editor chat'
          className={cn(
            "fixed bottom-[4.5rem] right-4 md:bottom-6 md:right-6 z-50",
            "flex items-center gap-2 h-11 px-4 md:px-5",
            "bg-primary text-primary-foreground rounded-full shadow-lg",
            "hover:bg-primary/90 active:scale-95 transition-all duration-150",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          )}
        >
          <Sparkles className='w-4 h-4 shrink-0' />
          <span className='text-sm font-medium hidden sm:inline'>
            Edit with AI
          </span>
        </button>
      )}

      {/* Chat panel */}
      {open && (
        <div
          role='complementary'
          aria-label='Reel editor chat'
          className={cn(
            "fixed z-50",
            // Mobile: inset from edges above the bottom bar
            "inset-x-3 bottom-[4.5rem]",
            // Desktop: fixed width panel at bottom-right
            "md:inset-x-auto md:bottom-6 md:right-6 md:w-[360px]",
            "h-[min(480px,60vh)]",
            "bg-card border rounded-2xl shadow-lg",
            "flex flex-col overflow-hidden",
          )}
        >
          {/* Header */}
          <div className='flex items-center justify-between px-4 py-3 border-b bg-muted/20 shrink-0'>
            <div className='flex items-center gap-2'>
              <div className='w-6 h-6 bg-primary/10 rounded-md flex items-center justify-center'>
                <Sparkles className='w-3.5 h-3.5 text-primary' />
              </div>
              <div>
                <p className='font-semibold text-sm leading-none'>
                  Edit with AI
                </p>
                <p className='text-[10px] text-muted-foreground mt-0.5'>
                  Describe any change
                </p>
              </div>
            </div>
            <Button
              variant='ghost'
              size='icon'
              className='w-7 h-7 rounded-lg'
              onClick={() => setOpen(false)}
              aria-label='Close chat'
            >
              <X className='w-3.5 h-3.5' />
            </Button>
          </div>

          {/* Messages */}
          <ScrollArea className='flex-1 px-3 py-3'>
            {messages.length === 0 && (
              <div className='space-y-2 mt-2'>
                <p className='text-[11px] text-muted-foreground text-center font-medium mb-3'>
                  Try asking…
                </p>
                {SUGGESTIONS.map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => setInput(suggestion)}
                    className={cn(
                      "w-full text-xs text-left px-3 py-2.5 rounded-xl",
                      "bg-muted hover:bg-muted/60 text-muted-foreground",
                      "transition-colors duration-100 leading-snug",
                    )}
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}

            {messages.map((msg) => (
              <div
                key={msg.id}
                className={cn(
                  "mb-3 flex",
                  msg.role === "user" ? "justify-end" : "justify-start",
                )}
              >
                <div
                  className={cn(
                    "max-w-[85%] px-3.5 py-2.5 text-xs leading-relaxed",
                    msg.role === "user"
                      ? "bg-primary text-primary-foreground rounded-[18px_18px_4px_18px]"
                      : "bg-muted text-foreground rounded-[18px_18px_18px_4px]",
                  )}
                >
                  {msg.parts
                    .filter((p) => p.type === "text")
                    .map((p, i) => (
                      <span key={i}>{p.text}</span>
                    ))}
                </div>
              </div>
            ))}

            {status === "streaming" && (
              <div className='flex justify-start mb-3'>
                <div className='bg-muted px-3.5 py-2.5 rounded-[18px_18px_18px_4px] text-xs text-muted-foreground'>
                  <span className='inline-flex gap-1'>
                    <span className='animate-bounce [animation-delay:0ms]'>
                      ·
                    </span>
                    <span className='animate-bounce [animation-delay:150ms]'>
                      ·
                    </span>
                    <span className='animate-bounce [animation-delay:300ms]'>
                      ·
                    </span>
                  </span>
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </ScrollArea>

          {/* Input */}
          <form
            onSubmit={handleSubmit}
            className='flex gap-2 p-3 border-t shrink-0'
          >
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder='Describe an edit…'
              disabled={status === "streaming"}
              className='flex-1 text-xs h-9'
            />
            <Button
              type='submit'
              disabled={!input.trim() || status === "streaming"}
              size='icon'
              className='w-9 h-9 shrink-0 rounded-xl'
              aria-label='Send'
            >
              <Send className='w-3.5 h-3.5' />
            </Button>
          </form>
        </div>
      )}
    </>
  );
}
