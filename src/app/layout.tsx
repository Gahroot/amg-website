import type { Metadata } from "next";
import { Geist, Geist_Mono, IBM_Plex_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { ThemeEffects } from "@/components/effects/theme-effects";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-ibm-plex-mono",
  weight: ["400", "500", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Anchor Mill Group",
    template: "%s | Anchor Mill Group",
  },
  description:
    "Integrated resilience, protection, and performance for UHNW families, family offices, and global executives.",
  keywords: [
    "UHNW",
    "family office",
    "executive protection",
    "risk management",
    "resilience",
    "wealth protection",
    "Anchor Mill Group",
  ],
  openGraph: {
    title: "Anchor Mill Group",
    description:
      "Integrated resilience, protection, and performance for UHNW families, family offices, and global executives.",
    url: "https://anchormillgroup.com",
    siteName: "Anchor Mill Group",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Anchor Mill Group",
    description:
      "Integrated resilience, protection, and performance for UHNW families, family offices, and global executives.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${ibmPlexMono.variable} antialiased`}
      >
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded"
        >
          Skip to main content
        </a>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          <ThemeEffects />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
