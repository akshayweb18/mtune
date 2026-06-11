import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import { Sidebar } from "@/components/layout/Sidebar";
import { RightPlayer } from "@/components/layout/RightPlayer";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { MobilePlayer } from "@/components/layout/MobilePlayer";
import { AudioEngine } from "@/components/player/AudioEngine";
import { DesktopBottomPlayer } from "@/components/player/DesktopBottomPlayer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Musical App | Premium Streaming",
  description: "Spotify-inspired premium music streaming app with Saavn API",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Musical App",
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover" as const,
  themeColor: "#050816",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} antialiased h-[100dvh] overflow-hidden flex flex-col bg-[#050816] text-white`}
      >
        <Providers>
          {/* Main layout */}
          <div className="flex w-full overflow-hidden h-full">
            {/* Desktop Sidebar */}
            <Sidebar />
            
            {/* Main Content Area — mobile: 148px + safe area, desktop: 72px */}
            <main className="flex-1 h-full overflow-y-auto relative pb-[148px] md:pb-[72px]">
              {children}
            </main>
            
            {/* Desktop Right Player Sidebar */}
            <RightPlayer />
          </div>

          {/* Desktop Bottom Player Bar */}
          <DesktopBottomPlayer />

          {/* Mobile Specific — Mini Player + Bottom Nav */}
          <MobilePlayer />
          <MobileBottomNav />

          {/* Audio Engine (invisible) */}
          <AudioEngine />
        </Providers>
      </body>
    </html>
  );
}
