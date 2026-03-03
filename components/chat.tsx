"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

async function createSession(): Promise<string> {
  const res = await fetch("/api/sessions", { method: "POST" });
  const { id } = (await res.json()) as { id: string };
  return id;
}

export default function Chat() {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    createSession().then(setSessionId);
  }, []);

  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: "/api/chat",
        body: sessionId ? { sessionId } : {},
      }),
    [sessionId]
  );

  const { messages, sendMessage, status, setMessages } = useChat({ transport });

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function handleNewChat() {
    setMessages([]);
    createSession().then(setSessionId);
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!input.trim() || status === "streaming" || !sessionId) return;
    sendMessage({ text: input });
    setInput("");
  }

  return (
    <div className="flex flex-col h-screen max-w-2xl mx-auto">
      <header className="border-b px-6 py-4 flex items-center justify-between">
        <h1 className="text-lg font-semibold">Reel Assistant</h1>
        <Button variant="outline" size="sm" onClick={handleNewChat}>
          New Chat
        </Button>
      </header>

      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
        {messages.length === 0 && (
          <p className="text-muted-foreground text-sm text-center mt-8">
            Ask me to write a script, plan your reel structure, generate
            hashtags, or give editing instructions.
          </p>
        )}
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`rounded-lg px-4 py-2 max-w-prose text-sm whitespace-pre-wrap ${
                m.role === "user"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-foreground"
              }`}
            >
              {m.parts
                .filter((p) => p.type === "text")
                .map((p, i) => <span key={i}>{p.text}</span>)}
            </div>
          </div>
        ))}
        {status === "streaming" && (
          <div className="flex justify-start">
            <div className="bg-muted rounded-lg px-4 py-2 text-sm text-muted-foreground animate-pulse">
              Thinking...
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={handleSubmit} className="border-t px-6 py-4 flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Write a script, plan a reel, get hashtags..."
          disabled={status === "streaming" || !sessionId}
          className="flex-1"
        />
        <Button
          type="submit"
          disabled={status === "streaming" || !input?.trim() || !sessionId}
        >
          Send
        </Button>
      </form>
    </div>
  );
}
