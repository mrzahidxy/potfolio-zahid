"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowUpRightFromSquare,
  faEnvelope,
} from "@fortawesome/free-solid-svg-icons";
import { faGithub, faLinkedin } from "@fortawesome/free-brands-svg-icons";
import { usePublicProfile } from "@/context/PublicProfileContext";
import type {
  ProfileExperience,
  ProfileExperienceListResponse,
} from "@/lib/profile-types";
import type { Project, ProjectListResponse } from "@/lib/project-types";
import OSWindow from "./OSWindow";
import { useOSDesktop } from "./OSDesktopShell";

export default function OSPortfolioDesktop() {
  const { activeItem, closeActiveItem } = useOSDesktop();
  const { profile, loading } = usePublicProfile();
  const [projects, setProjects] = useState<Project[]>([]);
  const [experiences, setExperiences] = useState<ProfileExperience[]>([]);
  const [isMaximized, setIsMaximized] = useState(false);

  useEffect(() => {
    let isActive = true;

    const loadDesktopData = async () => {
      try {
        const [projectResponse, experienceResponse] = await Promise.all([
          fetch("/api/projects", { cache: "no-store" }),
          fetch("/api/experiences", { cache: "no-store" }),
        ]);
        const [projectPayload, experiencePayload] = await Promise.all([
          projectResponse.json() as Promise<ProjectListResponse>,
          experienceResponse.json() as Promise<ProfileExperienceListResponse>,
        ]);

        if (!isActive) {
          return;
        }

        setProjects(projectPayload.success ? projectPayload.data ?? [] : []);
        setExperiences(
          experiencePayload.success ? experiencePayload.data ?? [] : []
        );
      } catch {
        if (isActive) {
          setProjects([]);
          setExperiences([]);
        }
      }
    };

    loadDesktopData();

    return () => {
      isActive = false;
    };
  }, []);

  useEffect(() => {
    setIsMaximized(false);
  }, [activeItem]);

  const shortName = useMemo(() => {
    const parts = profile.personal_details.name.split(" ").filter(Boolean);
    return (
      parts.find((part) => part.toLowerCase().includes("zahid")) ??
      parts[0] ??
      profile.personal_details.name
    );
  }, [profile.personal_details.name]);

  const skills = useMemo(
    () => Object.values(profile.preferences.tech_stack).flat().slice(0, 8),
    [profile.preferences.tech_stack]
  );

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <OSWindow title="Loading" bodyClassName="p-8">
          <div className="h-2 w-64 overflow-hidden rounded-full bg-slate-200">
            <div className="h-full w-2/3 rounded-full bg-indigo-500" />
          </div>
        </OSWindow>
      </div>
    );
  }

  const windowClassName = isMaximized
    ? "min-h-[calc(100vh-8.5rem)] w-full"
    : "";
  const scrollBodyClassName = isMaximized
    ? "max-h-[calc(100vh-12rem)] overflow-auto"
    : "";
  const windowActions = {
    isMaximized,
    onClose: closeActiveItem,
    onMinimize: closeActiveItem,
    onMaximize: () => setIsMaximized((current) => !current),
  };

  return (
    <div
      className={`flex min-h-[calc(100vh-10rem)] items-start justify-center ${isMaximized ? "pt-0" : "pt-2 lg:pt-8"}`}
    >
      <div className={isMaximized ? "w-full" : "w-full max-w-5xl"}>
        {!activeItem && (
          <div
            className="min-h-[58vh]"
            aria-label="No open windows"
          />
        )}

        {activeItem === "about" && (
          <OSWindow
            title="About Me"
            className={windowClassName}
            bodyClassName={`p-5 sm:p-7 ${scrollBodyClassName}`}
            {...windowActions}
          >
            <section
              id="about"
              className="grid gap-6 lg:grid-cols-[230px,minmax(0,1fr)] lg:items-center"
            >
              <div className="overflow-hidden rounded-lg border border-slate-300 bg-slate-950 shadow-inner">
                <Image
                  src="/image/about.png"
                  alt={profile.personal_details.name}
                  width={460}
                  height={460}
                  priority
                  className="aspect-square h-full w-full object-cover"
                />
              </div>

              <div className="min-w-0">
                <h1 className="font-mono text-[34px] font-bold leading-tight tracking-normal text-slate-950 dark:text-white sm:text-[46px]">
                  Hi, I&apos;m{" "}
                  <span className="text-indigo-600 dark:text-indigo-300">
                    {shortName}
                  </span>
                  <span className="inline-block translate-y-1 pl-1">_</span>
                </h1>
                <p className="mt-2 font-mono text-sm font-semibold text-slate-900 dark:text-slate-100 sm:text-base">
                  {profile.personal_details.title}
                </p>
                <p className="mt-6 max-w-2xl text-[15px] leading-7 text-slate-700 dark:text-slate-300 sm:text-base">
                  {profile.personal_details.bio}
                </p>

                <div className="mt-5 flex flex-wrap gap-2">
                  <span className="rounded-md border border-slate-200 bg-slate-50 px-3 py-1.5 font-mono text-xs font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">
                    {profile.personal_details.location}
                  </span>
                  {profile.content.intro.highlights.map((highlight) => (
                    <span
                      key={highlight}
                      className="rounded-md border border-slate-200 bg-slate-50 px-3 py-1.5 font-mono text-xs font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                    >
                      {highlight}
                    </span>
                  ))}
                </div>
              </div>
            </section>

            <div className="mt-7 border-t border-slate-200 pt-5 dark:border-slate-800">
              <h2 className="font-mono text-xl font-bold text-slate-950 dark:text-white">
                Skills
              </h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-md border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </OSWindow>
        )}

        {activeItem === "projects" && (
          <OSWindow
            title="Projects"
            className={windowClassName}
            bodyClassName={`divide-y divide-slate-200 dark:divide-slate-800 ${scrollBodyClassName}`}
            {...windowActions}
          >
            <section id="projects">
              {projects.length > 0 ? (
                projects.slice(0, 5).map((project) => (
                  <article
                    key={project._id ?? project.title}
                    className="flex items-center gap-4 px-4 py-4"
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-slate-950 font-mono text-sm font-bold text-emerald-400 dark:bg-slate-900">
                      {project.title.slice(0, 2).toUpperCase()}
                    </span>
                    <div className="min-w-0 flex-1">
                      <h2 className="truncate text-sm font-bold text-slate-950 dark:text-white">
                        {project.title}
                      </h2>
                      <p className="truncate text-sm text-slate-600 dark:text-slate-300">
                        {project.description}
                      </p>
                    </div>
                    {project.liveLink && (
                      <Link
                        href={project.liveLink}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={`Open ${project.title}`}
                        className="text-slate-500 transition hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-300"
                      >
                        <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
                      </Link>
                    )}
                  </article>
                ))
              ) : (
                <div className="px-4 py-10 text-center text-sm text-slate-600 dark:text-slate-300">
                  Projects will appear here once they are available.
                </div>
              )}
            </section>
          </OSWindow>
        )}

        {activeItem === "experience" && (
          <OSWindow
            title="Experience"
            className={windowClassName}
            bodyClassName={`divide-y divide-slate-200 dark:divide-slate-800 ${scrollBodyClassName}`}
            {...windowActions}
          >
            <section id="experience">
              {experiences.length > 0 ? (
                experiences.slice(0, 4).map((experience) => (
                  <article
                    key={
                      experience.id ??
                      `${experience.company}-${experience.period}`
                    }
                    className="px-5 py-4"
                  >
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <h2 className="text-sm font-bold text-slate-950 dark:text-white">
                          {experience.role}
                        </h2>
                        <p className="mt-1 text-sm font-medium text-indigo-700 dark:text-indigo-300">
                          {experience.company}
                        </p>
                      </div>
                      <span className="w-fit rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1 font-mono text-xs text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
                        {experience.period}
                      </span>
                    </div>
                    <p className="mt-3 text-sm leading-6 text-slate-700 dark:text-slate-300">
                      {experience.summary}
                    </p>
                  </article>
                ))
              ) : (
                <div className="px-5 py-10 text-center text-sm text-slate-600 dark:text-slate-300">
                  Experience entries will appear here once they are available.
                </div>
              )}
            </section>
          </OSWindow>
        )}

        {activeItem === "contact" && (
          <OSWindow
            title="Contact"
            className={windowClassName}
            bodyClassName={`p-5 ${scrollBodyClassName}`}
            {...windowActions}
          >
            <section id="contact">
              <h2 className="text-lg font-bold text-slate-950 dark:text-white">
                {profile.content.contact.heading}
              </h2>
              <p className="mt-3 text-sm leading-6 text-slate-700 dark:text-slate-300">
                {profile.content.contact.intro}
              </p>

              <div className="mt-5 space-y-3">
                <Link
                  href={`mailto:${profile.personal_details.contact.email}`}
                  className="flex items-center gap-3 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-800 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:border-indigo-800 dark:hover:bg-indigo-950/40"
                >
                  <FontAwesomeIcon icon={faEnvelope} className="w-4" />
                  {profile.personal_details.contact.email}
                </Link>
                <Link
                  href={profile.personal_details.links.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-3 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-800 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:border-indigo-800 dark:hover:bg-indigo-950/40"
                >
                  <FontAwesomeIcon icon={faLinkedin} className="w-4" />
                  LinkedIn
                </Link>
                <Link
                  href={profile.personal_details.links.github}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-3 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-800 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:border-indigo-800 dark:hover:bg-indigo-950/40"
                >
                  <FontAwesomeIcon icon={faGithub} className="w-4" />
                  GitHub
                </Link>
              </div>
            </section>
          </OSWindow>
        )}
      </div>
    </div>
  );
}
