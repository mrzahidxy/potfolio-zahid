import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar/Navbar";


const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Zahid",
  description: "A software developer portfolio",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="bg-slate-100 lg:h-screen dark:bg-gray-800 dark:text-white py-1">
          <Navbar />
          <div className="container  lg:h-[calc(100vh-5rem)]">{children}</div>
        </div>
      </body>
    </html>
  );
}
