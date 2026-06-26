"use client";

import Image from "next/image";
import { useState } from "react";

const CHATBOT_WIDGET_URL =
  process.env.NEXT_PUBLIC_CHATBOT_WIDGET_URL || "http://localhost:3000/widget";

export default function ChatbotLauncher() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-4 z-[9999] flex flex-col items-end gap-4 sm:bottom-8 sm:right-6">
      {isOpen ? (
        <div className="animate-[chatbotPop_180ms_ease-out] overflow-hidden rounded-[1.35rem] bg-gradient-to-br from-blue-500/40 via-cyan-400/20 to-slate-300/30 p-px shadow-[0_24px_80px_rgba(15,23,42,0.28)] backdrop-blur dark:from-blue-400/30 dark:via-cyan-300/10 dark:to-slate-700/30">
          <div className="h-[min(600px,calc(100vh-7rem))] w-[calc(100vw-2rem)] overflow-hidden rounded-[1.3rem] border border-white/70 bg-white shadow-2xl dark:border-white/10 dark:bg-slate-950 sm:h-[600px] sm:w-[400px]">
            <iframe
              src={CHATBOT_WIDGET_URL}
              title="Chatbot widget"
              aria-label="Chatbot conversation window"
              className="h-full w-full border-0 bg-white dark:bg-slate-950"
            />
          </div>
        </div>
      ) : null}

      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-label={isOpen ? "Close chatbot" : "Open chatbot"}
        aria-expanded={isOpen}
        className="group relative h-16 w-16 overflow-visible rounded-full bg-gradient-to-br from-blue-500 via-sky-400 to-cyan-300 p-0.5 shadow-[0_14px_32px_rgba(37,99,235,0.36)] transition duration-200 ease-out hover:-translate-y-1 hover:scale-105 hover:shadow-[0_20px_42px_rgba(37,99,235,0.48)] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-4 dark:focus:ring-offset-slate-900"
      >
        <span className="sr-only">{isOpen ? "Close" : "Chat"}</span>
        <span className="absolute inset-0 -z-10 rounded-full bg-blue-500/25 blur-xl transition group-hover:bg-blue-400/35" />
        <span className="block h-full w-full overflow-hidden rounded-full border-[3px] border-white bg-slate-200 ring-1 ring-slate-900/5 dark:border-slate-900 dark:ring-white/10">
          <Image
            src="/image/hero-image.png"
            alt=""
            width={60}
            height={60}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-110"
            aria-hidden="true"
          />
        </span>
        <span className="absolute -bottom-0.5 -right-0.5 flex h-7 w-7 items-center justify-center rounded-full border-[3px] border-white bg-blue-600 text-white shadow-lg transition group-hover:scale-105 dark:border-slate-900">
          {isOpen ? (
            <svg
              aria-hidden="true"
              viewBox="0 0 20 20"
              className="h-3.5 w-3.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
            >
              <path d="M5 5l10 10M15 5L5 15" />
            </svg>
          ) : (
            <svg
              aria-hidden="true"
              viewBox="0 0 20 20"
              className="h-3.5 w-3.5"
              fill="currentColor"
            >
              <path d="M10 3.5c-4.14 0-7.5 2.82-7.5 6.3 0 1.98 1.1 3.75 2.82 4.9v2.3l2.58-1.34c.67.18 1.38.27 2.1.27 4.14 0 7.5-2.82 7.5-6.3S14.14 3.5 10 3.5Z" />
            </svg>
          )}
        </span>
        {!isOpen ? (
          <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full border-2 border-white bg-rose-500 px-1 text-[10px] font-bold leading-none text-white shadow-md dark:border-slate-900">
            1
          </span>
        ) : null}
      </button>
    </div>
  );
}
