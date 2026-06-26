import Link from "next/link";
import { ChatWidget } from "@/components/ChatWidget";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-6xl items-center gap-8 lg:grid-cols-[1fr_420px]">
        <section>
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-500">Standalone MVP</p>
          <h1 className="mt-4 text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">
            Zahid Portfolio Chatbot
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
            A lightweight Next.js chatbot app powered by Groq. It answers questions about Zahid’s portfolio context and can be embedded in another site with an iframe.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/widget" className="rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-700">
              Open widget route
            </Link>
            <a href="#embed" className="rounded-2xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-800 hover:border-slate-500">
              View embed snippet
            </a>
          </div>
          <div id="embed" className="mt-10 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-bold text-slate-950">Iframe integration</h2>
            <pre className="mt-3 overflow-x-auto rounded-2xl bg-slate-950 p-4 text-xs text-slate-100">
{`<iframe
  src="https://YOUR_CHATBOT_DOMAIN/widget"
  width="400"
  height="600"
  style="border:0;"
></iframe>`}
            </pre>
          </div>
        </section>

        <ChatWidget />
      </div>
    </main>
  );
}
