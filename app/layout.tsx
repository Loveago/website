import "./globals.css";
import { ReactNode } from "react";
import Providers from "@/components/providers";
import Navbar from "@/components/Navbar";
import { Inter } from "next/font/google";
import PageContainer from "@/components/page-container";
import { prisma } from "@/lib/prisma";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata = {
  title: "Modern Blog",
  description: "A modern blog with Next.js, Prisma, and NextAuth",
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  const settings = await prisma.siteSettings.findFirst();
  const siteTitle = settings?.siteName ?? "Modern Blog";
  const favicon = settings?.faviconUrl ?? null;

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>{siteTitle}</title>
        {favicon && <link rel="icon" href={favicon} />}
      </head>
      <body className={`${inter.variable} font-sans bg-gradient-to-b from-background to-background/95 min-h-screen relative`}> 
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-500/10 via-transparent to-transparent dark:from-indigo-400/10" />
        <Providers>
          <Navbar />
          <main className="mx-auto max-w-5xl px-4 py-8">
            <PageContainer>{children}</PageContainer>
          </main>
        </Providers>
      </body>
    </html>
  );
}
