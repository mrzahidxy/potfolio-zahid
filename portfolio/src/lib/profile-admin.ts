import { z } from "zod";

const requiredText = (label: string) =>
  z.string().trim().min(1, `${label} is required`);

export const adminProfileSchema = z.object({
  name: requiredText("Name"),
  title: requiredText("Job title"),
  bio: requiredText("Professional bio"),
  introAvailabilityAvailable: requiredText("Available status text"),
  introAvailabilityUnavailable: requiredText("Unavailable status text"),
  introHeadline: requiredText("Hero headline"),
  introHighlights: z
    .array(requiredText("Hero highlight"))
    .min(1, "Add at least one hero highlight"),
  aboutParagraphs: z
    .array(requiredText("About paragraph"))
    .min(1, "Add at least one about paragraph"),
  aboutHeading: requiredText("About heading"),
  aboutIntro: requiredText("About intro"),
  aboutBasedInLabel: requiredText("Based in label"),
  aboutSkillsHeading: requiredText("Skills heading"),
  aboutSkillsIntro: requiredText("Skills intro"),
  availableForOpportunities: z.boolean(),
  email: z.string().trim().email("Valid email is required"),
  phone: requiredText("Phone number"),
  location: requiredText("Location"),
  linkedin: z.string().trim().url("Valid LinkedIn URL is required"),
  github: z.string().trim().url("Valid GitHub URL is required"),
  website: z
    .string()
    .trim()
    .refine((value) => value === "" || z.string().url().safeParse(value).success, {
      message: "Enter a valid website URL or leave it blank",
    }),
  contactHeading: requiredText("Contact heading"),
  contactIntro: requiredText("Contact intro"),
  contactBannerHeading: requiredText("Contact banner heading"),
  contactBannerIntro: requiredText("Contact banner intro"),
  contactQuickLinksNote: requiredText("Quick links note"),
  contactDetailsHeading: requiredText("Contact details heading"),
  contactDetailsIntro: requiredText("Contact details intro"),
  contactFormHeading: requiredText("Contact form heading"),
  contactFormIntro: requiredText("Contact form intro"),
  contactSuccessMessage: requiredText("Contact success message"),
});

export type AdminProfilePayload = z.infer<typeof adminProfileSchema>;

export const defaultAdminProfilePayload: AdminProfilePayload = {
  name: "",
  title: "",
  bio: "",
  introAvailabilityAvailable: "",
  introAvailabilityUnavailable: "",
  introHeadline: "",
  introHighlights: [],
  aboutParagraphs: [],
  aboutHeading: "",
  aboutIntro: "",
  aboutBasedInLabel: "",
  aboutSkillsHeading: "",
  aboutSkillsIntro: "",
  availableForOpportunities: false,
  email: "",
  phone: "",
  location: "",
  linkedin: "",
  github: "",
  website: "",
  contactHeading: "",
  contactIntro: "",
  contactBannerHeading: "",
  contactBannerIntro: "",
  contactQuickLinksNote: "",
  contactDetailsHeading: "",
  contactDetailsIntro: "",
  contactFormHeading: "",
  contactFormIntro: "",
  contactSuccessMessage: "",
};

export interface AdminProfileFormValues
  extends Omit<AdminProfilePayload, "aboutParagraphs" | "introHighlights"> {
  aboutParagraphsText: string;
  introHighlightsText: string;
}

export const defaultAdminProfileFormValues: AdminProfileFormValues = {
  name: "",
  title: "",
  bio: "",
  introAvailabilityAvailable: "",
  introAvailabilityUnavailable: "",
  introHeadline: "",
  introHighlightsText: "",
  aboutParagraphsText: "",
  aboutHeading: "",
  aboutIntro: "",
  aboutBasedInLabel: "",
  aboutSkillsHeading: "",
  aboutSkillsIntro: "",
  availableForOpportunities: false,
  email: "",
  phone: "",
  location: "",
  linkedin: "",
  github: "",
  website: "",
  contactHeading: "",
  contactIntro: "",
  contactBannerHeading: "",
  contactBannerIntro: "",
  contactQuickLinksNote: "",
  contactDetailsHeading: "",
  contactDetailsIntro: "",
  contactFormHeading: "",
  contactFormIntro: "",
  contactSuccessMessage: "",
};

export const aboutParagraphsFromText = (value: string) =>
  value
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

export const aboutParagraphsToText = (value: string[] = []) => value.join("\n\n");
export const introHighlightsFromText = (value: string) =>
  value
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);

export const introHighlightsToText = (value: string[] = []) => value.join("\n");

export const toAdminProfileFormValues = (
  value: AdminProfilePayload
): AdminProfileFormValues => ({
  ...value,
  aboutParagraphsText: aboutParagraphsToText(value.aboutParagraphs),
  introHighlightsText: introHighlightsToText(value.introHighlights),
});
