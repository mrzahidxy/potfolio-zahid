"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBriefcase,
  faDesktop,
  faEnvelope,
  faFolder,
  faHouse,
  faRobot,
} from "@fortawesome/free-solid-svg-icons";
import { usePublicProfile } from "@/context/PublicProfileContext";
import OSVisitStatsWidget from "./OSVisitStatsWidget";

export type OSDesktopItem = "about" | "projects" | "experience" | "contact";

const CHATBOT_WIDGET_URL =
  process.env.NEXT_PUBLIC_CHATBOT_WIDGET_URL || "http://localhost:3000/widget";

interface OSDesktopContextValue {
  activeItem: OSDesktopItem | null;
  openItem: (item: OSDesktopItem) => void;
  closeActiveItem: () => void;
}

interface LauncherItem {
  id: OSDesktopItem;
  label: string;
  icon: IconDefinition;
  color?: string;
}

const OSDesktopContext = createContext<OSDesktopContextValue | null>(null);

const shortcuts: LauncherItem[] = [
  { id: "about", label: "About Me", icon: faDesktop, color: "text-indigo-600" },
  { id: "projects", label: "Projects", icon: faFolder, color: "text-amber-500" },
  {
    id: "experience",
    label: "Experience",
    icon: faBriefcase,
    color: "text-emerald-600",
  },
  { id: "contact", label: "Contact", icon: faEnvelope, color: "text-sky-600" },
];

const dockItems: LauncherItem[] = [
  { id: "about", label: "About", icon: faDesktop },
  { id: "projects", label: "Projects", icon: faFolder },
  { id: "experience", label: "Experience", icon: faBriefcase },
  { id: "contact", label: "Contact", icon: faEnvelope },
];

export function useOSDesktop() {
  const context = useContext(OSDesktopContext);

  if (!context) {
    throw new Error("useOSDesktop must be used inside OSDesktopShell");
  }

  return context;
}

function cx(...classes: Array<string | false>) {
  return classes.filter(Boolean).join(" ");
}

export default function OSDesktopShell({
  children,
}: {
  children: ReactNode;
}) {
  const { profile } = usePublicProfile();
  const [activeItem, setActiveItem] = useState<OSDesktopItem | null>("about");
  const [selectedItem, setSelectedItem] = useState<OSDesktopItem>("about");
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const desktopContext = useMemo(
    () => ({
      activeItem,
      openItem: setActiveItem,
      closeActiveItem: () => setActiveItem(null),
    }),
    [activeItem]
  );
  const availabilityLabel = profile.preferences.available_for_opportunities
    ? profile.content.intro.availability_available
    : profile.content.intro.availability_unavailable;

  return (
    <OSDesktopContext.Provider value={desktopContext}>
      <div className="relative isolate min-h-screen overflow-hidden bg-[#8ab7e8] text-slate-950 dark:bg-[#16233f] dark:text-slate-50">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_18%,rgba(255,255,255,0.72),transparent_28%),radial-gradient(circle_at_70%_20%,rgba(217,232,255,0.7),transparent_32%),linear-gradient(135deg,rgba(96,165,250,0.24)_0%,rgba(129,140,248,0.28)_58%,rgba(168,85,247,0.16)_100%)] dark:bg-[radial-gradient(circle_at_12%_18%,rgba(56,189,248,0.2),transparent_30%),radial-gradient(circle_at_78%_18%,rgba(129,140,248,0.2),transparent_28%),linear-gradient(135deg,rgba(15,23,42,0.1)_0%,rgba(30,41,59,0.7)_100%)]" />

        <header className="relative z-30 flex h-10 items-center justify-between border-b border-white/[0.45] bg-white/[0.76] px-3 text-sm shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/[0.72]">
          <div className="flex min-w-0 items-center gap-4">
            <button
              type="button"
              onClick={() => {
                setSelectedItem("about");
                setActiveItem("about");
              }}
              className="flex shrink-0 items-center gap-2 font-semibold text-slate-950 transition hover:text-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300 dark:text-white dark:hover:text-indigo-300"
            >
              <FontAwesomeIcon
                icon={faDesktop}
                className="text-indigo-600 dark:text-indigo-300"
              />
              <span>Zahid OS</span>
            </button>
            <nav
              aria-label="Desktop menu"
              className="hidden items-center gap-6 text-slate-700 dark:text-slate-200 sm:flex"
            >
              <span>File</span>
              <span>Edit</span>
              <span>View</span>
              <span>Help</span>
            </nav>
          </div>

          <div className="flex shrink-0 items-center gap-3 text-xs font-semibold text-slate-800 dark:text-slate-100">
            <span className="hidden max-w-[220px] truncate rounded-full bg-emerald-50 px-2 py-1 text-[11px] text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 md:inline-flex">
              {availabilityLabel}
            </span>
            <span>100%</span>
            <span className="hidden sm:inline">Sat, Jul 4</span>
          </div>
        </header>

        <div className="relative z-10 mx-auto flex min-h-[calc(100vh-2.5rem)] max-w-[1512px] flex-col px-3 pb-24 pt-4 sm:px-5 lg:px-8">
          <div className="grid flex-1 gap-4 lg:grid-cols-[118px,minmax(0,1fr)]">
            <nav
              aria-label="Desktop shortcuts"
              className="hidden lg:order-1 lg:block"
            >
              <div className="grid grid-cols-4 gap-2 lg:grid-cols-1 lg:gap-5 lg:pt-6">
                {shortcuts.map((item) => {
                  const isSelected = selectedItem === item.id;

                  return (
                    <button
                      key={item.id}
                      type="button"
                      aria-pressed={isSelected}
                      onClick={() => setSelectedItem(item.id)}
                      onDoubleClick={() => {
                        setSelectedItem(item.id);
                        setActiveItem(item.id);
                      }}
                      onKeyDown={(event) => {
                        if (event.key === "Enter") {
                          setActiveItem(item.id);
                        }
                      }}
                      className={cx(
                        "group flex min-h-[82px] w-full flex-col items-center justify-center gap-2 rounded-md px-2 py-2 text-center text-xs font-semibold text-white drop-shadow-[0_1px_1px_rgba(15,23,42,0.65)] outline-none transition hover:bg-white/[0.16] focus-visible:bg-white/[0.18] focus-visible:ring-2 focus-visible:ring-white/70 lg:min-h-[92px]",
                        isSelected && "bg-white/[0.22] ring-1 ring-white/70"
                      )}
                    >
                      <span className="flex h-10 w-10 items-center justify-center rounded-md border border-white/70 bg-white/90 text-xl shadow-md">
                        <FontAwesomeIcon
                          icon={item.icon}
                          className={item.color}
                        />
                      </span>
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </nav>

            <div className="order-1 min-w-0 lg:order-2">{children}</div>
          </div>
        </div>

        <footer className="fixed inset-x-0 bottom-0 z-30 border-t border-white/50 bg-white/[0.72] px-3 py-2 shadow-[0_-10px_30px_rgba(26,47,87,0.16)] backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/[0.72]">
          <div className="mx-auto flex max-w-[1512px] items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => {
                setSelectedItem("about");
                setActiveItem("about");
              }}
              className="hidden items-center gap-2 rounded-md px-2 py-1.5 text-sm font-medium text-slate-800 hover:bg-white/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300 dark:text-slate-100 dark:hover:bg-white/10 sm:flex"
            >
              <FontAwesomeIcon icon={faHouse} />
              <span>Zahid OS</span>
            </button>
            <nav
              aria-label="Dock"
              className="mx-auto flex items-center gap-2 overflow-x-auto"
            >
              {dockItems.map((item) => {
                const isActive = activeItem === item.id;

                return (
                  <button
                    key={item.id}
                    type="button"
                    aria-label={item.label}
                    aria-pressed={isActive}
                    title={item.label}
                    onClick={() => {
                      setSelectedItem(item.id);
                      setActiveItem(item.id);
                    }}
                    className={cx(
                      "relative flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-slate-200/80 bg-white/[0.85] text-slate-800 shadow-sm transition hover:-translate-y-1 hover:bg-indigo-50 hover:text-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300 dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-100 dark:hover:bg-indigo-950/50 dark:hover:text-indigo-200",
                      isActive &&
                        "-translate-y-1 bg-indigo-50 text-indigo-700 ring-2 ring-indigo-300 dark:bg-indigo-950/50 dark:text-indigo-200"
                    )}
                  >
                    <FontAwesomeIcon icon={item.icon} />
                    {isActive && (
                      <span
                        className="absolute -bottom-1 h-1 w-5 rounded-full bg-indigo-600 dark:bg-indigo-300"
                        aria-hidden="true"
                      />
                    )}
                  </button>
                );
              })}
              <button
                type="button"
                aria-label={isChatbotOpen ? "Close AI chatbot" : "Open AI chatbot"}
                aria-pressed={isChatbotOpen}
                aria-expanded={isChatbotOpen}
                title="AI Chat"
                onClick={() => setIsChatbotOpen((current) => !current)}
                className={cx(
                  "relative flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-slate-200/80 bg-white/[0.85] text-slate-800 shadow-sm transition hover:-translate-y-1 hover:bg-indigo-50 hover:text-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300 dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-100 dark:hover:bg-indigo-950/50 dark:hover:text-indigo-200",
                  isChatbotOpen &&
                    "-translate-y-1 bg-indigo-50 text-indigo-700 ring-2 ring-indigo-300 dark:bg-indigo-950/50 dark:text-indigo-200"
                )}
              >
                <FontAwesomeIcon icon={faRobot} />
                {isChatbotOpen && (
                  <span
                    className="absolute -bottom-1 h-1 w-5 rounded-full bg-indigo-600 dark:bg-indigo-300"
                    aria-hidden="true"
                  />
                )}
              </button>
            </nav>
            <span className="hidden min-w-[160px] justify-end text-xs font-medium text-slate-700 dark:text-slate-300 sm:flex">
              (c) 2026 Zahid Hasan
            </span>
          </div>
        </footer>

        {isChatbotOpen && (
          <div className="fixed bottom-16 right-3 z-40 w-[calc(100vw-1.5rem)] max-w-[420px] overflow-hidden rounded-lg border border-white/80 bg-white/[0.94] shadow-[0_24px_70px_rgba(26,47,87,0.28)] backdrop-blur-xl dark:border-slate-700/80 dark:bg-slate-950/[0.92] sm:right-6">
            <div className="flex min-h-11 items-center justify-between gap-3 border-b border-slate-200/80 bg-gradient-to-b from-white/95 to-slate-100/[0.92] px-4 py-2.5 dark:border-slate-800/90 dark:from-slate-900/95 dark:to-slate-950/[0.92]">
              <p className="truncate text-sm font-semibold text-slate-800 dark:text-slate-100">
                AI Chat
              </p>
              <button
                type="button"
                onClick={() => setIsChatbotOpen(false)}
                aria-label="Close AI chatbot"
                className="flex h-7 w-8 items-center justify-center rounded text-sm leading-none text-slate-700 hover:bg-red-500 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-300 dark:text-slate-200"
              >
                x
              </button>
            </div>
            <iframe
              src={CHATBOT_WIDGET_URL}
              title="AI chatbot"
              aria-label="AI chatbot conversation window"
              className="h-[min(600px,calc(100vh-8rem))] w-full border-0 bg-white dark:bg-slate-950"
            />
          </div>
        )}

        <OSVisitStatsWidget />
      </div>
    </OSDesktopContext.Provider>
  );
}
