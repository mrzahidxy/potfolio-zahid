"use client";

import { ChangeEvent, FormEvent, useCallback, useEffect, useState } from "react";
import Link from "next/link";
import DefaultLoader from "@/components/common/DefaultLoader";
import { useAxiosWithAuth } from "@/helper/request-method";
import {
  adminProfileSchema,
  aboutParagraphsFromText,
  defaultAdminProfileFormValues,
  introHighlightsFromText,
  toAdminProfileFormValues,
  type AdminProfileFormValues,
  type AdminProfilePayload,
} from "@/lib/profile-admin";

interface ProfileResponse {
  success: boolean;
  message?: string;
  data: AdminProfilePayload;
  errors?: Record<string, string[] | undefined>;
}

type FieldErrors = Partial<Record<keyof AdminProfileFormValues, string>>;

const mapErrors = (errors?: Record<string, string[] | undefined>): FieldErrors => ({
  name: errors?.name?.[0],
  title: errors?.title?.[0],
  bio: errors?.bio?.[0],
  introAvailabilityAvailable: errors?.introAvailabilityAvailable?.[0],
  introAvailabilityUnavailable: errors?.introAvailabilityUnavailable?.[0],
  introHeadline: errors?.introHeadline?.[0],
  introHighlightsText: errors?.introHighlights?.[0],
  aboutParagraphsText: errors?.aboutParagraphs?.[0],
  aboutHeading: errors?.aboutHeading?.[0],
  aboutIntro: errors?.aboutIntro?.[0],
  aboutBasedInLabel: errors?.aboutBasedInLabel?.[0],
  aboutSkillsHeading: errors?.aboutSkillsHeading?.[0],
  aboutSkillsIntro: errors?.aboutSkillsIntro?.[0],
  email: errors?.email?.[0],
  phone: errors?.phone?.[0],
  location: errors?.location?.[0],
  linkedin: errors?.linkedin?.[0],
  github: errors?.github?.[0],
  website: errors?.website?.[0],
  contactHeading: errors?.contactHeading?.[0],
  contactIntro: errors?.contactIntro?.[0],
  contactBannerHeading: errors?.contactBannerHeading?.[0],
  contactBannerIntro: errors?.contactBannerIntro?.[0],
  contactQuickLinksNote: errors?.contactQuickLinksNote?.[0],
  contactDetailsHeading: errors?.contactDetailsHeading?.[0],
  contactDetailsIntro: errors?.contactDetailsIntro?.[0],
  contactFormHeading: errors?.contactFormHeading?.[0],
  contactFormIntro: errors?.contactFormIntro?.[0],
  contactSuccessMessage: errors?.contactSuccessMessage?.[0],
});

export default function ProfileForm() {
  const api = useAxiosWithAuth();
  const [formData, setFormData] = useState<AdminProfileFormValues>(
    defaultAdminProfileFormValues
  );
  const [errors, setErrors] = useState<FieldErrors>({});
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  const loadProfile = useCallback(async () => {
    try {
      setLoading(true);
      setLoadError(null);
      const response = await api.get<ProfileResponse>("/admin/profile");
      setFormData(toAdminProfileFormValues(response.data.data));
    } catch (error) {
      setLoadError(getApiError(error, "Failed to load profile content."));
    } finally {
      setLoading(false);
    }
  }, [api]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleToggleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      availableForOpportunities: event.target.checked,
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrors({});
    setSubmitResult(null);
    setIsSubmitting(true);

    const parsed = adminProfileSchema.safeParse({
      ...formData,
      aboutParagraphs: aboutParagraphsFromText(formData.aboutParagraphsText),
      introHighlights: introHighlightsFromText(formData.introHighlightsText),
    });

    if (!parsed.success) {
      setErrors(mapErrors(parsed.error.flatten().fieldErrors));
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await api.put<ProfileResponse>(
        "/admin/profile",
        parsed.data
      );
      setFormData(toAdminProfileFormValues(response.data.data));
      setSubmitResult({
        success: true,
        message: response.data.message ?? "Profile content updated successfully.",
      });
    } catch (error: any) {
      const fieldErrors = error?.response?.data?.errors as
        | Record<string, string[] | undefined>
        | undefined;

      if (fieldErrors) {
        setErrors(mapErrors(fieldErrors));
      }

      setSubmitResult({
        success: false,
        message: getApiError(error, "Failed to update profile content."),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <DefaultLoader />;
  }

  if (loadError) {
    return (
      <div className="rounded-2xl border border-red-500/40 bg-red-500/10 p-6 text-red-700 dark:text-red-200">
        <p className="font-semibold">{loadError}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={loadProfile}
            className="rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-500"
          >
            Retry
          </button>
          <Link
            href="/admin"
            className="rounded-full border border-red-500/40 px-4 py-2 text-sm font-semibold transition hover:border-red-400"
          >
            Back to dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900/60">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-slate-500">
            Profile
          </p>
          <h1 className="text-xl font-semibold text-slate-900 dark:text-white">
            Manage Profile Content
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Update the high-frequency details used across the homepage and contact
            sections.
          </p>
        </div>
        <Link
          href="/admin"
          className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:border-slate-500 dark:hover:text-white"
        >
          Back to dashboard
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="mt-6 space-y-6">
        <section className="space-y-5 rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-950/40">
          <div className="space-y-1">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
              Personal Info
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Core identity used across the homepage.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Field
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              error={errors.name}
            />
            <Field
              label="Job Title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              error={errors.title}
            />
            <TextareaField
              label="Professional Bio"
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              error={errors.bio}
              className="md:col-span-2"
              rows={4}
            />
          </div>
        </section>

        <section className="space-y-5 rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-950/40">
          <div className="space-y-1">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
              Hero
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Main hero copy and supporting highlight text.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Field
              label="Available Status Text"
              name="introAvailabilityAvailable"
              value={formData.introAvailabilityAvailable}
              onChange={handleChange}
              error={errors.introAvailabilityAvailable}
            />
            <Field
              label="Unavailable Status Text"
              name="introAvailabilityUnavailable"
              value={formData.introAvailabilityUnavailable}
              onChange={handleChange}
              error={errors.introAvailabilityUnavailable}
            />
            <TextareaField
              label="Hero Headline"
              name="introHeadline"
              value={formData.introHeadline}
              onChange={handleChange}
              error={errors.introHeadline}
              className="md:col-span-2"
              rows={3}
            />
            <TextareaField
              label="Hero Highlights"
              name="introHighlightsText"
              value={formData.introHighlightsText}
              onChange={handleChange}
              error={errors.introHighlightsText}
              className="md:col-span-2"
              rows={4}
              hint="Use one highlight per line."
            />
          </div>
        </section>

        <section className="space-y-5 rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-950/40">
          <div className="space-y-1">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
              About
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Update the longer context shown in the About section.
            </p>
          </div>

          <div className="grid gap-4">
            <Field
              label="About Heading"
              name="aboutHeading"
              value={formData.aboutHeading}
              onChange={handleChange}
              error={errors.aboutHeading}
            />
            <TextareaField
              label="About Intro"
              name="aboutIntro"
              value={formData.aboutIntro}
              onChange={handleChange}
              error={errors.aboutIntro}
              rows={3}
            />
            <TextareaField
              label="About Paragraphs"
              name="aboutParagraphsText"
              value={formData.aboutParagraphsText}
              onChange={handleChange}
              error={errors.aboutParagraphsText}
              rows={8}
              hint="Separate paragraphs with a blank line."
            />
            <Field
              label="Based In Label"
              name="aboutBasedInLabel"
              value={formData.aboutBasedInLabel}
              onChange={handleChange}
              error={errors.aboutBasedInLabel}
            />
            <Field
              label="Skills Heading"
              name="aboutSkillsHeading"
              value={formData.aboutSkillsHeading}
              onChange={handleChange}
              error={errors.aboutSkillsHeading}
            />
            <TextareaField
              label="Skills Intro"
              name="aboutSkillsIntro"
              value={formData.aboutSkillsIntro}
              onChange={handleChange}
              error={errors.aboutSkillsIntro}
              rows={3}
            />

          </div>
        </section>

        <section className="space-y-5 rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-950/40">
          <div className="space-y-1">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
              Contact
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Contact details, links, and availability shown in the contact section.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Field
              label="Contact Heading"
              name="contactHeading"
              value={formData.contactHeading}
              onChange={handleChange}
              error={errors.contactHeading}
              className="md:col-span-2"
            />
            <TextareaField
              label="Contact Intro"
              name="contactIntro"
              value={formData.contactIntro}
              onChange={handleChange}
              error={errors.contactIntro}
              className="md:col-span-2"
              rows={3}
            />
            <Field
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
            />
            <Field
              label="Phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              error={errors.phone}
            />
            <Field
              label="Location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              error={errors.location}
            />
            <div className="flex items-center rounded-xl border border-slate-200 bg-white px-4 py-3 dark:border-slate-700 dark:bg-slate-900">
              <label className="flex w-full items-center justify-between gap-4 text-sm font-medium text-slate-700 dark:text-slate-200">
                <span>Available for opportunities</span>
                <input
                  type="checkbox"
                  checked={formData.availableForOpportunities}
                  onChange={handleToggleChange}
                  className="h-4 w-4 rounded border-slate-300 text-sky-500 focus:ring-sky-500"
                />
              </label>
            </div>
            <Field
              label="LinkedIn"
              name="linkedin"
              value={formData.linkedin}
              onChange={handleChange}
              error={errors.linkedin}
              className="md:col-span-2"
            />
            <Field
              label="GitHub"
              name="github"
              value={formData.github}
              onChange={handleChange}
              error={errors.github}
            />
            <Field
              label="Website"
              name="website"
              value={formData.website}
              onChange={handleChange}
              error={errors.website}
            />
            <TextareaField
              label="Banner Heading"
              name="contactBannerHeading"
              value={formData.contactBannerHeading}
              onChange={handleChange}
              error={errors.contactBannerHeading}
              className="md:col-span-2"
              rows={3}
            />
            <TextareaField
              label="Banner Intro"
              name="contactBannerIntro"
              value={formData.contactBannerIntro}
              onChange={handleChange}
              error={errors.contactBannerIntro}
              className="md:col-span-2"
              rows={3}
            />
            <TextareaField
              label="Quick Links Note"
              name="contactQuickLinksNote"
              value={formData.contactQuickLinksNote}
              onChange={handleChange}
              error={errors.contactQuickLinksNote}
              className="md:col-span-2"
              rows={2}
            />
            <Field
              label="Details Heading"
              name="contactDetailsHeading"
              value={formData.contactDetailsHeading}
              onChange={handleChange}
              error={errors.contactDetailsHeading}
            />
            <TextareaField
              label="Details Intro"
              name="contactDetailsIntro"
              value={formData.contactDetailsIntro}
              onChange={handleChange}
              error={errors.contactDetailsIntro}
              rows={3}
            />
            <Field
              label="Form Heading"
              name="contactFormHeading"
              value={formData.contactFormHeading}
              onChange={handleChange}
              error={errors.contactFormHeading}
            />
            <TextareaField
              label="Form Intro"
              name="contactFormIntro"
              value={formData.contactFormIntro}
              onChange={handleChange}
              error={errors.contactFormIntro}
              rows={3}
            />
            <TextareaField
              label="Success Message"
              name="contactSuccessMessage"
              value={formData.contactSuccessMessage}
              onChange={handleChange}
              error={errors.contactSuccessMessage}
              className="md:col-span-2"
              rows={2}
            />
          </div>
        </section>

        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          {submitResult ? (
            <div
              className={`rounded-xl border px-4 py-3 text-sm ${submitResult.success
                  ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/70 dark:bg-emerald-950/30 dark:text-emerald-300"
                  : "border-red-200 bg-red-50 text-red-700 dark:border-red-900/70 dark:bg-red-950/30 dark:text-red-300"
                }`}
            >
              {submitResult.message}
            </div>
          ) : (
            <div />
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center justify-center rounded-full bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100"
          >
            {isSubmitting ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}

function getApiError(error: unknown, fallback: string) {
  const response = (error as any)?.response?.data;
  return response?.error ?? response?.message ?? fallback;
}

function Field({
  label,
  name,
  value,
  onChange,
  error,
  type = "text",
  className = "",
}: {
  label: string;
  name: string;
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  type?: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <label
        htmlFor={name}
        className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200"
      >
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
      />
      {error ? <p className="mt-2 text-sm text-red-500">{error}</p> : null}
    </div>
  );
}

function TextareaField({
  label,
  name,
  value,
  onChange,
  error,
  rows,
  hint,
  className = "",
}: {
  label: string;
  name: string;
  value: string;
  onChange: (event: ChangeEvent<HTMLTextAreaElement>) => void;
  error?: string;
  rows: number;
  hint?: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <label
        htmlFor={name}
        className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200"
      >
        {label}
      </label>
      <textarea
        id={name}
        name={name}
        rows={rows}
        value={value}
        onChange={onChange}
        className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
      />
      {hint ? (
        <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">{hint}</p>
      ) : null}
      {error ? <p className="mt-2 text-sm text-red-500">{error}</p> : null}
    </div>
  );
}
