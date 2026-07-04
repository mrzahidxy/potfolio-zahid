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
        reconnectTimer.current = setTimeout(connect, 3000);
      };

      return socket;
    };

    const socket = connect();

    return () => {
      socket.close();

      if (reconnectTimer.current) {
        clearTimeout(reconnectTimer.current);
      }
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
      className="fixed bottom-16 left-3 z-20 w-[min(220px,calc(100vw-1.5rem))] rounded-lg border border-white/80 bg-white/[0.82] px-4 py-3 shadow-[0_18px_50px_rgba(26,47,87,0.18)] backdrop-blur-xl dark:border-slate-700/80 dark:bg-slate-950/[0.76] sm:left-6"
      aria-live="polite"
      aria-label="Visit statistics"
    >
      <button
        type="button"
        onClick={() => setIsVisible(false)}
        aria-label="Close visit statistics"
        className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded text-sm leading-none text-slate-500 transition hover:bg-slate-200/80 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
      >
        x
      </button>
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">
            Visits
          </p>
          <p className="mt-1 text-2xl font-semibold tracking-tight text-slate-950 dark:text-white">
            {status === "connected" ? visitCount : "--"}
          </p>
        </div>
        <span
          className={`h-2.5 w-2.5 rounded-full ${
            status === "connected"
              ? "bg-emerald-400 shadow-[0_0_0_6px_rgba(74,222,128,0.18)]"
              : status === "connecting"
                ? "bg-amber-400 shadow-[0_0_0_6px_rgba(251,191,36,0.16)]"
                : "bg-slate-400"
          }`}
        />
      </div>
      <p className="mt-2 text-xs font-medium text-slate-600 dark:text-slate-300">
        {status === "connected"
          ? "Live counter"
          : status === "connecting"
            ? "Connecting"
            : "Offline"}
      </p>
    </aside>
  );
}
