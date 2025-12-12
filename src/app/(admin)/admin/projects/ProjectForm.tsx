"use client";

import React, { useState, FormEvent, ChangeEvent, useEffect } from "react";
import { z } from "zod";
import Link from "next/link";
import { useAxiosWithAuth } from "@/helper/request-method";
import { useRouter } from "next/navigation";

// Define the schema for form validation (excluding the file input)
const schema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  technology: z.string().min(1, "At least one technology is required"),
  githubLink: z.string().url("GitHub URL is required"),
  liveLink: z
    .string()
    .url("Invalid live link URL")
    .optional()
    .or(z.literal("")),
  img: z.string().optional().or(z.literal("")),
});

type FormData = z.infer<typeof schema>;

type props = {
  slug?: string;
};

export default function ProjectForm({ slug }: props) {
 const {push} = useRouter()
  const api = useAxiosWithAuth();
  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    technology: "",
    githubLink: "",
    liveLink: "",
    img: "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  // Fetch project details if slug is provided
  useEffect(() => {
    if (slug) {
      const getProject = async () => {
        try {
          const res = await api.get(`/admin/projects/${slug}`);
          setFormData({
            title: res.data.data.title,
            description: res.data.data.description,
            technology: res.data.data.technology.join(", "),
            githubLink: res.data.data.githubLink,
            liveLink: res.data.data.liveLink,
          });
          setImagePreview(res.data.data.img);
        } catch (error) {
          console.error("Error fetching project:", error);
        }
      };

      getProject();
    }
  }, [slug]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitResult(null);
    setErrors({});

    try {
      const validatedData = schema.parse(formData);

      const formDataToSend = new FormData();
      Object.entries(validatedData).forEach(([key, value]) => {
        formDataToSend.append(key, value);
      });


      // Append the image file if it exists
      if (imageFile) {
        formDataToSend.append("img", imageFile);
      }

      slug
        ? await api.put(`/admin/projects/${slug}`, formDataToSend, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          })
        : await api.post(`/admin/projects`, formDataToSend, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });

      setSubmitResult({
        success: true,
        message: "Project added successfully! Redirecting...",
      });

      setTimeout(() => {
        push("/admin/projects");
      }, 2000);
    } catch (error) {
      if (error instanceof z.ZodError) {
        setErrors(error.flatten().fieldErrors as Partial<FormData>);
      } else {
        setSubmitResult({
          success: false,
          message: (error as any)?.response?.data?.message,
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-lg dark:border-slate-800 dark:bg-slate-900/60">
      <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-slate-500">
            Project
          </p>
          <h1 className="text-xl font-semibold text-slate-900 dark:text-white">
            {slug ? "Edit Project" : "Add Project"}
          </h1>
        </div>
        <Link
          href="/admin/projects"
          className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:border-slate-500 dark:hover:text-white"
        >
          Back to list
        </Link>
      </div>
      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <FormField
          label="Title"
          id="title"
          value={formData.title}
          onChange={handleChange}
          error={errors.title}
        />

        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-slate-700 dark:text-slate-300"
          >
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-500 shadow-inner focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-500/30 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          ></textarea>
          {errors.description && (
            <p className="mt-1 text-sm text-red-300">
              {errors.description[0]}
            </p>
          )}
        </div>

        <FormField
            label="Technologies (comma-separated)"
            id="technology"
            value={formData.technology}
            onChange={handleChange}
            error={errors.technology}
            placeholder="React, Node.js, MongoDB"
          />

        <FormField
          label="GitHub Link"
          id="githubLink"
          value={formData.githubLink}
          onChange={handleChange}
          error={errors.githubLink}
        />

        <FormField
          label="Live Link (optional)"
          id="liveLink"
          value={formData.liveLink ?? ""}
          onChange={handleChange}
          error={errors.liveLink}
        />

        <div>
          <label
            htmlFor="img"
            className="block text-sm font-medium text-slate-300"
          >
            Project Image
          </label>
          <input
            type="file"
            id="img"
            name="img"
            onChange={handleImageChange}
            accept="image/*"
            className="mt-2 block w-full text-sm text-slate-700 file:mr-4 file:rounded-full file:border-0 file:bg-slate-100 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-slate-700 hover:file:bg-slate-200 dark:text-slate-300 dark:file:bg-slate-800 dark:file:text-slate-200 dark:hover:file:bg-slate-700"
          />

          {(imagePreview || imageFile) && (
            <div className="mt-4">
              <img
                src={imageFile ? URL.createObjectURL(imageFile) : imagePreview!}
                alt="Selected project preview"
            className="h-auto max-h-60 w-full rounded-lg object-cover ring-1 ring-slate-200 dark:ring-slate-800"
          />
        </div>
      )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-lg bg-sky-500 px-4 py-2 text-sm font-semibold text-slate-950 shadow-lg shadow-sky-500/30 transition hover:-translate-y-[1px] hover:bg-sky-400 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Submitting..." : slug ? "Update Project" : "Add Project"}
        </button>
      </form>

      {submitResult && (
        <div
          className={`mt-4 rounded-lg p-4 text-sm ${
            submitResult.success
              ? "border border-emerald-500/40 bg-emerald-500/10 text-emerald-100"
              : "border border-red-500/40 bg-red-500/10 text-red-200"
          }`}
        >
          <p className="font-semibold">
            {submitResult.success ? "Success" : "Error"}
          </p>
          <p>{submitResult.message}</p>
        </div>
      )}
    </div>
  );
}

function FormField({
  label,
  id,
  value,
  onChange,
  error,
  placeholder,
}: {
  label: string;
  id: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  error?: string | string[];
  placeholder?: string;
}) {
  const errorText = Array.isArray(error) ? error[0] : error;
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-sm font-medium text-slate-700 dark:text-slate-300"
      >
        {label}
      </label>
      <input
        type="text"
        id={id}
        name={id}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-500 shadow-inner focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-500/30 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
      />
      {errorText && <p className="mt-1 text-sm text-red-300">{errorText}</p>}
    </div>
  );
}
