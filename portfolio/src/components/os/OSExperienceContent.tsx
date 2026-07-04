import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFolder } from "@fortawesome/free-solid-svg-icons";
import type { ProfileExperience } from "@/lib/profile-types";

interface OSExperienceContentProps {
  experiences: ProfileExperience[];
}

export default function OSExperienceContent({
  experiences,
}: OSExperienceContentProps) {
  return (
    <section id="experience" className="flex h-full min-h-0 flex-col">
      <div className="flex min-h-10 items-center gap-2 border-b border-slate-200 bg-white/80 px-4 text-xs font-semibold text-slate-500 dark:border-slate-800 dark:bg-slate-900/80 dark:text-slate-400">
        <span>Desktop</span>
        <span>/</span>
        <span className="text-slate-800 dark:text-slate-100">Experience</span>
      </div>

      <div className="hidden min-h-9 grid-cols-[minmax(0,1fr),190px,130px] items-center border-b border-slate-200 bg-slate-50/90 px-5 text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400 lg:grid">
        <span>Role & Highlights</span>
        <span>Company</span>
        <span className="text-right">Period</span>
      </div>

      <div className="smooth-scrollbar min-h-0 flex-1 overflow-auto bg-white dark:bg-slate-900">
        {experiences.length > 0 ? (
          experiences.slice(0, 8).map((experience) => (
            <article
              key={experience.id ?? `${experience.company}-${experience.period}`}
              className="group grid min-h-28 grid-cols-1 items-start gap-3 border-b border-slate-100 px-5 py-5 transition hover:bg-sky-50/80 dark:border-slate-800 dark:hover:bg-slate-800/70 lg:grid-cols-[minmax(0,1fr),190px,130px]"
            >
              <div className="flex min-w-0 items-start gap-4">
                <span className="flex h-11 w-12 shrink-0 items-center justify-center rounded-md bg-amber-400 text-amber-900 shadow-sm ring-1 ring-amber-500/30">
                  <FontAwesomeIcon icon={faFolder} className="text-xl" />
                </span>
                <div className="min-w-0 space-y-3">
                  <div>
                    <h2 className="text-base font-bold leading-6 text-slate-950 dark:text-white">
                      {experience.role}
                    </h2>
                    <p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-300">
                      {experience.summary}
                    </p>
                  </div>

                  {experience.highlights?.length > 0 && (
                    <ul className="space-y-1.5 text-xs leading-5 text-slate-600 dark:text-slate-300">
                      {experience.highlights.slice(0, 3).map((highlight) => (
                        <li key={highlight} className="flex gap-2">
                          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-500" />
                          <span>{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>

              <div className="space-y-2 pt-1">
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                  {experience.company}
                </p>
                {experience.location && (
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                    {experience.location}
                  </p>
                )}
              </div>

              <p className="pt-1 text-right font-mono text-xs leading-5 text-slate-500 dark:text-slate-400">
                {experience.period}
              </p>
            </article>
          ))
        ) : (
          <div className="px-4 py-10 text-center text-sm text-slate-600 dark:text-slate-300">
            Experience entries will appear here once they are available.
          </div>
        )}
      </div>
    </section>
  );
}
