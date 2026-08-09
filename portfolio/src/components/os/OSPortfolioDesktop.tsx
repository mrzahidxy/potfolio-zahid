"use client";

import { useEffect, useMemo, useState } from "react";
import { usePublicProfile } from "@/context/PublicProfileContext";
import type {
  ProfileExperience,
  ProfileExperienceListResponse,
} from "@/lib/profile-types";
import type { Project, PublicProjectListResponse } from "@/lib/project-types";
import OSAboutContent from "./OSAboutContent";
import OSContactContent from "./OSContactContent";
import OSExperienceContent from "./OSExperienceContent";
import OSMailContent from "./OSMailContent";
import OSProjectsContent from "./OSProjectsContent";
import OSRetroGame from "./OSRetroGame";
import OSWindow from "./OSWindow";
import { useOSDesktop } from "./OSDesktopShell";

export default function OSPortfolioDesktop() {
  const { activeItem, closeActiveItem } = useOSDesktop();
  const { profile, loading } = usePublicProfile();
  const [projects, setProjects] = useState<Project[]>([]);
  const [experiences, setExperiences] = useState<ProfileExperience[]>([]);
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    let isActive = true;

    const loadDesktopData = async () => {
      try {
        const [projectResponse, experienceResponse] = await Promise.all([
          fetch("/api/projects", { cache: "force-cache" }),
          fetch("/api/experiences", { cache: "force-cache" }),
        ]);
        const [projectPayload, experiencePayload] = await Promise.all([
          projectResponse.json() as Promise<PublicProjectListResponse>,
          experienceResponse.json() as Promise<ProfileExperienceListResponse>,
        ]);

        if (!isActive) {
          return;
        }

        setProjects(projectPayload.success ? projectPayload.data ?? [] : []);
        setExperiences(
          experiencePayload.success ? experiencePayload.data ?? [] : [],
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
    [profile.preferences.tech_stack],
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

  const windowActions = {
    onClose: closeActiveItem,
    onMinimize: closeActiveItem,
  };
  const defaultWindowClassName =
    "h-[min(700px,100%)] max-h-full w-full max-w-6xl";

  return (
    <div className="flex h-full min-h-0 items-center justify-center overflow-hidden py-2">
      <div className="flex h-full min-h-0 w-full max-w-6xl shrink-0 flex-col justify-center">
        {!activeItem && <div className="h-full" aria-label="No open windows" />}

        {activeItem === "about" && (
          <OSWindow
            title="About Me"
            className={defaultWindowClassName}
            bodyClassName="smooth-scrollbar overflow-auto p-5 sm:p-7"
            {...windowActions}
          >
            <OSAboutContent
              profile={profile}
              shortName={shortName}
              skills={skills}
            />
          </OSWindow>
        )}

        {activeItem === "projects" && (
          <OSWindow
            title="Projects"
            className={defaultWindowClassName}
            bodyClassName="overflow-hidden bg-[#f4f7fb] dark:bg-slate-950"
            {...windowActions}
          >
            <OSProjectsContent projects={projects} />
          </OSWindow>
        )}

        {activeItem === "experience" && (
          <OSWindow
            title="Experience"
            className={defaultWindowClassName}
            bodyClassName="overflow-hidden bg-[#f4f7fb] dark:bg-slate-950"
            {...windowActions}
          >
            <OSExperienceContent experiences={experiences} />
          </OSWindow>
        )}

        {activeItem === "contact" && (
          <OSWindow
            title="Contact"
            className={defaultWindowClassName}
            bodyClassName="smooth-scrollbar overflow-auto bg-white p-5 dark:bg-slate-900 sm:p-7"
            {...windowActions}
          >
            <OSContactContent profile={profile} />
          </OSWindow>
        )}

        {activeItem === "mail" && (
          <OSWindow
            title="Mail"
            subtitle="Compose"
            className={defaultWindowClassName}
            bodyClassName="overflow-hidden bg-[#f5f7fb] dark:bg-slate-950"
            {...windowActions}
          >
            <OSMailContent
              profile={profile}
              isFormSubmitted={isFormSubmitted}
              formError={formError}
              setIsFormSubmitted={setIsFormSubmitted}
              setFormError={setFormError}
            />
          </OSWindow>
        )}

        {activeItem === "game" && (
          <OSWindow
            title="Byte Run"
            subtitle="Retro game"
            className={defaultWindowClassName}
            bodyClassName="overflow-hidden bg-slate-950"
            {...windowActions}
          >
            <OSRetroGame />
          </OSWindow>
        )}
      </div>
    </div>
  );
}
