'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Search, Library, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { usePlayerStore } from '@/store/usePlayerStore';

const navItems = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'Search', href: '/search', icon: Search },
  { name: 'Library', href: '/library', icon: Library },
  { name: 'Profile', href: '/profile', icon: User },
];

export function MobileBottomNav() {
  const pathname = usePathname();
  const isExpanded = usePlayerStore(s => s.isExpanded);

  if (isExpanded) return null;

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-[60] flex items-center"
      style={{
        background: 'rgba(0,0,0,0.97)',
        height: 'calc(60px + env(safe-area-inset-bottom, 0px))',
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
        borderTop: '1px solid rgba(255,255,255,0.08)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
      }}
    >
      {navItems.map((item) => {
        const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
        return (
          <Link
            key={item.name}
            href={item.href}
            className="flex flex-col items-center justify-center gap-1 flex-1 h-full active:opacity-70 transition-opacity"
          >
            <item.icon
              className={cn(
                'w-[22px] h-[22px] transition-none',
                isActive ? 'text-[#FFD700]' : 'text-[#B3B3B3]'
              )}
              strokeWidth={isActive ? 2.5 : 2}
              fill={isActive ? 'currentColor' : 'none'}
            />
            <span className={cn(
              'text-[10px] font-bold transition-none',
              isActive ? 'text-[#FFD700]' : 'text-[#B3B3B3]'
            )}>
              {item.name}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
