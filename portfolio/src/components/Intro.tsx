import Link from "next/link";
import type {
  ProfileIntroContent,
  ProfilePersonalDetails,
  ProfilePreferences,
} from "@/lib/profile-types";
import OSWindow from "./os/OSWindow";

interface IntroProps {
  personalDetails: ProfilePersonalDetails;
  preferences: ProfilePreferences;
  content: ProfileIntroContent;
}

function Intro({ personalDetails, preferences, content }: IntroProps) {
  return (
    <section
      id="intro"
      className="relative scroll-mt-32 px-0 pb-6 pt-2 sm:scroll-mt-28 md:pb-8"
    >
      <OSWindow
        title="About Me"
        subtitle={`${personalDetails.name}.profile`}
        bodyClassName="relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,rgba(14,165,233,0.16),transparent_34%),radial-gradient(circle_at_82%_12%,rgba(16,185,129,0.13),transparent_30%)] dark:bg-[radial-gradient(circle_at_18%_20%,rgba(14,165,233,0.2),transparent_34%),radial-gradient(circle_at_82%_12%,rgba(16,185,129,0.12),transparent_30%)]" />
        <div className="relative grid min-h-[520px] gap-8 p-5 sm:p-7 md:p-9 lg:grid-cols-[minmax(0,1fr),320px] lg:items-center lg:p-10">
          <div className="hero-entrance hero-entrance-delay-1 max-w-3xl">
            <div className="inline-flex flex-wrap items-center gap-2 rounded-full border border-emerald-200/80 bg-emerald-50/80 px-3 py-1.5 text-[11px] font-semibold text-emerald-700 shadow-sm dark:border-emerald-900/70 dark:bg-emerald-950/40 dark:text-emerald-300">
              <span className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_0_5px_rgba(16,185,129,0.16)]" />
              {preferences.available_for_opportunities
                ? content.availability_available
                : content.availability_unavailable}
            </div>

            <p className="mt-7 text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-500 dark:text-slate-400">
              {personalDetails.name} / {personalDetails.title}
            </p>
            <h1 className="mt-4 max-w-3xl text-[34px] font-semibold leading-[1.08] tracking-tight text-slate-950 dark:text-white sm:text-[48px] lg:text-[58px]">
              {content.headline}
            </h1>
            <p className="mt-5 max-w-2xl text-[16px] leading-7 text-slate-600 dark:text-slate-300 sm:text-[18px] sm:leading-8">
              {personalDetails.bio}
            </p>

            <div className="mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:flex-wrap sm:items-center">
              <Link
                href="#projects"
                className="inline-flex h-12 w-full items-center justify-center rounded-[16px] bg-slate-950 px-6 text-sm font-semibold text-white shadow-[0_18px_40px_rgba(15,23,42,0.18)] transition duration-200 hover:-translate-y-[2px] hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 sm:w-auto sm:min-w-[10rem] dark:bg-sky-300 dark:text-slate-950 dark:hover:bg-sky-200"
              >
                {content.primary_cta_label}
              </Link>
              <Link
                href="#contact"
                className="inline-flex h-12 w-full items-center justify-center rounded-[16px] border border-slate-200/80 bg-white/80 px-6 text-sm font-semibold text-slate-800 shadow-sm transition duration-200 hover:-translate-y-[2px] hover:border-sky-200 hover:bg-sky-50 hover:text-sky-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 sm:w-auto sm:min-w-[10rem] dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-100 dark:hover:border-sky-700 dark:hover:bg-sky-950/40 dark:hover:text-sky-200"
              >
                {content.secondary_cta_label}
              </Link>
            </div>

            <div className="mt-8 flex flex-wrap gap-2.5">
              {content.highlights.map((item) => (
                <span
                  key={item}
                  className="rounded-[14px] border border-slate-200/80 bg-white/70 px-3.5 py-2 text-[13px] font-medium text-slate-700 backdrop-blur dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-200 sm:text-sm"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div className="hero-entrance hero-entrance-delay-2 rounded-[22px] border border-slate-200/80 bg-slate-950 p-4 text-slate-100 shadow-[0_22px_60px_rgba(15,23,42,0.18)] dark:border-slate-800 dark:bg-black/40">
            <div className="mb-4 flex items-center justify-between border-b border-white/10 pb-3">
              <span className="text-xs font-semibold text-sky-200">
                profile.json
              </span>
              <span className="text-[11px] text-slate-400">read-only</span>
            </div>
            <dl className="space-y-4 text-sm">
              <div>
                <dt className="text-[11px] uppercase tracking-[0.22em] text-slate-500">
                  Name
                </dt>
                <dd className="mt-1 font-semibold text-white">
                  {personalDetails.name}
                </dd>
              </div>
              <div>
                <dt className="text-[11px] uppercase tracking-[0.22em] text-slate-500">
                  Role
                </dt>
                <dd className="mt-1 text-slate-200">
                  {personalDetails.title}
                </dd>
              </div>
              <div>
                <dt className="text-[11px] uppercase tracking-[0.22em] text-slate-500">
                  Location
                </dt>
                <dd className="mt-1 text-slate-200">
                  {personalDetails.location}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </OSWindow>
    </section>
  );
}

export default Intro;
