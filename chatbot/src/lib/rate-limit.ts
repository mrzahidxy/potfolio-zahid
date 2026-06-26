type Bucket = {
  count: number;
  resetAt: number;
};

const buckets = new Map<string, Bucket>();

export type RateLimitResult = {
  allowed: boolean;
  remaining: number;
  resetAt: number;
};

type UpstashResponse<T> = {
  result?: T;
  error?: string;
};

const DEFAULT_LIMIT = 20;
const DEFAULT_WINDOW_MS = 60_000;

function memoryRateLimit(
  key: string,
  limit = DEFAULT_LIMIT,
  windowMs = DEFAULT_WINDOW_MS,
): RateLimitResult {
  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || bucket.resetAt <= now) {
    const resetAt = now + windowMs;
    buckets.set(key, { count: 1, resetAt });
    return { allowed: true, remaining: limit - 1, resetAt };
  }

  if (bucket.count >= limit) {
    return { allowed: false, remaining: 0, resetAt: bucket.resetAt };
  }

  bucket.count += 1;
  return {
    allowed: true,
    remaining: Math.max(0, limit - bucket.count),
    resetAt: bucket.resetAt,
  };
}

async function upstashCommand<T>(command: string[]) {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) return null;

  const response = await fetch(`${url}/${command.map(encodeURIComponent).join("/")}`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Redis rate limit request failed.");
  }

  return (await response.json()) as UpstashResponse<T>;
}

async function redisRateLimit(
  key: string,
  limit = DEFAULT_LIMIT,
  windowMs = DEFAULT_WINDOW_MS,
): Promise<RateLimitResult | null> {
  if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
    return null;
  }

  const windowSeconds = Math.ceil(windowMs / 1000);
  const windowId = Math.floor(Date.now() / windowMs);
  const redisKey = `rate-limit:${key}:${windowId}`;
  const resetAt = (windowId + 1) * windowMs;

  const increment = await upstashCommand<number>(["incr", redisKey]);
  const count = Number(increment?.result || 0);

  if (count === 1) {
    await upstashCommand<number>(["expire", redisKey, String(windowSeconds)]);
  }

  return {
    allowed: count <= limit,
    remaining: Math.max(0, limit - count),
    resetAt,
  };
}

export async function rateLimit(
  key: string,
  limit = DEFAULT_LIMIT,
  windowMs = DEFAULT_WINDOW_MS,
): Promise<RateLimitResult> {
  try {
    const redisResult = await redisRateLimit(key, limit, windowMs);
    if (redisResult) return redisResult;
  } catch {
    // Fall back to in-memory limiting if Redis is unavailable.
  }

  return memoryRateLimit(key, limit, windowMs);
}
