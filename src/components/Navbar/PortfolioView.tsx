import { useEffect, useState } from "react";

const WEBSOCKET_URL = process.env.NEXT_PUBLIC_WEBSOCKET_URL ?? "ws://localhost:8010";
const VISIT_API_URL = `${process.env.NEXT_PUBLIC_VISIT_API_URL}portfolio-visit`;

function PortfolioView() {
  const [visitCount, setVisitCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const socket = new WebSocket(WEBSOCKET_URL);

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

  return (
    <div className="fixed bottom-4 right-4 bg-blue-500 py-1 px-3 rounded-md text-white text-sm z-50">
      <p>Total View: <strong>{ loading ? "..." : visitCount}</strong></p>
    </div>
  );
}

export default PortfolioView;
