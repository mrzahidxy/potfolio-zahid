"use client";

import { usePublicProfile } from "@/context/PublicProfileContext";

export default function PortfolioFooter() {
  const { profile } = usePublicProfile();
  const currentYear = new Date().getFullYear();
  const name = profile.personal_details.name.trim();

  return (
    <footer className="border-t border-slate-200/70 bg-white/80 px-4 py-6 text-sm text-slate-500 backdrop-blur dark:border-slate-800/80 dark:bg-slate-950/80 dark:text-slate-400 md:px-6">
      <div className="container flex max-w-6xl items-center justify-center text-center">
        <p>
          © {currentYear}
          {name ? ` ${name}.` : "."} All rights reserved.
        </p>
      </div>
    </footer>
  );
}
