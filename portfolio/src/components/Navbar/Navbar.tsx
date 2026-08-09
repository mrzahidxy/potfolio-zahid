"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { faBars, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
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
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
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

  useEffect(() => {
    if (typeof document === "undefined") return;
    const originalOverflow = document.body.style.overflow;

    if (isDrawerOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = originalOverflow;
    }

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isDrawerOpen]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsDrawerOpen(false);
      }
    };

    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsDrawerOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("resize", handleResize);
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

  const closeDrawer = () => setIsDrawerOpen(false);

  return (
    <div className="relative">
      <nav className="fixed inset-x-0 top-0 z-50 pt-3 text-slate-900 transition-colors duration-300 dark:text-white">
        <div className="container max-w-6xl px-4 md:px-6">
          <div className="relative overflow-visible">
            <div className="overflow-hidden rounded-[20px] border border-slate-200/80 bg-white/95 shadow-[0_10px_30px_rgba(15,23,42,0.08)] transition-colors duration-300 dark:border-slate-800/80 dark:bg-slate-950/94">
              <div className="flex items-center justify-between gap-2 px-3 py-2.5 md:px-5 md:py-3.5">
              <a href="#intro" className="min-w-0 transition-opacity hover:opacity-90" onClick={closeDrawer}>
                <div className="flex flex-col space-y-0.5">
                  <span className="truncate text-[14px] font-semibold tracking-tight text-slate-900 dark:text-slate-50 sm:text-[15px]">
                    {name}
                  </span>
                  <span className="truncate text-[11px] text-slate-500 dark:text-slate-400 sm:text-[12px]">
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
                <Link
                  href="/os"
                  className="hidden h-10 shrink-0 items-center justify-center whitespace-nowrap rounded-full border border-slate-200/80 bg-white/80 px-4 text-sm font-semibold text-slate-800 transition duration-200 hover:border-sky-200 hover:bg-sky-50 hover:text-sky-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-200/70 sm:inline-flex dark:border-slate-700/80 dark:bg-slate-900/80 dark:text-slate-100 dark:hover:border-sky-700 dark:hover:bg-sky-950/40 dark:hover:text-sky-200 dark:focus-visible:ring-sky-900"
                >
                  OS View
                </Link>
                <a
                  href="#contact"
                  className="hidden h-10 shrink-0 items-center justify-center whitespace-nowrap rounded-full bg-slate-950 px-4 text-sm font-semibold text-white transition duration-200 hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-200/70 sm:inline-flex sm:min-w-[9rem] dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100 dark:focus-visible:ring-sky-900"
                >
                  Work With Me
                </a>
                <DarkModeToggle
                  isDarkMode={isDarkMode}
                  toggleDarkMode={toggleDarkMode}
                />
                <button
                  type="button"
                  onClick={() => setIsDrawerOpen((open) => !open)}
                  aria-expanded={isDrawerOpen}
                  aria-controls="mobile-nav-drawer"
                  aria-label={isDrawerOpen ? "Close navigation menu" : "Open navigation menu"}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200/80 bg-white/80 text-slate-700 transition duration-200 hover:border-slate-300 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-200/70 lg:hidden dark:border-slate-700/80 dark:bg-slate-900/80 dark:text-slate-100 dark:hover:border-slate-600 dark:hover:bg-slate-900 dark:focus-visible:ring-sky-900"
                >
                  <FontAwesomeIcon icon={isDrawerOpen ? faXmark : faBars} />
                </button>
              </div>
              </div>
            </div>

            <div
              className={`lg:hidden ${isDrawerOpen ? "pointer-events-auto" : "pointer-events-none"}`}
              aria-hidden={!isDrawerOpen}
            >
              <div
                aria-hidden="true"
                onClick={closeDrawer}
                className={`fixed inset-0 z-40 bg-slate-950/45 transition-opacity duration-300 ${isDrawerOpen ? "opacity-100" : "opacity-0"}`}
              />
              <div
                id="mobile-nav-drawer"
                className={`absolute left-0 right-0 top-full z-50 border-t border-slate-200/70 bg-white/98 px-3 pb-4 pt-3 shadow-[0_24px_60px_rgba(15,23,42,0.14)] transition-all duration-300 dark:border-slate-800/80 dark:bg-slate-950/98 ${
                  isDrawerOpen
                    ? "translate-y-0 opacity-100"
                    : "-translate-y-3 opacity-0"
                }`}
              >
                <div className="space-y-3">
                  <div className="rounded-[18px] border border-slate-200/70 bg-slate-50/80 p-2.5 dark:border-slate-800/80 dark:bg-slate-900/70">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-slate-500 dark:text-slate-400">
                      Navigation
                    </p>
                    <ul className="mt-2 space-y-1.5">
                      {NAV_ITEMS.map((item) => (
                        <NavbarLink
                          key={item.url}
                          to={item.url}
                          label={item.name}
                          isActive={activeSection === item.url}
                          onClick={() => {
                            setActiveSection(item.url);
                            closeDrawer();
                          }}
                          itemClassName="w-full"
                          className="h-11 w-full justify-start px-3.5 text-[14px]"
                        />
                      ))}
                    </ul>
                  </div>

                  <div className="grid grid-cols-1 gap-2.5">
                    <Link
                      href="/os"
                      onClick={closeDrawer}
                      className="inline-flex h-11 items-center justify-center rounded-full border border-slate-200/80 bg-white px-4 text-sm font-semibold text-slate-800 transition duration-200 hover:border-sky-200 hover:bg-sky-50 hover:text-sky-800 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:border-sky-700 dark:hover:bg-sky-950/40 dark:hover:text-sky-200"
                    >
                      OS View
                    </Link>
                    <a
                      href="#contact"
                      onClick={closeDrawer}
                      className="inline-flex h-11 items-center justify-center rounded-full bg-slate-950 px-4 text-sm font-semibold text-white transition duration-200 hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100"
                    >
                      Work With Me
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>
      <PortfolioView />
    </div>
  );
};

export default Navbar;
