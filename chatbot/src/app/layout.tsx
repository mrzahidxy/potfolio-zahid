import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Zahid Portfolio Chatbot",
  description: "Standalone portfolio assistant chatbot powered by Groq.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
