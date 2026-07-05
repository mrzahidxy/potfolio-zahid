"use client";

import React, { useState } from "react";

import { Formik, Form, FormikHelpers } from "formik";
import * as Yup from "yup";
import emailjs from "emailjs-com";
import FormInput from "./common/FormInput";
import ContactInfo from "./common/ContatcInfo";
import type {
  ProfileContactContent,
  ProfileContactDetails,
  ProfileLinks,
} from "@/lib/profile-types";
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

interface ContactProps {
  contactDetails: ProfileContactDetails;
  links: ProfileLinks;
  content: ProfileContactContent;
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

const Contact: React.FC<ContactProps> = ({
  contactDetails,
  links,
  content,
}) => {
  const [isFormSubmitted, setIsFormSubmitted] = useState<boolean>(false);
  const [formError, setFormError] = useState<string | null>(null);
  const quickActions = [
    {
      href: `mailto:${contactDetails.email}`,
      label: content.email_action_label,
      primary: true,
    },
    {
      href: links.linkedin,
      label: content.linkedin_action_label,
    },
    {
      href: links.github,
      label: content.github_action_label,
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

      const templateParams: Record<string, unknown> = { ...values };
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        templateParams,
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
    <section
      id="contact"
      className="relative scroll-mt-32 px-4 py-16 sm:scroll-mt-28 md:px-6 md:py-20 lg:px-8"
    >
      <div className="container max-w-6xl space-y-6 md:space-y-8">
        <Reveal className="space-y-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">
            {content.eyebrow_label}
          </p>
          <h2 className="text-3xl font-semibold tracking-tight text-slate-950 dark:text-slate-50 sm:text-4xl">
            {content.heading}
          </h2>
          <p className="max-w-2xl text-[14px] leading-7 text-slate-600 dark:text-slate-300 sm:text-[15px]">
            {content.intro}
          </p>
        </Reveal>


        <div className="grid items-stretch gap-4 md:gap-5 xl:grid-cols-[0.9fr,1.1fr]">
          <Reveal delayMs={70} className="h-full">
            <div className="relative h-full overflow-hidden rounded-[24px] bg-slate-950 p-5 text-slate-100 shadow-[0_22px_60px_rgba(15,23,42,0.16)] sm:p-6">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(56,189,248,0.18),transparent_40%),radial-gradient(circle_at_80%_0%,rgba(59,130,246,0.15),transparent_35%)]" />
              <div className="relative flex h-full flex-col space-y-5">
                <div className="space-y-2">
                  <p className="text-[10px] uppercase tracking-[0.26em] text-sky-200/70">
                    {content.details_eyebrow_label}
                  </p>
                  <h3 className="text-lg font-semibold">
                    {content.details_heading}
                  </h3>
                  <p className="text-[13px] leading-6 text-slate-200/82 sm:text-[14px]">
                    {content.details_intro}
                  </p>
                </div>

                <div className="space-y-2.5 border-t border-white/10 pt-5">
                  {[
                    { icon: "/icon/email.png", text: contactDetails.email },
                    { icon: "/icon/phone.png", text: contactDetails.phone },
                    { icon: "/icon/address.png", text: contactDetails.address },
                  ].map((info) => (
                    <div
                      key={info.text}
                      className="rounded-[18px] border border-white/10 bg-white/[0.04] p-3"
                    >
                      <ContactInfo icon={info.icon} text={info.text} />
                    </div>
                  ))}
                </div>

                <div className="space-y-2.5 border-t border-white/10 pt-5">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.26em] text-sky-200/70">
                    {content.quick_links_label}
                  </p>
                  <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
                    {quickActions.map((action) => (
                      <a
                        key={action.label}
                        href={action.href}
                        target={
                          action.href.startsWith("mailto:") ? undefined : "_blank"
                        }
                        rel={
                          action.href.startsWith("mailto:")
                            ? undefined
                            : "noreferrer"
                        }
                        className={
                          action.primary
                            ? "inline-flex h-9 items-center justify-center rounded-full bg-sky-400 px-3.5 text-[13px] font-semibold text-slate-950 shadow-[0_12px_24px_rgba(56,189,248,0.22)] transition duration-200 hover:-translate-y-[1px] hover:bg-sky-300"
                            : "inline-flex h-9 items-center justify-center rounded-full border border-white/15 bg-white/5 px-3.5 text-[13px] font-semibold text-white transition duration-200 hover:-translate-y-px hover:border-white/30 hover:bg-white/10"
                        }
                      >
                        {action.label}
                      </a>
                    ))}
                  </div>
                  <p className="text-[12px] leading-5 text-slate-300/82">
                    {content.quick_links_note}
                  </p>
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal delayMs={110} className="h-full">
            <div className="h-full rounded-[24px] border border-slate-200/70 bg-white/85 p-5 shadow-[0_18px_45px_rgba(15,23,42,0.05)] backdrop-blur sm:p-6 dark:border-slate-800/80 dark:bg-slate-900/75">
              <div className="mb-5 space-y-2">
                <p className="text-[10px] font-semibold uppercase tracking-[0.26em] text-slate-500 dark:text-slate-400">
                  {content.form_eyebrow_label}
                </p>
                <h3 className="text-xl font-semibold tracking-tight text-slate-950 dark:text-slate-50">
                  {content.form_heading}
                </h3>
                <p className="text-[13px] leading-6 text-slate-600 dark:text-slate-300 sm:text-[14px]">
                  {content.form_intro}
                </p>
              </div>
              <Formik
                initialValues={initialValues}
                onSubmit={handleSubmit}
                validationSchema={validationSchema}
              >
                {({ isSubmitting }) => (
                  <Form id="email-form" className="space-y-4">
                    <div className="grid gap-3 sm:gap-4 md:grid-cols-2">
                      {formFields.map((data, index) => {
                        const isMessage = data.id === "message";
                        return (
                          <div
                            key={index}
                            className={isMessage ? "md:col-span-2" : ""}
                          >
                            <label
                              htmlFor={data.id}
                              className="mb-2 block text-[13px] font-semibold text-slate-700 dark:text-slate-200"
                            >
                              {data.label}
                            </label>
                            <FormInput
                              type={data.type}
                              id={data.id}
                              name={data.name}
                              placeholder={data.placeholder}
                              as={isMessage ? "textarea" : "input"}
                              rows={isMessage ? 4 : undefined}
                              className={
                                isMessage ? "min-h-[112px] resize-none" : ""
                              }
                            />
                          </div>
                        );
                      })}
                    </div>

                    <div className="w-full">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full rounded-full bg-sky-400 px-5 py-3 text-sm font-semibold text-slate-900 shadow-md shadow-sky-500/25 transition duration-200 hover:-translate-y-[1px] hover:bg-sky-300 disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0 disabled:hover:bg-sky-400"
                      >
                        {isSubmitting
                          ? "Sending..."
                          : content.submit_button_label}
                      </button>
                    </div>

                    {formError && (
                      <div className="rounded-[18px] border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-300">
                        {formError}
                      </div>
                    )}

                    {isFormSubmitted && !formError && (
                      <div className="rounded-[18px] border border-sky-200 bg-sky-50 px-4 py-3 text-sm font-semibold text-sky-700 dark:border-sky-900/60 dark:bg-sky-950/30 dark:text-sky-300">
                        {content.success_message}
                      </div>
                    )}
                  </Form>
                )}
              </Formik>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
};

export default Contact;
