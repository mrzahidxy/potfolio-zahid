"use client";

import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import DefaultLoader from "@/components/common/DefaultLoader";
import { useAxiosWithAuth } from "@/helper/request-method";
import {
  adminExperienceSchema,
  defaultAdminExperienceFormValues,
  experienceHighlightsFromText,
  toAdminExperienceFormValues,
  type AdminExperienceFormValues,
  type AdminExperiencePayload,
} from "@/lib/experience-admin";

interface ExperienceResponse {
  success: boolean;
  message?: string;
  data: AdminExperiencePayload & { id?: string };
  errors?: Record<string, string[] | undefined>;
}

type FieldErrors = Partial<Record<keyof AdminExperienceFormValues, string>>;

const mapErrors = (errors?: Record<string, string[] | undefined>): FieldErrors => ({
  role: errors?.role?.[0],
  company: errors?.company?.[0],
  period: errors?.period?.[0],
  location: errors?.location?.[0],
  summary: errors?.summary?.[0],
  highlightsText: errors?.highlights?.[0],
});

export default function ExperienceForm({ id }: { id?: string }) {
  const api = useAxiosWithAuth();
  const router = useRouter();
  const [formData, setFormData] = useState<AdminExperienceFormValues>(
    defaultAdminExperienceFormValues
  );
  const [errors, setErrors] = useState<FieldErrors>({});
  const [loading, setLoading] = useState(Boolean(id));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  useEffect(() => {
    if (!id) return;

    const loadExperience = async () => {
      try {
        const response = await api.get<ExperienceResponse>(`/admin/experiences/${id}`);
        setFormData(toAdminExperienceFormValues(response.data.data));
      } catch (error) {
        setSubmitResult({
          success: false,
          message: "Failed to load experience.",
        });
      } finally {
        setLoading(false);
      }
    };

    loadExperience();
  }, [api, id]);

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleToggleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, setAsCurrent: event.target.checked }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrors({});
    setSubmitResult(null);
    setIsSubmitting(true);

    const payload = {
      ...formData,
      highlights: experienceHighlightsFromText(formData.highlightsText),
    };

    const parsed = adminExperienceSchema.safeParse(payload);

    if (!parsed.success) {
      setErrors(mapErrors(parsed.error.flatten().fieldErrors));
      setIsSubmitting(false);
      return;
    }

    try {
      const response = id
        ? await api.put<ExperienceResponse>(`/admin/experiences/${id}`, parsed.data)
        : await api.post<ExperienceResponse>("/admin/experiences", parsed.data);

      setSubmitResult({
        success: true,
        message:
          response.data.message ??
          (id ? "Experience updated successfully." : "Experience added successfully."),
      });

      setTimeout(() => {
        router.push("/admin/experiences");
      }, 800);
    } catch (error: any) {
      const fieldErrors = error?.response?.data?.errors as
        | Record<string, string[] | undefined>
        | undefined;

      if (fieldErrors) {
        setErrors(mapErrors(fieldErrors));
      }

      setSubmitResult({
        success: false,
        message:
          error?.response?.data?.message ?? "Failed to save experience.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <DefaultLoader />;
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900/60">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-slate-500">
            Experience
          </p>
          <h1 className="text-xl font-semibold text-slate-900 dark:text-white">
            {id ? "Edit Experience" : "Add Experience"}
          </h1>
        </div>
        <Link
          href="/admin/experiences"
          className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:border-slate-500 dark:hover:text-white"
        >
          Back to list
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <Field
            label="Role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            error={errors.role}
          />
          <Field
            label="Company"
            name="company"
            value={formData.company}
            onChange={handleChange}
            error={errors.company}
          />
          <Field
            label="Employment Period"
            name="period"
            value={formData.period}
            onChange={handleChange}
            error={errors.period}
            className="md:col-span-2"
          />
          <Field
            label="Location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            error={errors.location}
            className="md:col-span-2"
          />
          <TextareaField
            label="Summary"
            name="summary"
            value={formData.summary}
            onChange={handleChange}
            error={errors.summary}
            className="md:col-span-2"
            rows={4}
          />
          <TextareaField
            label="Highlights"
            name="highlightsText"
            value={formData.highlightsText}
            onChange={handleChange}
            error={errors.highlightsText}
            className="md:col-span-2"
            rows={5}
            hint="Use one highlight per line."
          />
          <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 md:col-span-2 dark:border-slate-700 dark:bg-slate-900">
            <label className="flex w-full items-start justify-between gap-4 text-sm font-medium text-slate-700 dark:text-slate-200">
              <div className="space-y-1">
                <span className="block">Set as current role</span>
                <span className="block text-xs font-normal leading-5 text-slate-500 dark:text-slate-400">
                  Place this entry at the top of the experience list. Existing history stays intact.
                </span>
              </div>
              <input
                type="checkbox"
                checked={formData.setAsCurrent}
                onChange={handleToggleChange}
                className="mt-0.5 h-4 w-4 rounded border-slate-300 text-sky-500 focus:ring-sky-500"
              />
            </label>
          </div>
        </div>

        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          {submitResult ? (
            <div
              className={`rounded-xl border px-4 py-3 text-sm ${
                submitResult.success
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
            {isSubmitting ? "Saving..." : id ? "Update Experience" : "Add Experience"}
          </button>
        </div>
      </form>
    </div>
  );
}

function Field({
  label,
  name,
  value,
  onChange,
  error,
  className = "",
}: {
  label: string;
  name: string;
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  error?: string;
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
