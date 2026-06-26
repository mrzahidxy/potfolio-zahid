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

    const nextMessages: ChatMessageType[] = [...messages, { role: "user", content: trimmed }];
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

      setMessages((current) => [...current, { role: "assistant", content: data.reply! }]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to get a reply right now.");
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void sendMessage(input);
  }

  return (
    <section
      className={`flex min-h-0 w-full flex-col overflow-hidden border border-slate-200 bg-slate-50 shadow-soft ${
        embedded ? "h-screen rounded-none sm:h-[600px] sm:rounded-3xl" : "h-[min(720px,calc(100vh-3rem))] rounded-3xl"
      }`}
      aria-label="Zahid portfolio chatbot"
    >
      <header className="flex items-center justify-between gap-3 border-b border-slate-200 bg-white px-4 py-2.5">
        <div className="min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">Portfolio Assistant</p>
          <h1 className="truncate text-base font-bold leading-tight text-slate-950">Ask about Zahid</h1>
        </div>
        <p className="hidden shrink-0 text-xs text-slate-500 sm:block">Projects · Skills · Contact</p>
      </header>

      <div className="flex-1 space-y-4 overflow-y-auto p-4">
        {messages.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-4 text-sm text-slate-700">
            <p className="font-medium text-slate-950">Hi, I’m Zahid’s portfolio assistant.</p>
            <p className="mt-1">Choose a starter question or ask anything about Zahid’s work.</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {starterQuestions.map((question) => (
                <button
                  key={question}
                  type="button"
                  onClick={() => void sendMessage(question)}
                  className="rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-700 transition hover:border-slate-400 hover:bg-white"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((message, index) => <ChatMessage key={`${message.role}-${index}`} message={message} />)
        )}

        {isLoading && (
          <div className="flex justify-start">
            <div className="rounded-2xl rounded-bl-md border border-slate-200 bg-white px-4 py-3 text-sm text-slate-500">
              Thinking…
            </div>
          </div>
        )}

        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
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
            placeholder="Ask about Zahid..."
            className="min-w-0 flex-1 rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-slate-500"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Send
          </button>
        </div>
      </form>
    </section>
  );
}
