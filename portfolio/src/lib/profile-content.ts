import { promises as fs } from "fs";
import path from "path";
import dbConnect from "@/lib/dbConnect";
import PortfolioContent from "@/models/PortfolioContent";
import {
  defaultAdminProfilePayload,
  type AdminProfilePayload,
} from "./profile-admin";
import {
  defaultPublicProfileData,
  type ProfileContent,
  type ProfileExperience,
  type PublicProfileData,
} from "./profile-types";
import type { AdminExperiencePayload } from "./experience-admin";

const PROFILE_PATH = path.join(process.cwd(), "src", "data", "profile.json");
const PORTFOLIO_CONTENT_KEY = "primary";

const toSlug = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const getExperienceId = (experience: ProfileExperience, index: number) =>
  experience.id ||
  `${toSlug(experience.role || "experience")}-${toSlug(experience.company || "item")}-${index + 1}`;

const normalizeExperiences = (
  experiences: ProfileExperience[]
): ProfileExperience[] =>
  experiences.map((experience, index) => ({
    ...experience,
    id: getExperienceId(experience, index),
  }));

const normalizeProfileContent = (profile: ProfileContent): ProfileContent => ({
  ...profile,
  history: {
    ...profile.history,
    experiences: normalizeExperiences(profile.history.experiences ?? []),
  },
});

const getPeriodStart = (period: string) =>
  period.split(/\s+[–—-]\s+/)[0]?.trim() ?? "";

const toPreviousExperience = (
  experience: ProfileExperience,
  nextCurrentPeriod: string
): ProfileExperience => {
  if (!experience.period.includes("Present")) {
    return experience;
  }

  const nextStart = getPeriodStart(nextCurrentPeriod);

  if (!nextStart) {
    return experience;
  }

  return {
    ...experience,
    period: experience.period.replace(/Present/i, nextStart),
  };
};

async function readProfileFromFile(): Promise<ProfileContent> {
  const raw = await fs.readFile(PROFILE_PATH, "utf8");
  const parsed = JSON.parse(raw) as ProfileContent;

  return normalizeProfileContent(parsed);
}

type PortfolioContentRecord = Partial<ProfileContent> & {
  key: string;
  content?: Partial<ProfileContent["content"]>;
};

const mergeProfileRecordWithFile = (
  fileProfile: ProfileContent,
  record: PortfolioContentRecord
): ProfileContent =>
  normalizeProfileContent({
    personal_details: record.personal_details ?? fileProfile.personal_details,
    preferences: record.preferences ?? fileProfile.preferences,
    history: record.history ?? fileProfile.history,
    metadata: record.metadata ?? fileProfile.metadata,
    content: {
      intro: {
        ...fileProfile.content.intro,
        ...(record.content?.intro ?? {}),
      },
      about: {
        ...fileProfile.content.about,
        ...(record.content?.about ?? {}),
      },
      contact: {
        ...fileProfile.content.contact,
        ...(record.content?.contact ?? {}),
      },
      product_focus: {
        ...fileProfile.content.product_focus,
        ...(record.content?.product_focus ?? {}),
      },
    },
  });

const withEmptyExperiences = (profile: ProfileContent): ProfileContent =>
  normalizeProfileContent({
    ...profile,
    history: {
      ...profile.history,
      experiences: [],
    },
  });

export async function readProfileContent(): Promise<ProfileContent> {
  const fileProfile = await readProfileFromFile();

  try {
    const connection = await dbConnect();

    if (!connection) {
      return fileProfile;
    }

    const record = await PortfolioContent.findOne({
      key: PORTFOLIO_CONTENT_KEY,
    }).lean<PortfolioContentRecord>();

    if (!record) {
      return fileProfile;
    }

    return mergeProfileRecordWithFile(fileProfile, record);
  } catch (error) {
    console.error("Falling back to file-based profile content:", error);
    return fileProfile;
  }
}

async function readProfileContentForExperienceApi(): Promise<ProfileContent> {
  const fileProfile = await readProfileFromFile();

  try {
    const connection = await dbConnect();

    if (!connection) {
      return fileProfile;
    }

    const record = await PortfolioContent.findOne({
      key: PORTFOLIO_CONTENT_KEY,
    }).lean<PortfolioContentRecord>();

    if (!record) {
      return withEmptyExperiences(fileProfile);
    }

    return mergeProfileRecordWithFile(fileProfile, record);
  } catch (error) {
    console.error("Falling back to file-based experience content:", error);
    return fileProfile;
  }
}

async function writeProfileContent(profile: ProfileContent): Promise<ProfileContent> {
  const normalizedProfile = normalizeProfileContent(profile);

  await fs.writeFile(
    PROFILE_PATH,
    `${JSON.stringify(normalizedProfile, null, 2)}\n`
  );

  try {
    const connection = await dbConnect();

    if (connection) {
      await PortfolioContent.findOneAndUpdate(
        { key: PORTFOLIO_CONTENT_KEY },
        {
          key: PORTFOLIO_CONTENT_KEY,
          personal_details: normalizedProfile.personal_details,
          preferences: normalizedProfile.preferences,
          history: normalizedProfile.history,
          metadata: normalizedProfile.metadata,
          content: normalizedProfile.content,
        },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
    }
  } catch (error) {
    console.error("Failed to sync portfolio content to database:", error);
  }

  return normalizedProfile;
}

function pickAdminProfileContent(
  profile: ProfileContent
): AdminProfilePayload {
  return {
    name: profile.personal_details.name,
    title: profile.personal_details.title,
    bio: profile.personal_details.bio,
    introAvailabilityAvailable:
      profile.content.intro.availability_available,
    introAvailabilityUnavailable:
      profile.content.intro.availability_unavailable,
    introHeadline: profile.content.intro.headline,
    introHighlights: profile.content.intro.highlights ?? [],
    aboutParagraphs: profile.personal_details.about_paragraphs ?? [],
    aboutHeading: profile.content.about.heading,
    aboutIntro: profile.content.about.intro,
    aboutBasedInLabel: profile.content.about.based_in_label,
    aboutSkillsHeading: profile.content.about.skills_heading,
    aboutSkillsIntro: profile.content.about.skills_intro,
    availableForOpportunities:
      profile.preferences.available_for_opportunities ?? false,
    email: profile.personal_details.contact.email,
    phone: profile.personal_details.contact.phone,
    location: profile.personal_details.location,
    linkedin: profile.personal_details.links.linkedin,
    github: profile.personal_details.links.github,
    website: profile.personal_details.links.website,
    contactHeading: profile.content.contact.heading,
    contactIntro: profile.content.contact.intro,
    contactBannerHeading: profile.content.contact.banner_heading,
    contactBannerIntro: profile.content.contact.banner_intro,
    contactQuickLinksNote: profile.content.contact.quick_links_note,
    contactDetailsHeading: profile.content.contact.details_heading,
    contactDetailsIntro: profile.content.contact.details_intro,
    contactFormHeading: profile.content.contact.form_heading,
    contactFormIntro: profile.content.contact.form_intro,
    contactSuccessMessage: profile.content.contact.success_message,
  };
}

function pickPublicProfileContent(
  profile: ProfileContent
): PublicProfileData {
  return {
    personal_details: profile.personal_details,
    preferences: profile.preferences,
    content: profile.content,
  };
}

export async function readPublicProfileApiContent(): Promise<PublicProfileData> {
  const fileProfile = await readProfileFromFile();

  try {
    const connection = await dbConnect();

    if (!connection) {
      return pickPublicProfileContent(fileProfile);
    }

    const record = await PortfolioContent.findOne({
      key: PORTFOLIO_CONTENT_KEY,
    }).lean<PortfolioContentRecord>();

    if (!record) {
      return defaultPublicProfileData;
    }

    return pickPublicProfileContent(mergeProfileRecordWithFile(fileProfile, record));
  } catch (error) {
    console.error("Falling back to file-based public profile content:", error);
    return pickPublicProfileContent(fileProfile);
  }
}

export async function readAdminProfileApiContent(): Promise<AdminProfilePayload> {
  const fileProfile = await readProfileFromFile();

  try {
    const connection = await dbConnect();

    if (!connection) {
      return pickAdminProfileContent(fileProfile);
    }

    const record = await PortfolioContent.findOne({
      key: PORTFOLIO_CONTENT_KEY,
    }).lean<PortfolioContentRecord>();

    if (!record) {
      return defaultAdminProfilePayload;
    }

    return pickAdminProfileContent(mergeProfileRecordWithFile(fileProfile, record));
  } catch (error) {
    console.error("Falling back to file-based admin profile content:", error);
    return pickAdminProfileContent(fileProfile);
  }
}

export async function updateAdminProfileContent(
  data: AdminProfilePayload
): Promise<AdminProfilePayload> {
  const profile = await readProfileContentForExperienceApi();

  const updatedProfile: ProfileContent = {
    ...profile,
    personal_details: {
      ...profile.personal_details,
      name: data.name,
      title: data.title,
      bio: data.bio,
      about_paragraphs: data.aboutParagraphs,
      location: data.location,
      contact: {
        ...profile.personal_details.contact,
        email: data.email,
        phone: data.phone,
        address: data.location,
      },
      links: {
        ...profile.personal_details.links,
        website: data.website,
        github: data.github,
        linkedin: data.linkedin,
      },
    },
    content: {
      ...profile.content,
      intro: {
        ...profile.content.intro,
        availability_available: data.introAvailabilityAvailable,
        availability_unavailable: data.introAvailabilityUnavailable,
        headline: data.introHeadline,
        highlights: data.introHighlights,
      },
      about: {
        ...profile.content.about,
        heading: data.aboutHeading,
        intro: data.aboutIntro,
        based_in_label: data.aboutBasedInLabel,
        skills_heading: data.aboutSkillsHeading,
        skills_intro: data.aboutSkillsIntro,
      },
      contact: {
        ...profile.content.contact,
        heading: data.contactHeading,
        intro: data.contactIntro,
        banner_heading: data.contactBannerHeading,
        banner_intro: data.contactBannerIntro,
        quick_links_note: data.contactQuickLinksNote,
        details_heading: data.contactDetailsHeading,
        details_intro: data.contactDetailsIntro,
        form_heading: data.contactFormHeading,
        form_intro: data.contactFormIntro,
        success_message: data.contactSuccessMessage,
      },
    },
    preferences: {
      ...profile.preferences,
      available_for_opportunities: data.availableForOpportunities,
    },
    metadata: {
      ...profile.metadata,
      last_updated: new Date().toISOString().slice(0, 10),
    },
  };

  const persistedProfile = await writeProfileContent(updatedProfile);

  return pickAdminProfileContent(persistedProfile);
}

export async function listAdminExperiences(): Promise<ProfileExperience[]> {
  const profile = await readProfileContentForExperienceApi();
  return profile.history.experiences;
}

export async function getAdminExperienceById(
  id: string
): Promise<ProfileExperience | null> {
  const experiences = await listAdminExperiences();
  return experiences.find((experience) => experience.id === id) ?? null;
}

const persistExperiences = async (
  profile: ProfileContent,
  experiences: ProfileExperience[]
) => {
  const updatedProfile: ProfileContent = {
    ...profile,
    history: {
      ...profile.history,
      experiences: normalizeExperiences(experiences),
    },
    metadata: {
      ...profile.metadata,
      last_updated: new Date().toISOString().slice(0, 10),
    },
  };

  const persistedProfile = await writeProfileContent(updatedProfile);

  return persistedProfile.history.experiences;
};

export async function createAdminExperience(
  data: AdminExperiencePayload
): Promise<ProfileExperience> {
  const profile = await readProfileContentForExperienceApi();

  const nextExperience: ProfileExperience = {
    role: data.role,
    company: data.company,
    period: data.period,
    location: data.location,
    summary: data.summary,
    highlights: data.highlights,
  };

  const nextExperiences = data.setAsCurrent
    ? [
        nextExperience,
        ...profile.history.experiences.map((experience, index) =>
          index === 0 ? toPreviousExperience(experience, data.period) : experience
        ),
      ]
    : [...profile.history.experiences, nextExperience];

  const experiences = await persistExperiences(profile, nextExperiences);
  return experiences[data.setAsCurrent ? 0 : experiences.length - 1];
}

export async function updateAdminExperience(
  id: string,
  data: AdminExperiencePayload
): Promise<ProfileExperience | null> {
  const profile = await readProfileContentForExperienceApi();
  const currentIndex = profile.history.experiences.findIndex(
    (experience) => experience.id === id
  );

  if (currentIndex === -1) {
    return null;
  }

  const currentExperience = profile.history.experiences[currentIndex];
  const updatedExperience: ProfileExperience = {
    ...currentExperience,
    role: data.role,
    company: data.company,
    period: data.period,
    location: data.location,
    summary: data.summary,
    highlights: data.highlights,
  };

  const remainingExperiences = profile.history.experiences.filter(
    (experience) => experience.id !== id
  );

  const nextExperiences = data.setAsCurrent
    ? [
        updatedExperience,
        ...remainingExperiences.map((experience, index) =>
          index === 0 ? toPreviousExperience(experience, data.period) : experience
        ),
      ]
    : [
        ...remainingExperiences.slice(0, currentIndex),
        updatedExperience,
        ...remainingExperiences.slice(currentIndex),
      ];

  const experiences = await persistExperiences(profile, nextExperiences);
  return experiences.find((experience) => experience.id === id) ?? experiences[0] ?? null;
}

export async function deleteAdminExperience(id: string): Promise<boolean> {
  const profile = await readProfileContentForExperienceApi();
  const nextExperiences = profile.history.experiences.filter(
    (experience) => experience.id !== id
  );

  if (nextExperiences.length === profile.history.experiences.length) {
    return false;
  }

  await persistExperiences(profile, nextExperiences);
  return true;
}
