"use client";

import React, { useEffect, useState } from "react";
import NavbarLink from "./NavbarLink";
import { DarkModeToggle } from "./DarkModeToggle.component";

const Navbar: React.FC = () => {
  const isSticky = false;
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const darkModeValue = localStorage.getItem("darkMode");
      const isDarkMode = darkModeValue === "true";

      setIsDarkMode(isDarkMode);
    }
  }, []);

  // Apply dark mode class on component mount and when isDarkMode changes
  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDarkMode);
  }, [isDarkMode]);

  // Dark Mode Toggler Function
  const toggleDarkMode = () => {
    const updatedDarkMode = !isDarkMode;
    setIsDarkMode(updatedDarkMode);
    typeof window !== undefined &&
      localStorage.setItem("darkMode", JSON.stringify(updatedDarkMode));
  };

  return (
    <nav
      className={`w-4/5 lg:w-1/2 mx-auto rounded-full shadow-lg px-4 text-sm lg:text-lg bg-blue-100 dark:bg-gray-800 dark:text-white `}
    >
      <div className="container mx-auto p-4 flex justify-between items-center relative">
        <div>
          <h1 className="hidden md:block text-xl lg:text-3xl font-bold">
            Zahid
          </h1>
        </div>

        <ul className="flex items-center gap-6">
          {[
            { name: "Intro", url: "/" },
            { name: "About", url: "about" },
            // { name: "Skills", url: "skills" },
            { name: "Projects", url: "projects" },
            { name: "Contact", url: "contact" },
          ].map((item, i) => (
            <NavbarLink key={i} to={item.url} label={item.name} />
          ))}
        </ul>
        <div className="hidden md:block">
          <DarkModeToggle
            isDarkMode={isDarkMode}
            toggleDarkMode={toggleDarkMode}
          />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
