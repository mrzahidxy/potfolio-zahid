"use client";

import React, { useState } from "react";

import { Formik, Form, FormikHelpers } from "formik";
import * as Yup from "yup";
import emailjs from "emailjs-com";
import FormInput from "./common/FormInput";
import ContactInfo from "./common/ContatcInfo";
import SocialLink from "./common/SocialLink";
import profile from "@/data/profile.json";
import Reveal from "./common/Reveal";

interface FormValues {
  name: string;
  subject: string;
  email: string;
  message: string;
}

const formFields = [
  {
    label: "Name",
    type: "text",
    id: "name",
    name: "name",
    placeholder: "Your name",
  },
  {
    label: "Project / Role",
    type: "text",
    id: "subject",
    name: "subject",
    placeholder: "Project, role, or collaboration",
  },
  {
    label: "Email",
    type: "email",
    id: "email",
    name: "email",
    placeholder: "Your email",
  },
  {
    label: "Brief",
    type: "text",
    id: "message",
    name: "message",
    placeholder: "What are you building, and where do you need help?",
  },
];

const Contact: React.FC = () => {
  const [isFormSubmitted, setIsFormSubmitted] = useState<boolean>(false);
  const contactDetails = profile.personal_details.contact;
  const socialLinks = [
    {
      href: profile.personal_details.links.linkedin,
      icon: "/icon/linkedin.png",
      alt: "linkedin-link",
    },
    {
      href: profile.personal_details.links.github,
      icon: "/icon/github.png",
      alt: "github-link",
    },
  ];
  const quickActions = [
    {
      href: `mailto:${contactDetails.email}`,
      label: "Email Me",
      primary: true,
    },
    {
      href: profile.personal_details.links.linkedin,
      label: "LinkedIn",
    },
    {
      href: profile.personal_details.links.github,
      label: "GitHub",
    },
  ];
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
    _values: FormValues,
    { resetForm }: FormikHelpers<FormValues>
  ) => {
    try {
      await emailjs.sendForm(
        "service_22y98hx",
        "template_t42a7dm",
        "email-form",
        "IiyX8JA0nQvOYICjB"
      );
      setIsFormSubmitted(true);
      resetForm();
    } catch (error) {
      alert(error);
    }
  };

  return (
    <section
      id="contact"
      className="relative scroll-mt-28 px-4 py-20 md:px-6 md:py-24 lg:px-8"
    >
      <div className="container max-w-6xl space-y-8 md:space-y-10">
        <Reveal className="space-y-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">
            Contact
          </p>
          <h2 className="text-3xl font-semibold tracking-tight text-slate-950 dark:text-slate-50 sm:text-4xl">
            Start a conversation.
          </h2>
          <p className="max-w-2xl text-[15px] leading-7 text-slate-600 dark:text-slate-300 sm:text-base sm:leading-8">
            If you have a role, project, or collaboration in mind, send a short note.
          </p>
        </Reveal>

        <Reveal delayMs={70}>
          <div className="relative overflow-hidden rounded-[34px] bg-slate-950 p-6 text-slate-100 shadow-[0_32px_90px_rgba(15,23,42,0.18)] sm:p-8 md:p-10">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(56,189,248,0.18),transparent_32%),radial-gradient(circle_at_80%_0%,rgba(59,130,246,0.14),transparent_30%)]" />
            <div className="relative grid gap-6 md:gap-8 lg:grid-cols-[1.1fr,0.9fr] lg:items-stretch">
              <div className="space-y-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-sky-200/70">
                  What I Can Help With
                </p>
                <h3 className="max-w-2xl text-2xl font-semibold tracking-tight text-white sm:text-3xl md:text-4xl">
                  Open to product roles, freelance work, and focused builds that need thoughtful execution.
                </h3>
                <p className="max-w-2xl text-[15px] leading-7 text-slate-200/84 sm:text-[16px] sm:leading-8">
                  A short note on the role, product, timeline, or scope is enough to get started.
                </p>
              </div>

              <div className="rounded-[28px] border border-white/10 bg-white/[0.05] p-4 backdrop-blur sm:p-5">
                <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-sky-200/70">
                  Quick Links
                </p>
                <div className="flex flex-wrap gap-3">
                  {quickActions.map((action) => (
                    <a
                      key={action.label}
                      href={action.href}
                      target={action.href.startsWith("mailto:") ? undefined : "_blank"}
                      rel={action.href.startsWith("mailto:") ? undefined : "noreferrer"}
                      className={
                        action.primary
                          ? "inline-flex h-11 items-center rounded-full bg-sky-400 px-5 text-sm font-semibold text-slate-950 shadow-[0_18px_40px_rgba(56,189,248,0.28)] transition duration-200 hover:-translate-y-[1px] hover:bg-sky-300"
                          : "inline-flex h-11 items-center rounded-full border border-white/15 bg-white/5 px-5 text-sm font-semibold text-white transition duration-200 hover:-translate-y-px hover:border-white/30 hover:bg-white/10"
                      }
                    >
                      {action.label}
                    </a>
                  ))}
                </div>
                <p className="mt-4 text-[14px] leading-7 text-slate-300/82 sm:text-[15px]">
                  Use whichever channel is easiest.
                </p>
              </div>
            </div>
          </div>
        </Reveal>

        <div className="grid items-stretch gap-5 md:gap-6 xl:grid-cols-[0.96fr,1.04fr]">
          <Reveal delayMs={110}>
            <div className="relative overflow-hidden rounded-[32px] bg-slate-950 p-6 text-slate-100 shadow-[0_30px_80px_rgba(15,23,42,0.18)] sm:p-7 md:p-8">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(56,189,248,0.18),transparent_40%),radial-gradient(circle_at_80%_0%,rgba(59,130,246,0.15),transparent_35%)]" />
              <div className="relative flex h-full flex-col space-y-7">
                <div className="space-y-3">
                  <p className="text-[11px] uppercase tracking-[0.28em] text-sky-200/70">
                    Contact Details
                  </p>
                  <h3 className="text-xl font-semibold">
                    Reach me directly
                  </h3>
                  <p className="text-[14px] leading-7 text-slate-200/82 sm:text-[15px]">
                    Email, phone, location, and profile links.
                  </p>
                </div>

                <div className="space-y-3.5 border-t border-white/10 pt-6">
                  {[
                    { icon: "/icon/email.png", text: contactDetails.email },
                    { icon: "/icon/phone.png", text: contactDetails.phone },
                    { icon: "/icon/address.png", text: contactDetails.address },
                  ].map((info) => (
                    <div
                      key={info.text}
                      className="rounded-[22px] border border-white/10 bg-white/[0.04] p-4"
                    >
                      <ContactInfo icon={info.icon} text={info.text} />
                    </div>
                  ))}
                </div>

                <div className="pt-1">
                  <h4 className="text-xs font-semibold uppercase tracking-[0.3em] text-sky-200/70">
                    Profiles
                  </h4>
                  <div className="mt-3 flex items-center gap-3">
                    {socialLinks.map((social) => (
                      <div
                        key={social.href}
                        className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/10 backdrop-blur transition duration-200 hover:-translate-y-[1px] hover:border-sky-200/40 hover:bg-white/20"
                      >
                        <SocialLink {...social} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal delayMs={150}>
            <div className="rounded-[32px] border border-slate-200/70 bg-white/85 p-6 shadow-[0_24px_60px_rgba(15,23,42,0.06)] backdrop-blur sm:p-7 md:p-8 dark:border-slate-800/80 dark:bg-slate-900/75">
              <div className="mb-7 space-y-3">
                <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">
                  Project Brief
                </p>
                <h3 className="text-2xl font-semibold tracking-tight text-slate-950 dark:text-slate-50">
                  Send a short brief
                </h3>
                <p className="text-[14px] leading-7 text-slate-600 dark:text-slate-300 sm:text-[15px]">
                  Share the context and what you need help with so I can reply with the right next step.
                </p>
              </div>
              <Formik
                initialValues={initialValues}
                onSubmit={handleSubmit}
                validationSchema={validationSchema}
              >
                <Form id="email-form" className="space-y-6">
                  <div className="grid gap-5 md:grid-cols-2">
                    {formFields.map((data, index) => {
                      const isMessage = data.id === "message";
                      return (
                        <div key={index} className={isMessage ? "md:col-span-2" : ""}>
                          <label
                            htmlFor={data.id}
                            className="mb-2.5 block text-sm font-semibold text-slate-700 dark:text-slate-200"
                          >
                            {data.label}
                          </label>
                          <FormInput
                            type={data.type}
                            id={data.id}
                            name={data.name}
                            placeholder={data.placeholder}
                            as={isMessage ? "textarea" : "input"}
                            rows={isMessage ? 5 : undefined}
                            className={isMessage ? "min-h-[140px] resize-none" : ""}
                          />
                        </div>
                      );
                    })}
                  </div>

                  <div className="w-full">
                    <button
                      type="submit"
                      className="w-full rounded-full bg-sky-400 px-6 py-3.5 text-sm font-semibold text-slate-900 shadow-lg shadow-sky-500/30 transition duration-200 hover:-translate-y-[1px] hover:bg-sky-300"
                    >
                      Send Brief
                    </button>
                  </div>

                  {isFormSubmitted && (
                    <div className="rounded-[18px] border border-sky-200 bg-sky-50 px-4 py-3 text-sm font-semibold text-sky-700 dark:border-sky-900/60 dark:bg-sky-950/30 dark:text-sky-300">
                      Thanks. I&apos;ve received your message and will get back to you soon.
                    </div>
                  )}
                </Form>
              </Formik>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
};

export default Contact;
