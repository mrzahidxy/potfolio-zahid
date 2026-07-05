import Image from "next/image";
import type {
  ProfileAboutContent,
  ProfilePersonalDetails,
  ProfilePreferences,
} from "@/lib/profile-types";
import Reveal from "./common/Reveal";

const formatTitle = (key: string) =>
  key
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

interface AboutProps {
  personalDetails: ProfilePersonalDetails;
  preferences: ProfilePreferences;
  content: ProfileAboutContent;
}

const About: React.FC<AboutProps> = ({
  personalDetails,
  preferences,
  content,
}) => {
  const aboutParagraphs = personalDetails.about_paragraphs;
  const techStack = preferences.tech_stack;

  return (
    <section
      id="about"
      className="relative scroll-mt-32 px-4 py-20 sm:scroll-mt-28 md:px-6 md:py-24 lg:px-8"
    >
      <div className="container max-w-6xl space-y-12 md:space-y-14">
        <Reveal className="space-y-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">
            {content.eyebrow_label}
          </p>
          <h2 className="text-3xl font-semibold tracking-tight text-slate-950 dark:text-slate-50 sm:text-4xl">
            {content.heading}
          </h2>
          <p className="max-w-3xl text-[15px] leading-7 text-slate-600 dark:text-slate-300 sm:text-base sm:leading-8">
            {content.intro}
          </p>
        </Reveal>

        <Reveal
          className="grid gap-6 md:gap-8 lg:grid-cols-[220px,minmax(0,1fr)]"
          delayMs={70}
        >
          <div className="mx-auto w-full max-w-[220px] space-y-4 lg:mx-0">
            <div className="overflow-hidden rounded-[24px] border border-slate-200/70 bg-white/75 shadow-[0_18px_45px_rgba(15,23,42,0.05)] dark:border-slate-800/80 dark:bg-slate-900/70">
              <Image
                src="/image/about.png"
                alt={personalDetails.name}
                width={220}
                height={190}
                className="h-[190px] w-full object-cover object-top"
              />
            </div>
            <div className="rounded-[22px] border border-slate-200/70 bg-white/80 p-4 shadow-[0_14px_34px_rgba(15,23,42,0.05)] backdrop-blur dark:border-slate-800/80 dark:bg-slate-900/75">
              <p className="text-[10px] font-semibold uppercase tracking-[0.26em] text-slate-500 dark:text-slate-400">
                {content.based_in_label}
              </p>
              <p className="mt-2 text-[15px] font-semibold leading-6 text-slate-900 dark:text-slate-50">
                {personalDetails.location}
              </p>
            </div>
          </div>

          <div className="space-y-4 rounded-[26px] border border-slate-200/70 bg-white/80 p-5 text-[15px] leading-7 text-slate-700 shadow-[0_18px_45px_rgba(15,23,42,0.05)] backdrop-blur dark:border-slate-800/80 dark:bg-slate-900/75 dark:text-slate-300 sm:p-6 sm:text-[16px] sm:leading-8">
            {aboutParagraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </Reveal>

        <Reveal
          className="rounded-[26px] border border-slate-200/70 bg-white/80 p-4 shadow-[0_18px_45px_rgba(15,23,42,0.05)] backdrop-blur sm:p-5 dark:border-slate-800/80 dark:bg-slate-900/75"
          delayMs={120}
        >
          <div className="flex flex-col gap-2.5 sm:flex-row sm:items-end sm:justify-between">
            <div className="space-y-1.5">
              <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-slate-500 dark:text-slate-400">
                {content.skills_eyebrow_label}
              </p>
              <h3 className="text-2xl font-semibold tracking-tight text-slate-950 dark:text-slate-50">
                {content.skills_heading}
              </h3>
            </div>
            <p className="max-w-xl text-[13px] leading-6 text-slate-600 dark:text-slate-300 sm:text-right">
              {content.skills_intro}
            </p>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {Object.entries(techStack).map(([key, items]) => (
              <div
                key={key}
                className="rounded-[18px] border border-slate-200/70 bg-slate-50/75 p-3 dark:border-slate-800/80 dark:bg-slate-950/45"
              >
                <h4 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                  {formatTitle(key)}
                </h4>
                <ul className="mt-2 flex flex-wrap gap-1.5">
                  {(items as string[]).map((item) => (
                    <li
                      key={item}
                      className="rounded-full border border-slate-200/80 bg-white px-2.5 py-1 text-[12px] font-medium leading-5 text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
};

export default About;
