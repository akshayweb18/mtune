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
import AvatarDropdown from "@/components/profile/AvatarDropdown";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "mTune | Premium Music Streaming",
  description: "mTune — a world-class music streaming experience.",
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
              }}
            >
              <div
                className="min-h-full"
                style={{
                  paddingBottom: 'calc(var(--scroll-pad-mobile, 156px) + env(safe-area-inset-bottom, 0px))',
                }}
              >
                {children}
              </div>
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

          {/* Floating avatar — top-right, only shows when authenticated */}
          <div className="avatar-dropdown-portal">
            <AvatarDropdown />
          </div>
        </Providers>
      </body>
    </html>
  );
}
