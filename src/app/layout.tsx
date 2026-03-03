import type { Metadata } from "next";
import { GeistMono } from "geist/font/mono";
import localFont from "next/font/local";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageViewTracker from "@/components/PageViewTracker";

const seasonSans = localFont({
  src: [
    {
      path: "./fonts/SeasonSans-TRIAL-Light.otf",
      weight: "300",
      style: "normal",
    },
    {
      path: "./fonts/SeasonSans-TRIAL-Regular.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/SeasonSans-TRIAL-Medium.otf",
      weight: "500",
      style: "normal",
    },
    {
      path: "./fonts/SeasonSans-TRIAL-SemiBold.otf",
      weight: "600",
      style: "normal",
    },
    {
      path: "./fonts/SeasonSans-TRIAL-Bold.otf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-season",
  display: "swap",
  fallback: ["system-ui", "sans-serif"],
});

export const metadata: Metadata = {
  title: {
    default: "CENTRO IA — AI Initiatives & Documentation",
    template: "%s | CENTRO IA",
  },
  description:
    "Documenting AI initiatives, case studies, and roadmap for CENTRO's educational ecosystem.",
  openGraph: {
    title: "CENTRO IA",
    description: "AI initiatives for education at CENTRO.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${GeistMono.variable} ${seasonSans.variable}`}>
      <body className="min-h-screen antialiased">
        <Navbar />
        <PageViewTracker />
        <main className="pt-16">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
