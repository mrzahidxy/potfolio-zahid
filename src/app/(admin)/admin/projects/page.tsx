"use client";

import React, { useState, useEffect } from "react";
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
}

export default function ProjectManagement() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter()

  const api = useAxiosWithAuth();

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await api.get<{ success: boolean; data: Project[] }>(
        `/projects`
      );
      setProjects(response.data.data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch projects. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/admin/projects/${id}`);
      setProjects(projects.filter((project) => project._id !== id));
    } catch (err) {
      setError((err as any)?.response.data.message);
    }
  };

  const handleUpdate = (id: string) => {
    router.push(`/admin/projects/edit/${id}`);
  };

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
      <div className="flex flex-col justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-lg md:flex-row md:items-center dark:border-slate-800 dark:bg-slate-900/60">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-slate-500">
            Projects
          </p>
          <h1 className="text-xl font-semibold text-slate-900 dark:text-white">Manage Projects</h1>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/admin/projects/add"
            className="inline-flex items-center gap-2 rounded-full bg-sky-500 px-4 py-2 text-sm font-semibold text-slate-950 shadow-lg shadow-sky-500/30 transition hover:-translate-y-[1px] hover:bg-sky-400"
          >
            Add Project
          </Link>
          <Link
            href="/admin"
            className="rounded-full border border-slate-700 bg-slate-800 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:border-slate-500 hover:text-white"
          >
            Dashboard
          </Link>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-lg dark:border-slate-800 dark:bg-slate-900/60">
        <ProjectTable
          projects={projects}
          onDelete={handleDelete}
          onUpdate={handleUpdate}
        />
      </div>
    </div>
  );
}
