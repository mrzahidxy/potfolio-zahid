"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import DefaultLoader from "@/components/common/DefaultLoader";
import { useAxiosWithAuth } from "@/helper/request-method";
import ExperienceTable from "./experienceTable";

interface Experience {
  id?: string;
  role: string;
  company: string;
  period: string;
  location?: string;
  summary: string;
  highlights: string[];
}

export default function ExperienceManagementPage() {
  const api = useAxiosWithAuth();
  const router = useRouter();
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const [busyAction, setBusyAction] = useState<string | null>(null);

  const fetchExperiences = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get<{ success: boolean; data: Experience[] }>(
        "/admin/experiences"
      );
      setExperiences(response.data.data ?? []);
      setError(null);
    } catch (err) {
      setError(getApiError(err, "Failed to load experiences. Please try again later."));
    } finally {
      setLoading(false);
    }
  }, [api]);

  useEffect(() => {
    fetchExperiences();
  }, [fetchExperiences]);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this experience permanently?")) return;

    try {
      setBusyAction(`delete-${id}`);
      setFeedback(null);
      await api.delete(`/admin/experiences/${id}`);
      setExperiences((prev) => prev.filter((experience) => experience.id !== id));
      setFeedback({ type: "success", message: "Experience deleted successfully." });
    } catch (err) {
      setFeedback({
        type: "error",
        message: getApiError(err, "Failed to delete experience."),
      });
    } finally {
      setBusyAction(null);
    }
  };

  const handleUpdate = (id: string) => {
    router.push(`/admin/experiences/edit/${id}`);
  };

  if (loading) {
    return <DefaultLoader />;
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-6 text-center text-red-200">
        <p className="font-semibold">{error}</p>
        <button
          type="button"
          onClick={fetchExperiences}
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
            Experience
          </p>
          <h1 className="text-xl font-semibold text-slate-900 dark:text-white">
            Manage Experience
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Keep your role history as a separate list, just like projects.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            href="/admin/experiences/add"
            className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100"
          >
            Add Experience
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
        {experiences.length ? (
          <ExperienceTable
            experiences={experiences}
            onDelete={handleDelete}
            onUpdate={handleUpdate}
            busyAction={busyAction}
          />
        ) : (
          <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-900/40 dark:text-slate-300">
            No experience entries yet.
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
