import { ErrorMessage, Field, Form, Formik, type FormikHelpers } from "formik";
import * as Yup from "yup";
import emailjs from "emailjs-com";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import type { PublicProfileData } from "@/lib/profile-types";

interface FormValues {
  name: string;
  subject: string;
  email: string;
  message: string;
}

interface OSMailContentProps {
  profile: PublicProfileData;
  isFormSubmitted: boolean;
  formError: string | null;
  setIsFormSubmitted: (value: boolean) => void;
  setFormError: (value: string | null) => void;
}

const EMAILJS_SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
const EMAILJS_TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
const EMAILJS_PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;

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
  email: Yup.string().email("Invalid email address").required("Email is required"),
  message: Yup.string()
    .required("Message is required")
    .min(20, "Message must be at least 20 characters"),
});

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

export default function OSMailContent({
  profile,
  isFormSubmitted,
  formError,
  setIsFormSubmitted,
  setFormError,
}: OSMailContentProps) {
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
    <section
      id="ai-mail"
      className="flex h-full min-h-0 flex-col bg-white text-slate-950 dark:bg-slate-900 dark:text-slate-50"
    >
      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        <div className="flex min-h-10 items-center border-b border-slate-200 bg-white px-4 dark:border-slate-800 dark:bg-slate-900">
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
              className="flex min-h-0 flex-1 flex-col bg-white dark:bg-slate-900"
            >
              <div className="border-b border-slate-200 dark:border-slate-800">
                {[
                  ["To", "os-mail-to"],
                ].map(([label, id]) => (
                  <div
                    key={id}
                    className="grid min-h-8 grid-cols-[64px,minmax(0,1fr)] items-center px-4"
                  >
                    <label
                      htmlFor={id}
                      className="text-sm font-semibold text-slate-500 dark:text-slate-400"
                    >
                      {label}
                    </label>
                    <input
                      id={id}
                      type="email"
                      value={profile.personal_details.contact.email}
                      readOnly
                      className="min-w-0 bg-transparent text-sm font-medium text-slate-900 outline-none dark:text-slate-100"
                    />
                  </div>
                ))}

                {[
                  ["From", "email", "os-mail-email", "email", "your.email@example.com"],
                  ["Name", "name", "os-mail-name", "text", "Your name"],
                  ["Subject", "subject", "os-mail-subject", "text", "Project, role, or collaboration"],
                ].map(([label, name, id, type, placeholder]) => (
                  <div
                    key={name}
                    className="grid min-h-9 grid-cols-[64px,minmax(0,1fr)] items-start border-t border-slate-100 px-4 py-1.5 dark:border-slate-800"
                  >
                    <label
                      htmlFor={id}
                      className="pt-0.5 text-sm font-semibold text-slate-500 dark:text-slate-400"
                    >
                      {label}
                    </label>
                    <div>
                      <Field
                        id={id}
                        name={name}
                        type={type}
                        placeholder={placeholder}
                        className="w-full bg-transparent text-sm font-medium text-slate-900 outline-none placeholder:text-slate-400 dark:text-slate-100 dark:placeholder:text-slate-500"
                      />
                      <ErrorMessage
                        name={name}
                        component="div"
                        className="mt-1 text-xs font-medium text-red-600 dark:text-red-400"
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex min-h-0 flex-1 flex-col p-3">
                <Field
                  id="os-mail-message"
                  name="message"
                  as="textarea"
                  rows={8}
                  placeholder="Write your message..."
                  className="min-h-[96px] flex-1 resize-none bg-transparent text-sm leading-6 text-slate-900 outline-none placeholder:text-slate-400 dark:text-slate-100 dark:placeholder:text-slate-500"
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

              <div className="flex justify-end border-t border-slate-200 bg-slate-50 px-4 py-2 dark:border-slate-800 dark:bg-slate-950/70">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex h-9 items-center justify-center gap-2 rounded-md bg-sky-500 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:bg-sky-500"
                >
                  <FontAwesomeIcon icon={faPaperPlane} className="h-4 w-4" />
                  {isSubmitting ? "Sending..." : "Send Message"}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </section>
  );
}
