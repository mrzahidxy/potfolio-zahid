import type { Metadata, Viewport } from "next";
import { PublicProfileProvider } from "@/context/PublicProfileContext";
import { readStaticProfileContent } from "@/lib/profile-content";
import { getSiteUrl } from "@/lib/site-url";

export async function generateMetadata(): Promise<Metadata> {
  const profile = await readStaticProfileContent();
  const siteUrl = getSiteUrl();

  return {
    metadataBase: new URL(siteUrl),
    title: `${profile.personal_details.name} | ${profile.personal_details.title}`,
    description: profile.personal_details.bio,
    alternates: {
      canonical: siteUrl,
    },
  };
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PublicProfileProvider>
      <main>{children}</main>
    </PublicProfileProvider>
  );
}
