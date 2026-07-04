"use client";

import { FormEvent, useRef, useState } from "react";
import { ChatMessage } from "@/components/ChatMessage";
import type { ChatMessage as ChatMessageType } from "@/lib/groq";

const starterQuestions = [
  "Who is Zahid?",
  "What projects has Zahid built?",
  "What tech stack does Zahid use?",
  "Is Zahid available for work?",
  "How can I contact Zahid?",
];

type ChatApiResponse = {
  reply?: string;
  error?: string;
};

export function ChatWidget({ embedded = false }: { embedded?: boolean }) {
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function sendMessage(content: string) {
    const trimmed = content.trim();
    if (!trimmed || isLoading) return;

    const nextMessages: ChatMessageType[] = [
      ...messages,
      { role: "user", content: trimmed },
    ];
    setMessages(nextMessages);
    setInput("");
    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextMessages.slice(-10) }),
      });
      const data = (await response.json()) as ChatApiResponse;

      if (!response.ok || !data.reply) {
        throw new Error(data.error || "Unable to get a reply right now.");
      }

      setMessages((current) => [
        ...current,
        { role: "assistant", content: data.reply! },
      ]);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to get a reply right now."
      );
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void sendMessage(input);
  }

  const shellClassName = embedded
    ? "h-screen border-0 bg-white shadow-none ring-0"
    : "h-[min(720px,calc(100vh-3rem))] rounded-lg border border-white/80 bg-white/[0.92] shadow-soft ring-1 ring-slate-950/[0.06] backdrop-blur-xl";

  return (
    <section
      className={`flex min-h-0 w-full flex-col overflow-hidden ${shellClassName}`}
      aria-label="Zahid portfolio chatbot"
    >
      {!embedded && (
        <header className="flex min-h-11 items-center justify-between gap-3 border-b border-slate-200/80 bg-gradient-to-b from-white/95 to-slate-100/[0.92] px-4 py-2.5">
          <div className="flex min-w-0 items-center gap-3">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-slate-200 bg-slate-950 font-mono text-xs font-bold text-emerald-300 shadow-sm">
              AI
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold leading-tight text-slate-900">
                Zahid Assistant.exe
              </p>
              <p className="truncate font-mono text-[11px] text-slate-500">
                Projects / Skills / Contact
              </p>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-1 text-sm leading-none text-slate-700">
            <span className="flex h-7 w-8 items-center justify-center rounded hover:bg-slate-200/80">
              -
            </span>
            <span className="flex h-7 w-8 items-center justify-center rounded text-[13px] hover:bg-slate-200/80">
              []
            </span>
            <span className="flex h-7 w-8 items-center justify-center rounded hover:bg-red-500 hover:text-white">
              x
            </span>
          </div>
        </header>
      )}

      <div className="flex items-center justify-between gap-3 border-b border-slate-200 bg-slate-50/80 px-4 py-2 font-mono text-[11px] text-slate-500">
        <span>session: ai-chatbot</span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-emerald-400" />
          online
        </span>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto bg-slate-100/70 p-4">
        {messages.length === 0 ? (
          <div className="rounded-lg border border-dashed border-slate-300 bg-white p-4 text-sm text-slate-700 shadow-sm">
            <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">
              AI chatbot ready
            </p>
            <p className="mt-2 font-semibold text-slate-950">
              This AI chatbot can answer portfolio questions about Zahid&apos;s
              work, skills, projects, availability, and contact details.
            </p>
            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              {starterQuestions.map((question) => (
                <button
                  key={question}
                  type="button"
                  onClick={() => void sendMessage(question)}
                  className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-left font-mono text-[12px] font-medium text-slate-700 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700"
                >
                  <span className="mr-2 text-slate-400">&gt;</span>
                  {question}
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((message, index) => (
            <ChatMessage key={`${message.role}-${index}`} message={message} />
          ))
        )}

        {isLoading && (
          <div className="flex justify-start">
            <div className="rounded-lg border border-slate-200 bg-white px-4 py-3 font-mono text-[13px] text-slate-500 shadow-sm">
              Thinking...
            </div>
          </div>
        )}

        {error && (
          <div
            className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
            role="alert"
          >
            {error}
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="border-t border-slate-200 bg-white p-3">
        <div className="flex gap-2">
          <input
            ref={inputRef}
            value={input}
            onChange={(event) => setInput(event.target.value)}
            maxLength={1000}
            placeholder="Type a command or question..."
            className="min-w-0 flex-1 rounded-md border border-slate-200 bg-slate-50 px-4 py-3 font-mono text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-500/15"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="rounded-md bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Send
          </button>
        </div>
      </form>
    </section>
  );
}
