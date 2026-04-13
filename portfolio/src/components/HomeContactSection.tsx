"use client";

import Contact from "./Contact";
import { usePublicProfile } from "@/context/PublicProfileContext";

export default function HomeContactSection() {
  const { profile, loading } = usePublicProfile();

  const hasContact = Boolean(
    profile.content.contact.heading ||
      profile.personal_details.contact.email ||
      profile.personal_details.contact.phone
  );

  if (loading || !hasContact) {
    return null;
  }

  return (
    <Contact
      contactDetails={profile.personal_details.contact}
      links={profile.personal_details.links}
      content={profile.content.contact}
    />
  );
}
