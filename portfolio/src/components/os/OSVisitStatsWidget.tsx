"use client";

import { useEffect, useRef, useState } from "react";

const SOCKET_URL = process.env.NEXT_PUBLIC_WEBSOCKET_URL?.trim() || "";
const API_URL = process.env.NEXT_PUBLIC_VISIT_API_URL?.trim() || "";
const shouldConnectVisitCounter = Boolean(SOCKET_URL);

export default function OSVisitStatsWidget() {
  const [visitCount, setVisitCount] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [status, setStatus] = useState<
    "connecting" | "connected" | "disconnected"
  >(shouldConnectVisitCounter ? "connecting" : "disconnected");
  const reconnectTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!shouldConnectVisitCounter) {
      setStatus("disconnected");
      return;
    }

    let shouldReconnect = true;

    const connect = () => {
      setStatus("connecting");
      const socket = new WebSocket(SOCKET_URL);

      socket.onopen = () => setStatus("connected");

      socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);

          if (data.type === "visit_count") {
            setVisitCount(data.count);
          }
        } catch {
          setStatus("disconnected");
        }
      };

      socket.onerror = () => {
        setStatus("disconnected");
      };

      socket.onclose = () => {
        setStatus("disconnected");

        if (shouldReconnect) {
          reconnectTimer.current = setTimeout(connect, 3000);
        }
      };

      return socket;
    };

    const socket = connect();

    return () => {
      shouldReconnect = false;

      if (reconnectTimer.current) {
        clearTimeout(reconnectTimer.current);
      }

      socket.close();
    };
  }, []);

  useEffect(() => {
    if (!shouldConnectVisitCounter || !API_URL) {
      return;
    }

    fetch(`${API_URL}/api/visit`, { method: "POST" }).catch(() => {
      setStatus("disconnected");
    });
  }, []);

  if (!isVisible) {
    return null;
  }

  return (
    <aside
      className="fixed bottom-16 left-3 z-20 flex min-h-14 max-w-[calc(100vw-1.5rem)] items-center gap-3 rounded-lg border border-white/80 bg-white/[0.84] py-2 pl-4 pr-9 shadow-[0_14px_36px_rgba(26,47,87,0.15)] backdrop-blur-xl dark:border-slate-700/80 dark:bg-slate-950/[0.78] sm:left-6"
      aria-live="polite"
      aria-label="Visit statistics"
    >
      <button
        type="button"
        onClick={() => setIsVisible(false)}
        aria-label="Close visit statistics"
        className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded text-xs leading-none text-slate-500 transition hover:bg-slate-200/80 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
      >
        x
      </button>
      <span
        className={`h-2.5 w-2.5 shrink-0 rounded-full ${
          status === "connected"
            ? "bg-emerald-400 shadow-[0_0_0_4px_rgba(74,222,128,0.16)]"
            : status === "connecting"
              ? "bg-amber-400 shadow-[0_0_0_4px_rgba(251,191,36,0.14)]"
              : "bg-slate-400"
        }`}
      />
      <div className="min-w-0">
        <p className="text-[11px] font-semibold uppercase leading-none tracking-[0.2em] text-slate-500 dark:text-slate-400">
          Visits
        </p>
        <p className="mt-1.5 truncate text-base font-semibold leading-none text-slate-950 dark:text-white">
          {status === "connected" ? visitCount : "--"}
          <span className="ml-1.5 text-xs font-medium text-slate-500 dark:text-slate-400">
            {status === "connected"
              ? "live"
              : status === "connecting"
                ? "connecting"
                : "offline"}
          </span>
        </p>
      </div>
    </aside>
  );
}
