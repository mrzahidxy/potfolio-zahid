"use client";

import { useContext, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  faArrowRightFromBracket,
  faBriefcase,
  faDiagramProject,
  faGauge,
  faMoon,
  faSun,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AuthContext } from "@/context/AuthContext";

const navLinks = [
  { href: "/admin", label: "Dashboard", icon: faGauge },
  { href: "/admin/projects", label: "Projects", icon: faDiagramProject },
  { href: "/admin/experiences", label: "Experience", icon: faBriefcase },
  { href: "/admin/profile", label: "Profile", icon: faUser },
];

const isActiveAdminLink = (pathname: string | null, href: string) => {
  if (!pathname) return false;
  if (href === "/admin") return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
};

export default function AdminShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const { currentUser, dispatch } = useContext(AuthContext);
  const router = useRouter();
  const pathname = usePathname();
  const [isDarkMode, setIsDarkMode] = useState(true);
  const isLoginPage = pathname === "/admin/login";
  const hasAdminAccess =
    Boolean(currentUser?.accessToken) && currentUser?.isAdmin === true;

  useEffect(() => {
    if (typeof window === "undefined" || isLoginPage) return;

    if (!hasAdminAccess) {
      dispatch({ type: "LOGOUT" });
      router.replace("/admin/login");
    }
  }, [dispatch, hasAdminAccess, isLoginPage, router]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = localStorage.getItem("adminDarkMode");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initial = stored === null ? prefersDark : stored === "true";
    setIsDarkMode(initial);
    document.documentElement.classList.toggle("dark", initial);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem("adminDarkMode", JSON.stringify(isDarkMode));
    document.documentElement.classList.toggle("dark", isDarkMode);
  }, [isDarkMode]);

  const handleLogout = () => {
    dispatch({ type: "LOGOUT" });
    router.replace("/admin/login");
  };

  const activeTitle =
    navLinks.find((link) => isActiveAdminLink(pathname, link.href))?.label ??
    "Admin";

  if (isLoginPage) {
    return <div className="font-sans">{children}</div>;
  }

  if (!hasAdminAccess) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 text-sm text-slate-300">
        Redirecting to sign in...
      </div>
    );
  }

  return (
    <div
      className={`font-sans flex min-h-screen ${isDarkMode ? "bg-slate-950 text-slate-100" : "bg-slate-50 text-slate-900"}`}
    >
      <aside
        className={`hidden w-64 flex-col border-r px-5 py-6 shadow-xl backdrop-blur lg:flex ${
          isDarkMode ? "border-slate-800 bg-slate-900/80" : "border-slate-200 bg-white/80"
        }`}
      >
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-500 text-lg font-bold text-slate-950">
            ZH
          </div>
          <div>
            <p className="text-sm text-slate-400">Admin Console</p>
            <p className="text-lg font-semibold">Zahid Hasan</p>
          </div>
        </div>

        <nav className="space-y-1">
          {navLinks.map((link) => {
            const active = isActiveAdminLink(pathname, link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition ${
                  active
                    ? isDarkMode
                      ? "bg-slate-800 text-white shadow-inner"
                      : "bg-slate-100 text-slate-900 shadow-inner"
                    : isDarkMode
                      ? "text-slate-300 hover:bg-slate-800 hover:text-white"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                <FontAwesomeIcon icon={link.icon} className="h-4 w-4" />
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto">
          <button
            type="button"
            onClick={handleLogout}
            className={`flex w-full items-center justify-between rounded-lg border px-3 py-2 text-sm font-medium transition ${
              isDarkMode
                ? "border-slate-800 text-slate-200 hover:border-slate-600 hover:bg-slate-800"
                : "border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-100"
            }`}
          >
            <span>Logout</span>
            <FontAwesomeIcon
              icon={faArrowRightFromBracket}
              className="h-4 w-4"
            />
          </button>
        </div>
      </aside>

      <div className="flex-1">
        <header
          className={`flex items-center justify-between border-b px-4 py-4 shadow-sm backdrop-blur ${
            isDarkMode ? "border-slate-800 bg-slate-900/70" : "border-slate-200 bg-white/80"
          }`}
        >
          <div>
            <p
              className={`text-xs uppercase tracking-[0.3em] ${
                isDarkMode ? "text-slate-500" : "text-slate-500"
              }`}
            >
              Admin
            </p>
            <h1
              className={`text-xl font-semibold ${
                isDarkMode ? "text-white" : "text-slate-900"
              }`}
            >
              {activeTitle}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsDarkMode((prev) => !prev)}
              className={`flex h-10 w-10 items-center justify-center rounded-full border text-sm font-semibold transition ${
                isDarkMode
                  ? "border-slate-700 bg-slate-800 text-slate-100 hover:border-slate-500"
                  : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
              }`}
              aria-label="Toggle theme"
            >
              <FontAwesomeIcon
                icon={isDarkMode ? faSun : faMoon}
                className="h-4 w-4"
              />
            </button>
            <div
              className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm shadow-inner ${
                isDarkMode
                  ? "border-slate-800 bg-slate-900 text-slate-200"
                  : "border-slate-200 bg-white text-slate-700"
              }`}
            >
              <span className="inline-flex h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_0_6px_rgba(52,211,153,0.25)]" />
              <span>Active</span>
            </div>
          </div>
        </header>

        <main className="px-4 py-6 lg:px-8 lg:py-8">
          <div className="mx-auto max-w-6xl space-y-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
