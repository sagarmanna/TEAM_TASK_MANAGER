import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Team Task Manager",
  description:
    "Create projects, assign tasks and manage teams.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-slate-950 text-white min-h-screen">
        {children}
      </body>
    </html>
  );
}