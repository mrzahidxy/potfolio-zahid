import { NextFunction, Request, Response } from "express";

const VISIT_RATE_LIMIT_WINDOW_MS = 60_000;
const visitRateLimitEntries = new Map<string, number>();

export const normalizeOrigin = (origin: string) => origin.trim().replace(/\/+$/, "");

export const parseAllowedOrigins = (value: string | undefined) =>
  (value ?? "")
    .split(",")
    .map(normalizeOrigin)
    .filter(Boolean);

export const createOriginGuard = (allowedOrigins: string[], nodeEnv: string | undefined) => {
  const allowWildcard = nodeEnv !== "production" && allowedOrigins.includes("*");
  const allowlist = new Set(allowedOrigins.filter((origin) => origin !== "*"));

  return (req: Request, res: Response, next: NextFunction) => {
    const origin = req.header("origin");

    if (!origin) {
      next();
      return;
    }

    if (allowWildcard || allowlist.has(normalizeOrigin(origin))) {
      next();
      return;
    }

    res.status(403).json({ error: "Origin not allowed" });
  };
};

export const createCorsOriginValidator = (allowedOrigins: string[], nodeEnv: string | undefined) => {
  const allowWildcard = nodeEnv !== "production" && allowedOrigins.includes("*");
  const allowlist = new Set(allowedOrigins.filter((origin) => origin !== "*"));

  return (origin: string | undefined, callback: (err: Error | null, allow?: boolean | string) => void) => {
    if (!origin || allowWildcard) {
      callback(null, true);
      return;
    }

    const normalizedOrigin = normalizeOrigin(origin);
    if (allowlist.has(normalizedOrigin)) {
      callback(null, normalizedOrigin);
      return;
    }

    callback(null, false);
  };
};

const getRequestIp = (req: Request) => {
  const forwardedFor = req.header("x-forwarded-for")?.split(",")[0]?.trim();
  const realIp = req.header("x-real-ip")?.trim();
  return forwardedFor || realIp || req.ip || "unknown";
};

export const visitRateLimiter = (req: Request, res: Response, next: NextFunction) => {
  const now = Date.now();
  const ip = getRequestIp(req);
  const expiresAt = visitRateLimitEntries.get(ip);

  if (expiresAt && expiresAt > now) {
    res.setHeader("Retry-After", Math.ceil((expiresAt - now) / 1000).toString());
    res.status(429).json({ error: "Too many visit increments" });
    return;
  }

  visitRateLimitEntries.set(ip, now + VISIT_RATE_LIMIT_WINDOW_MS);
  next();
};

const cleanupTimer = setInterval(() => {
  const now = Date.now();

  for (const [ip, expiresAt] of visitRateLimitEntries.entries()) {
    if (expiresAt <= now) {
      visitRateLimitEntries.delete(ip);
    }
  }
}, VISIT_RATE_LIMIT_WINDOW_MS);

cleanupTimer.unref?.();
