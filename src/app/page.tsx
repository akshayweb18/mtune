'use client';

import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { saavnApi } from '@/services/api';
import { usePlayerStore } from '@/store/usePlayerStore';
import { Song } from '@/types';
import { Play, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

// ── Card Component ──────────────────────────────────────────────────────────

function MediaCard({
  title,
  subtitle,
  img,
  isArtist = false,
  onClick
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
      <div className={cn(
        "relative w-full aspect-square mb-4 shadow-[0_8px_24px_rgba(0,0,0,0.5)]",
        isArtist ? "rounded-full" : "rounded-sm"
      )}>
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

function QuickCard({ title, img, onClick }: { title: string; img: string; onClick: () => void }) {
  return (
    <div
      onClick={onClick}
      className="flex items-center gap-3 bg-[#2a2a2a] hover:bg-[#3a3a3a] rounded-md overflow-hidden cursor-pointer group transition-colors duration-150 active:scale-[0.98]"
    >
      <div className="w-14 h-14 shrink-0">
        {img ? <img src={img} alt={title} className="w-full h-full object-cover" loading="lazy" /> : <div className="w-full h-full bg-[#3a3a3a]" />}
      </div>
      <span className="text-[13px] font-bold text-white flex-1 pr-2 truncate">{title}</span>
    </div>
  );
}

function SectionHeader({ title, href, onClick }: { title: string; href?: string; onClick?: () => void }) {
  const router = useRouter();
  
  const handleShowAll = () => {
    if (onClick) onClick();
    else if (href) router.push(href);
  };

  return (
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-[22px] font-bold text-white tracking-tight hover:underline cursor-pointer" onClick={handleShowAll}>{title}</h2>
      <button onClick={handleShowAll} className="text-[12px] font-bold text-[#A7A7A7] hover:text-white transition-colors">Show all</button>
    </div>
  );
}

// ── Main Page ───────────────────────────────────────────────────────────────

export default function Home() {
  const router = useRouter();
  const setCurrentSong = usePlayerStore((s) => s.setCurrentSong);
  const setQueue = usePlayerStore((s) => s.setQueue);

  const getGreeting = () => {
    const istTime = new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" });
    const h = new Date(istTime).getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const { data: globalTopData } = useQuery({
    queryKey: ['global-top-50'],
    queryFn: () => saavnApi.searchSongs('global top 50 2024', 1, 12),
    staleTime: 5 * 60 * 1000,
  });

  const { data: madeForYouData } = useQuery({
    queryKey: ['made-for-you'],
    queryFn: () => saavnApi.searchPlaylists('mix', 1, 6),
    staleTime: 5 * 60 * 1000,
  });

  const { data: popularArtistsData } = useQuery({
    queryKey: ['popular-artists'],
    queryFn: () => saavnApi.searchArtists('english pop', 1, 10),
    staleTime: 10 * 60 * 1000,
  });

  const { data: newReleasesData } = useQuery({
    queryKey: ['new-releases'],
    queryFn: () => saavnApi.searchAlbums('new hindi 2024', 1, 10),
    staleTime: 10 * 60 * 1000,
  });

  const { data: trendingBollyData } = useQuery({
    queryKey: ['trending-bollywood'],
    queryFn: () => saavnApi.searchSongs('bollywood hits 2024', 1, 12),
    staleTime: 5 * 60 * 1000,
  });

  const globalTopSongs: Song[] = globalTopData?.results || [];
  const trendingBollySongs: Song[] = trendingBollyData?.results || [];
  const madeForYouPlaylists = madeForYouData?.results || [];
  const popularArtists = popularArtistsData?.results || [];
  const newReleases = newReleasesData?.results || [];

  const playSong = (song: Song, queue: Song[]) => {
    setCurrentSong(song);
    setQueue(queue);
  };

  // Quick items for top grid (recent/made for you)
  const quickItems = [
    ...madeForYouPlaylists.slice(0, 3),
    ...globalTopSongs.slice(0, 3),
  ];

  return (
    <div className="min-h-full animate-fade-in">
      {/* Mobile header with user avatar */}
      <div className="md:hidden flex items-center justify-between px-4 pt-[max(env(safe-area-inset-top,16px),16px)] pb-4">
        <h1 className="text-[22px] font-bold text-white">{getGreeting()}</h1>
        <div className="flex gap-3">
          <div className="w-9 h-9 rounded-full bg-[#535353] overflow-hidden cursor-pointer flex items-center justify-center">
            <span className="text-[14px] font-bold text-white">A</span>
          </div>
        </div>
      </div>

      {/* Desktop Header */}
      <div className="hidden md:flex items-center justify-between px-8 pt-8 pb-6">
        <h1 className="text-[32px] font-black text-white tracking-tight">{getGreeting()}</h1>
        <div className="w-9 h-9 rounded-full overflow-hidden cursor-pointer hover:scale-105 transition-transform bg-[#535353] flex items-center justify-center">
          <span className="text-[14px] font-bold text-white">A</span>
        </div>
      </div>

      <div className="px-4 md:px-8 pb-8 flex flex-col gap-8">

        {/* ── Quick Play Grid — Spotify 2-col on mobile, 3-col on desktop ── */}
        {quickItems.length > 0 && (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-2 md:gap-3">
            {quickItems.map((item: any, i) => {
              const img = item.image?.[2]?.url || item.image?.[1]?.url || item.image?.[0]?.url || '';
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

        {/* ── Trending Worldwide ── */}
        {globalTopSongs.length > 0 && (
          <section>
            <SectionHeader title="Trending worldwide" href="/search?q=global top 50 2024" />
            <div className="flex overflow-x-auto gap-4 md:gap-5 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0 snap-x pb-2">
              {globalTopSongs.map((song) => {
                const img = song.image?.[2]?.url || song.image?.[0]?.url || '';
                const artists = song.artists?.primary?.map(a => a.name).join(', ') || 'Various Artists';
                return (
                  <MediaCard
                    key={song.id}
                    title={song.name}
                    subtitle={artists}
                    img={img}
                    onClick={() => playSong(song, globalTopSongs)}
                  />
                );
              })}
            </div>
          </section>
        )}

        {/* ── Made For You ── */}
        {madeForYouPlaylists.length > 0 && (
          <section>
            <SectionHeader title="Made for you" href="/search?q=mix" />
            <div className="flex overflow-x-auto gap-4 md:gap-5 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0 snap-x pb-2">
              {madeForYouPlaylists.map((pl: any) => {
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

        {/* ── Popular Artists ── */}
        {popularArtists.length > 0 && (
          <section>
            <SectionHeader title="Popular artists" href="/search?q=english pop artists" />
            <div className="flex overflow-x-auto gap-4 md:gap-5 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0 snap-x pb-2">
              {popularArtists.map((artist: any) => {
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

        {/* ── Bollywood Hits ── */}
        {trendingBollySongs.length > 0 && (
          <section>
            <SectionHeader title="Bollywood hits" href="/search?q=bollywood hits 2024" />
            <div className="flex overflow-x-auto gap-4 md:gap-5 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0 snap-x pb-2">
              {trendingBollySongs.map((song) => {
                const img = song.image?.[2]?.url || song.image?.[0]?.url || '';
                const artists = song.artists?.primary?.map(a => a.name).join(', ') || 'Various Artists';
                return (
                  <MediaCard
                    key={song.id}
                    title={song.name}
                    subtitle={artists}
                    img={img}
                    onClick={() => playSong(song, trendingBollySongs)}
                  />
                );
              })}
            </div>
          </section>
        )}

        {/* ── New Releases ── */}
        {newReleases.length > 0 && (
          <section>
            <SectionHeader title="New releases" href="/search?q=new hindi 2024 albums" />
            <div className="flex overflow-x-auto gap-4 md:gap-5 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0 snap-x pb-2">
              {newReleases.map((album: any) => {
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

      </div>
    </div>
  );
}
