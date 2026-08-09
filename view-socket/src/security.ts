import { NextFunction, Request, Response } from "express";

const VISIT_RATE_LIMIT_WINDOW_MS = 60_000;
const visitRateLimitEntries = new Map<string, number>();

export const normalizeOrigin = (origin: string) => origin.trim().replace(/\/+$/, "");

export const parseAllowedOrigins = (value: string | undefined) =>
  (value ?? "")
    .split(",")
    .map(normalizeOrigin)
    .filter(Boolean);

export const isOriginAllowed = (
  origin: string | undefined,
  allowedOrigins: string[],
  nodeEnv: string | undefined,
) => {
  if (!origin) return nodeEnv !== "production";
  if (nodeEnv !== "production" && allowedOrigins.includes("*")) return true;

  const allowlist = new Set(allowedOrigins.filter((allowedOrigin) => allowedOrigin !== "*"));
  return allowlist.has(normalizeOrigin(origin));
};

export const createOriginGuard = (allowedOrigins: string[], nodeEnv: string | undefined) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (isOriginAllowed(req.header("origin"), allowedOrigins, nodeEnv)) {
      next();
      return;
    }

    res.status(403).json({ error: "Origin not allowed" });
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
