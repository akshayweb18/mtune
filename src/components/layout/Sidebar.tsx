'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Home, Search, Library, Plus, Heart, ListMusic, History } from 'lucide-react';
import { useState } from 'react';
import { CreatePlaylistModal } from '@/components/shared/CreatePlaylistModal';
import { useLibraryStore } from '@/store/useLibraryStore';

const mainLinks = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'Search', href: '/search', icon: Search },
];

export function Sidebar() {
  const pathname = usePathname();
  const [isCreatePlaylistOpen, setIsCreatePlaylistOpen] = useState(false);
  const customPlaylists = useLibraryStore(s => s.customPlaylists);

  return (
    <>
      <aside className="hidden md:flex flex-col w-[240px] h-full bg-black p-2 gap-2 pb-[110px] z-10 shrink-0">

        {/* ── Logo ── */}
        <div className="flex items-center gap-2 px-3 py-4 mb-1">
          <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
          </svg>
          <span className="text-[20px] font-black text-white tracking-tight">MTune</span>
        </div>

        {/* ── Main Nav ── */}
        <nav className="flex flex-col gap-1 px-1">
          {mainLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={cn(
                  'flex items-center gap-4 px-3 py-2.5 rounded-md transition-colors duration-150 font-bold text-[14px]',
                  isActive ? 'text-white bg-[#2a2a2a]' : 'text-[#B3B3B3] hover:text-white hover:bg-[#1a1a1a]'
                )}
              >
                <link.icon className={cn('w-6 h-6', isActive ? 'fill-current' : '')} />
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* ── Divider ── */}
        <div className="h-px bg-white/10 mx-3 my-1" />

        {/* ── Library Section ── */}
        <div className="flex-1 overflow-y-auto flex flex-col px-1 scrollbar-hide">
          <div className="flex items-center justify-between px-3 py-2 mb-1">
            <div className="flex items-center gap-2 text-[#B3B3B3] hover:text-white cursor-pointer group transition-colors">
              <Library className="w-6 h-6" />
              <span className="font-bold text-[14px]">Your Library</span>
            </div>
            <button
              onClick={() => setIsCreatePlaylistOpen(true)}
              className="w-8 h-8 flex items-center justify-center text-[#B3B3B3] hover:text-white rounded-full hover:bg-[#1a1a1a] transition-all"
              title="Create playlist"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>

          {/* Library filter pills */}
          <div className="flex gap-2 px-1 mb-3 flex-wrap">
            <button className="px-3 py-1 rounded-full bg-white text-black text-[12px] font-bold">Playlists</button>
            <button className="px-3 py-1 rounded-full bg-[#2a2a2a] hover:bg-[#3a3a3a] text-white text-[12px] font-bold transition-colors">Artists</button>
          </div>

          {/* Fixed library links */}
          <div className="flex flex-col gap-0.5 mb-2">
            <Link href="/liked" className={cn('flex items-center gap-3 px-2 py-2 rounded-md transition-colors group', pathname === '/liked' ? 'bg-[#2a2a2a]' : 'hover:bg-[#1a1a1a]')}>
              <div className="w-10 h-10 rounded-sm flex items-center justify-center shrink-0" style={{ background: 'linear-gradient(135deg, #450af5, #c4efd9)' }}>
                <Heart className="w-5 h-5 text-white fill-white" />
              </div>
              <div>
                <p className={cn('text-[14px] font-bold truncate', pathname === '/liked' ? 'text-white' : 'text-[#B3B3B3] group-hover:text-white')}>Liked Songs</p>
                <p className="text-[11px] text-[#6a6a6a]">Playlist</p>
              </div>
            </Link>

            <Link href="/history" className={cn('flex items-center gap-3 px-2 py-2 rounded-md transition-colors group', pathname === '/history' ? 'bg-[#2a2a2a]' : 'hover:bg-[#1a1a1a]')}>
              <div className="w-10 h-10 rounded-sm bg-[#333] flex items-center justify-center shrink-0">
                <History className="w-5 h-5 text-[#B3B3B3]" />
              </div>
              <div>
                <p className={cn('text-[14px] font-bold truncate', pathname === '/history' ? 'text-white' : 'text-[#B3B3B3] group-hover:text-white')}>Recently Played</p>
                <p className="text-[11px] text-[#6a6a6a]">Playlist</p>
              </div>
            </Link>
          </div>

          {/* Custom Playlists */}
          {customPlaylists.map((playlist) => {
            const href = `/playlist/${playlist.id}`;
            const isActive = pathname === href;
            const thumb = playlist.songs[0]?.image?.[1]?.url || playlist.songs[0]?.image?.[0]?.url;
            return (
              <Link
                key={playlist.id}
                href={href}
                className={cn('flex items-center gap-3 px-2 py-2 rounded-md transition-colors group', isActive ? 'bg-[#2a2a2a]' : 'hover:bg-[#1a1a1a]')}
              >
                <div className="w-10 h-10 rounded-sm bg-[#282828] flex items-center justify-center overflow-hidden shrink-0">
                  {thumb ? (
                    <img src={thumb} alt={playlist.name} className="w-full h-full object-cover" />
                  ) : (
                    <ListMusic className="w-4 h-4 text-[#6a6a6a]" />
                  )}
                </div>
                <div className="min-w-0">
                  <p className={cn('text-[14px] font-bold truncate', isActive ? 'text-white' : 'text-[#B3B3B3] group-hover:text-white')}>{playlist.name}</p>
                  <p className="text-[11px] text-[#6a6a6a]">Playlist · {playlist.songs.length} songs</p>
                </div>
              </Link>
            );
          })}
        </div>

      </aside>

      <CreatePlaylistModal isOpen={isCreatePlaylistOpen} onClose={() => setIsCreatePlaylistOpen(false)} />
    </>
  );
}
