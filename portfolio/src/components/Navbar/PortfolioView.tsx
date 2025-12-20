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
    <div className="fixed bottom-4 right-4 z-50 flex items-center gap-2 rounded-full border border-slate-200 bg-white/90 px-3 py-1 text-xs font-semibold text-slate-800 shadow-md backdrop-blur dark:border-slate-700 dark:bg-slate-800/90 dark:text-slate-100">
      <span role="img" aria-label="eyes">
        👀
      </span>
      {status === "connecting" && (
        <span
          className="flex h-3 w-3 items-center justify-center"
          aria-label="connecting"
        >
          <span className="h-3 w-3 rounded-full border-2 border-slate-400 border-t-transparent animate-spin" />
        </span>
      )}
      {status === "connected" && <span>{visitCount}</span>}
      {status === "disconnected" && (
        <span className="text-slate-500">Offline</span>
      )}
    </div>
  );
}

export default PortfolioView;
