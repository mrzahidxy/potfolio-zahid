"use client";

import React, { useEffect, useState } from "react";
import NavbarLink from "./NavbarLink";
import { DarkModeToggle } from "./DarkModeToggle.component";
import PortfolioView from "./PortfolioView";

const Navbar: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  // Load the dark mode preference from localStorage when the component mounts
  useEffect(() => {
    if (typeof window !== "undefined") {
      const darkModeValue = localStorage.getItem("darkMode");
      const isDarkMode = darkModeValue === "true";
      setIsDarkMode(isDarkMode);
    }
  }, []);

  // Toggle the dark mode class on the <html> element when the state changes
  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDarkMode);
  }, [isDarkMode]);

  // Function to toggle dark mode and store the value in localStorage
  const toggleDarkMode = () => {
    const updatedDarkMode = !isDarkMode;
    setIsDarkMode(updatedDarkMode);
    if (typeof window !== "undefined") {
      localStorage.setItem("darkMode", JSON.stringify(updatedDarkMode));
    }
  };

  return (
    <div className="relative">
      <nav
        className={`hidden md:block fixed top-0 left-0 w-full bg-blue-100 dark:bg-gray-800 dark:text-white shadow-lg py-4 z-50 transition-colors duration-300`}
      >
        <div className="container mx-auto flex justify-between items-center px-6">
          {/* Logo */}
          <div>
            <h1 className="hidden md:block text-xl lg:text-3xl font-bold">
              Zahid
            </h1>
          </div>

          {/* Navbar Links */}
          <ul className="flex items-center gap-6">
            {[
              { name: "Intro", url: "#intro" },
              { name: "About", url: "#about" },
              { name: "Projects", url: "#projects" },
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
