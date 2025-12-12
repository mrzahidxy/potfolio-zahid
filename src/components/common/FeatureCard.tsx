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
    <div className="group flex h-full flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-lg dark:border-slate-700 dark:bg-slate-800">
      <div className="relative h-36 overflow-hidden bg-slate-100 dark:bg-slate-700">
        {project.img ? (
          <Image
            width={800}
            height={800}
            src={project.img}
            alt=""
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-lg font-semibold text-slate-300">
            Image coming soon
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-slate-900/5" />
      </div>

      <div className="flex flex-1 flex-col gap-2 p-3.5">
        <div className="flex flex-wrap gap-2">
          {project?.technology?.map((tech: string) => (
            <span
              key={tech}
              className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-700 dark:bg-slate-700 dark:text-slate-100"
            >
              {tech}
            </span>
          ))}
        </div>

        <h2 className="text-[15px] font-semibold text-slate-900 dark:text-slate-50">{project.title}</h2>
        <p className="flex-1 text-[13px] leading-6 text-slate-600 dark:text-slate-200">
          {project.description}
        </p>

        <div className="flex flex-wrap items-center gap-3 text-sm font-semibold">
          {project.liveLink && (
            <Link
              href={project.liveLink}
            className="inline-flex items-center gap-2 rounded-full bg-sky-400 px-4 py-2 text-slate-900 shadow-md shadow-sky-500/30 transition hover:-translate-y-[2px] hover:bg-sky-300"
          >
            Live Demo
            <FontAwesomeIcon icon={faArrowUpRightFromSquare} className="text-xs" />
          </Link>
          )}

          {project.githubLink && (
            <Link
              href={project.githubLink}
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-3 py-2 text-slate-700 transition hover:border-slate-300 hover:text-slate-900 dark:border-slate-600 dark:text-slate-200 dark:hover:border-slate-400 dark:hover:text-slate-50"
            >
              <FontAwesomeIcon icon={faGithub} />
              Code
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default FeatureCard;
