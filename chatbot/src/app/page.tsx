import Link from "next/link";
import { ChatWidget } from "@/components/ChatWidget";

export default function HomePage() {
  return (
    <main className="relative isolate min-h-screen overflow-hidden bg-[#8ab7e8] px-4 py-6 text-slate-950 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_18%,rgba(255,255,255,0.72),transparent_28%),radial-gradient(circle_at_72%_20%,rgba(217,232,255,0.72),transparent_32%),linear-gradient(135deg,rgba(96,165,250,0.24)_0%,rgba(129,140,248,0.28)_58%,rgba(168,85,247,0.16)_100%)]" />

      <header className="relative z-10 mx-auto mb-5 flex h-10 max-w-6xl items-center justify-between rounded-lg border border-white/[0.45] bg-white/[0.76] px-3 text-sm shadow-sm backdrop-blur-xl">
        <div className="flex min-w-0 items-center gap-2 font-semibold">
          <span className="flex h-6 w-6 items-center justify-center rounded bg-slate-950 font-mono text-[10px] text-emerald-300">
            AI
          </span>
          <span>Zahid Chat OS</span>
        </div>
        <nav className="hidden items-center gap-5 text-xs font-medium text-slate-700 sm:flex">
          <Link href="/widget" className="hover:text-indigo-700">
            Widget
          </Link>
          <a href="#embed" className="hover:text-indigo-700">
            Embed
          </a>
        </nav>
      </header>

      <div className="relative z-10 mx-auto grid max-w-6xl items-center gap-6 lg:grid-cols-[minmax(0,1fr),420px]">
        <section className="rounded-lg border border-white/80 bg-white/[0.82] p-5 shadow-soft backdrop-blur-xl sm:p-7">
          <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500">
            Standalone assistant
          </p>
          <h1 className="mt-4 max-w-2xl text-4xl font-black tracking-normal text-slate-950 sm:text-5xl">
            Zahid Portfolio Chatbot
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-8 text-slate-600">
            A focused assistant for portfolio visitors. It answers questions
            about Zahid&apos;s work, projects, skills, availability, and contact
            details.
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              href="/widget"
              className="rounded-md bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Open widget
            </Link>
            <a
              href="#embed"
              className="rounded-md border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-800 transition hover:border-indigo-300 hover:bg-indigo-50"
            >
              View embed snippet
            </a>
          </div>

          <div
            id="embed"
            className="mt-8 rounded-lg border border-slate-200 bg-slate-950 p-4 shadow-inner"
          >
            <div className="mb-3 flex items-center justify-between border-b border-slate-800 pb-2">
              <h2 className="font-mono text-sm font-bold text-slate-100">
                iframe.html
              </h2>
              <span className="font-mono text-[11px] text-emerald-300">
                ready
              </span>
            </div>
            <pre className="overflow-x-auto text-xs leading-6 text-slate-100">
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
