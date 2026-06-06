type LogLevel = "debug" | "info" | "warn" | "error";

type LoggerOptions = {
  context?: string;
};

type LogMeta = unknown;

const DEV_COLORS: Record<LogLevel, string> = {
  debug: "#0ea5e9",
  info: "#2563eb",
  warn: "#d97706",
  error: "#dc2626",
};

const ANSI_COLORS: Record<LogLevel, string> = {
  debug: "36",
  info: "34",
  warn: "33",
  error: "31",
};

const isBrowser = typeof window !== "undefined";
const isDevelopment = process.env.NODE_ENV !== "production";

const formatMeta = (meta?: LogMeta) => {
  if (meta === undefined) {
    return "";
  }

  if (meta instanceof Error) {
    return meta.stack || `${meta.name}: ${meta.message}`;
  }

  if (typeof meta === "string") {
    return meta;
  }

  try {
    return JSON.stringify(meta);
  } catch {
    return String(meta);
  }
};

const formatMessage = (
  level: LogLevel,
  context: string | undefined,
  message: string,
  meta?: LogMeta
) => {
  const timestamp = new Date().toISOString();
  const prefix = `[${timestamp}] [${level.toUpperCase()}]${
    context ? ` [${context}]` : ""
  }`;
  const suffix = formatMeta(meta);

  return suffix ? `${prefix} ${message} ${suffix}` : `${prefix} ${message}`;
};

const write = (
  level: LogLevel,
  context: string | undefined,
  message: string,
  meta?: LogMeta
) => {
  if (level === "debug" && !isDevelopment) {
    return;
  }

  const output = formatMessage(level, context, message, meta);

  if (isDevelopment && isBrowser) {
    console.log(`%c${output}`, `color:${DEV_COLORS[level]};font-weight:600;`);
    return;
  }

  if (isDevelopment && !isBrowser && process.stdout?.isTTY) {
    console.log(`\u001b[${ANSI_COLORS[level]}m${output}\u001b[0m`);
    return;
  }

  let logger = console.error;

  if (level === "debug") {
    logger = console.debug;
  } else if (level === "info") {
    logger = console.info;
  } else if (level === "warn") {
    logger = console.warn;
  }

  logger(output);
};

export type Logger = {
  debug: (message: string, meta?: LogMeta) => void;
  info: (message: string, meta?: LogMeta) => void;
  warn: (message: string, meta?: LogMeta) => void;
  error: (message: string, meta?: LogMeta) => void;
  withContext: (context: string) => Logger;
};

export const createLogger = (options: LoggerOptions = {}): Logger => {
  const context = options.context;

  return {
    debug: (message, meta) => write("debug", context, message, meta),
    info: (message, meta) => write("info", context, message, meta),
    warn: (message, meta) => write("warn", context, message, meta),
    error: (message, meta) => write("error", context, message, meta),
    withContext: (nextContext) =>
      createLogger({
        context: context ? `${context}:${nextContext}` : nextContext,
      }),
  };
};

export const logger = createLogger();
