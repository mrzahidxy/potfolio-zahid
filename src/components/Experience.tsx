import profile from "@/data/profile.json";

const experiences = profile.history.experiences;

const Experience: React.FC = () => {
  return (
    <section
      id="experience"
      className="bg-slate-50 px-4 py-14 md:px-6 lg:px-8 dark:bg-slate-900"
    >
      <div className="container max-w-5xl space-y-8">
        <div className="text-center space-y-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-500">
            Experience
          </p>
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-50 sm:text-3xl">
            Work Experience
          </h2>
          <p className="mx-auto max-w-3xl text-[15px] leading-7 text-slate-600 dark:text-slate-200">
            Building innovative solutions and growing with amazing teams across
            product-led environments.
          </p>
        </div>

        <div className="relative">
          <div className="absolute left-4 top-0 bottom-0 w-px -translate-x-1/2 bg-gradient-to-b from-sky-200 via-slate-200 to-slate-200 dark:from-slate-700 dark:via-slate-800 dark:to-slate-800" />
          <div className="space-y-8">
            {experiences.map((experience) => (
              <div key={experience.role} className="relative pl-12">
                <div className="absolute left-4 top-6 h-3 w-3 -translate-x-1/2 rounded-full bg-sky-400 ring-4 ring-white shadow-[0_0_0_6px_rgba(56,189,248,0.12)] dark:ring-slate-800" />
                <div className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-100 dark:bg-slate-800 dark:ring-slate-700">
                  <div className="flex flex-col gap-1">
                    <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-300">
                      {experience.period}
                    </span>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50">
                      {experience.role}
                    </h3>
                    <p className="text-sm font-medium text-sky-400">
                      {experience.company}
                    </p>
                  </div>
                  <p className="mt-3 text-[13px] leading-6 text-slate-600 dark:text-slate-200">
                    {experience.summary}
                  </p>
                  <ul className="mt-3 space-y-2 text-sm text-slate-600 dark:text-slate-200">
                    {experience.highlights.map((highlight: string) => (
                      <li key={highlight} className="flex items-start gap-2">
                        <span className="mt-1 h-1.5 w-1.5 rounded-full bg-sky-400" />
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Experience;
