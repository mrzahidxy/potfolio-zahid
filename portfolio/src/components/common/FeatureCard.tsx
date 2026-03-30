import { faArrowUpRightFromSquare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import Link from "next/link";
import Image from "next/image";

type Props = {
  project: {
    description: string;
    img: string;
    technology: Array<string>;
    githubLink: string;
    liveLink: string;
    title: string;
    _id?: string;
  };
};

const FeatureCard: React.FC<Props> = ({ project }) => {
  return (
    <div className="group flex h-full flex-col overflow-hidden rounded-[30px] border border-slate-200/70 bg-white/85 shadow-[0_24px_60px_rgba(15,23,42,0.06)] backdrop-blur transition duration-300 hover:-translate-y-1 hover:shadow-[0_32px_80px_rgba(15,23,42,0.1)] dark:border-slate-800/80 dark:bg-slate-900/75">
      <div className="relative h-52 overflow-hidden border-b border-slate-200/70 bg-gradient-to-br from-slate-100 via-white to-slate-100 sm:h-60 md:h-64 dark:border-slate-800/80 dark:from-slate-800 dark:via-slate-900 dark:to-slate-800">
        {project.img ? (
          <Image
            width={800}
            height={800}
            src={project.img}
            alt={`${project.title} preview`}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-lg font-semibold text-slate-300 dark:text-slate-500">
            Image coming soon
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/15 via-transparent to-transparent" />
      </div>

      <div className="flex flex-1 flex-col gap-5 p-5 sm:p-6 md:gap-6 md:p-7">
        <div className="flex min-h-[42px] flex-wrap gap-2">
          {project?.technology?.map((tech: string) => (
            <span
              key={tech}
              className="rounded-full border border-slate-200/80 bg-slate-50/90 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-700 transition duration-200 hover:border-slate-300 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:hover:border-slate-600 dark:hover:bg-slate-700/80"
            >
              {tech}
            </span>
          ))}
        </div>

        <div className="space-y-3">
          <h2 className="text-[19px] font-semibold tracking-tight text-slate-950 dark:text-slate-50 sm:text-xl">
            {project.title}
          </h2>
          <p className="text-[14px] leading-7 text-slate-600 dark:text-slate-300 sm:text-[15px] md:min-h-[126px]">
            {project.description}
          </p>
        </div>

        <div className="mt-auto flex flex-wrap items-center gap-3 border-t border-slate-200/70 pt-5 text-sm font-semibold dark:border-slate-800/80">
          {project.liveLink && (
            <Link
              href={project.liveLink}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-11 shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-full bg-slate-950 px-5 text-white shadow-[0_16px_30px_rgba(15,23,42,0.16)] transition duration-200 hover:-translate-y-[2px] hover:bg-slate-800 dark:bg-sky-400 dark:text-slate-950 dark:hover:bg-sky-300"
            >
              View Project
              <FontAwesomeIcon icon={faArrowUpRightFromSquare} className="text-xs" />
            </Link>
          )}

          {project.githubLink && (
            <Link
              href={project.githubLink}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-11 shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-full border border-slate-200/80 bg-white px-5 text-slate-700 shadow-sm transition duration-200 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 dark:border-slate-700 dark:bg-transparent dark:text-slate-200 dark:hover:border-slate-500 dark:hover:bg-slate-800 dark:hover:text-slate-50"
            >
              <FontAwesomeIcon icon={faGithub} />
              View Code
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default FeatureCard;
