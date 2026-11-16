import type { Metadata, Viewport } from "next";
import { Geist_Mono, Inter, Inter_Tight, Russo_One } from "next/font/google";
import "lenis/dist/lenis.css";
import "./globals.css";
import SmoothScroll from "@/components/providers/SmoothScroll";

const interTight = Inter_Tight({
  variable: "--font-inter-tight",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

// Squared, heavy face closest to the VizStats wordmark — used only for the logo text.
const russoOne = Russo_One({
  variable: "--font-russo",
  subsets: ["latin"],
  weight: "400",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "VizStats — Data Experience Design",
    template: "%s — VizStats",
  },
  description:
    "VizStats designs data experiences: long-form data stories, interactive explorers and 3D visualisation.",
};

export const viewport: Viewport = {
  themeColor: "#000000",
  colorScheme: "dark",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${interTight.variable} ${inter.variable} ${russoOne.variable} ${geistMono.variable} antialiased`}
    >
      <body className="min-h-full bg-ink text-fog">
        <SmoothScroll>
          {children}
        </SmoothScroll>
        <div className="grain" aria-hidden />
      </body>
    </html>
  );
}
