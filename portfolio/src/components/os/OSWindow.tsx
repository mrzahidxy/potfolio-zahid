import type { ReactNode } from "react";

interface OSWindowProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
  bodyClassName?: string;
  titleBarClassName?: string;
  onClose?: () => void;
  onMinimize?: () => void;
}

export default function OSWindow({
  title,
  subtitle,
  children,
  className = "",
  bodyClassName = "",
  titleBarClassName = "",
  onClose,
  onMinimize,
}: OSWindowProps) {
  return (
    <div
      className={`flex flex-col overflow-hidden rounded-lg border border-white/80 bg-white/[0.92] shadow-[0_24px_70px_rgba(26,47,87,0.28)] ring-1 ring-slate-900/[0.06] backdrop-blur-xl dark:border-slate-700/80 dark:bg-slate-950/[0.85] dark:shadow-[0_24px_70px_rgba(0,0,0,0.36)] dark:ring-white/[0.05] ${className}`}
    >
      <div
        className={`flex min-h-9 shrink-0 items-center justify-between gap-3 border-b border-slate-200/80 bg-gradient-to-b from-white/95 to-slate-100/[0.92] px-4 py-1.5 dark:border-slate-800/90 dark:from-slate-900/95 dark:to-slate-950/[0.92] ${titleBarClassName}`}
      >
        <div className="flex min-w-0 items-center gap-3">
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-slate-800 dark:text-slate-100">
              {title}
            </p>
            {subtitle && (
              <p className="truncate text-[11px] font-medium text-slate-500 dark:text-slate-400">
                {subtitle}
              </p>
            )}
          </div>
        </div>
        <div
          className="flex shrink-0 items-center gap-1 text-sm leading-none text-slate-700 dark:text-slate-200"
        >
          <button
            type="button"
            onClick={onMinimize}
            disabled={!onMinimize}
            aria-label="Minimize window"
            className="flex h-6 w-7 items-center justify-center rounded hover:bg-slate-200/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300 disabled:pointer-events-none dark:hover:bg-slate-800"
          >
            -
          </button>
          <button
            type="button"
            onClick={onClose}
            disabled={!onClose}
            aria-label="Close window"
            className="flex h-6 w-7 items-center justify-center rounded hover:bg-red-500 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-300 disabled:pointer-events-none"
          >
            x
          </button>
        </div>
      </div>
      <div className={`min-h-0 flex-1 ${bodyClassName}`}>
        {children}
      </div>
    </div>
  );
}
