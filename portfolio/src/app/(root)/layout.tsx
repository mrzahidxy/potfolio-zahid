import type { Metadata, Viewport } from "next";
import Navbar from "@/components/Navbar/Navbar";
import PortfolioFooter from "@/components/PortfolioFooter";
import ChatbotLauncher from "@/components/ChatbotLauncher";
import { PublicProfileProvider } from "@/context/PublicProfileContext";
import { readStaticProfileContent } from "@/lib/profile-content";

export async function generateMetadata(): Promise<Metadata> {
  const profile = await readStaticProfileContent();
  const profileSite = profile.metadata.site_url || "https://mrzahidxy.vercel.app";
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || profileSite;

  return {
    metadataBase: new URL(siteUrl),
    title: `${profile.personal_details.name} | ${profile.personal_details.title}`,
    description: profile.personal_details.bio,
    alternates: {
      canonical: "/",
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
      <Navbar />
      <main className="pt-[7.5rem] sm:pt-32 md:pt-24">{children}</main>
      <PortfolioFooter />
      <ChatbotLauncher />
    </PublicProfileProvider>
  );
}
