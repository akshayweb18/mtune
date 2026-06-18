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
      <body className={`${inter.variable} antialiased bg-[#121212] text-white`}>
        <Providers>
          {/* Main layout */}
          <div className="flex w-full h-[100dvh] overflow-hidden">
            {/* Desktop Sidebar */}
            <div className="hidden md:block h-full z-10 shrink-0">
              <Sidebar />
            </div>
            
          {/* Main Content Area — scrolls naturally inside main */}
            <main
              id="main-scroll"
              className="flex-1 w-full h-full overflow-y-auto"
              style={{
                WebkitOverflowScrolling: 'touch',
                overscrollBehaviorY: 'contain',
                /*
                 * Mobile: bottomNav(60px) + miniPlayer(56px) + gaps(16px) + extra(16px) = 148px
                 * Desktop: DesktopBottomPlayer(90px) + gap(16px) = 106px  → use 140px for safety
                 * Safe-area adds notch/home-bar height
                 */
                paddingBottom: 'calc(var(--scroll-pad-mobile, 156px) + env(safe-area-inset-bottom, 0px))',
              }}
            >
              {children}
            </main>
            
            {/* Desktop Right Player Sidebar */}
            <div className="hidden lg:block h-full z-10 shrink-0">
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
