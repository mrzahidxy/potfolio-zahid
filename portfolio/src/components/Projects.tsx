"use client";

import React, { useEffect, useState } from "react";
import FeatureCard from "./common/FeatureCard";
import { useAxiosWithAuth } from "@/helper/request-method";
import DefaultLoader from "./common/DefaultLoader";
import Reveal from "./common/Reveal";

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
  success: boolean;
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
        className="scroll-mt-32 px-4 py-20 sm:scroll-mt-28 md:px-6 md:py-24 lg:px-8"
      >
        <div className="container max-w-6xl flex items-center justify-center">
          <DefaultLoader />
        </div>
      </section>
    );
  }



  return (
    <section
      id="projects"
      className="relative scroll-mt-32 px-4 py-20 sm:scroll-mt-28 md:px-6 md:py-24 lg:px-8"
    >
      <div className="container max-w-6xl space-y-8 sm:space-y-10 md:space-y-12">
        <Reveal className="space-y-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">
            Projects
          </p>
          <h2 className="text-3xl font-semibold tracking-tight text-slate-950 dark:text-slate-50 sm:text-4xl">
            Selected Work
          </h2>
          <p className="max-w-3xl text-[15px] leading-7 text-slate-600 dark:text-slate-300 sm:text-base sm:leading-8">
            A few builds and the workflows they were designed to support.
          </p>
        </Reveal>

        {projects.length > 0 ? (
          <div className="grid grid-cols-1 gap-5 sm:gap-6 md:grid-cols-2 lg:grid-cols-3 xl:gap-7">
            {projects.map((project: Project, index) => (
              <Reveal
                key={project._id ?? project.title}
                delayMs={Math.min(index * 70, 180)}
                durationMs={560}
              >
                <FeatureCard project={project} />
              </Reveal>
            ))}
          </div>
        ) : (
          <Reveal delayMs={80}>
            <div className="rounded-[30px] border border-dashed border-slate-300 bg-white/70 p-8 text-center text-slate-500 shadow-[0_20px_50px_rgba(15,23,42,0.05)] backdrop-blur dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-300">
              Selected projects will appear here once they are published.
            </div>
          </Reveal>
        )}
      </div>
    </section>
  );
};

export default Projects;
