import { useEffect, useState } from "react";

const WEBSOCKET_URL = process.env.NEXT_PUBLIC_WEBSOCKET_URL ?? "ws://localhost:8010";
const VISIT_API_URL = `${process.env.NEXT_PUBLIC_VISIT_API_URL}portfolio-visit`;

function PortfolioView() {
  const [visitCount, setVisitCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const socket = new WebSocket(WEBSOCKET_URL);

    socket.onopen = () => setConnected(true);
    socket.onclose = () => setConnected(false);

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "visit_count") {
        setVisitCount(data.count);
        setLoading(false);
      }
    };

    return () => socket.close();
  }, []);

  useEffect(() => {
    fetch(VISIT_API_URL);
  }, []);

  const showConnecting = !connected && loading;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex items-center gap-2 rounded-full border border-slate-200 bg-white/90 px-3 py-1 text-xs font-semibold text-slate-800 shadow-md backdrop-blur dark:border-slate-700 dark:bg-slate-800/90 dark:text-slate-100">
      <span role="img" aria-label="eyes">👀</span>
      {loading ? (
        showConnecting ? (
          <span className="flex h-3 w-3 items-center justify-center" aria-label="connecting">
            <span className="h-3 w-3 rounded-full border-2 border-slate-400 border-t-transparent animate-spin" />
          </span>
        ) : (
          <span>…</span>
        )
      ) : (
        <span>{visitCount}</span>
      )}
    </div>
  );
}

export default PortfolioView;
