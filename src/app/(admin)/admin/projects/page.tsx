"use client";

import React, { useState, useEffect } from "react";
import ProjectTable from "./projectTable";
import Link from "next/link";
import { useAxiosWithAuth } from "@/helper/request-method";
import { useRouter } from "next/navigation";


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
      await api.delete(`/projects/${id}`);
      setProjects(projects.filter((project) => project._id !== id));
    } catch (err) {
      setError("Failed to delete project. Please try again.");
    }
  };

  const handleUpdate = (id: string) => {
    router.push(`/admin/projects/edit/${id}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 p-4">
        <p>{error}</p>
        <button
          onClick={fetchProjects}
          className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto mt-20">
      <div className="flex justify-between py-2">
        <h1 className="text-2xl font-bold mb-4">Projects</h1>
        <Link
          href="/admin/projects/add"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Add Project
        </Link>
      </div>
      <ProjectTable
        projects={projects}
        onDelete={handleDelete}
        onUpdate={handleUpdate}
      />
    </div>
  );
}
