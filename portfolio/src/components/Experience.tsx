import profile from "@/data/profile.json";
import Reveal from "./common/Reveal";

const experiences = profile.history.experiences;

const Experience: React.FC = () => {
  return (
    <section
      id="experience"
      className="relative scroll-mt-28 px-4 py-20 md:px-6 md:py-24 lg:px-8"
    >
      <div className="container max-w-6xl space-y-10 md:space-y-12">
        <Reveal className="space-y-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">
            Experience
          </p>
          <h2 className="text-3xl font-semibold tracking-tight text-slate-950 dark:text-slate-50 sm:text-4xl">
            Professional Experience
          </h2>
          <p className="max-w-3xl text-[15px] leading-7 text-slate-600 dark:text-slate-300 sm:text-base sm:leading-8">
            Teams where I shipped customer-facing features, internal workflows,
            and operational tooling.
          </p>
        </Reveal>

        <div className="space-y-6">
          {experiences.map((experience, index) => (
            <Reveal
              key={`${experience.company}-${experience.period}`}
              delayMs={Math.min(index * 70, 210)}
              durationMs={560}
            >
              <article className="grid gap-4 md:gap-5 lg:grid-cols-[190px,1fr]">
                <div className="pt-2 lg:pt-3">
                  <span className="inline-flex rounded-full border border-slate-200/80 bg-white/85 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-700 shadow-[0_12px_30px_rgba(15,23,42,0.08)] backdrop-blur dark:border-slate-700/80 dark:bg-slate-900/80 dark:text-slate-200">
                    {experience.period}
                  </span>
                </div>

                <div className="rounded-[30px] border border-slate-200/70 bg-white/85 p-5 shadow-[0_24px_60px_rgba(15,23,42,0.06)] backdrop-blur sm:p-6 md:p-7 dark:border-slate-800/80 dark:bg-slate-900/75">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="space-y-3">
                      <h3 className="text-[20px] font-semibold tracking-tight text-slate-950 dark:text-slate-50 sm:text-[22px]">
                        {experience.role}
                      </h3>
                      <div className="flex flex-wrap items-center gap-2.5">
                        <p className="text-[15px] font-semibold text-sky-700 dark:text-sky-300">
                          {experience.company}
                        </p>
                        {experience.location && (
                          <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[12px] font-medium text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
                            {experience.location}
                          </span>
                        )}
                      </div>
                    </div>
                    {experience.period.includes("Present") && (
                      <span className="inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-emerald-700 dark:border-emerald-900/80 dark:bg-emerald-950/40 dark:text-emerald-300">
                        Current
                      </span>
                    )}
                  </div>

                  <p className="mt-4 max-w-3xl text-[14px] leading-7 text-slate-600 dark:text-slate-300 sm:mt-5 sm:text-[15px] sm:leading-8">
                    {experience.summary}
                  </p>

                  <ul className="mt-6 space-y-3.5 border-t border-slate-200/70 pt-5 dark:border-slate-800/80">
                    {experience.highlights.map((highlight: string) => (
                      <li
                        key={highlight}
                        className="flex items-start gap-3 text-[14px] leading-7 text-slate-700 dark:text-slate-300 sm:text-[15px]"
                      >
                        <span className="mt-2 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-sky-500" />
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Experience;
