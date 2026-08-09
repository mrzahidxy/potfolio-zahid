import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUpRightFromSquare, faFolder } from "@fortawesome/free-solid-svg-icons";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import type { Project } from "@/lib/project-types";

interface OSProjectsContentProps {
  projects: Project[];
}

export default function OSProjectsContent({ projects }: OSProjectsContentProps) {
  return (
    <section id="projects" className="flex h-full min-h-0 flex-col">
      <div className="flex min-h-10 items-center gap-2 border-b border-slate-200 bg-white/80 px-4 text-xs font-semibold text-slate-500 dark:border-slate-800 dark:bg-slate-900/80 dark:text-slate-400">
        <span>Desktop</span>
        <span>/</span>
        <span className="text-slate-800 dark:text-slate-100">Projects</span>
      </div>

      <div className="grid min-h-9 grid-cols-[minmax(0,1fr),110px] items-center border-b border-slate-200 bg-slate-50/90 px-5 text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
        <span>Project & Details</span>
        <span className="text-right">Open</span>
      </div>

      <div className="smooth-scrollbar min-h-0 flex-1 overflow-auto bg-white dark:bg-slate-900">
        {projects.length > 0 ? (
          projects.slice(0, 8).map((project) => (
            <article
              key={project._id ?? project.title}
              className="group grid min-h-24 grid-cols-[minmax(0,1fr),110px] items-start gap-5 border-b border-slate-100 px-5 py-5 transition hover:bg-sky-50/80 dark:border-slate-800 dark:hover:bg-slate-800/70"
            >
              <div className="flex min-w-0 items-start gap-4">
                <span className="flex h-11 w-12 shrink-0 items-center justify-center rounded-md bg-amber-400 text-amber-900 shadow-sm ring-1 ring-amber-500/30">
                  <FontAwesomeIcon icon={faFolder} className="text-xl" />
                </span>
                <div className="min-w-0 space-y-2">
                  <div>
                    <h2 className="text-base font-bold leading-6 text-slate-950 dark:text-white">
                      {project.title}
                    </h2>
                    <p className="mt-1 max-w-4xl text-sm leading-6 text-slate-600 dark:text-slate-300">
                      {project.description}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {(project.technology ?? []).slice(0, 5).map((tech) => (
                      <span
                        key={tech}
                        className="rounded-md border border-slate-200 bg-slate-50 px-2 py-1 text-[11px] font-semibold text-slate-600 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-1">
                {project.githubLink && (
                  <Link
                    href={project.githubLink}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`Open ${project.title} GitHub`}
                    className="flex h-8 w-8 items-center justify-center rounded-md text-slate-500 transition hover:bg-white hover:text-indigo-600 group-hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-950 dark:hover:text-indigo-300 dark:group-hover:text-slate-200"
                  >
                    <FontAwesomeIcon icon={faGithub} />
                  </Link>
                )}
                {project.liveLink && (
                  <Link
                    href={project.liveLink}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`Open ${project.title}`}
                    className="flex h-8 w-8 items-center justify-center rounded-md text-slate-500 transition hover:bg-white hover:text-indigo-600 group-hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-950 dark:hover:text-indigo-300 dark:group-hover:text-slate-200"
                  >
                    <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
                  </Link>
                )}
              </div>
            </article>
          ))
        ) : (
          <div className="px-4 py-10 text-center text-sm text-slate-600 dark:text-slate-300">
            Projects will appear here once they are available.
          </div>
        )}
      </div>
    </section>
  );
}
