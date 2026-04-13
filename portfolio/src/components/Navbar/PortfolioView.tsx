import { useEffect, useRef, useState } from "react";

const SOCKET_URL =
  process.env.NEXT_PUBLIC_WEBSOCKET_URL || "ws://localhost:8010";
const API_URL = process.env.NEXT_PUBLIC_VISIT_API_URL;

function PortfolioView() {
  const [visitCount, setVisitCount] = useState<number>(0);
  const [status, setStatus] = useState<
    "connecting" | "connected" | "disconnected"
  >("connecting");
  const reconnectTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
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
        } catch (error) {
          console.error("Invalid message from socket:", error);
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
    fetch(`${API_URL}/api/visit`, { method: "POST" }).catch((error) =>
      console.error("Visit API error:", error)
    );
  }, []);

  return (
    <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2.5 rounded-full border border-slate-200/80 bg-white/85 px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-[0_16px_40px_rgba(15,23,42,0.12)] backdrop-blur-xl dark:border-slate-800/80 dark:bg-slate-900/85 dark:text-slate-100">
      <span
        className={`h-2.5 w-2.5 rounded-full ${
          status === "connected"
            ? "bg-emerald-400 shadow-[0_0_0_6px_rgba(74,222,128,0.18)]"
            : status === "connecting"
              ? "bg-amber-400 shadow-[0_0_0_6px_rgba(251,191,36,0.16)]"
              : "bg-slate-400"
        }`}
      />
      <span className="text-[10px] uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">
        Visits
      </span>
      {status === "connecting" && (
        <span
          className="flex h-3 w-3 items-center justify-center"
          aria-label="connecting"
        >
          <span className="h-3 w-3 rounded-full border-2 border-slate-400 border-t-transparent animate-spin" />
        </span>
      )}
      {status === "connected" && (
        <span className="text-sm font-semibold text-slate-900 dark:text-slate-50">
          {visitCount}
        </span>
      )}
      {status === "disconnected" && (
        <span className="text-slate-500">Offline</span>
      )}
    </div>
  );
}

export default PortfolioView;
