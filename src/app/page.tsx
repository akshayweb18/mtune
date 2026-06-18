'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { saavnApi } from '@/services/api';
import { usePlayerStore } from '@/store/usePlayerStore';
import { Song } from '@/types';
import { Play } from 'lucide-react';
import { cn } from '@/lib/utils';

// ── Language Filter Config ───────────────────────────────────────────────────

type Language = {
  id: string;
  label: string;
  emoji: string;
  songQuery: string;
  albumQuery: string;
  artistQuery: string;
  playlistQuery: string;
};

const LANGUAGES: Language[] = [
  {
    id: 'all',
    label: 'All',
    emoji: '🌍',
    songQuery: 'top trending hollywood bollywood mix 2025 2026',
    albumQuery: 'new album releases 2025 2026',
    artistQuery: 'trending artists 2025 2026',
    playlistQuery: 'best mix 2025 2026',
  },
  {
    id: 'hindi',
    label: 'Hindi',
    emoji: '🇮🇳',
    songQuery: 'top hindi songs 2025 2026',
    albumQuery: 'new hindi album 2025 2026',
    artistQuery: 'bollywood singer',
    playlistQuery: 'hindi hits 2025 2026',
  },
  {
    id: 'english',
    label: 'English',
    emoji: '🇬🇧',
    songQuery: 'top english pop hits 2025 2026',
    albumQuery: 'new english album 2025 2026',
    artistQuery: 'english pop artist',
    playlistQuery: 'english top hits 2025 2026',
  },
  {
    id: 'punjabi',
    label: 'Punjabi',
    emoji: '🎤',
    songQuery: 'top punjabi songs 2025 2026',
    albumQuery: 'new punjabi album 2025 2026',
    artistQuery: 'punjabi singer',
    playlistQuery: 'punjabi hits 2025 2026',
  },
  {
    id: 'tamil',
    label: 'Tamil',
    emoji: '🎵',
    songQuery: 'top tamil songs 2025 2026',
    albumQuery: 'new tamil album 2025 2026',
    artistQuery: 'tamil singer',
    playlistQuery: 'tamil hits 2025 2026',
  },
  {
    id: 'telugu',
    label: 'Telugu',
    emoji: '🎶',
    songQuery: 'top telugu songs 2025 2026',
    albumQuery: 'new telugu album 2025 2026',
    artistQuery: 'telugu singer',
    playlistQuery: 'telugu hits 2025 2026',
  },
  {
    id: 'kannada',
    label: 'Kannada',
    emoji: '🎼',
    songQuery: 'top kannada songs 2025 2026',
    albumQuery: 'new kannada album 2025 2026',
    artistQuery: 'kannada singer',
    playlistQuery: 'kannada hits 2025 2026',
  },
  {
    id: 'malayalam',
    label: 'Malayalam',
    emoji: '🎙️',
    songQuery: 'top malayalam songs 2025 2026',
    albumQuery: 'new malayalam album 2025 2026',
    artistQuery: 'malayalam singer',
    playlistQuery: 'malayalam hits 2025 2026',
  },
];

// Ã¢â€â‚¬Ã¢â€â‚¬ Card Components Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬

function MediaCard({
  title,
  subtitle,
  img,
  isArtist = false,
  onClick,
}: {
  title: string;
  subtitle: string;
  img: string;
  isArtist?: boolean;
  onClick: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className="w-[148px] md:w-[180px] shrink-0 p-3 bg-[#181818] hover:bg-[#282828] rounded-md cursor-pointer group transition-colors duration-200 snap-start"
    >
      <div
        className={cn(
          'relative w-full aspect-square mb-4 shadow-[0_8px_24px_rgba(0,0,0,0.5)]',
          isArtist ? 'rounded-full' : 'rounded-sm'
        )}
      >
        {img ? (
          <img
            src={img}
            alt={title}
            className="w-full h-full object-cover rounded-[inherit]"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full bg-[#282828] rounded-[inherit] flex items-center justify-center">
            <Play className="w-8 h-8 text-white/20" />
          </div>
        )}
        {/* Spotify-style floating play button */}
        <div className="absolute bottom-2 right-2 w-12 h-12 rounded-full bg-[#FFD700] text-black flex items-center justify-center opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200 shadow-xl shadow-black/50 z-10">
          <Play className="w-5 h-5 fill-current ml-0.5" />
        </div>
      </div>
      <h3 className="font-bold text-white text-[14px] truncate mb-1 leading-tight">{title}</h3>
      <p className="text-[12px] text-[#A7A7A7] line-clamp-2 leading-snug">{subtitle}</p>
    </div>
  );
}

function QuickCard({
  title,
  img,
  onClick,
}: {
  title: string;
  img: string;
  onClick: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className="flex items-center gap-3 bg-[#2a2a2a] hover:bg-[#3a3a3a] rounded-md overflow-hidden cursor-pointer group transition-colors duration-150 active:scale-[0.98]"
    >
      <div className="w-14 h-14 shrink-0">
        {img ? (
          <img src={img} alt={title} className="w-full h-full object-cover" loading="lazy" />
        ) : (
          <div className="w-full h-full bg-[#3a3a3a]" />
        )}
      </div>
      <span className="text-[13px] font-bold text-white flex-1 pr-2 truncate">{title}</span>
    </div>
  );
}

function SectionHeader({
  title,
  href,
  onClick,
}: {
  title: string;
  href?: string;
  onClick?: () => void;
}) {
  const router = useRouter();

  const handleShowAll = () => {
    if (onClick) onClick();
    else if (href) router.push(href);
  };

  return (
    <div className="flex items-center justify-between mb-4">
      <h2
        className="text-[22px] font-bold text-white tracking-tight hover:underline cursor-pointer"
        onClick={handleShowAll}
      >
        {title}
      </h2>
      <button
        onClick={handleShowAll}
        className="text-[12px] font-bold text-[#A7A7A7] hover:text-white transition-colors"
      >
        Show all
      </button>
    </div>
  );
}

// Ã¢â€â‚¬Ã¢â€â‚¬ Language Filter Bar Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬

function LanguageFilterBar({
  selected,
  onChange,
}: {
  selected: string;
  onChange: (id: string) => void;
}) {
  return (
    <div className="sticky top-0 z-20 bg-[#121212]/95 backdrop-blur-md">
      <div
        className="flex gap-2 overflow-x-auto scrollbar-hide px-4 md:px-8 py-3"
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        {LANGUAGES.map((lang) => (
          <button
            key={lang.id}
            onClick={() => onChange(lang.id)}
            className={cn(
              'shrink-0 flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[13px] font-bold transition-all duration-200 border',
              selected === lang.id
                ? 'bg-[#FFD700] text-black border-[#FFD700] shadow-[0_0_12px_rgba(255,215,0,0.4)] scale-105'
                : 'bg-[#2a2a2a] text-white border-transparent hover:bg-[#3a3a3a] hover:border-white/10'
            )}
          >
            <span className="text-[15px] leading-none">{lang.emoji}</span>
            <span>{lang.label}</span>
          </button>
        ))}
      </div>
      {/* Divider */}
      <div className="h-px bg-white/5 mx-4 md:mx-8" />
    </div>
  );
}

// Ã¢â€â‚¬Ã¢â€â‚¬ Skeleton Loader Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬

function SectionSkeleton() {
  return (
    <section>
      <div className="h-6 w-40 skeleton rounded mb-4" />
      <div className="flex gap-4 overflow-hidden">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="w-[148px] shrink-0">
            <div className="aspect-square skeleton rounded mb-3" />
            <div className="h-3.5 skeleton rounded mb-2 w-3/4" />
            <div className="h-3 skeleton rounded w-1/2" />
          </div>
        ))}
      </div>
    </section>
  );
}

// Ã¢â€â‚¬Ã¢â€â‚¬ Main Page Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬

export default function Home() {
  const router = useRouter();
  const setCurrentSong = usePlayerStore((s) => s.setCurrentSong);
  const setQueue = usePlayerStore((s) => s.setQueue);
  const [selectedLang, setSelectedLang] = useState('all');

  const lang = LANGUAGES.find((l) => l.id === selectedLang) || LANGUAGES[0];

  const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  };

  // Ã¢â€â‚¬Ã¢â€â‚¬ Queries (all re-run when language changes) Ã¢â€â‚¬Ã¢â€â‚¬
  const { data: songsData, isLoading: songsLoading } = useQuery({
    queryKey: ['home-songs', selectedLang],
    queryFn: () => saavnApi.searchSongs(lang.songQuery, 1, 50),
    staleTime: 5 * 60 * 1000,
  });

  // Latest Trending - only for 'all', shows freshest tracks
  const { data: latestTrendingData, isLoading: latestLoading } = useQuery({
    queryKey: ['home-latest-trending', selectedLang],
    queryFn: () =>
      saavnApi.searchSongs(
        selectedLang === 'all'
          ? 'latest trending bollywood songs 2025 2026'
          : `latest ${lang.label} songs 2025 2026`,
        1,
        50
      ),
    staleTime: 5 * 60 * 1000,
  });

  const { data: albumsData, isLoading: albumsLoading } = useQuery({
    queryKey: ['home-albums', selectedLang],
    queryFn: () => saavnApi.searchAlbums(lang.albumQuery, 1, 10),
    staleTime: 10 * 60 * 1000,
  });

  const { data: artistsData, isLoading: artistsLoading } = useQuery({
    queryKey: ['home-artists', selectedLang],
    queryFn: () => saavnApi.searchArtists(lang.artistQuery, 1, 10),
    staleTime: 10 * 60 * 1000,
  });

  const { data: playlistsData, isLoading: playlistsLoading } = useQuery({
    queryKey: ['home-playlists', selectedLang],
    queryFn: () => saavnApi.searchPlaylists(lang.playlistQuery, 1, 6),
    staleTime: 5 * 60 * 1000,
  });

  // Second song section (bollywood for "all", else same lang hits)
  const { data: moreSongsData } = useQuery({
    queryKey: ['home-more-songs', selectedLang],
    queryFn: () =>
      saavnApi.searchSongs(
        selectedLang === 'all' ? 'bollywood hits 2025 2026' : `${lang.label} hits 2025 2026`,
        1,
        50
      ),
    staleTime: 5 * 60 * 1000,
  });

  // Helper: get image url of a song
  const getImg = (s: Song) => s.image?.[2]?.url || s.image?.[1]?.url || s.image?.[0]?.url || '';

  // Deduplicate across sections by both song ID AND image URL
  const latestTrending: Song[] = (() => {
    const seen = new Set<string>();
    return (latestTrendingData?.results || []).filter((s: Song) => {
      const key = s.id + '|' + getImg(s);
      if (seen.has(s.id) || seen.has(getImg(s))) return false;
      seen.add(s.id); seen.add(getImg(s));
      return true;
    });
  })();

  const latestIds = new Set(latestTrending.map((s) => s.id));
  const latestImgs = new Set(latestTrending.map(getImg).filter(Boolean));

  const songs: Song[] = (() => {
    const seen = new Set<string>([...latestIds]);
    const seenImgs = new Set<string>([...latestImgs]);
    return (songsData?.results || []).filter((s: Song) => {
      const img = getImg(s);
      if (seen.has(s.id) || (img && seenImgs.has(img))) return false;
      seen.add(s.id); if (img) seenImgs.add(img);
      return true;
    });
  })();

  const allUsedIds = new Set([...latestIds, ...songs.map((s) => s.id)]);
  const allUsedImgs = new Set([...latestImgs, ...songs.map(getImg).filter(Boolean)]);

  const moreSongs: Song[] = (() => {
    const seen = new Set<string>([...allUsedIds]);
    const seenImgs = new Set<string>([...allUsedImgs]);
    return (moreSongsData?.results || []).filter((s: Song) => {
      const img = getImg(s);
      if (seen.has(s.id) || (img && seenImgs.has(img))) return false;
      seen.add(s.id); if (img) seenImgs.add(img);
      return true;
    });
  })();

  const albums = albumsData?.results || [];
  const artists = artistsData?.results || [];
  const playlists = playlistsData?.results || [];

  const playSong = (song: Song, queue: Song[]) => {
    setCurrentSong(song);
    setQueue(queue);
  };

  // Quick items grid
  const quickItems = [...playlists.slice(0, 3), ...songs.slice(0, 3)];
  const isLoading = songsLoading || albumsLoading || artistsLoading || playlistsLoading || latestLoading;

  return (
    <div className="min-h-full animate-fade-in">
      {/* Ã¢â€â‚¬Ã¢â€â‚¬ Mobile Header Ã¢â€â‚¬Ã¢â€â‚¬ */}
      <div className="md:hidden flex items-center justify-between px-4 pt-[max(env(safe-area-inset-top,16px),16px)] pb-3">
        <h1 className="text-[22px] font-bold text-white">{getGreeting()}</h1>
        <div className="flex gap-3">
          <div className="w-9 h-9 rounded-full bg-[#535353] overflow-hidden cursor-pointer flex items-center justify-center">
            <span className="text-[14px] font-bold text-white">A</span>
          </div>
        </div>
      </div>

      {/* Ã¢â€â‚¬Ã¢â€â‚¬ Desktop Header Ã¢â€â‚¬Ã¢â€â‚¬ */}
      <div className="hidden md:flex items-center justify-between px-8 pt-8 pb-4">
        <h1 className="text-[32px] font-black text-white tracking-tight">{getGreeting()}</h1>
        <div className="w-9 h-9 rounded-full overflow-hidden cursor-pointer hover:scale-105 transition-transform bg-[#535353] flex items-center justify-center">
          <span className="text-[14px] font-bold text-white">A</span>
        </div>
      </div>

      {/* Ã¢â€â‚¬Ã¢â€â‚¬ Language Filter Bar (sticky) Ã¢â€â‚¬Ã¢â€â‚¬ */}
      <LanguageFilterBar selected={selectedLang} onChange={setSelectedLang} />

      {/* Ã¢â€â‚¬Ã¢â€â‚¬ Page Content Ã¢â€â‚¬Ã¢â€â‚¬ */}
      <div className="px-4 md:px-8 pb-8 flex flex-col gap-8 pt-6">

        {/* Loading state */}
        {isLoading && (
          <>
            <SectionSkeleton />
            <SectionSkeleton />
            <SectionSkeleton />
          </>
        )}

        {!isLoading && (
          <>
            {/* Ã¢â€â‚¬Ã¢â€â‚¬ Quick Play Grid Ã¢â€â‚¬Ã¢â€â‚¬ */}
            {quickItems.length > 0 && (
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-2 md:gap-3">
                {quickItems.map((item: any, i) => {
                  const img =
                    item.image?.[2]?.url || item.image?.[1]?.url || item.image?.[0]?.url || '';
                  const title = item.title || item.name || '';
                  return (
                    <QuickCard
                      key={i}
                      title={title}
                      img={img}
                      onClick={() => {
                        if (item.id) router.push(`/playlist/${item.id}`);
                      }}
                    />
                  );
                })}
              </div>
            )}



            {/* ── 🔥 Latest Trending Songs ── */}
            {latestTrending.length > 0 && (
              <section>
                <SectionHeader
                  title={
                    selectedLang === 'all'
                      ? '🔥 Latest Trending'
                      : `🔥 Latest ${lang.label} Trending`
                  }
                  href={`/search?q=${encodeURIComponent(
                    selectedLang === 'all' ? 'latest trending bollywood songs 2025 2026' : `latest ${lang.label} songs 2025 2026`
                  )}`}
                />
                <div className="flex overflow-x-auto gap-4 md:gap-5 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0 snap-x pb-2">
                  {latestTrending.map((song) => {
                    const img = song.image?.[2]?.url || song.image?.[0]?.url || '';
                    const artistNames = song.artists?.primary?.map((a) => a.name).join(', ') || 'Various Artists';
                    return (
                      <MediaCard
                        key={song.id}
                        title={song.name}
                        subtitle={artistNames}
                        img={img}
                        onClick={() => playSong(song, latestTrending)}
                      />
                    );
                  })}
                </div>
              </section>
            )}

            {/* Ã¢â€â‚¬Ã¢â€â‚¬ Trending Songs Ã¢â€â‚¬Ã¢â€â‚¬ */}
            {songs.length > 0 && (
              <section>
                <SectionHeader
                  title={
                    selectedLang === 'all'
                      ? 'Trending worldwide'
                      : `${lang.label} Trending Songs`
                  }
                  href={`/search?q=${encodeURIComponent(lang.songQuery)}`}
                />
                <div className="flex overflow-x-auto gap-4 md:gap-5 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0 snap-x pb-2">
                  {songs.map((song) => {
                    const img = song.image?.[2]?.url || song.image?.[0]?.url || '';
                    const artistNames = song.artists?.primary?.map((a) => a.name).join(', ') || 'Various Artists';
                    return (
                      <MediaCard
                        key={song.id}
                        title={song.name}
                        subtitle={artistNames}
                        img={img}
                        onClick={() => playSong(song, songs)}
                      />
                    );
                  })}
                </div>
              </section>
            )}

            {/* Ã¢â€â‚¬Ã¢â€â‚¬ New Albums Ã¢â€â‚¬Ã¢â€â‚¬ */}
            {albums.length > 0 && (
              <section>
                <SectionHeader
                  title={
                    selectedLang === 'all' ? 'New releases' : `New ${lang.label} Albums`
                  }
                  href={`/search?q=${encodeURIComponent(lang.albumQuery)}`}
                />
                <div className="flex overflow-x-auto gap-4 md:gap-5 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0 snap-x pb-2">
                  {albums.map((album: any) => {
                    const img = album.image?.[2]?.url || album.image?.[0]?.url || '';
                    return (
                      <MediaCard
                        key={album.id}
                        title={album.name || album.title || ''}
                        subtitle={album.year ? `Album Ã‚Â· ${album.year}` : 'Album'}
                        img={img}
                        onClick={() => router.push(`/album/${album.id}`)}
                      />
                    );
                  })}
                </div>
              </section>
            )}

            {/* Ã¢â€â‚¬Ã¢â€â‚¬ Popular Artists Ã¢â€â‚¬Ã¢â€â‚¬ */}
            {artists.length > 0 && (
              <section>
                <SectionHeader
                  title={
                    selectedLang === 'all' ? 'Popular artists' : `Popular ${lang.label} Artists`
                  }
                  href={`/search?q=${encodeURIComponent(lang.artistQuery)}`}
                />
                <div className="flex overflow-x-auto gap-4 md:gap-5 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0 snap-x pb-2">
                  {artists.map((artist: any) => {
                    const img = artist.image?.[2]?.url || artist.image?.[0]?.url || '';
                    return (
                      <MediaCard
                        key={artist.id}
                        title={artist.name || artist.title || ''}
                        subtitle="Artist"
                        img={img}
                        isArtist
                        onClick={() => router.push(`/artist/${artist.id}`)}
                      />
                    );
                  })}
                </div>
              </section>
            )}

            {/* Ã¢â€â‚¬Ã¢â€â‚¬ More Songs Ã¢â€â‚¬Ã¢â€â‚¬ */}
            {moreSongs.length > 0 && (
              <section>
                <SectionHeader
                  title={
                    selectedLang === 'all' ? 'Bollywood hits' : `${lang.label} Hits`
                  }
                  href={`/search?q=${encodeURIComponent(
                    selectedLang === 'all' ? 'bollywood hits 2025 2025 2026' : `${lang.label} hits 2025 2025 2026`
                  )}`}
                />
                <div className="flex overflow-x-auto gap-4 md:gap-5 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0 snap-x pb-2">
                  {moreSongs.map((song) => {
                    const img = song.image?.[2]?.url || song.image?.[0]?.url || '';
                    const artistNames =
                      song.artists?.primary?.map((a) => a.name).join(', ') || 'Various Artists';
                    return (
                      <MediaCard
                        key={song.id}
                        title={song.name}
                        subtitle={artistNames}
                        img={img}
                        onClick={() => playSong(song, moreSongs)}
                      />
                    );
                  })}
                </div>
              </section>
            )}

            {/* Ã¢â€â‚¬Ã¢â€â‚¬ Made For You Playlists Ã¢â€â‚¬Ã¢â€â‚¬ */}
            {playlists.length > 0 && (
              <section>
                <SectionHeader
                  title={
                    selectedLang === 'all' ? 'Made for you' : `${lang.label} Playlists`
                  }
                  href={`/search?q=${encodeURIComponent(lang.playlistQuery)}`}
                />
                <div className="flex overflow-x-auto gap-4 md:gap-5 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0 snap-x pb-2">
                  {playlists.map((pl: any) => {
                    const img = pl.image?.[2]?.url || pl.image?.[0]?.url || '';
                    return (
                      <MediaCard
                        key={pl.id}
                        title={pl.title || pl.name || ''}
                        subtitle="Playlist"
                        img={img}
                        onClick={() => router.push(`/playlist/${pl.id}`)}
                      />
                    );
                  })}
                </div>
              </section>
            )}
          </>
        )}
      </div>
    </div>
  );
}


