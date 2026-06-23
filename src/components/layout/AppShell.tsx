'use client';

import { usePathname } from 'next/navigation';
import { Sidebar } from '@/components/layout/Sidebar';
import { RightPlayer } from '@/components/layout/RightPlayer';
import { MobileBottomNav } from '@/components/layout/MobileBottomNav';
import { MobilePlayer } from '@/components/layout/MobilePlayer';
import { AudioEngine } from '@/components/player/AudioEngine';
import { DesktopBottomPlayer } from '@/components/player/DesktopBottomPlayer';
import AvatarDropdown from '@/components/profile/AvatarDropdown';
import { ToastContainer } from '@/components/shared/Toast';

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = pathname?.startsWith('/auth');

  // Auth page: render children only — no sidebar, no players, no nav
  if (isAuthPage) {
    return <>{children}</>;
  }

  return (
    <>
      {/* Main layout */}
      <div className="flex w-full h-[100dvh] overflow-hidden">
        {/* Desktop Sidebar */}
        <div className="hidden md:block h-full z-10 shrink-0">
          <Sidebar />
        </div>

        {/* Main Content Area */}
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
              paddingBottom:
                'calc(var(--scroll-pad-mobile, 156px) + env(safe-area-inset-bottom, 0px))',
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

      {/* Floating avatar — top-right, shown on all non-auth pages */}
      <div className="avatar-dropdown-portal">
        <AvatarDropdown />
      </div>

      {/* Global Toast Notifications */}
      <ToastContainer />
    </>
  );
}
