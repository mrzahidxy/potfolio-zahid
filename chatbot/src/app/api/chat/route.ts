import { NextRequest, NextResponse } from "next/server";
import {
  createGroqChatCompletion,
  GroqProviderError,
  type ChatMessage,
} from "@/lib/groq";
import { buildSystemPrompt } from "@/lib/prompt";
import { rateLimit } from "@/lib/rate-limit";

const MAX_MESSAGES = 10;
const MAX_MESSAGE_LENGTH = 1_000;

function json(data: unknown, init?: ResponseInit) {
  return NextResponse.json(data, {
    ...init,
    headers: {
      "Cache-Control": "no-store",
      ...(init?.headers || {}),
    },
  });
}

function getClientIp(request: NextRequest) {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

function normalizeContent(value: unknown) {
  if (typeof value !== "string") return "";
  return value.replace(/\s+/g, " ").trim().slice(0, MAX_MESSAGE_LENGTH);
}

/**
 * Parses the message array from the request body
 * Validates message format and ensures the last message's role is user
 *
 * @param body - Request body object containing the messages array
 * @returns Parsed chat message array, or null if validation fails
 */
function parseMessages(body: unknown): ChatMessage[] | null {
  if (
    !body ||
    typeof body !== "object" ||
    !Array.isArray((body as { messages?: unknown }).messages)
  ) {
    return null;
  }

  // Extract the last N messages (limiting to maximum number of messages)
  const rawMessages = (body as { messages: unknown[] }).messages.slice(
    -MAX_MESSAGES,
  );
  const messages: ChatMessage[] = [];

  for (const message of rawMessages) {
    if (!message || typeof message !== "object") return null;
    const role = (message as { role?: unknown }).role;
    const content = normalizeContent(
      (message as { content?: unknown }).content,
    );

    if ((role !== "user" && role !== "assistant") || !content) return null;
    messages.push({ role, content });
  }

  // Verify message array is not empty and the last message's role is user
  if (!messages.length || messages[messages.length - 1].role !== "user")
    return null;
  return messages;
}

export async function POST(request: NextRequest) {
  try {
    const limited = await rateLimit(getClientIp(request));
    if (!limited.allowed) {
      return json(
        { error: "Too many requests. Please wait a moment and try again." },
        {
          status: 429,
          headers: {
            "Retry-After": String(
              Math.ceil((limited.resetAt - Date.now()) / 1000),
            ),
          },
        },
      );
    }

    if (!process.env.GROQ_API_KEY) {
      return json(
        { error: "Chat service is not configured yet." },
        { status: 503 },
      );
    }

    const body = await request.json().catch(() => null);
    const messages = parseMessages(body);
    if (!messages) {
      return json(
        { error: "Invalid request. Send an array of user/assistant messages." },
        { status: 400 },
      );
    }

    const reply = await createGroqChatCompletion([
      { role: "system", content: buildSystemPrompt() },
      ...messages,
    ]);

    return json({ reply });
  } catch (error) {
    if (error instanceof GroqProviderError) {
      if (error.status === 429) {
        return json(
          {
            error: "The chat provider is rate limited. Please try again soon.",
          },
          { status: 429 },
        );
      }
      return json(
        {
          error:
            "The chat provider is currently unavailable. Please try again later.",
        },
        { status: 502 },
      );
    }

    return json(
      { error: "Something went wrong. Please try again later." },
      { status: 500 },
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204 });
}
