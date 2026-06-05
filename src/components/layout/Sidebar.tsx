'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Home, Search, Compass, ListMusic, Heart, History, Plus, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { AiMoodMixModal } from '@/components/shared/AiMoodMixModal';

const mainLinks = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'Search', href: '/search', icon: Search },
  { name: 'Discover', href: '/discover', icon: Compass },
];

const libraryLinks = [
  { name: 'Liked Songs', href: '/liked', icon: Heart },
  { name: 'Your Playlists', href: '/playlists', icon: ListMusic },
  { name: 'Recently Played', href: '/history', icon: History },
];

export function Sidebar() {
  const pathname = usePathname();
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);

  return (
    <>
      <aside className="hidden md:flex flex-col w-[260px] h-full bg-[#05050f] border-r border-white/5 p-4 gap-6 pb-[100px] z-10 shrink-0">
        
        {/* Logo */}
        <div className="flex items-center gap-3 px-2 mt-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/20">
            <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
               <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
            </svg>
          </div>
          <span className="text-xl font-bold text-white tracking-tight">Akshay Music</span>
        </div>

        {/* Main Navigation */}
        <nav className="space-y-1">
          {mainLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link 
                key={link.name} 
                href={link.href}
                className={cn(
                  "flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-300 font-medium text-sm group",
                  isActive 
                    ? "bg-gradient-to-r from-primary to-secondary text-white shadow-lg shadow-primary/25" 
                    : "text-white/60 hover:text-white hover:bg-white/5"
                )}
              >
                <link.icon className={cn("w-5 h-5 transition-transform duration-300", isActive ? "scale-110" : "group-hover:scale-110")} />
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Library Section */}
        <div className="flex-1 overflow-y-auto scrollbar-hide flex flex-col gap-2">
          <div className="flex items-center justify-between px-2 mb-2">
            <span className="text-xs font-bold text-white/40 uppercase tracking-wider">Your Library</span>
            <button className="text-white/40 hover:text-white p-1 rounded-full transition hover:bg-white/10">
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-1">
            {libraryLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link 
                  key={link.name} 
                  href={link.href}
                  className={cn(
                    "flex items-center gap-3 px-2 py-2 rounded-xl transition duration-200 text-sm group",
                    isActive ? "bg-white/10" : "hover:bg-white/5"
                  )}
                >
                  <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center shrink-0 transition-transform group-hover:scale-105", 
                    link.name === 'Liked Songs' ? 'bg-gradient-to-br from-primary to-secondary' : 'bg-white/5')}
                  >
                    <link.icon className={cn("w-4 h-4 text-white", link.name === 'Liked Songs' ? 'fill-current' : '')} />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className={cn("truncate font-medium transition-colors", isActive ? "text-white" : "text-white/70 group-hover:text-white")}>{link.name}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* AI Mood Mix Banner */}
        <div 
          onClick={() => setIsAiModalOpen(true)}
          className="mt-auto relative rounded-2xl p-4 overflow-hidden cursor-pointer group"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 border border-white/10 rounded-2xl group-hover:border-primary/50 transition-colors"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary opacity-0 group-hover:opacity-20 transition-opacity duration-500 blur-xl"></div>
          <div className="relative z-10 flex flex-col items-start">
            <h3 className="text-sm font-bold text-white flex items-center gap-1.5 mb-1">
              AI Mood Mix <Sparkles className="w-3.5 h-3.5 text-accent animate-pulse" />
            </h3>
            <p className="text-[11px] text-white/60 mb-3">Let AI find your vibe ✨</p>
            <button className="w-full py-2 rounded-xl bg-gradient-to-r from-primary to-secondary text-white text-xs font-bold shadow-lg shadow-primary/30 group-hover:shadow-primary/50 transition-all">
              Generate Mix
            </button>
          </div>
        </div>
      </aside>

      <AiMoodMixModal isOpen={isAiModalOpen} onClose={() => setIsAiModalOpen(false)} />
    </>
  );
}
