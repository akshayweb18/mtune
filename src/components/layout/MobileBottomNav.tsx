'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Search, Library, Crown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { usePlayerStore } from '@/store/usePlayerStore';

const navItems = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'Search', href: '/search', icon: Search },
  { name: 'Library', href: '/library', icon: Library },
  { name: 'Premium', href: '/premium', icon: Crown },
];

export function MobileBottomNav() {
  const pathname = usePathname();
  const isExpanded = usePlayerStore(s => s.isExpanded);

  // Hide bottom nav when fullscreen player is open
  if (isExpanded) return null;

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[#0A0A10] border-t border-white/5 flex items-start justify-around pt-2 z-50 pb-safe" style={{ paddingBottom: 'max(env(safe-area-inset-bottom, 8px), 8px)', height: 'calc(70px + max(env(safe-area-inset-bottom, 0px), 0px))' }}>
      {navItems.map((item) => {
        const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
        
        return (
          <Link
            key={item.name}
            href={item.href}
            className="flex flex-col items-center justify-center w-16 h-full gap-1 active:scale-95 transition-transform group"
          >
            <div className="relative">
              <item.icon 
                className={cn(
                  "w-6 h-6 transition-all duration-300", 
                  isActive 
                    ? "text-secondary drop-shadow-[0_0_10px_rgba(236,72,153,0.8)]" 
                    : "text-white/40 group-hover:text-white/70"
                )} 
              />
            </div>
            <span 
              className={cn(
                "text-[10px] font-medium transition-colors mt-1",
                isActive ? "text-white" : "text-white/40"
              )}
            >
              {item.name}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
