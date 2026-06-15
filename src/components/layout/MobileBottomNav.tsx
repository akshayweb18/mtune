'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Search, Library } from 'lucide-react';
import { cn } from '@/lib/utils';
import { usePlayerStore } from '@/store/usePlayerStore';

const navItems = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'Search', href: '/search', icon: Search },
  { name: 'Your Library', href: '/library', icon: Library },
];

export function MobileBottomNav() {
  const pathname = usePathname();
  const isExpanded = usePlayerStore(s => s.isExpanded);

  if (isExpanded) return null;

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-[60] flex items-center justify-around"
      style={{
        background: '#000000',
        height: 'calc(60px + env(safe-area-inset-bottom, 0px))',
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
        borderTop: '1px solid rgba(255,255,255,0.08)',
      }}
    >
      {navItems.map((item) => {
        const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
        return (
          <Link
            key={item.name}
            href={item.href}
            className="flex flex-col items-center justify-center gap-1 w-full h-full active:opacity-70 transition-opacity"
          >
            <item.icon
              className={cn(
                'w-[24px] h-[24px] transition-none',
                isActive ? 'text-white fill-current' : 'text-[#B3B3B3]'
              )}
              strokeWidth={isActive ? 2.5 : 2}
            />
            <span className={cn(
              'text-[10px] font-bold transition-none',
              isActive ? 'text-white' : 'text-[#B3B3B3]'
            )}>
              {item.name}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
