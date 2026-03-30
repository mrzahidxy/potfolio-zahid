"use client";

import React, { useState, useEffect, useCallback } from "react";
import ProjectTable from "./projectTable";
import Link from "next/link";
import { useAxiosWithAuth } from "@/helper/request-method";
import { useRouter } from "next/navigation";
import DefaultLoader from "@/components/common/DefaultLoader";


interface Project {
  _id: string;
  title: string;
  description: string;
  technology: string[];
  githubLink: string;
  liveLink: string;
  img: string;
  isArchived: boolean;
}

export default function ProjectManagement() {
  const [activeProjects, setActiveProjects] = useState<Project[]>([]);
  const [archivedProjects, setArchivedProjects] = useState<Project[]>([]);
  const [showArchived, setShowArchived] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter()

  const api = useAxiosWithAuth();

  const fetchProjects = useCallback(async () => {
    try {
      setLoading(true);
      const [activeResponse, archivedResponse] = await Promise.all([
        api.get<{ success: boolean; data: Project[] }>(`/projects`),
        api.get<{ success: boolean; data: Project[] }>(`/projects/archived`),
      ]);
      setActiveProjects(activeResponse.data.data);
      setArchivedProjects(archivedResponse.data.data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch projects. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, [api]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/admin/projects/${id}`);
      setActiveProjects((prev) => prev.filter((project) => project._id !== id));
      setArchivedProjects((prev) => prev.filter((project) => project._id !== id));
    } catch (err) {
      setError((err as any)?.response.data.message);
    }
  };

  const handleArchive = async (id: string) => {
    try {
      await api.patch(`/admin/projects/${id}/archive`);
      await fetchProjects();
    } catch (err) {
      setError((err as any)?.response?.data?.message ?? "Failed to update archive status.");
    }
  };

  const handleUpdate = (id: string) => {
    router.push(`/admin/projects/edit/${id}`);
  };

  const visibleProjects = showArchived ? archivedProjects : activeProjects;

  if (loading) {
    return <DefaultLoader/>;
  }

  if (error) {
    return (
      <div className="text-center text-red-200 p-6 rounded-xl border border-red-500/40 bg-red-500/10">
        <p className="font-semibold">{error}</p>
        <button
          onClick={fetchProjects}
          className="mt-4 rounded-full bg-sky-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-sky-400"
        >
          Refresh
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-5 md:flex-row md:items-center dark:border-slate-800 dark:bg-slate-900/60">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-slate-500">
            Projects
          </p>
          <h1 className="text-xl font-semibold text-slate-900 dark:text-white">Manage Projects</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {activeProjects.length} active / {archivedProjects.length} archived
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 p-1 dark:border-slate-700 dark:bg-slate-800">
            <button
              type="button"
              onClick={() => setShowArchived(false)}
              className={`rounded-full px-3 py-1.5 text-sm font-medium transition ${
                !showArchived
                  ? "bg-slate-900 text-white dark:bg-white dark:text-slate-950"
                  : "text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
              }`}
            >
              Active
            </button>
            <button
              type="button"
              onClick={() => setShowArchived(true)}
              className={`rounded-full px-3 py-1.5 text-sm font-medium transition ${
                showArchived
                  ? "bg-slate-900 text-white dark:bg-white dark:text-slate-950"
                  : "text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
              }`}
            >
              Archived
            </button>
          </div>
          <Link
            href="/admin/projects/add"
            className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100"
          >
            Add Project
          </Link>
          <Link
            href="/admin"
            className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:border-slate-500 dark:hover:text-white"
          >
            Dashboard
          </Link>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900/60">
        {visibleProjects.length ? (
          <ProjectTable
            projects={visibleProjects}
            onDelete={handleDelete}
            onUpdate={handleUpdate}
            onArchive={handleArchive}
          />
        ) : (
          <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-900/40 dark:text-slate-300">
            {showArchived
              ? "No archived projects yet."
              : "No active projects available."}
          </div>
        )}
      </div>
    </div>
  );
}
