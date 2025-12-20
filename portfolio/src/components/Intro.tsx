import Link from "next/link";
import profile from "@/data/profile.json";

const { personal_details, preferences } = profile;

function Intro() {
  return (
    <section
      id="intro"
      className="relative isolate overflow-hidden bg-slate-950 text-white"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(56,189,248,0.35),transparent_45%),radial-gradient(circle_at_80%_0%,rgba(59,130,246,0.35),transparent_35%),radial-gradient(circle_at_50%_80%,rgba(14,165,233,0.25),transparent_40%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(115deg,rgba(15,23,42,0.4)_0%,rgba(15,23,42,0.9)_50%,rgba(8,47,73,0.7)_100%)]" />

      <div className="container relative flex min-h-[calc(100vh-64px)] max-w-5xl flex-col items-center justify-center px-4 py-12 text-center md:py-14">
        <div className="flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-[11px] font-medium text-sky-100 ring-1 ring-white/15 backdrop-blur">
          <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_0_6px_rgba(16,185,129,0.25)] animate-pulse" />
          {preferences.available_for_opportunities
            ? "Available for new opportunities"
            : "Heads down on current work"}
        </div>

        <p className="mt-6 text-[11px] tracking-[0.3em] uppercase text-sky-200/70">
          Hello, I&apos;m
        </p>
        <h1 className="mt-3 text-[36px] font-semibold leading-tight sm:text-[40px] md:text-[42px] md:leading-[48px]">
          {personal_details.name}
        </h1>
        <p className="mt-3 text-lg font-medium text-sky-200 sm:text-xl">
          {personal_details.title}
        </p>
        <p className="mt-4 max-w-2xl text-[15px] leading-7 text-sky-100/80 sm:text-base">
          {personal_details.bio}
        </p>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="#projects"
            className="rounded-full bg-sky-400 px-4 py-2 text-sm font-semibold text-slate-900 shadow-md shadow-sky-500/30 transition hover:translate-y-[-2px] hover:bg-sky-300 hover:shadow-sky-400/40"
          >
            View My Work
          </Link>
          <Link
            href="#contact"
            className="rounded-full border border-white/30 px-4 py-2.5 text-sm font-semibold text-white transition hover:border-sky-300 hover:text-sky-200 hover:shadow-[0_12px_40px_rgba(125,211,252,0.15)]"
          >
            Get in Touch
          </Link>
        </div>

        <div className="mt-10 flex flex-col items-center gap-1.5 text-sky-200/70">
          <span className="text-[11px] uppercase tracking-[0.4em]">Scroll</span>
          <div className="relative h-10 w-px overflow-hidden rounded-full bg-white/20">
            <span className="absolute inset-x-0 h-5 w-px animate-[scrollLine_1.8s_ease-in-out_infinite] bg-sky-200" />
          </div>
        </div>
      </div>
    </section>
  );
}

export default Intro;
