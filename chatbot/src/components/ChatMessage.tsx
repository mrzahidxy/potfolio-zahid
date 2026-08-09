import type { ChatMessage as ChatMessageType } from "@/lib/groq";

export function ChatMessage({ message }: { message: ChatMessageType }) {
  const isUser = message.role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[86%] whitespace-pre-wrap rounded-lg border px-4 py-3 font-mono text-[13px] leading-relaxed shadow-sm ${
          isUser
            ? "border-indigo-400/40 bg-indigo-600 text-white"
            : "border-slate-200 bg-white text-slate-800"
        }`}
      >
        <p
          className={`mb-1 text-[10px] font-semibold uppercase tracking-[0.18em] ${
            isUser ? "text-indigo-100" : "text-slate-400"
          }`}
        >
          {isUser ? "You" : "Zahid AI"}
        </p>
        {message.content}
      </div>
    </div>
  );
}
