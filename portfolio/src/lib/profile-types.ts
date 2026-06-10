import rawProfile from "@/data/profile.json";

export interface ProfileContactDetails {
  email: string;
  phone: string;
  address: string;
}

export interface ProfileLinks {
  website: string;
  github: string;
  linkedin: string;
}

export interface ProfileIntroContent {
  availability_available: string;
  availability_unavailable: string;
  headline: string;
  primary_cta_label: string;
  secondary_cta_label: string;
  highlights: string[];
}

export interface ProfileAboutContent {
  eyebrow_label: string;
  heading: string;
  intro: string;
  based_in_label: string;
  skills_eyebrow_label: string;
  skills_heading: string;
  skills_intro: string;
}

export interface ProfileContactContent {
  eyebrow_label: string;
  heading: string;
  intro: string;
  banner_eyebrow_label: string;
  banner_heading: string;
  banner_intro: string;
  quick_links_label: string;
  email_action_label: string;
  linkedin_action_label: string;
  github_action_label: string;
  quick_links_note: string;
  details_eyebrow_label: string;
  details_heading: string;
  details_intro: string;
  profiles_label: string;
  form_eyebrow_label: string;
  form_heading: string;
  form_intro: string;
  submit_button_label: string;
  success_message: string;
}

export interface ProfileProductFocusContent {
  eyebrow_label: string;
  heading: string;
  intro: string;
  principles_label: string;
  principles: string[];
  closing_note: string;
}

export interface ProfileSectionContent {
  intro: ProfileIntroContent;
  about: ProfileAboutContent;
  contact: ProfileContactContent;
  product_focus: ProfileProductFocusContent;
}

export interface ProfilePersonalDetails {
  name: string;
  title: string;
  location: string;
  bio: string;
  about_paragraphs: string[];
  contact: ProfileContactDetails;
  links: ProfileLinks;
}

export interface ProfileExperience {
  id?: string;
  role: string;
  company: string;
  period: string;
  location?: string;
  summary: string;
  highlights: string[];
}

export interface ProfileEducation {
  degree: string;
  institution: string;
  period: string;
  location: string;
  notes: string[];
}

export interface FeaturedProject {
  title: string;
  description: string;
  links: {
    live: string;
    github: string;
  };
  technologies: string[];
}

export interface ProfilePreferences {
  available_for_opportunities: boolean;
  hero_background?: {
    element_count?: number;
    scheme?: "dark" | "light";
  };
  interests?: string[];
  tech_stack: Record<string, string[]>;
}

export interface ProfileHistory {
  experiences: ProfileExperience[];
  education: ProfileEducation[];
  featured_projects: FeaturedProject[];
}

export interface ProfileMetadata {
  site_url?: string;
  last_updated?: string;
  generated_from?: string;
}

export interface ProfileContent {
  personal_details: ProfilePersonalDetails;
  preferences: ProfilePreferences;
  history: ProfileHistory;
  metadata: ProfileMetadata;
  content: ProfileSectionContent;
}

export interface PublicProfileData {
  personal_details: ProfilePersonalDetails;
  preferences: ProfilePreferences;
  content: ProfileSectionContent;
}

export interface PublicProfileApiResponse {
  success: boolean;
  data: PublicProfileData;
}

export interface ProfileExperienceListResponse {
  success: boolean;
  data: ProfileExperience[];
}

const defaultProfileContent = rawProfile as ProfileContent;

export const defaultPublicProfileData: PublicProfileData = {
  personal_details: defaultProfileContent.personal_details,
  preferences: defaultProfileContent.preferences,
  content: defaultProfileContent.content,
};

