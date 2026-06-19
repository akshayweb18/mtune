'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { saavnApi } from '@/services/api';
import { usePlayerStore } from '@/store/usePlayerStore';
import { Song } from '@/types';
import { Play } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';

// ── Language Filter Config ──────────────────────────────────────────────────

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
    albumQuery: 'hits 2025',
    artistQuery: 'arijit singh',
    playlistQuery: 'top 50',
  },
  {
    id: 'hindi',
    label: 'Hindi',
    emoji: '🇮🇳',
    songQuery: 'top hindi songs 2025 2026',
    albumQuery: 'hindi movies',
    artistQuery: 'shreya ghoshal',
    playlistQuery: 'hindi top hits',
  },
  {
    id: 'english',
    label: 'English',
    emoji: '🇬🇧',
    songQuery: 'top english pop hits 2025 2026',
    albumQuery: 'english pop album',
    artistQuery: 'taylor swift',
    playlistQuery: 'english hits',
  },
  {
    id: 'punjabi',
    label: 'Punjabi',
    emoji: '🎤',
    songQuery: 'top punjabi songs 2025 2026',
    albumQuery: 'punjabi hits album',
    artistQuery: 'diljit dosanjh',
    playlistQuery: 'punjabi hits',
  },
  {
    id: 'tamil',
    label: 'Tamil',
    emoji: '🎵',
    songQuery: 'top tamil songs 2025 2026',
    albumQuery: 'tamil album',
    artistQuery: 'anirudh',
    playlistQuery: 'tamil hits',
  },
  {
    id: 'telugu',
    label: 'Telugu',
    emoji: '🎶',
    songQuery: 'top telugu songs 2025 2026',
    albumQuery: 'telugu movies',
    artistQuery: 'devi sri prasad',
    playlistQuery: 'telugu hits',
  },
  {
    id: 'kannada',
    label: 'Kannada',
    emoji: '🎼',
    songQuery: 'top kannada songs 2025 2026',
    albumQuery: 'kannada hits album',
    artistQuery: 'puneeth rajkumar',
    playlistQuery: 'kannada hits',
  },
  {
    id: 'malayalam',
    label: 'Malayalam',
    emoji: '🎙️',
    songQuery: 'top malayalam songs 2025 2026',
    albumQuery: 'malayalam album',
    artistQuery: 'ks chithra',
    playlistQuery: 'malayalam hits',
  },
];

// ── Card Components ──────────────────────────────────────────────────────────

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
        {/* Floating play button */}
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

// ── Language Filter Bar ──────────────────────────────────────────────────────

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
      <div className="h-px bg-white/5 mx-4 md:mx-8" />
    </div>
  );
}

// ── Skeleton Loader ──────────────────────────────────────────────────────────

function SectionSkeleton() {
  return (
    <section>
      <div className="h-6 w-40 skeleton rounded mb-4" />
      <div className="flex gap-4 overflow-hidden">
        {[...Array(6)].map((_, i) => (
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

// ── Main Page ────────────────────────────────────────────────────────────────

export default function Home() {
  const router = useRouter();
  const { user } = useAuth();
  const setCurrentSong = usePlayerStore((s) => s.setCurrentSong);
  const setQueue = usePlayerStore((s) => s.setQueue);
  const [selectedLang, setSelectedLang] = useState('all');

  const lang = LANGUAGES.find((l) => l.id === selectedLang) || LANGUAGES[0];

  const getGreeting = () => {
    const h = new Date().getHours();
    let greeting = '';

    if (h < 12) {
      const mornings = ['Rise and shine', 'Morning vibes', 'Ready for some tunes', 'Good morning'];
      greeting = mornings[Math.floor(Math.random() * mornings.length)];
    } else if (h < 17) {
      const afternoons = ['Afternoon rhythm', 'Mid-day grooves', 'Keep vibing', 'Good afternoon'];
      greeting = afternoons[Math.floor(Math.random() * afternoons.length)];
    } else {
      const evenings = ['Evening chills', 'Night vibes', 'Time to unwind', 'Good evening'];
      greeting = evenings[Math.floor(Math.random() * evenings.length)];
    }
    
    if (user && user.displayName) {
      const firstName = user.displayName.split(' ')[0];
      return (
        <span>
          {greeting}, <span className="text-[#FFD700]">{firstName}</span> ✨
        </span>
      );
    }
    return <span>{greeting} 🎧</span>;
  };

  // ── API Queries ──

  const { data: songsData, isLoading: songsLoading } = useQuery({
    queryKey: ['home-songs', selectedLang],
    queryFn: () => saavnApi.searchSongs(lang.songQuery, 1, 50),
    staleTime: 5 * 60 * 1000,
  });

  const { data: latestTrendingData, isLoading: latestLoading } = useQuery({
    queryKey: ['home-latest-trending', selectedLang],
    queryFn: () =>
      saavnApi.searchSongs(
        selectedLang === 'all'
          ? 'latest trending bollywood songs 2025 2026'
          : `latest ${lang.label} songs 2025 2026`,
        1, 50
      ),
    staleTime: 5 * 60 * 1000,
  });

  const { data: albumsData, isLoading: albumsLoading } = useQuery({
    queryKey: ['home-albums', selectedLang],
    queryFn: () => saavnApi.searchAlbums(lang.albumQuery, 1, 20),
    staleTime: 10 * 60 * 1000,
  });

  const { data: artistsData, isLoading: artistsLoading } = useQuery({
    queryKey: ['home-artists', selectedLang],
    queryFn: () => saavnApi.searchArtists(lang.artistQuery, 1, 20),
    staleTime: 10 * 60 * 1000,
  });

  const { data: playlistsData, isLoading: playlistsLoading } = useQuery({
    queryKey: ['home-playlists', selectedLang],
    queryFn: () => saavnApi.searchPlaylists(lang.playlistQuery, 1, 10),
    staleTime: 5 * 60 * 1000,
  });

  const { data: moreSongsData } = useQuery({
    queryKey: ['home-more-songs', selectedLang],
    queryFn: () =>
      saavnApi.searchSongs(
        selectedLang === 'all' ? 'bollywood hits 2025 2026' : `${lang.label} hits 2025 2026`,
        1, 50
      ),
    staleTime: 5 * 60 * 1000,
  });

  const { data: romanticData } = useQuery({
    queryKey: ['home-romantic', selectedLang],
    queryFn: () =>
      saavnApi.searchSongs(
        selectedLang === 'all'
          ? 'best romantic love songs hindi 2025 2026'
          : `romantic ${lang.label} love songs 2025 2026`,
        1, 50
      ),
    staleTime: 5 * 60 * 1000,
  });

  const { data: chartbustersData } = useQuery({
    queryKey: ['home-chartbusters', selectedLang],
    queryFn: () =>
      saavnApi.searchSongs(
        selectedLang === 'all'
          ? 'chart busters top 2026 hindi pop songs new'
          : `chart busters ${lang.label} top songs 2026`,
        1, 50
      ),
    staleTime: 5 * 60 * 1000,
  });

  const { data: bollywood2025Data } = useQuery({
    queryKey: ['home-bollywood2025', selectedLang],
    queryFn: () =>
      saavnApi.searchSongs(
        selectedLang === 'all'
          ? 'bollywood new songs 2025 latest hit'
          : `${lang.label} new songs 2025 latest hit`,
        1, 50
      ),
    staleTime: 5 * 60 * 1000,
  });

  const { data: bollywoodDance2025Data } = useQuery({
    queryKey: ['home-bollywood-dance', selectedLang],
    queryFn: () =>
      saavnApi.searchSongs(
        selectedLang === 'all'
          ? 'latest bollywood dance hits 2025 2026'
          : `latest ${lang.label} dance hits 2025`,
        1, 50
      ),
    staleTime: 5 * 60 * 1000,
  });

  const { data: bollywoodRomance2025Data } = useQuery({
    queryKey: ['home-bollywood-romance', selectedLang],
    queryFn: () =>
      saavnApi.searchSongs(
        selectedLang === 'all'
          ? 'latest bollywood romantic love songs 2025 2026'
          : `latest ${lang.label} romantic songs 2025`,
        1, 50
      ),
    staleTime: 5 * 60 * 1000,
  });

  const { data: bollywoodTop50Data } = useQuery({
    queryKey: ['home-bollywood-top50', selectedLang],
    queryFn: () =>
      saavnApi.searchSongs(
        selectedLang === 'all'
          ? 'top 50 bollywood latest songs 2025 2026'
          : `top 50 ${lang.label} latest songs 2025`,
        1, 50
      ),
    staleTime: 5 * 60 * 1000,
  });

  const { data: topHits2025Data } = useQuery({
    queryKey: ['home-tophits2025', selectedLang],
    queryFn: () =>
      saavnApi.searchSongs(
        selectedLang === 'all'
          ? 'top hits 2025 india trending viral songs'
          : `top hits ${lang.label} 2025 trending viral`,
        1, 50
      ),
    staleTime: 5 * 60 * 1000,
  });

  const { data: partyData } = useQuery({
    queryKey: ['home-party', selectedLang],
    queryFn: () =>
      saavnApi.searchSongs(
        selectedLang === 'all'
          ? 'top party dance songs bollywood 2024 2025'
          : `party ${lang.label} dance songs 2025`,
        1, 50
      ),
    staleTime: 5 * 60 * 1000,
  });

  const { data: workoutData } = useQuery({
    queryKey: ['home-workout', selectedLang],
    queryFn: () =>
      saavnApi.searchSongs(
        selectedLang === 'all'
          ? 'high energy gym workout songs hindi english'
          : `${lang.label} energetic songs workout`,
        1, 50
      ),
    staleTime: 5 * 60 * 1000,
  });

  const { data: sadData } = useQuery({
    queryKey: ['home-sad', selectedLang],
    queryFn: () =>
      saavnApi.searchSongs(
        selectedLang === 'all'
          ? 'best sad emotional songs hindi 2024 2025'
          : `sad emotional ${lang.label} songs`,
        1, 50
      ),
    staleTime: 5 * 60 * 1000,
  });

  const { data: classicData } = useQuery({
    queryKey: ['home-classic', selectedLang],
    queryFn: () =>
      saavnApi.searchSongs(
        selectedLang === 'all'
          ? 'all time classic bollywood evergreen songs'
          : `classic ${lang.label} evergreen songs`,
        1, 50
      ),
    staleTime: 10 * 60 * 1000,
  });

  const { data: newReleasesData } = useQuery({
    queryKey: ['home-new-releases', selectedLang],
    queryFn: () =>
      saavnApi.searchSongs(
        selectedLang === 'all'
          ? 'latest new bollywood hindi movie songs 2025'
          : `new ${lang.label} movie songs 2025 latest`,
        1, 50
      ),
    staleTime: 5 * 60 * 1000,
  });

  const { data: indieData } = useQuery({
    queryKey: ['home-indie', selectedLang],
    queryFn: () =>
      saavnApi.searchSongs(
        selectedLang === 'all'
          ? 'best indie pop hindi independent music 2024 2025'
          : `${lang.label} indie independent songs`,
        1, 50
      ),
    staleTime: 5 * 60 * 1000,
  });

  const { data: movieData } = useQuery({
    queryKey: ['home-movie', selectedLang],
    queryFn: () =>
      saavnApi.searchSongs(
        selectedLang === 'all'
          ? 'superhit bollywood movie songs 2024 2025'
          : `superhit ${lang.label} movie songs 2024 2025`,
        1, 50
      ),
    staleTime: 5 * 60 * 1000,
  });

  const { data: devotionalData } = useQuery({
    queryKey: ['home-devotional'],
    queryFn: () => saavnApi.searchSongs('bhakti devotional bhajan songs 2024 2025 top', 1, 50),
    staleTime: 10 * 60 * 1000,
  });

  const { data: bhaktiHinduData } = useQuery({
    queryKey: ['home-bhakti-hindu'],
    queryFn: () => saavnApi.searchSongs('hindu bhakti aarti chalisa bhajan mantra top', 1, 50),
    staleTime: 10 * 60 * 1000,
  });

  // ── Helper ──
  const getImg = (s: Song) => s.image?.[2]?.url || s.image?.[1]?.url || s.image?.[0]?.url || '';

  // ── Sequential deduplication — each section gets fresh unique songs ──
  const usedIds = new Set<string>();
  const usedImgs = new Set<string>();

  const dedup = (results: Song[]): Song[] => {
    const out: Song[] = [];
    for (const s of results || []) {
      const img = getImg(s);
      if (usedIds.has(s.id) || (img && usedImgs.has(img))) continue;
      
      // Exclude specific unwanted songs
      const titleLower = (s.name || s.title || '').toLowerCase();
      if (titleLower.includes('mere hussain') || titleLower.includes('naat')) continue;

      usedIds.add(s.id);
      if (img) usedImgs.add(img);
      out.push(s);
    }
    return out;
  };

  const latestTrending  = dedup(latestTrendingData?.results  || []);
  const newReleases     = dedup(newReleasesData?.results     || []);
  const songs           = dedup(songsData?.results           || []);
  const moreSongs       = dedup(moreSongsData?.results       || []);
  const romanticSongs   = dedup(romanticData?.results        || []);
  const movieSongs      = dedup(movieData?.results           || []);
  const partySongs      = dedup(partyData?.results           || []);
  const workoutSongs    = dedup(workoutData?.results         || []);
  const sadSongs        = dedup(sadData?.results             || []);
  const indieSongs      = dedup(indieData?.results           || []);
  const classicSongs      = dedup(classicData?.results         || []);
  const devotionalSongs   = dedup(devotionalData?.results      || []);
  const bhaktiHinduSongs  = dedup(bhaktiHinduData?.results     || []);
  const chartbusters      = dedup(chartbustersData?.results    || []);
  const bollywood2025     = dedup(bollywood2025Data?.results   || []);
  const bollywoodDance    = dedup(bollywoodDance2025Data?.results || []);
  const bollywoodRomance  = dedup(bollywoodRomance2025Data?.results || []);
  const bollywoodTop50    = dedup(bollywoodTop50Data?.results  || []);
  const topHits2025       = dedup(topHits2025Data?.results     || []);

  const albums    = albumsData?.results    || [];
  const artists   = artistsData?.results   || [];
  const playlists = playlistsData?.results || [];

  const playSong = (song: Song, queue: Song[]) => {
    setCurrentSong(song);
    setQueue(queue);
  };

  const quickItems = [...playlists.slice(0, 3), ...songs.slice(0, 3)];
  const isLoading = songsLoading || albumsLoading || artistsLoading || playlistsLoading || latestLoading;

  // ── Reusable Song Row Component ──
  const SongRow = ({
    songs: list,
    label,
    href,
  }: {
    songs: Song[];
    label: string;
    href: string;
  }) => {
    if (!list.length) return null;
    return (
      <section>
        <SectionHeader title={label} href={href} />
        <div className="flex overflow-x-auto gap-4 md:gap-5 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0 snap-x pb-2">
          {list.map((song) => {
            const img = song.image?.[2]?.url || song.image?.[0]?.url || '';
            const artistNames =
              song.artists?.primary?.map((a) => a.name).join(', ') || 'Various Artists';
            return (
              <MediaCard
                key={song.id}
                title={song.name}
                subtitle={artistNames}
                img={img}
                onClick={() => playSong(song, list)}
              />
            );
          })}
        </div>
      </section>
    );
  };

  return (
    <div className="min-h-full animate-fade-in">
      {/* ── Mobile Header ── */}
      <div className="md:hidden flex items-center justify-between px-4 pt-[max(env(safe-area-inset-top,16px),16px)] pb-3">
        <h1 className="text-[22px] font-bold text-white">{getGreeting()}</h1>
      </div>

      {/* ── Desktop Header ── */}
      <div className="hidden md:flex items-center justify-between px-8 pt-8 pb-4">
        <h1 className="text-[32px] font-black text-white tracking-tight">{getGreeting()}</h1>
      </div>

      {/* ── Language Filter Bar ── */}
      <LanguageFilterBar selected={selectedLang} onChange={setSelectedLang} />

      {/* ── Main Content ── */}
      <div className="px-4 md:px-8 pb-8 flex flex-col gap-10 pt-6">

        {/* Skeletons while loading */}
        {isLoading && (
          <>
            <SectionSkeleton />
            <SectionSkeleton />
            <SectionSkeleton />
            <SectionSkeleton />
          </>
        )}

        {!isLoading && (
          <>
            {/* Quick Play Grid */}
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

            {/* 1. 🔥 Latest Trending */}
            <SongRow
              songs={latestTrending}
              label={
                selectedLang === 'all' ? '🔥 Latest Trending' : `🔥 Latest ${lang.label} Trending`
              }
              href={`/search?q=${encodeURIComponent(
                selectedLang === 'all'
                  ? 'latest trending bollywood songs 2025 2026'
                  : `latest ${lang.label} songs 2025`
              )}`}
            />

            {/* 2. 🆕 New Releases */}
            <SongRow
              songs={newReleases}
              label={
                selectedLang === 'all' ? '🆕 New Releases' : `🆕 New ${lang.label} Releases`
              }
              href={`/search?q=${encodeURIComponent(
                selectedLang === 'all'
                  ? 'new hindi songs june 2025 latest'
                  : `new ${lang.label} songs 2025`
              )}`}
            />

            {/* 3. 🌍 Trending Worldwide */}
            <SongRow
              songs={songs}
              label={
                selectedLang === 'all' ? '🌍 Trending Worldwide' : `🌍 ${lang.label} Trending`
              }
              href={`/search?q=${encodeURIComponent(lang.songQuery)}`}
            />

            {/* 4. 💿 New Albums */}
            {albums.length > 0 && (
              <section>
                <SectionHeader
                  title={
                    selectedLang === 'all' ? '💿 New Albums' : `💿 New ${lang.label} Albums`
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
                        subtitle={album.year ? `Album · ${album.year}` : 'Album'}
                        img={img}
                        onClick={() => router.push(`/album/${album.id}`)}
                      />
                    );
                  })}
                </div>
              </section>
            )}

            {/* 5. ❤️ Romantic Hits */}
            <SongRow
              songs={romanticSongs}
              label={
                selectedLang === 'all'
                  ? '❤️ Romantic Hits'
                  : `❤️ ${lang.label} Romantic Songs`
              }
              href={`/search?q=${encodeURIComponent(
                selectedLang === 'all'
                  ? 'romantic love songs hindi 2024 2025'
                  : `romantic ${lang.label} songs`
              )}`}
            />

            {/* 6. 🎬 Superhit Movie Songs */}
            <SongRow
              songs={movieSongs}
              label={
                selectedLang === 'all'
                  ? '🎬 Superhit Movie Songs'
                  : `🎬 ${lang.label} Movie Songs`
              }
              href={`/search?q=${encodeURIComponent(
                selectedLang === 'all'
                  ? 'superhit bollywood movie songs 2024 2025'
                  : `superhit ${lang.label} movie songs`
              )}`}
            />

            {/* 7. 🎤 Popular Artists */}
            {artists.length > 0 && (
              <section>
                <SectionHeader
                  title={
                    selectedLang === 'all'
                      ? '🎤 Popular Artists'
                      : `🎤 Popular ${lang.label} Artists`
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

            {/* 8. 🎉 Party Anthems */}
            <SongRow
              songs={partySongs}
              label={
                selectedLang === 'all' ? '🎉 Party Anthems' : `🎉 ${lang.label} Party Songs`
              }
              href={`/search?q=${encodeURIComponent(
                selectedLang === 'all'
                  ? 'top party dance songs bollywood 2025'
                  : `party ${lang.label} dance songs`
              )}`}
            />


            {/* 10. 😢 Sad & Emotional */}
            <SongRow
              songs={sadSongs}
              label={
                selectedLang === 'all'
                  ? '😢 Sad & Emotional'
                  : `😢 ${lang.label} Sad Songs`
              }
              href={`/search?q=${encodeURIComponent(
                selectedLang === 'all'
                  ? 'sad emotional songs hindi 2024 2025'
                  : `sad ${lang.label} songs`
              )}`}
            />

            {/* 11. 🏆 Bollywood Hits */}
            <SongRow
              songs={moreSongs}
              label={
                selectedLang === 'all' ? '🏆 Bollywood Hits' : `🏆 ${lang.label} Hits`
              }
              href={`/search?q=${encodeURIComponent(
                selectedLang === 'all'
                  ? 'bollywood hits 2025 2026'
                  : `${lang.label} hits 2025`
              )}`}
            />

            {/* 12. 🎸 Indie & Independent */}
            <SongRow
              songs={indieSongs}
              label={
                selectedLang === 'all'
                  ? '🎸 Indie & Independent'
                  : `🎸 ${lang.label} Indie Songs`
              }
              href={`/search?q=${encodeURIComponent(
                selectedLang === 'all'
                  ? 'indie pop hindi independent music 2024 2025'
                  : `${lang.label} indie songs`
              )}`}
            />

            {/* 13. 🌟 All Time Classics */}
            <SongRow
              songs={classicSongs}
              label={
                selectedLang === 'all'
                  ? '🌟 All Time Classics'
                  : `🌟 ${lang.label} Classics`
              }
              href={`/search?q=${encodeURIComponent(
                selectedLang === 'all'
                  ? 'all time classic bollywood evergreen songs'
                  : `classic ${lang.label} evergreen songs`
              )}`}
            />

            {/* 14. 📊 Chart Busters 2026 */}
            <SongRow
              songs={chartbusters}
              label={selectedLang === 'all' ? '📊 Chart Busters 2026' : `📊 ${lang.label} Chart Busters 2026`}
              href={`/search?q=${encodeURIComponent(selectedLang === 'all' ? 'chart busters top 2026 hindi pop songs new' : `chart busters ${lang.label} top songs 2026`)}`}
            />

            {/* 15. 🎧 Bollywood 2025 */}
            <SongRow
              songs={bollywood2025}
              label={selectedLang === 'all' ? '🎧 Bollywood 2025' : `🎧 ${lang.label} 2025 Songs`}
              href={`/search?q=${encodeURIComponent(selectedLang === 'all' ? 'bollywood new songs 2025 latest hit' : `${lang.label} new songs 2025 latest hit`)}`}
            />

            {/* 16. 💃 Latest Bollywood Dance */}
            <SongRow
              songs={bollywoodDance}
              label={selectedLang === 'all' ? '💃 Latest Bollywood Dance' : `💃 Latest ${lang.label} Dance`}
              href={`/search?q=${encodeURIComponent(selectedLang === 'all' ? 'latest bollywood dance hits 2025 2026' : `latest ${lang.label} dance hits 2025`)}`}
            />

            {/* 17. 💖 Latest Bollywood Romance */}
            <SongRow
              songs={bollywoodRomance}
              label={selectedLang === 'all' ? '💖 Latest Bollywood Romance' : `💖 Latest ${lang.label} Romance`}
              href={`/search?q=${encodeURIComponent(selectedLang === 'all' ? 'latest bollywood romantic love songs 2025 2026' : `latest ${lang.label} romantic songs 2025`)}`}
            />

            {/* 18. 🌟 Top 50 Bollywood Latest */}
            <SongRow
              songs={bollywoodTop50}
              label={selectedLang === 'all' ? '🌟 Top 50 Bollywood Latest' : `🌟 Top 50 ${lang.label} Latest`}
              href={`/search?q=${encodeURIComponent(selectedLang === 'all' ? 'top 50 bollywood latest songs 2025 2026' : `top 50 ${lang.label} latest songs 2025`)}`}
            />

            {/* 19. 🚀 Top Viral Hits 2025 */}
            <SongRow
              songs={topHits2025}
              label={selectedLang === 'all' ? '🚀 Top Viral Hits 2025' : `🚀 Top ${lang.label} Viral 2025`}
              href={`/search?q=${encodeURIComponent(selectedLang === 'all' ? 'top hits 2025 india trending viral songs' : `top hits ${lang.label} 2025 trending viral`)}`}
            />

            {/* 20. 🙏 Devotional & Bhakti */}
            <SongRow
              songs={devotionalSongs}
              label="🙏 Devotional & Bhakti"
              href="/search?q=bhakti+devotional+bhajan+songs+2025"
            />

            {/* 15. 🎵 Made For You Playlists */}
            {playlists.length > 0 && (
              <section>
                <SectionHeader
                  title={
                    selectedLang === 'all' ? '🎵 Made For You' : `🎵 ${lang.label} Playlists`
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

            {/* 21. 🕉️ Hindu Bhakti & Aarti */}
            <SongRow
              songs={bhaktiHinduSongs}
              label="🕉️ Hindu Bhakti & Aarti"
              href="/search?q=hindu+bhakti+aarti+chalisa+bhajan"
            />

            {/* 22. 💪 Workout Bangers */}
            <SongRow
              songs={workoutSongs}
              label={
                selectedLang === 'all'
                  ? '💪 Workout Bangers'
                  : `💪 ${lang.label} Energy Songs`
              }
              href="/search?q=gym+workout+energy+songs+hindi+english"
            />
          </>
        )}
      </div>
    </div>
  );
}
