"use client";

import React, { useState } from "react";

import { Formik, Form, FormikHelpers } from "formik";
import * as Yup from "yup";
import emailjs from "emailjs-com";
import FormInput from "./common/FormInput";
import ContactInfo from "./common/ContatcInfo";
import SocialLink from "./common/SocialLink";
import profile from "@/data/profile.json";

interface FormValues {
  name: string;
  subject: string;
  email: string;
  message: string;
}

const formFields = [
  { type: "text", id: "name", name: "name", placeholder: "Name..." },
  { type: "text", id: "subject", name: "subject", placeholder: "Subject..." },
  { type: "text", id: "email", name: "email", placeholder: "Email..." },
  { type: "text", id: "message", name: "message", placeholder: "Message..." },
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
      className="bg-white px-4 py-14 md:px-6 lg:px-8 dark:bg-slate-900"
    >
      <div className="container max-w-5xl space-y-8">
        <div className="text-center space-y-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-500">
            Contact
          </p>
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-50 sm:text-3xl">
            Let&apos;s Work Together
          </h2>
          <p className="mx-auto max-w-2xl text-[15px] leading-7 text-slate-600 dark:text-slate-200">
            Have a project in mind? Drop me a message and let&apos;s create something
            remarkable together.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr,1.05fr]">
          <div className="relative overflow-hidden rounded-2xl bg-slate-900 p-5 text-slate-100 shadow-md">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(56,189,248,0.18),transparent_40%),radial-gradient(circle_at_80%_0%,rgba(59,130,246,0.15),transparent_35%)]" />
            <div className="relative space-y-6">
              <div className="space-y-2">
                <p className="text-[11px] uppercase tracking-[0.28em] text-sky-200/70">
                  Get in Touch
                </p>
                <h3 className="text-xl font-semibold">Let&apos;s discuss your project</h3>
                <p className="text-[13px] text-slate-200/80 leading-6">
                  I’m always open to new opportunities, collaborations, and ambitious
                  ideas.
                </p>
              </div>

              <div className="space-y-2.5">
                {[
                  { icon: "/icon/email.png", text: contactDetails.email },
                  { icon: "/icon/phone.png", text: contactDetails.phone },
                  { icon: "/icon/address.png", text: contactDetails.address },
                ].map((info) => (
                  <div
                    key={info.text}
                    className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3"
                  >
                    <ContactInfo icon={info.icon} text={info.text} />
                  </div>
                ))}
              </div>

              <div className="pt-2">
                <h4 className="text-xs font-semibold uppercase tracking-[0.3em] text-sky-200/70">
                  Connect with me
                </h4>
                <div className="mt-3 flex items-center gap-3">
                  {socialLinks.map((social) => (
                    <div
                      key={social.href}
                      className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/10 backdrop-blur transition hover:border-sky-200/40 hover:bg-white/20"
                    >
                      <SocialLink {...social} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white/90 p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800">
            <Formik
              initialValues={initialValues}
              onSubmit={handleSubmit}
              validationSchema={validationSchema}
            >
              <Form id="email-form" className="space-y-5">
                <div className="grid gap-4 md:grid-cols-2">
                  {formFields.map((data, index) => {
                    const isMessage = data.id === "message";
                    return (
                      <div key={index} className={isMessage ? "md:col-span-2" : ""}>
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
                    className="w-full rounded-full bg-sky-400 px-6 py-3 text-sm font-semibold text-slate-900 shadow-lg shadow-sky-500/30 transition hover:-translate-y-[1px] hover:bg-sky-300"
                  >
                    Send Message
                  </button>
                </div>

                {isFormSubmitted && (
                  <div className="text-sky-600 font-semibold">
                    Thank you! I will contact you soon.
                  </div>
                )}
              </Form>
            </Formik>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
