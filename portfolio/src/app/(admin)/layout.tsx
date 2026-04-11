import type { Metadata } from "next";
import AdminShell from "./AdminShell";

export const metadata: Metadata = {
  title: {
    default: "Admin",
    template: "%s | Admin",
  },
  description: "Admin panel",
  keywords: [],
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
    },
  },
  openGraph: {
    title: "Admin",
    description: "Admin panel",
  },
  twitter: {
    title: "Admin",
    description: "Admin panel",
  },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminShell>{children}</AdminShell>;
}
