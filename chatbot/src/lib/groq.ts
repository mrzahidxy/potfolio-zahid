export type ChatRole = "user" | "assistant";

export type ChatMessage = {
  role: ChatRole;
  content: string;
};

type GroqMessage = ChatMessage | { role: "system"; content: string };

type GroqResponse = {
  choices?: Array<{
    message?: {
      content?: string;
    };
  }>;
  error?: {
    message?: string;
    type?: string;
    code?: string;
  };
};

export class GroqProviderError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "GroqProviderError";
    this.status = status;
  }
}

export async function createGroqChatCompletion(messages: GroqMessage[]) {
  const apiKey = process.env.GROQ_API_KEY;
  const model = process.env.GROQ_MODEL || "llama-3.1-8b-instant";

  if (!apiKey) {
    throw new GroqProviderError("Groq API key is not configured.", 500);
  }

  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      messages,
      temperature: 0.2,
      max_tokens: 450,
    }),
  });

  const data = (await response.json().catch(() => ({}))) as GroqResponse;

  if (!response.ok) {
    throw new GroqProviderError(data.error?.message || "Groq provider request failed.", response.status);
  }

  const reply = data.choices?.[0]?.message?.content?.trim();
  if (!reply) {
    throw new GroqProviderError("Groq returned an empty response.", 502);
  }

  return reply;
}
