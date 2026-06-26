import type { ChatMessage as ChatMessageType } from "@/lib/groq";

export function ChatMessage({ message }: { message: ChatMessageType }) {
  const isUser = message.role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-4 py-3 text-sm leading-relaxed ${
          isUser
            ? "rounded-br-md bg-slate-900 text-white"
            : "rounded-bl-md border border-slate-200 bg-white text-slate-800"
        }`}
      >
        {message.content}
      </div>
    </div>
  );
}
