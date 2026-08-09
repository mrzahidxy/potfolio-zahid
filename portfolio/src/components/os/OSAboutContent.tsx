import Image from "next/image";
import type { PublicProfileData } from "@/lib/profile-types";

interface OSAboutContentProps {
  profile: PublicProfileData;
  shortName: string;
  skills: string[];
}

export default function OSAboutContent({
  profile,
  shortName,
  skills,
}: OSAboutContentProps) {
  return (
    <>
      <section
        id="about"
        className="grid gap-6 lg:grid-cols-[230px,minmax(0,1fr)] lg:items-center"
      >
        <div className="overflow-hidden rounded-lg border border-slate-300 bg-slate-950 shadow-inner">
          <Image
            src="/image/about.png"
            alt={profile.personal_details.name}
            width={460}
            height={460}
            priority
            className="aspect-square h-full w-full object-cover"
          />
        </div>

        <div className="min-w-0">
          <h1 className="font-mono text-[34px] font-bold leading-tight tracking-normal text-slate-950 dark:text-white sm:text-[46px]">
            Hi, I&apos;m{" "}
            <span className="text-indigo-600 dark:text-indigo-300">
              {shortName}
            </span>
            <span className="inline-block translate-y-1 pl-1">_</span>
          </h1>
          <p className="mt-2 font-mono text-sm font-semibold text-slate-900 dark:text-slate-100 sm:text-base">
            {profile.personal_details.title}
          </p>
          <p className="mt-6 max-w-2xl text-[15px] leading-7 text-slate-700 dark:text-slate-300 sm:text-base">
            {profile.personal_details.bio}
          </p>

          <div className="mt-5 flex flex-wrap gap-2">
            <span className="rounded-md border border-slate-200 bg-slate-50 px-3 py-1.5 font-mono text-xs font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">
              {profile.personal_details.location}
            </span>
            {profile.content.intro.highlights.map((highlight) => (
              <span
                key={highlight}
                className="rounded-md border border-slate-200 bg-slate-50 px-3 py-1.5 font-mono text-xs font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
              >
                {highlight}
              </span>
            ))}
          </div>
        </div>
      </section>

      <div className="mt-7 border-t border-slate-200 pt-5 dark:border-slate-800">
        <h2 className="font-mono text-xl font-bold text-slate-950 dark:text-white">
          Skills
        </h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {skills.map((skill) => (
            <span
              key={skill}
              className="rounded-md border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>
    </>
  );
}
