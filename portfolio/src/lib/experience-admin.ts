import { z } from "zod";

const requiredText = (label: string) =>
  z.string().trim().min(1, `${label} is required`);

export const adminExperienceSchema = z.object({
  role: requiredText("Role"),
  company: requiredText("Company"),
  period: requiredText("Employment period"),
  location: z.string().trim().optional().default(""),
  summary: requiredText("Role summary"),
  highlights: z
    .array(requiredText("Responsibility"))
    .min(1, "Add at least one responsibility"),
  setAsCurrent: z.boolean().default(false),
});

export type AdminExperiencePayload = z.infer<typeof adminExperienceSchema>;

export interface AdminExperienceFormValues
  extends Omit<AdminExperiencePayload, "highlights"> {
  highlightsText: string;
}

export const defaultAdminExperienceFormValues: AdminExperienceFormValues = {
  role: "",
  company: "",
  period: "",
  location: "",
  summary: "",
  highlightsText: "",
  setAsCurrent: false,
};

export const experienceHighlightsFromText = (value: string) =>
  value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

export const experienceHighlightsToText = (value: string[] = []) =>
  value.join("\n");

export const toAdminExperienceFormValues = (
  value: AdminExperiencePayload
): AdminExperienceFormValues => ({
  ...value,
  highlightsText: experienceHighlightsToText(value.highlights),
});
