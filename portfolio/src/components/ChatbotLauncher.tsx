"use client";

import { useState } from "react";

const CHATBOT_WIDGET_URL =
  process.env.NEXT_PUBLIC_CHATBOT_WIDGET_URL || "http://localhost:3000/widget";

export default function ChatbotLauncher() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-4 z-[9999] flex flex-col items-end gap-4 sm:bottom-8 sm:right-6">
      {isOpen ? (
        <div className="animate-[chatbotPop_180ms_ease-out] overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-[0_18px_55px_rgba(15,23,42,0.16)] dark:border-slate-800 dark:bg-slate-950">
          <div className="h-[min(600px,calc(100vh-7rem))] w-[calc(100vw-2rem)] overflow-hidden rounded-3xl bg-white dark:bg-slate-950 sm:h-[600px] sm:w-[400px]">
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
        className="flex h-14 w-14 items-center justify-center rounded-full border border-slate-200 bg-white text-blue-600 shadow-[0_12px_32px_rgba(15,23,42,0.14)] transition hover:-translate-y-0.5 hover:shadow-[0_16px_40px_rgba(15,23,42,0.18)] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-4 dark:border-slate-800 dark:bg-slate-900 dark:focus:ring-offset-slate-900"
      >
        <span className="sr-only">{isOpen ? "Close" : "Chat"}</span>
        {isOpen ? (
          <svg
            aria-hidden="true"
            viewBox="0 0 20 20"
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
          >
            <path d="M5 5l10 10M15 5L5 15" />
          </svg>
        ) : (
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4v8Z" />
          </svg>
        )}
      </button>
    </div>
  );
}
