import profile from "@/data/profile.json";

const aboutParagraphs = profile.personal_details.about_paragraphs;
const techStack = profile.preferences.tech_stack;

const formatTitle = (key: string) =>
  key
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

const About: React.FC = () => {
  return (
    <section
      id="about"
      className="bg-white px-4 py-14 md:px-6 lg:px-8 dark:bg-slate-900"
    >
      <div className="container max-w-5xl space-y-8">
        <div className="text-center space-y-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-400">
            About
          </p>
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-50 sm:text-3xl">
            Passionate Developer &amp; Problem Solver
          </h2>
          <p className="mx-auto max-w-3xl text-[15px] leading-7 text-slate-600 dark:text-slate-200">
            {profile.personal_details.bio}
          </p>
        </div>

        <div className="grid items-center gap-6 lg:grid-cols-[200px,1fr]">
          <div className="mx-auto h-44 w-44 overflow-hidden rounded-2xl shadow-md ring-1 ring-slate-200 dark:ring-slate-700">
            <img
              src="/image/about.png"
              alt={profile.personal_details.name}
              className="h-full w-full object-cover"
            />
          </div>

          <div className="space-y-4 text-[15px] leading-7 text-slate-600 dark:text-slate-200">
            {aboutParagraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
          {Object.entries(techStack).map(([key, items]) => (
            <div
              key={key}
              className="rounded-xl border border-slate-100 bg-slate-50/70 p-3.5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md dark:border-slate-700 dark:bg-slate-800/70"
            >
              <h4 className="text-base font-semibold text-slate-900 dark:text-slate-50">
                {formatTitle(key)}
              </h4>
              <ul className="mt-2.5 space-y-2 text-sm text-slate-600 dark:text-slate-200">
                {(items as string[]).map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-sky-400" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default About;
