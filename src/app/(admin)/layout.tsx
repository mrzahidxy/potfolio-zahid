"use client";

import { Inter } from "next/font/google";
import "../globals.css";
import { useContext, useEffect } from "react";
import { AuthContext } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { currentUser } = useContext(AuthContext);
  const { push } = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined" && !currentUser?.accessToken) {
      push("/admin/login");
    }
  }, [currentUser]);

  return (
    <html lang="en">
      <body
        className={`${inter.className} h-screen  dark:bg-gray-800 dark:text-white`}
      >
        <div className="container lg:h-[calc(100vh-5rem)]">{children}</div>
      </body>
    </html>
  );
}
