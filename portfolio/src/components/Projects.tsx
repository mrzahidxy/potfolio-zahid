"use client";

import React, { useEffect, useState } from "react";
import FeatureCard from "./common/FeatureCard";
import { useAxiosWithAuth } from "@/helper/request-method";
import DefaultLoader from "./common/DefaultLoader";

interface Project {
  description: string;
  img: string;
  technology: Array<string>;
  githubLink: string;
  liveLink: string;
  title: string;
  _id?: string;
}

interface ProjectApiResponse {
  data: Project[];
}

const Projects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const api = useAxiosWithAuth();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await api.get<ProjectApiResponse>(`/projects`);
        setProjects(response.data.data);
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [api]);

  if (loading) {
    return (
      <section
        id="projects"
        className="bg-slate-50 px-4 py-20 md:px-6 lg:px-8"
      >
        <div className="container flex items-center justify-center">
          <DefaultLoader />
        </div>
      </section>
    );
  }



  return (
    <section
      id="projects"
      className="bg-slate-50 px-4 py-14 md:px-6 lg:px-8 dark:bg-slate-900"
    >
      <div className="container max-w-6xl space-y-6">
        <div className="text-center space-y-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-500">
            Portfolio
          </p>
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-50 sm:text-3xl">
            Featured Projects
          </h2>
          <p className="mx-auto max-w-3xl text-[15px] leading-7 text-slate-600 dark:text-slate-200">
            Recent work showcasing modern web development, thoughtful
            architecture, and polished UI experiences.
          </p>
        </div>

        {projects.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project: Project) => (
              <FeatureCard key={project._id} project={project} />
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-slate-200 bg-white/60 p-6 text-center text-slate-500 shadow-sm dark:border-slate-700 dark:bg-slate-800/70 dark:text-slate-300">
            Projects will appear here once they are published.
          </div>
        )}
      </div>
    </section>
  );
};

export default Projects;
