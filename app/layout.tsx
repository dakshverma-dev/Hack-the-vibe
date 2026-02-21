import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ResumeAgent AI – Land Your Dream Job in 60 Seconds",
  description:
    "AI-powered resume optimizer that tailors your resume to any job posting, generates cover letters, and prepares you for interviews.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
