"use client";

import { useEffect, useState } from "react";
import type {
  ProfileExperience,
  ProfileExperienceListResponse,
} from "@/lib/profile-types";
import { useAxiosWithAuth } from "@/helper/request-method";
import DefaultLoader from "./common/DefaultLoader";
import Reveal from "./common/Reveal";

const Experience: React.FC = () => {
  const api = useAxiosWithAuth();
  const [experiences, setExperiences] = useState<ProfileExperience[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        const response =
          await api.get<ProfileExperienceListResponse>("/experiences");
        setExperiences(response.data.data ?? []);
      } catch {
        setExperiences([]);
      } finally {
        setLoading(false);
      }
    };

    fetchExperiences();
  }, [api]);

  if (loading) {
    return (
      <section
        id="experience"
        className="scroll-mt-32 px-4 py-20 sm:scroll-mt-28 md:px-6 md:py-24 lg:px-8"
      >
        <div className="container flex max-w-6xl items-center justify-center">
          <DefaultLoader />
        </div>
      </section>
    );
  }

  return (
    <section
      id="experience"
      className="relative scroll-mt-32 px-4 py-20 sm:scroll-mt-28 md:px-6 md:py-24 lg:px-8"
    >
      <div className="container max-w-6xl space-y-6 sm:space-y-8">
        <Reveal className="space-y-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">
            Experience
          </p>
          <h2 className="text-3xl font-semibold tracking-tight text-slate-950 dark:text-slate-50 sm:text-4xl">
            Professional Experience
          </h2>
          <p className="max-w-3xl text-[14px] leading-7 text-slate-600 dark:text-slate-300 sm:text-[15px]">
            Teams where I shipped customer-facing features, internal workflows,
            and operational tooling.
          </p>
        </Reveal>

        {experiences.length > 0 ? (
          <div className="relative space-y-4 before:absolute before:bottom-6 before:left-4 before:top-6 before:w-px before:bg-gradient-to-b before:from-sky-400 before:via-slate-200 before:to-slate-200 dark:before:via-slate-700 dark:before:to-slate-800 sm:before:left-5">
            {experiences.map((experience, index) => (
              <Reveal
                key={experience.id ?? `${experience.company}-${experience.period}`}
                delayMs={Math.min(index * 70, 210)}
                durationMs={560}
              >
                <div className="relative pl-10 sm:pl-12">
                  <div className="absolute left-0 top-5 z-10 flex h-8 w-8 items-center justify-center rounded-full border border-sky-200 bg-white shadow-[0_10px_24px_rgba(14,165,233,0.18)] dark:border-sky-900/80 dark:bg-slate-950 sm:left-1">
                    <span className="h-3 w-3 rounded-full bg-sky-500 ring-4 ring-sky-100 dark:ring-sky-950" />
                  </div>
                  <div className="absolute left-8 top-9 hidden h-px w-4 bg-slate-200 dark:bg-slate-700 sm:block" />
                  <article className="rounded-[22px] border border-slate-200/70 bg-white/85 p-4 shadow-[0_18px_45px_rgba(15,23,42,0.05)] backdrop-blur transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(15,23,42,0.08)] sm:p-5 dark:border-slate-800/80 dark:bg-slate-900/75">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-full border border-slate-200/80 bg-slate-50 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
                          {experience.period}
                        </span>
                        {index === 0 && experience.period.includes("Present") && (
                          <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-emerald-700 dark:border-emerald-900/80 dark:bg-emerald-950/40 dark:text-emerald-300">
                            Current
                          </span>
                        )}
                      </div>
                      <h3 className="text-lg font-semibold tracking-tight text-slate-950 dark:text-slate-50 sm:text-xl">
                        {experience.role}
                      </h3>
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-[14px] font-semibold text-sky-700 dark:text-sky-300">
                          {experience.company}
                        </p>
                        {experience.location && (
                          <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-0.5 text-[11px] font-medium text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
                            {experience.location}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <p className="mt-3 max-w-3xl text-[14px] leading-6 text-slate-600 dark:text-slate-300">
                    {experience.summary}
                  </p>

                  <ul className="mt-4 grid gap-2 border-t border-slate-200/70 pt-4 md:grid-cols-2 dark:border-slate-800/80">
                    {experience.highlights.map((highlight: string) => (
                      <li
                        key={highlight}
                        className="flex items-start gap-2.5 text-[13px] leading-6 text-slate-700 dark:text-slate-300"
                      >
                        <span className="mt-2 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-sky-500" />
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>
                  </article>
                </div>
              </Reveal>
            ))}
          </div>
        ) : (
          <Reveal delayMs={80}>
            <div className="rounded-[30px] border border-dashed border-slate-300 bg-white/70 p-8 text-center text-slate-500 shadow-[0_20px_50px_rgba(15,23,42,0.05)] backdrop-blur dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-300">
              Experience entries will appear here once they are available.
            </div>
          </Reveal>
        )}
      </div>
    </section>
  );
};

export default Experience;
