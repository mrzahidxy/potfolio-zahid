import Link from "next/link";
import type {
  ProfileIntroContent,
  ProfilePersonalDetails,
  ProfilePreferences,
} from "@/lib/profile-types";
import HeroBackgroundAnimation, {
  type HeroBackgroundColorScheme,
} from "./common/HeroBackgroundAnimation";

interface IntroProps {
  personalDetails: ProfilePersonalDetails;
  preferences: ProfilePreferences;
  content: ProfileIntroContent;
}

function Intro({ personalDetails, preferences, content }: IntroProps) {
  const heroBackground = preferences.hero_background;
  const heroBackgroundScheme: HeroBackgroundColorScheme =
    heroBackground?.scheme === "light" || heroBackground?.scheme === "dark"
      ? heroBackground.scheme
      : "dark";

  return (
    <section
      id="intro"
      className="relative isolate overflow-hidden scroll-mt-28 bg-slate-950 text-white"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(56,189,248,0.35),transparent_45%),radial-gradient(circle_at_80%_0%,rgba(59,130,246,0.35),transparent_35%),radial-gradient(circle_at_50%_80%,rgba(14,165,233,0.25),transparent_40%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(115deg,rgba(15,23,42,0.4)_0%,rgba(15,23,42,0.9)_50%,rgba(8,47,73,0.7)_100%)]" />
      <HeroBackgroundAnimation
        elementCount={heroBackground?.element_count ?? 6}
        colorScheme={heroBackgroundScheme}
      />

      <div className="container relative flex min-h-[calc(100vh-6.5rem)] max-w-6xl items-center px-4 py-20 sm:py-24 md:min-h-[calc(100vh-7.5rem)] md:px-6 md:py-28 lg:py-24">
        <div className="hero-entrance hero-entrance-delay-1 flex w-full justify-center lg:justify-start">
          <div className="flex max-w-4xl flex-col items-center text-center lg:items-start lg:text-left">
            <div className="inline-flex flex-wrap items-center justify-center gap-2 rounded-full border border-white/10 bg-white/10 px-3.5 py-2 text-[10px] font-medium text-sky-100 ring-1 ring-white/5 backdrop-blur sm:text-[11px]">
              <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_0_6px_rgba(16,185,129,0.25)] animate-pulse" />
              {preferences.available_for_opportunities
                ? content.availability_available
                : content.availability_unavailable}
            </div>

            <p className="mt-8 text-[11px] tracking-[0.32em] uppercase text-sky-200/75 sm:mt-10">
              {personalDetails.name} / {personalDetails.title}
            </p>
            <h1 className="mt-5 max-w-3xl text-[38px] font-semibold leading-[1.03] tracking-tight text-white sm:mt-6 sm:text-[52px] lg:text-[68px]">
              {content.headline}
            </h1>
            <p className="mt-6 max-w-2xl text-[16px] leading-7 text-slate-200/90 sm:mt-7 sm:text-[18px] sm:leading-8">
              {personalDetails.bio}
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
              <Link
                href="#projects"
                className="inline-flex h-11 items-center rounded-full bg-sky-400 px-5 text-sm font-semibold text-slate-950 shadow-[0_18px_40px_rgba(56,189,248,0.28)] transition duration-200 hover:-translate-y-[2px] hover:bg-sky-300"
              >
                {content.primary_cta_label}
              </Link>
              <Link
                href="#contact"
                className="inline-flex h-11 items-center rounded-full border border-white/20 bg-white/5 px-5 text-sm font-semibold text-white transition duration-200 hover:border-sky-300/60 hover:bg-white/10 hover:text-sky-100"
              >
                {content.secondary_cta_label}
              </Link>
            </div>

            <div className="mt-10 flex flex-wrap justify-center gap-2.5 lg:justify-start">
              {content.highlights.map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-white/10 bg-white/5 px-3.5 py-2 text-[13px] text-slate-200/90 backdrop-blur transition duration-200 hover:border-white/20 hover:bg-white/[0.08] sm:text-sm"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Intro;
