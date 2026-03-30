import Reveal from "./common/Reveal";

const workPrinciples = [
  "Clarify scope",
  "Ship in stages",
  "Keep systems simple",
  "Leave clean handoff",
];

const ProductFocus: React.FC = () => {
  return (
    <section className="relative px-4 py-16 md:px-6 md:py-20 lg:px-8 lg:py-24">
      <div className="container relative max-w-6xl">
        <Reveal delayMs={80} durationMs={620}>
          <div className="relative overflow-hidden rounded-[34px] bg-slate-950 p-6 text-slate-100 shadow-[0_32px_90px_rgba(15,23,42,0.18)] sm:p-8 md:p-10">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(56,189,248,0.16),transparent_32%),radial-gradient(circle_at_80%_0%,rgba(59,130,246,0.12),transparent_30%)]" />
            <div className="relative grid gap-6 md:gap-8 lg:grid-cols-[1.08fr,0.92fr] lg:items-stretch">
              <div className="space-y-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-sky-200/70">
                  How I Work
                </p>
                <h3 className="max-w-2xl text-2xl font-semibold tracking-tight text-white sm:text-3xl md:text-4xl">
                  Clear scope, practical tradeoffs, and delivery that fits both teams and focused client work.
                </h3>
                <p className="max-w-2xl text-[15px] leading-7 text-slate-200/84 sm:text-[16px] sm:leading-8">
                  I prefer straightforward execution: understand the problem,
                  align on priorities, and ship without adding unnecessary complexity.
                </p>
              </div>

              <div className="rounded-[28px] border border-white/10 bg-white/[0.05] p-4 backdrop-blur sm:p-5">
                <div className="space-y-0">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-sky-200/70">
                    Working Principles
                  </p>
                </div>

                <div className="mt-5 space-y-5">
                  <div className="space-y-3">
                    <div className="flex flex-wrap gap-2.5">
                      {workPrinciples.map((item) => (
                        <span
                          key={item}
                          className="rounded-full border border-white/10 bg-white/[0.08] px-3.5 py-2 text-[13px] font-medium text-slate-100 transition duration-200 hover:border-white/20 hover:bg-white/[0.12]"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3 border-t border-white/10 pt-5">
                    <p className="text-[14px] leading-7 text-slate-300/84 sm:text-[15px]">
                      The goal is reliable delivery, useful collaboration, and a
                      codebase that still makes sense when the next phase starts.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
};

export default ProductFocus;
