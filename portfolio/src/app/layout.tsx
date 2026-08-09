import "./globals.css";
import type { Metadata } from "next";
import ClientProvider from "./ClientProvider";
import { readStaticProfileContent } from "@/lib/profile-content";
import { getSiteUrl } from "@/lib/site-url";

export async function generateMetadata(): Promise<Metadata> {
  const profile = await readStaticProfileContent();
  const profileName = profile.personal_details.name;
  const profileTitle = profile.personal_details.title;
  const profileBio = profile.personal_details.bio;
  const siteUrl = getSiteUrl();

  return {
    metadataBase: new URL(siteUrl),
    title: `${profileName} | ${profileTitle} & Full-Stack Developer`,
    description: profileBio,
    keywords: [
      profileName,
      profileTitle,
      "Full-Stack Developer",
      "React",
      "Next.js",
      "Node.js",
      "TypeScript",
    ],
    openGraph: {
      title: `${profileName} | ${profileTitle} & Full-Stack Developer`,
      description: profileBio,
      url: siteUrl,
      siteName: `${profileName} Portfolio`,
      images: [
        {
          url: new URL("/image/hero-image.png", siteUrl).toString(),
          width: 1200,
          height: 630,
          alt: `${profileName} Portfolio`,
        },
      ],
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${profileName} | ${profileTitle} & Full-Stack Developer`,
      description: profileBio,
      images: [new URL("/image/hero-image.png", siteUrl).toString()],
    },
    alternates: {
      canonical: siteUrl,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className="font-sans bg-slate-50 text-slate-900 antialiased transition-colors duration-300 dark:bg-slate-900 dark:text-slate-50"
      >
        <ClientProvider>
          {children}
        </ClientProvider>
      </body>
    </html>
  );
}
