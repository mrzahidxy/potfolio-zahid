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
    <div className="mt-32 max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold mb-4">Add Project</h1>
        <Link href="/admin/projects" className="text-blue-500 hover:underline">
          Project List
        </Link>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700"
          >
            Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="border p-2 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
          {errors.title && (
            <p className="text-red-500 text-sm mt-1">{errors.title}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700"
          >
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            className="border p-2 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          ></textarea>
          {errors.description && (
            <p className="text-red-500 text-sm mt-1">{errors.description}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="technology"
            className="block text-sm font-medium text-gray-700"
          >
            Technologies (comma-separated)
          </label>
          <input
            type="text"
            id="technology"
            name="technology"
            value={formData.technology}
            onChange={handleChange}
            placeholder="React, Node.js, MongoDB"
            className="border p-2 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
          {errors.technology && (
            <p className="text-red-500 text-sm mt-1">{errors.technology}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="githubLink"
            className="block text-sm font-medium text-gray-700"
          >
            GitHub Link
          </label>
          <input
            type="url"
            id="githubLink"
            name="githubLink"
            value={formData.githubLink}
            onChange={handleChange}
            className="border p-2 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
          {errors.githubLink && (
            <p className="text-red-500 text-sm mt-1">{errors.githubLink}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="liveLink"
            className="block text-sm font-medium text-gray-700"
          >
            Live Link (optional)
          </label>
          <input
            type="url"
            id="liveLink"
            name="liveLink"
            value={formData.liveLink}
            onChange={handleChange}
            className="border p-2 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
          {errors.liveLink && (
            <p className="text-red-500 text-sm mt-1">{errors.liveLink}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="img"
            className="block text-sm font-medium text-gray-700"
          >
            Project Image
          </label>
          <input
            type="file"
            id="img"
            name="img"
            onChange={handleImageChange}
            accept="image/*"
            className="mt-1 block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-indigo-50 file:text-indigo-700
              hover:file:bg-indigo-100"
          />

          {(imagePreview || imageFile) && (
            <div className="mt-4">
              <img
                src={imageFile ? URL.createObjectURL(imageFile) : imagePreview!}
                alt="Selected project preview"
                className="max-w-full h-auto rounded-md shadow"
              />
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          {isSubmitting ? "Submitting..." : "Add Project"}
        </button>
      </form>

      {submitResult && (
        <div
          className={`mt-4 p-4 rounded-md ${
            submitResult.success
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          <p className="font-bold">
            {submitResult.success ? "Success" : "Error"}
          </p>
          <p>{submitResult.message}</p>
        </div>
      )}
    </div>
  );
}
