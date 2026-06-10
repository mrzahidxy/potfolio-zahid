"use client";

import { useCallback, useContext, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AuthContext } from "@/context/AuthContext";
import { useAxiosWithAuth } from "@/helper/request-method";
import type { ProjectListResponse } from "@/lib/project-types";

interface ExperienceListResponse {
  success: boolean;
  data: Array<{ id?: string }>;
}

export default function DashboardPage() {
  const api = useAxiosWithAuth();
  const router = useRouter();
  const { dispatch } = useContext(AuthContext);
  const [activeCount, setActiveCount] = useState<number>(0);
  const [archivedCount, setArchivedCount] = useState<number>(0);
  const [experienceCount, setExperienceCount] = useState<number>(0);
  const [loadingStats, setLoadingStats] = useState(true);
  const [statsError, setStatsError] = useState<string | null>(null);

  const handleLogout = () => {
    dispatch({ type: "LOGOUT" });
    router.replace("/admin/login");
  };

  const fetchCounts = useCallback(async () => {
    try {
      setLoadingStats(true);
      setStatsError(null);

      const [projectResponse, experienceResponse] = await Promise.all([
        api.get<ProjectListResponse>("/admin/projects"),
        api.get<ExperienceListResponse>("/admin/experiences"),
      ]);

      const projects = projectResponse.data.data ?? [];
      setActiveCount(projects.filter((project) => !project.isArchived).length);
      setArchivedCount(projects.filter((project) => project.isArchived).length);
      setExperienceCount(experienceResponse.data.data?.length ?? 0);
    } catch (error) {
      setStatsError(getApiError(error, "Failed to load dashboard stats."));
    } finally {
      setLoadingStats(false);
    }
  }, [api]);

  useEffect(() => {
    fetchCounts();
  }, [fetchCounts]);

  const hasNoStats =
    !loadingStats &&
    !statsError &&
    activeCount === 0 &&
    archivedCount === 0 &&
    experienceCount === 0;

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900/60">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-slate-500">
              Admin
            </p>
            <h1 className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">
              Admin Dashboard
            </h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Manage projects and the homepage copy that changes most often.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <LinkChip label="Projects" href="/admin/projects" primary />
            <LinkChip label="Experience" href="/admin/experiences" />
            <LinkChip label="Profile" href="/admin/profile" />
            <LinkChip label="Add Project" href="/admin/projects/add" />
            <LinkChip label="Back to Site" href="/" />
            <ActionChip label="Logout" onClick={handleLogout} />
          </div>
        </div>

        {statsError && (
          <div className="mt-5 rounded-xl border border-red-500/40 bg-red-500/10 p-4 text-sm text-red-700 dark:text-red-200">
            <p className="font-semibold">{statsError}</p>
            <button
              type="button"
              onClick={fetchCounts}
              className="mt-3 rounded-full bg-red-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-red-500"
            >
              Retry
            </button>
          </div>
        )}

        <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4" aria-live="polite">
          <StatCard
            label="Active Projects"
            value={loadingStats ? "Loading..." : activeCount}
            href="/admin/projects"
          />
          <StatCard
            label="Archived Projects"
            value={loadingStats ? "Loading..." : archivedCount}
            href="/admin/projects"
          />
          <Link
            href="/admin/experiences"
            className="rounded-xl border border-slate-200 bg-slate-50 p-4 transition hover:border-slate-300 hover:bg-white dark:border-slate-800 dark:bg-slate-950/50 dark:hover:border-slate-700 dark:hover:bg-slate-900"
          >
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
              Experience
            </p>
            <p className="mt-2 text-lg font-semibold text-slate-900 dark:text-white">
              {loadingStats ? "Loading..." : `${experienceCount} entries`}
            </p>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Manage your role history separately from profile copy.
            </p>
          </Link>
          <Link
            href="/admin/profile"
            className="rounded-xl border border-slate-200 bg-slate-50 p-4 transition hover:border-slate-300 hover:bg-white dark:border-slate-800 dark:bg-slate-950/50 dark:hover:border-slate-700 dark:hover:bg-slate-900"
          >
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
              Profile Management
            </p>
            <p className="mt-2 text-lg font-semibold text-slate-900 dark:text-white">
              Update homepage copy
            </p>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Edit name, bio, contact details, and availability details.
            </p>
          </Link>
        </div>

        {hasNoStats && (
          <div className="mt-4 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-950/40 dark:text-slate-300">
            No projects or experience entries have been added yet.
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  href,
}: {
  label: string;
  value: number | string;
  href: string;
}) {
  const content = (
    <>
      <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
        {label}
      </p>
      <p className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">
        {value}
      </p>
    </>
  );

  return (
    <Link
      href={href}
      className="rounded-xl border border-slate-200 bg-slate-50 p-4 transition hover:border-slate-300 hover:bg-white dark:border-slate-800 dark:bg-slate-950/50 dark:hover:border-slate-700 dark:hover:bg-slate-900"
    >
      {content}
    </Link>
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

function getApiError(error: unknown, fallback: string) {
  const response = (error as any)?.response?.data;
  return response?.error ?? response?.message ?? fallback;
}

function ActionChip({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:border-slate-500 dark:hover:text-white"
    >
      {label}
    </button>
  );
}
