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
        className={`${inter.variable} antialiased min-h-[100dvh] flex flex-col bg-[#050816] text-white`}
      >
        <Providers>
          {/* Main layout */}
          <div className="flex w-full flex-1 relative">
            {/* Desktop Sidebar */}
            <div className="hidden md:block sticky top-0 h-[100dvh] z-10 shrink-0">
              <Sidebar />
            </div>
            
            {/* Main Content Area */}
            <main className="flex-1 w-full pb-[148px] md:pb-[72px]">
              {children}
            </main>
            
            {/* Desktop Right Player Sidebar */}
            <div className="hidden lg:block sticky top-0 h-[100dvh] z-10 shrink-0">
              <RightPlayer />
            </div>
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
