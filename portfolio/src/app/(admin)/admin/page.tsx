"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAxiosWithAuth } from "@/helper/request-method";

interface ProjectListResponse {
  success: boolean;
  data: Array<{ _id: string }>;
}

export default function DashboardPage() {
  const api = useAxiosWithAuth();
  const [activeCount, setActiveCount] = useState<number>(0);
  const [archivedCount, setArchivedCount] = useState<number>(0);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const [activeResponse, archivedResponse] = await Promise.all([
          api.get<ProjectListResponse>("/projects"),
          api.get<ProjectListResponse>("/projects/archived"),
        ]);

        setActiveCount(activeResponse.data.data.length);
        setArchivedCount(archivedResponse.data.data.length);
      } catch (error) {
        console.error("Error loading dashboard stats:", error);
      }
    };

    fetchCounts();
  }, [api]);

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900/60">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-slate-500">
              Admin
            </p>
            <h1 className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">
              Project Dashboard
            </h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Manage project entries and archived items from one place.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <LinkChip label="Projects" href="/admin/projects" primary />
            <LinkChip label="Add Project" href="/admin/projects/add" />
            <LinkChip label="Back to Site" href="/" />
            <LinkChip label="Logout" href="/admin/login" />
          </div>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <StatCard label="Active Projects" value={activeCount} />
          <StatCard label="Archived Projects" value={archivedCount} />
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950/50">
      <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
        {label}
      </p>
      <p className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">
        {value}
      </p>
    </div>
  );
}

function LinkChip({
  label,
  href,
  primary = false,
}: {
  label: string;
  href: string;
  primary?: boolean;
}) {
  return (
    <Link
      href={href}
      className={
        primary
          ? "rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100"
          : "rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:border-slate-500 dark:hover:text-white"
      }
    >
      {label}
    </Link>
  );
}
