import { useEffect, useRef, useState } from "react";

const SOCKET_URL = process.env.NEXT_PUBLIC_WEBSOCKET_URL?.trim() || "";
const API_URL = process.env.NEXT_PUBLIC_VISIT_API_URL?.trim() || "";
const shouldConnectVisitCounter = Boolean(SOCKET_URL);

function PortfolioView() {
  const [visitCount, setVisitCount] = useState<number>(0);
  const [status, setStatus] = useState<
    "connecting" | "connected" | "disconnected"
  >(shouldConnectVisitCounter ? "connecting" : "disconnected");
  const reconnectTimer = useRef<NodeJS.Timeout | null>(null);

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
    if (!shouldConnectVisitCounter || !API_URL) return;

    fetch(`${API_URL}/api/visit`, { method: "POST" }).catch(() => {
      setStatus("disconnected");
    });
  }, []);

  return (
    <div
      className="fixed bottom-24 right-4 z-50 flex items-center gap-2 rounded-full border border-slate-200/80 bg-white/85 px-3 py-2 text-xs font-semibold text-slate-700 shadow-[0_12px_32px_rgba(15,23,42,0.10)] backdrop-blur-xl dark:border-slate-800/80 dark:bg-slate-900/85 dark:text-slate-100 sm:bottom-9 sm:right-28"
      aria-live="polite"
    >
      <span className="sr-only">Visits</span>
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className="h-4 w-4 text-sky-500"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
      {status === "connecting" && (
        <span
          className="h-3 w-3 animate-spin rounded-full border-2 border-slate-400 border-t-transparent"
          aria-label="connecting"
        />
      )}
      {status === "connected" && (
        <span className="text-sm font-semibold text-slate-900 dark:text-slate-50">
          {visitCount.toLocaleString()}
        </span>
      )}
      {status === "disconnected" && (
        <span className="text-slate-500">Offline</span>
      )}
    </div>
  );
}

export default PortfolioView;
