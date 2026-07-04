import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFolder } from "@fortawesome/free-solid-svg-icons";
import type { PublicProfileData } from "@/lib/profile-types";

interface OSContactContentProps {
  profile: PublicProfileData;
}

export default function OSContactContent({ profile }: OSContactContentProps) {
  return (
    <section id="contact" className="space-y-5">
      <div>
        <p className="font-mono text-xs font-semibold uppercase tracking-[0.24em] text-indigo-600 dark:text-indigo-300">
          Contact
        </p>
        <h2 className="mt-2 text-2xl font-bold text-slate-950 dark:text-white">
          {profile.content.contact.heading}
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-300">
          {profile.content.contact.intro}
        </p>
      </div>

      <div className="grid grid-cols-3 gap-4 sm:max-w-md">
        {[
          {
            name: "Email",
            href: `mailto:${profile.personal_details.contact.email}`,
          },
          {
            name: "LinkedIn",
            href: profile.personal_details.links.linkedin,
          },
          {
            name: "GitHub",
            href: profile.personal_details.links.github,
          },
        ].map((item) => (
          <Link
            key={item.name}
            href={item.href}
            target={item.name === "Email" ? undefined : "_blank"}
            rel={item.name === "Email" ? undefined : "noreferrer"}
            aria-label={`Open ${item.name}`}
            className="group flex flex-col items-center gap-2 rounded-md p-2 text-center outline-none transition hover:bg-sky-50/80 focus-visible:bg-sky-50/80 focus-visible:ring-2 focus-visible:ring-indigo-300 dark:hover:bg-slate-800/70 dark:focus-visible:bg-slate-800/70"
          >
            <span className="flex h-14 w-16 items-center justify-center rounded-md bg-amber-400 text-amber-900 shadow-sm ring-1 ring-amber-500/30 transition group-hover:-translate-y-0.5 group-hover:shadow-md">
              <FontAwesomeIcon icon={faFolder} className="text-3xl" />
            </span>
            <span className="max-w-full truncate text-xs font-semibold text-slate-800 dark:text-slate-100">
              {item.name}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
