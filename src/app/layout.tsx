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
  themeColor: "#000000",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" data-scroll-behavior="smooth">
      <body
        className={`${inter.variable} antialiased bg-[#121212] text-white overflow-hidden fixed inset-0 w-full h-full`}
        style={{ display: 'flex', flexDirection: 'column' }}
      >
        <Providers>
          {/* Main layout */}
          <div className="flex w-full flex-1 relative min-h-0">
            {/* Desktop Sidebar */}
            <div className="hidden md:block sticky top-0 h-[100dvh] z-10 shrink-0">
              <Sidebar />
            </div>
            
          {/* Main Content Area — scrolls independently */}
            <main className="flex-1 w-full overflow-y-auto overflow-x-hidden pb-[180px] md:pb-[140px] relative scroll-smooth" style={{ WebkitOverflowScrolling: 'touch' }}>
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
