import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "../globals.css";
import Navbar from "@/components/Navbar/Navbar";
import profile from "@/data/profile.json";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const profileSite = profile.metadata.site_url || "https://mrzahidxy.vercel.app";
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || profileSite;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: `${profile.personal_details.name} | ${profile.personal_details.title}`,
  description: profile.personal_details.bio,
  alternates: {
    canonical: "/",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${jakarta.className} bg-transparent text-slate-900 antialiased transition-colors duration-300 dark:text-slate-50`}
      >
        <Navbar />
        <main className="pt-28 md:pt-24">{children}</main>
      </body>
    </html>
  );
}
