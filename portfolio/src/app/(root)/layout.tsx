import type { Metadata, Viewport } from "next";
import Navbar from "@/components/Navbar/Navbar";
import PortfolioFooter from "@/components/PortfolioFooter";
import { PublicProfileProvider } from "@/context/PublicProfileContext";
import { readProfileContent } from "@/lib/profile-content";

export async function generateMetadata(): Promise<Metadata> {
  const profile = await readProfileContent();
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
    <html lang="en">
      <body
        className="font-sans bg-transparent text-slate-900 antialiased transition-colors duration-300 dark:text-slate-50"
      >
        <PublicProfileProvider>
          <Navbar />
          <main className="pt-[7.5rem] sm:pt-32 md:pt-24">{children}</main>
          <PortfolioFooter />
        </PublicProfileProvider>
      </body>
    </html>
  );
}
