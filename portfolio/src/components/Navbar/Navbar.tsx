"use client";

import React, { useEffect, useState } from "react";
import NavbarLink from "./NavbarLink";
import { DarkModeToggle } from "./DarkModeToggle.component";
import PortfolioView from "./PortfolioView";
import profile from "@/data/profile.json";

const Navbar: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [mounted, setMounted] = useState(false);

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
        className={`hidden md:block fixed top-0 left-0 z-50 w-full border-b border-white/70 bg-white/85 py-3 text-slate-900 shadow-sm backdrop-blur-lg transition-colors duration-300 dark:border-slate-800 dark:bg-slate-900/90 dark:text-white`}
      >
        <div className="container mx-auto flex items-center justify-between px-6">
          {/* Logo */}
          <div>
            <h1 className="hidden md:block text-lg lg:text-xl font-semibold tracking-tight">
              {profile.personal_details.name}
            </h1>
          </div>

          {/* Navbar Links */}
          <ul className="flex items-center gap-4">
            {[
              { name: "Intro", url: "#intro" },
              { name: "About", url: "#about" },
              { name: "Projects", url: "#projects" },
              { name: "Experience", url: "#experience" },
              { name: "Contact", url: "#contact" },
            ].map((item, i) => (
              <NavbarLink key={i} to={item.url} label={item.name} />
            ))}
          </ul>

          {/* Dark Mode Toggle */}
          <div className="hidden md:block">
            <DarkModeToggle
              isDarkMode={isDarkMode}
              toggleDarkMode={toggleDarkMode}
            />
          </div>
        </div>
      </nav>
      <PortfolioView />
    </div>
  );
};

export default Navbar;
