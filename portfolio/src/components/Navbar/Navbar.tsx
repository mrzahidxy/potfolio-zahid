"use client";

import React, { useEffect, useState } from "react";
import { usePublicProfile } from "@/context/PublicProfileContext";
import NavbarLink from "./NavbarLink";
import { DarkModeToggle } from "./DarkModeToggle.component";
import PortfolioView from "./PortfolioView";

const NAV_ITEMS = [
  { name: "Intro", url: "#intro" },
  { name: "About", url: "#about" },
  { name: "Experience", url: "#experience" },
  { name: "Projects", url: "#projects" },
];

const Navbar: React.FC = () => {
  const { profile } = usePublicProfile();
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [mounted, setMounted] = useState(false);
  const [activeSection, setActiveSection] = useState<string>(NAV_ITEMS[0].url);
  const name = profile.personal_details.name;
  const title = profile.personal_details.title;

  useEffect(() => {
    if (typeof window === "undefined") return;
    const darkModeValue = localStorage.getItem("darkMode");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initial = darkModeValue === null ? prefersDark : darkModeValue === "true";
    setIsDarkMode(initial);
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    document.documentElement.classList.toggle("dark", isDarkMode);
    document.documentElement.setAttribute("data-theme", isDarkMode ? "dark" : "light");
  }, [isDarkMode, mounted]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const updateFromHash = () => {
      const matchedHash =
        NAV_ITEMS.find((item) => item.url === window.location.hash)?.url ??
        NAV_ITEMS[0].url;
      setActiveSection(matchedHash);
    };

    const sections = NAV_ITEMS.map((item) =>
      document.querySelector<HTMLElement>(item.url)
    ).filter((section): section is HTMLElement => Boolean(section));

    updateFromHash();

    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleSection = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visibleSection) {
          setActiveSection(`#${visibleSection.target.id}`);
        }
      },
      {
        rootMargin: "-45% 0px -45% 0px",
        threshold: [0.15, 0.35, 0.6],
      }
    );

    sections.forEach((section) => observer.observe(section));
    window.addEventListener("hashchange", updateFromHash);

    return () => {
      observer.disconnect();
      window.removeEventListener("hashchange", updateFromHash);
    };
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => {
      const next = !prev;
      if (typeof window !== "undefined") {
        localStorage.setItem("darkMode", JSON.stringify(next));
      }
      return next;
    });
  };

  return (
    <div className="relative">
      <nav
        className="fixed inset-x-0 top-0 z-50 pt-4 text-slate-900 transition-colors duration-300 dark:text-white"
      >
        <div className="container max-w-6xl px-4 md:px-6">
          <div className="overflow-hidden rounded-[24px] border border-slate-200/80 bg-white/95 shadow-[0_10px_30px_rgba(15,23,42,0.08)] transition-colors duration-300 dark:border-slate-800/80 dark:bg-slate-950/94">
            <div className="flex items-center justify-between gap-5 px-4 py-3.5 md:px-5">
              <a href="#intro" className="min-w-0 transition-opacity hover:opacity-90">
                <div className="flex flex-col space-y-0.5">
                  <span className="truncate text-[15px] font-semibold tracking-tight text-slate-900 dark:text-slate-50">
                    {name}
                  </span>
                  <span className="truncate text-[12px] text-slate-500 dark:text-slate-400">
                    {title}
                  </span>
                </div>
              </a>

              <ul className="hidden items-center gap-1 lg:flex">
                {NAV_ITEMS.map((item) => (
                  <NavbarLink
                    key={item.url}
                    to={item.url}
                    label={item.name}
                    isActive={activeSection === item.url}
                    onClick={() => setActiveSection(item.url)}
                  />
                ))}
              </ul>

              <div className="flex items-center gap-2">
                <a
                  href="#contact"
                  className="hidden h-10 shrink-0 items-center justify-center whitespace-nowrap rounded-full bg-slate-950 px-5 text-sm font-semibold text-white transition duration-200 hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-200/70 sm:inline-flex sm:min-w-[9.5rem] dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100 dark:focus-visible:ring-sky-900"
                >
                  Work With Me
                </a>
                <DarkModeToggle
                  isDarkMode={isDarkMode}
                  toggleDarkMode={toggleDarkMode}
                />
              </div>
            </div>

            <div className="flex gap-2 overflow-x-auto border-t border-slate-200/70 px-4 pb-3 pt-2.5 lg:hidden dark:border-slate-800/80">
              <ul className="flex items-center gap-1.5">
                {NAV_ITEMS.map((item) => (
                  <NavbarLink
                    key={item.url}
                    to={item.url}
                    label={item.name}
                    isActive={activeSection === item.url}
                    onClick={() => setActiveSection(item.url)}
                  />
                ))}
                <li className="shrink-0 sm:hidden">
                  <a
                    href="#contact"
                    className="inline-flex h-10 items-center rounded-full bg-slate-950 px-4 text-sm font-semibold text-white transition duration-200 hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100"
                  >
                    Contact
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </nav>
      <PortfolioView />
    </div>
  );
};

export default Navbar;
