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
          className="grid gap-8 md:gap-10 lg:grid-cols-[300px,minmax(0,1fr)] lg:gap-14"
          delayMs={70}
        >
          <div className="mx-auto w-full max-w-[320px] space-y-5 lg:mx-0 lg:max-w-none">
            <div className="overflow-hidden rounded-[30px] border border-slate-200/70 bg-white/75 shadow-[0_24px_60px_rgba(15,23,42,0.06)] dark:border-slate-800/80 dark:bg-slate-900/70">
              <Image
                src="/image/about.png"
                alt={personalDetails.name}
                width={280}
                height={340}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="rounded-[24px] border border-slate-200/70 bg-white/80 p-4 shadow-[0_18px_40px_rgba(15,23,42,0.05)] backdrop-blur dark:border-slate-800/80 dark:bg-slate-900/75">
              <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">
                {content.based_in_label}
              </p>
              <p className="mt-2 text-[15px] font-semibold text-slate-900 dark:text-slate-50">
                {personalDetails.location}
              </p>
            </div>
          </div>

          <div className="max-w-[70ch] space-y-4 pt-1 text-[15px] leading-7 text-slate-700 dark:text-slate-300 sm:space-y-5 sm:text-[16px] sm:leading-8">
            {aboutParagraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </Reveal>

        <Reveal
          className="rounded-[30px] border border-slate-200/70 bg-white/80 p-4 shadow-[0_24px_60px_rgba(15,23,42,0.06)] backdrop-blur sm:p-5 md:p-6 dark:border-slate-800/80 dark:bg-slate-900/75"
          delayMs={120}
        >
          <div className="max-w-3xl space-y-2.5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">
              {content.skills_eyebrow_label}
            </p>
            <h3 className="text-[26px] font-semibold tracking-tight text-slate-950 dark:text-slate-50 sm:text-[28px]">
              {content.skills_heading}
            </h3>
            <p className="text-[14px] leading-7 text-slate-600 dark:text-slate-300 sm:text-[15px]">
              {content.skills_intro}
            </p>
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-2 lg:gap-5 xl:grid-cols-4">
            {Object.entries(techStack).map(([key, items]) => (
              <div
                key={key}
                className="rounded-[22px] border border-slate-200/70 bg-slate-50/80 p-4 dark:border-slate-800/80 dark:bg-slate-950/45"
              >
                <h4 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                  {formatTitle(key)}
                </h4>
                <ul className="mt-3 space-y-2.5 text-[14px] leading-6 text-slate-700 dark:text-slate-300">
                  {(items as string[]).map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <span className="mt-2 h-1.5 w-1.5 rounded-full bg-sky-500" />
                      <span>{item}</span>
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
