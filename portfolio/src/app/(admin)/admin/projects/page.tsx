"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import ProjectTable from "./projectTable";
import Link from "next/link";
import { useAxiosWithAuth } from "@/helper/request-method";
import { useRouter } from "next/navigation";
import DefaultLoader from "@/components/common/DefaultLoader";
import type {
  DeleteProjectResponse,
  Project,
  ProjectBusyAction,
  ProjectFeedback,
  ProjectListResponse,
  ProjectResponse,
} from "@/lib/project-types";

export default function ProjectManagement() {
  const [activeProjects, setActiveProjects] = useState<Project[]>([]);
  const [archivedProjects, setArchivedProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<ProjectFeedback | null>(null);
  const [busyAction, setBusyAction] = useState<ProjectBusyAction>(null);
  const router = useRouter();

  const api = useAxiosWithAuth();

  const fetchProjects = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get<ProjectListResponse>(
        `/admin/projects`
      );
      const projects = response.data.data ?? [];
      setActiveProjects(projects.filter((project) => !project.isArchived));
      setArchivedProjects(projects.filter((project) => project.isArchived));
      setError(null);
    } catch (err) {
      setError(getApiError(err, "Failed to fetch projects. Please try again later."));
    } finally {
      setLoading(false);
    }
  }, [api]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const removeProject = (id: string) => {
    setActiveProjects((prev) => prev.filter((project) => project._id !== id));
    setArchivedProjects((prev) => prev.filter((project) => project._id !== id));
  };

  const upsertProject = (project: Project) => {
    if (project.isArchived) {
      setActiveProjects((prev) => prev.filter((item) => item._id !== project._id));
      setArchivedProjects((prev) => [
        project,
        ...prev.filter((item) => item._id !== project._id),
      ]);
    } else {
      setArchivedProjects((prev) => prev.filter((item) => item._id !== project._id));
      setActiveProjects((prev) => [
        project,
        ...prev.filter((item) => item._id !== project._id),
      ]);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this project permanently?")) return;

    try {
      setBusyAction(`delete-${id}`);
      const response = await api.delete<DeleteProjectResponse>(
        `/admin/projects/${id}`
      );
      removeProject(response.data.deletedId || id);
      setFeedback({ type: "success", message: "Project deleted successfully." });
    } catch (err) {
      setFeedback({ type: "error", message: getApiError(err, "Failed to delete project.") });
    } finally {
      setBusyAction(null);
    }
  };

  const handleArchive = async (id: string) => {
    try {
      setBusyAction(`archive-${id}`);
      const response = await api.patch<ProjectResponse>(
        `/admin/projects/${id}/archive`
      );
      upsertProject(response.data.data);
      setFeedback({ type: "success", message: "Project archived successfully." });
    } catch (err) {
      setFeedback({ type: "error", message: getApiError(err, "Failed to archive project.") });
    } finally {
      setBusyAction(null);
    }
  };

  const handleRestore = async (id: string) => {
    try {
      setBusyAction(`restore-${id}`);
      const response = await api.patch<ProjectResponse>(
        `/admin/projects/${id}/restore`
      );
      upsertProject(response.data.data);
      setFeedback({ type: "success", message: "Project restored successfully." });
    } catch (err) {
      setFeedback({ type: "error", message: getApiError(err, "Failed to restore project.") });
    } finally {
      setBusyAction(null);
    }
  };

  const handleImageUpload = async (id: string, file: File) => {
    try {
      setBusyAction(`image-${id}`);
      const body = new FormData();
      body.append("img", file);
      const response = await api.post<ProjectResponse>(
        `/admin/projects/${id}/image`,
        body,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      upsertProject(response.data.data);
      setFeedback({ type: "success", message: "Project image updated successfully." });
    } catch (err) {
      setFeedback({ type: "error", message: getApiError(err, "Failed to upload project image.") });
    } finally {
      setBusyAction(null);
    }
  };

  const handleUpdate = (id: string) => {
    router.push(`/admin/projects/edit/${id}`);
  };

  const totals = useMemo(
    () => `${activeProjects.length} active / ${archivedProjects.length} archived`,
    [activeProjects.length, archivedProjects.length]
  );

  if (loading) {
    return <DefaultLoader />;
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
            {totals}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
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

      {feedback && (
        <div
          className={`rounded-xl border p-4 text-sm ${
            feedback.type === "success"
              ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-200"
              : "border-red-500/40 bg-red-500/10 text-red-700 dark:text-red-200"
          }`}
        >
          {feedback.message}
        </div>
      )}

      <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900/60">
        <h2 className="mb-4 text-base font-semibold text-slate-900 dark:text-white">
          Active Projects
        </h2>
        {activeProjects.length ? (
          <ProjectTable
            projects={activeProjects}
            onDelete={handleDelete}
            onUpdate={handleUpdate}
            onArchive={handleArchive}
            onRestore={handleRestore}
            onImageUpload={handleImageUpload}
            busyAction={busyAction}
          />
        ) : (
          <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-900/40 dark:text-slate-300">
            No active projects available.
          </div>
        )}
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900/60">
        <h2 className="mb-4 text-base font-semibold text-slate-900 dark:text-white">
          Archived Projects
        </h2>
        {archivedProjects.length ? (
          <ProjectTable
            projects={archivedProjects}
            onDelete={handleDelete}
            onUpdate={handleUpdate}
            onArchive={handleArchive}
            onRestore={handleRestore}
            onImageUpload={handleImageUpload}
            busyAction={busyAction}
          />
        ) : (
          <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-900/40 dark:text-slate-300">
            No archived projects yet.
          </div>
        )}
      </div>
    </div>
  );
}

function getApiError(err: unknown, fallback: string) {
  const response = (err as any)?.response?.data;
  return response?.error ?? response?.message ?? fallback;
}
