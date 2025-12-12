"use client";

import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faDiagramProject,
  faPlus,
  faRightFromBracket,
} from "@fortawesome/free-solid-svg-icons";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <DashboardCard
          title="Projects"
          value="4"
          hint="Managed projects"
          href="/admin/projects"
          icon={faDiagramProject}
        />
        <DashboardCard
          title="Add Project"
          value="New"
          hint="Create a new entry"
          href="/admin/projects/add"
          icon={faPlus}
        />
        <DashboardCard
          title="Logout"
          value="Exit"
          hint="End admin session"
          href="/admin/login"
          icon={faRightFromBracket}
        />
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-slate-500">
              Quick Links
            </p>
            <h2 className="text-lg font-semibold text-white">Shortcuts</h2>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-3">
          <LinkChip label="View Projects" href="/admin/projects" />
          <LinkChip label="Add Project" href="/admin/projects/add" />
          <LinkChip label="Back to Site" href="/" />
        </div>
      </div>
    </div>
  );
}

function DashboardCard({
  title,
  value,
  hint,
  href,
  icon,
}: {
  title: string;
  value: string;
  hint: string;
  href: string;
  icon: any;
}) {
  return (
    <Link
      href={href}
      className="group rounded-2xl border border-slate-200 bg-white p-4 shadow-lg transition hover:-translate-y-1 hover:border-slate-300 hover:bg-white dark:border-slate-800 dark:bg-slate-900/60 dark:hover:border-slate-700 dark:hover:bg-slate-900"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-slate-500">
            {title}
          </p>
          <p className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">{value}</p>
          <p className="text-sm text-slate-500 dark:text-slate-400">{hint}</p>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-sky-500 shadow-inner dark:bg-slate-800 dark:text-sky-400">
          <FontAwesomeIcon icon={icon} className="h-5 w-5" />
        </div>
      </div>
    </Link>
  );
}

function LinkChip({ label, href }: { label: string; href: string }) {
  return (
    <Link
      href={href}
      className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:border-slate-500 dark:hover:text-white"
    >
      {label}
    </Link>
  );
}
