"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ErrorMessage, Field, Formik, Form, FormikHelpers } from "formik";
import * as Yup from "yup";
import emailjs from "emailjs-com";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowUpRightFromSquare,
  faEnvelope,
  faPaperPlane,
} from "@fortawesome/free-solid-svg-icons";
import { faGithub, faLinkedin } from "@fortawesome/free-brands-svg-icons";
import { usePublicProfile } from "@/context/PublicProfileContext";
import type {
  ProfileExperience,
  ProfileExperienceListResponse,
} from "@/lib/profile-types";
import type { Project, PublicProjectListResponse } from "@/lib/project-types";
import OSRetroGame from "./OSRetroGame";
import OSWindow from "./OSWindow";
import { useOSDesktop } from "./OSDesktopShell";

interface FormValues {
  name: string;
  subject: string;
  email: string;
  message: string;
}

const EMAILJS_SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
const EMAILJS_TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
const EMAILJS_PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;

const getEmailErrorMessage = (error: unknown): string => {
  const errorText =
    typeof error === "object" && error !== null && "text" in error
      ? String((error as { text?: unknown }).text ?? "")
      : typeof error === "object" && error !== null && "message" in error
        ? String((error as { message?: unknown }).message ?? "")
        : "";

  const normalizedText = errorText.toLowerCase();

  if (normalizedText.includes("service id not found")) {
    return "Email service is misconfigured. Please update NEXT_PUBLIC_EMAILJS_SERVICE_ID with a valid EmailJS service ID.";
  }
  if (normalizedText.includes("template id not found")) {
    return "Email template is misconfigured. Please update NEXT_PUBLIC_EMAILJS_TEMPLATE_ID with a valid EmailJS template ID.";
  }
  if (
    normalizedText.includes("public key is invalid") ||
    normalizedText.includes("user id is invalid")
  ) {
    return "Email public key is invalid. Please update NEXT_PUBLIC_EMAILJS_PUBLIC_KEY.";
  }

  return "Message could not be sent right now. Please try again in a moment.";
};

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
          fetch("/api/projects", { cache: "no-store" }),
          fetch("/api/experiences", { cache: "no-store" }),
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

  const windowActions = {
    onClose: closeActiveItem,
    onMinimize: closeActiveItem,
  };
  const defaultWindowClassName = "w-full min-w-[720px] min-h-[520px]";
  const initialValues: FormValues = {
    name: "",
    subject: "",
    email: "",
    message: "",
  };
  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .required("Name is required")
      .min(3, "Name must be at least 3 characters"),
    subject: Yup.string().required("Subject is required"),
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    message: Yup.string()
      .required("Message is required")
      .min(20, "Message must be at least 20 characters"),
  });
  const handleSubmit = async (
    values: FormValues,
    { resetForm, setSubmitting }: FormikHelpers<FormValues>,
  ) => {
    try {
      setFormError(null);
      setIsFormSubmitted(false);

      if (!EMAILJS_SERVICE_ID || !EMAILJS_TEMPLATE_ID || !EMAILJS_PUBLIC_KEY) {
        setFormError(
          "Email service is not configured. Set NEXT_PUBLIC_EMAILJS_SERVICE_ID, NEXT_PUBLIC_EMAILJS_TEMPLATE_ID, and NEXT_PUBLIC_EMAILJS_PUBLIC_KEY.",
        );
        return;
      }

      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        { ...values },
        EMAILJS_PUBLIC_KEY,
      );
      setIsFormSubmitted(true);
      resetForm();
    } catch (error) {
      setFormError(getEmailErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex h-full min-h-0 items-center justify-center overflow-auto py-6 pb-20 pt-6">
      <div className="w-full max-w-5xl shrink-0">
        {!activeItem && (
          <div
            className="h-full"
            aria-label="No open windows"
          />
        )}

        {activeItem === "about" && (
          <OSWindow
            title="About Me"
            className={`${defaultWindowClassName} max-w-5xl`}
            bodyClassName="overflow-auto p-5 sm:p-7"
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
            className={`${defaultWindowClassName} max-w-5xl`}
            bodyClassName="overflow-auto divide-y divide-slate-200 dark:divide-slate-800"
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
            className={`${defaultWindowClassName} max-w-5xl`}
            bodyClassName="overflow-auto divide-y divide-slate-200 dark:divide-slate-800"
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
            className={`${defaultWindowClassName} max-w-5xl`}
            bodyClassName="overflow-auto p-5"
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

        {activeItem === "mail" && (
          <OSWindow
            title="Mail"
            subtitle="Compose"
            className={defaultWindowClassName}
            bodyClassName="overflow-auto bg-[#f5f7fb] dark:bg-slate-950"
            {...windowActions}
          >
            <section
              id="ai-mail"
              className="min-h-[500px] bg-white text-slate-950 dark:bg-slate-900 dark:text-slate-50"
            >
              <div className="flex min-w-0 flex-col">
                <div className="flex min-h-12 items-center border-b border-slate-200 bg-white px-4 dark:border-slate-800 dark:bg-slate-900">
                  <div className="min-w-0">
                    <h2 className="truncate text-sm font-semibold text-slate-950 dark:text-white">
                      Compose Message
                    </h2>
                    <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                      From portfolio visitor to {profile.personal_details.name}
                    </p>
                  </div>
                </div>

                <Formik
                  initialValues={initialValues}
                  onSubmit={handleSubmit}
                  validationSchema={validationSchema}
                >
                  {({ isSubmitting }) => (
                    <Form
                      id="os-email-form"
                      className="flex flex-1 flex-col bg-white dark:bg-slate-900"
                    >
                      <div className="border-b border-slate-200 dark:border-slate-800">
                        <div className="grid min-h-10 grid-cols-[64px,minmax(0,1fr)] items-center px-4">
                          <label
                            htmlFor="os-mail-to"
                            className="text-sm font-semibold text-slate-500 dark:text-slate-400"
                          >
                            To
                          </label>
                          <input
                            id="os-mail-to"
                            type="email"
                            value={profile.personal_details.contact.email}
                            readOnly
                            className="min-w-0 bg-transparent text-sm font-medium text-slate-900 outline-none dark:text-slate-100"
                          />
                        </div>

                        <div className="grid min-h-10 grid-cols-[64px,minmax(0,1fr)] items-start border-t border-slate-100 px-4 py-2.5 dark:border-slate-800">
                          <label
                            htmlFor="os-mail-email"
                            className="pt-0.5 text-sm font-semibold text-slate-500 dark:text-slate-400"
                          >
                            From
                          </label>
                          <div>
                            <Field
                              id="os-mail-email"
                              name="email"
                              type="email"
                              placeholder="your.email@example.com"
                              className="w-full bg-transparent text-sm font-medium text-slate-900 outline-none placeholder:text-slate-400 dark:text-slate-100 dark:placeholder:text-slate-500"
                            />
                            <ErrorMessage
                              name="email"
                              component="div"
                              className="mt-1 text-xs font-medium text-red-600 dark:text-red-400"
                            />
                          </div>
                        </div>

                        <div className="grid min-h-10 grid-cols-[64px,minmax(0,1fr)] items-start border-t border-slate-100 px-4 py-2.5 dark:border-slate-800">
                          <label
                            htmlFor="os-mail-name"
                            className="pt-0.5 text-sm font-semibold text-slate-500 dark:text-slate-400"
                          >
                            Name
                          </label>
                          <div>
                            <Field
                              id="os-mail-name"
                              name="name"
                              type="text"
                              placeholder="Your name"
                              className="w-full bg-transparent text-sm font-medium text-slate-900 outline-none placeholder:text-slate-400 dark:text-slate-100 dark:placeholder:text-slate-500"
                            />
                            <ErrorMessage
                              name="name"
                              component="div"
                              className="mt-1 text-xs font-medium text-red-600 dark:text-red-400"
                            />
                          </div>
                        </div>

                        <div className="grid min-h-10 grid-cols-[64px,minmax(0,1fr)] items-start border-t border-slate-100 px-4 py-2.5 dark:border-slate-800">
                          <label
                            htmlFor="os-mail-subject"
                            className="pt-0.5 text-sm font-semibold text-slate-500 dark:text-slate-400"
                          >
                            Subject
                          </label>
                          <div>
                            <Field
                              id="os-mail-subject"
                              name="subject"
                              type="text"
                              placeholder="Project, role, or collaboration"
                              className="w-full bg-transparent text-sm font-medium text-slate-900 outline-none placeholder:text-slate-400 dark:text-slate-100 dark:placeholder:text-slate-500"
                            />
                            <ErrorMessage
                              name="subject"
                              component="div"
                              className="mt-1 text-xs font-medium text-red-600 dark:text-red-400"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-1 flex-col p-4">
                        <Field
                          id="os-mail-message"
                          name="message"
                          as="textarea"
                          rows={8}
                          placeholder="Write your message..."
                          className="min-h-[170px] flex-1 resize-none bg-transparent text-[15px] leading-7 text-slate-900 outline-none placeholder:text-slate-400 dark:text-slate-100 dark:placeholder:text-slate-500"
                        />
                        <ErrorMessage
                          name="message"
                          component="div"
                          className="mt-2 text-xs font-medium text-red-600 dark:text-red-400"
                        />
                      </div>

                      {(formError || isFormSubmitted) && (
                        <div className="px-4 pb-3">
                          {formError && (
                            <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-300">
                              {formError}
                            </div>
                          )}

                          {isFormSubmitted && !formError && (
                            <div className="rounded-md border border-sky-200 bg-sky-50 px-4 py-3 text-sm font-semibold text-sky-700 dark:border-sky-900/60 dark:bg-sky-950/30 dark:text-sky-300">
                              {profile.content.contact.success_message}
                            </div>
                          )}
                        </div>
                      )}

                      <div className="flex justify-end border-t border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-800 dark:bg-slate-950/70">
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-sky-500 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:bg-sky-500"
                        >
                          <FontAwesomeIcon
                            icon={faPaperPlane}
                            className="h-4 w-4"
                          />
                          {isSubmitting ? "Sending..." : "Send Message"}
                        </button>
                      </div>
                    </Form>
                  )}
                </Formik>
              </div>
            </section>
          </OSWindow>
        )}

        {activeItem === "game" && (
          <OSWindow
            title="Byte Run"
            subtitle="Retro game"
            className={`${defaultWindowClassName} max-h-[calc(100dvh-10rem)]`}
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
