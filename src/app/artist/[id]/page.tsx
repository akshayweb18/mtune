'use client';

import { useParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { saavnApi } from '@/services/api';
import { usePlayerStore } from '@/store/usePlayerStore';
import { useLibraryStore } from '@/store/useLibraryStore';
import { Play, Pause, Heart, MoreVertical, ChevronLeft, ListPlus, Shuffle, CheckCircle2 } from 'lucide-react';
import { Song } from '@/types';
import { cn } from '@/lib/utils';
import { AddToPlaylistModal } from '@/components/shared/AddToPlaylistModal';
import { useState } from 'react';

export default function ArtistPage() {
  const { id } = useParams();
  const router = useRouter();
  const { setCurrentSong, setQueue, currentSong, isPlaying, togglePlay, toggleShuffle, isShuffling } = usePlayerStore();
  const { isLiked, toggleLike } = useLibraryStore();
  const [selectedSongForPlaylist, setSelectedSongForPlaylist] = useState<Song | null>(null);
  const [showAll, setShowAll] = useState(false);

  const { data: artist, isLoading: artistLoading, error: artistError } = useQuery({
    queryKey: ['artist', id],
    queryFn: async () => {
      try {
        return await saavnApi.getArtistDetails(id as string);
      } catch {
        return null;
      }
    },
    enabled: !!id,
    retry: 2,
  });

  const { data: songsData, isLoading: songsLoading } = useQuery({
    queryKey: ['artistSongs', id],
    queryFn: async () => {
      try {
        return await saavnApi.getArtistSongs(id as string, 1, 'popularity', 'desc');
      } catch {
        // Fallback: search songs by artist name
        return null;
      }
    },
    enabled: !!id,
    retry: 2,
  });

  // Fallback: search for songs by artist name if direct fetch fails
  const { data: fallbackSongs } = useQuery({
    queryKey: ['artistSongsFallback', artist?.name],
    queryFn: () => saavnApi.searchSongs(artist?.name || '', 1, 20),
    enabled: !!artist?.name && !songsData?.songs?.length,
    staleTime: 5 * 60 * 1000,
  });

  // Loading state
  if (artistLoading || songsLoading) {
    return (
      <div className="min-h-full bg-[#121212]">
        {/* Hero skeleton */}
        <div className="relative h-[40vh] min-h-[300px] bg-[#282828] animate-pulse" />
        <div className="px-4 md:px-8 pt-6 space-y-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 p-2">
              <div className="w-6 h-4 bg-[#282828] rounded animate-pulse" />
              <div className="w-10 h-10 bg-[#282828] rounded animate-pulse shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-3 bg-[#282828] rounded animate-pulse w-3/4" />
                <div className="h-2 bg-[#282828] rounded animate-pulse w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Get songs from either direct fetch or fallback
  const topSongs: Song[] = songsData?.songs || fallbackSongs?.results || [];

  // If even after all attempts artist data is missing, show a proper error state
  if (!artist && !artistLoading) {
    return (
      <div className="min-h-full bg-[#121212] flex flex-col items-center justify-center gap-6 p-8 text-center">
        <div className="w-24 h-24 rounded-full bg-[#282828] flex items-center justify-center">
          <svg className="w-12 h-12 text-[#535353]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
        <div>
          <h2 className="text-[22px] font-black text-white mb-2">Artist not available</h2>
          <p className="text-[#A7A7A7] text-[14px]">We couldn't load this artist. Please try again.</p>
        </div>
        <button
          onClick={() => router.back()}
          className="px-6 py-3 bg-white text-black font-bold rounded-full text-[14px] hover:scale-105 transition-transform"
        >
          Go back
        </button>
      </div>
    );
  }

  const artistImg = artist?.image?.[2]?.url || artist?.image?.[1]?.url || artist?.image?.[0]?.url;
  const isThisArtistPlaying = currentSong?.artists?.primary?.some((a: any) => a.id === artist?.id);
  const displaySongs = showAll ? topSongs : topSongs.slice(0, 10);

  const handlePlaySong = (song: Song, index: number) => {
    if (currentSong?.id === song.id) {
      togglePlay();
    } else {
      setCurrentSong(song);
      setQueue(topSongs.slice(index));
    }
  };

  const handlePlayAll = () => {
    if (topSongs.length > 0) {
      if (isThisArtistPlaying && isPlaying) {
        togglePlay();
      } else {
        setCurrentSong(topSongs[0]);
        setQueue(topSongs);
      }
    }
  };

  const handleShuffle = () => {
    if (topSongs.length > 0) {
      const shuffled = [...topSongs].sort(() => Math.random() - 0.5);
      setCurrentSong(shuffled[0]);
      setQueue(shuffled);
    }
  };

  return (
    <div className="flex flex-col min-h-full bg-[#121212]">

      {/* ── Immersive Hero ── */}
      <div className="relative w-full h-[40vh] min-h-[300px] md:h-[50vh]">
        {/* BG Image */}
        {artistImg ? (
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${artistImg})` }}
          />
        ) : (
          <div className="absolute inset-0 bg-[#282828]" />
        )}

        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-[#121212]/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-transparent" />

        {/* Back Button */}
        <div className="absolute top-0 left-0 right-0 flex items-center justify-between p-4 z-20"
          style={{ paddingTop: 'max(env(safe-area-inset-top, 16px), 16px)' }}
        >
          <button
            onClick={() => router.back()}
            className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white hover:bg-black/60 transition-colors"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white hover:bg-black/60 transition-colors">
            <MoreVertical className="w-5 h-5" />
          </button>
        </div>

        {/* Artist Info */}
        <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
          <p className="text-[12px] font-bold text-white/60 uppercase tracking-widest mb-2">Artist</p>
          <h1 className="text-[42px] md:text-[64px] font-black text-white leading-none tracking-tight mb-1 flex items-center gap-3">
            {artist?.name || 'Artist'}
            <CheckCircle2 className="w-7 h-7 text-[#FFD700] fill-[#FFD700] shrink-0" />
          </h1>
          {artist?.followerCount && (
            <p className="text-[13px] text-white/70 font-medium mt-2">
              {Number(artist.followerCount).toLocaleString('en-IN')} followers
            </p>
          )}
        </div>
      </div>

      {/* ── Controls Row ── */}
      <div className="flex items-center gap-4 px-6 py-5">
        <button
          onClick={handlePlayAll}
          className="w-14 h-14 rounded-full bg-[#FFD700] flex items-center justify-center text-black hover:scale-105 active:scale-95 transition-transform shadow-lg shrink-0"
        >
          {isThisArtistPlaying && isPlaying
            ? <Pause className="w-7 h-7 fill-current" />
            : <Play className="w-7 h-7 fill-current ml-1" />}
        </button>
        <button
          onClick={handleShuffle}
          className={cn(
            'w-10 h-10 flex items-center justify-center transition-colors',
            isShuffling ? 'text-[#FFD700]' : 'text-[#B3B3B3] hover:text-white'
          )}
        >
          <Shuffle className="w-6 h-6" />
        </button>
      </div>

      {/* ── Popular Songs ── */}
      <div className="px-4 md:px-8 pb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[18px] font-black text-white">Popular</h2>
          {topSongs.length > 10 && (
            <button
              onClick={() => setShowAll(!showAll)}
              className="text-[12px] font-bold text-[#A7A7A7] hover:text-white transition-colors"
            >
              {showAll ? 'Show less' : 'See all'}
            </button>
          )}
        </div>

        {topSongs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 rounded-full bg-[#282828] flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-[#535353]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
              </svg>
            </div>
            <p className="text-white font-bold text-[16px] mb-1">No songs available</p>
            <p className="text-[#A7A7A7] text-[13px]">Songs for this artist couldn't be loaded.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-1">
            {displaySongs.map((song, index) => {
              const isCurrentlyPlaying = currentSong?.id === song.id;
              const liked = isLiked(song.id);
              const img = song.image?.[1]?.url || song.image?.[0]?.url;
              const artists = song.artists?.primary?.map((a: any) => a.name).join(', ') || '';

              return (
                <div
                  key={song.id}
                  onClick={() => handlePlaySong(song, index)}
                  className={cn(
                    'flex items-center gap-3 px-2 py-2 rounded-md cursor-pointer group transition-colors',
                    isCurrentlyPlaying ? 'bg-white/10' : 'hover:bg-[#2a2a2a]'
                  )}
                >
                  {/* Index / EQ animation */}
                  <div className="w-6 flex justify-center shrink-0">
                    {isCurrentlyPlaying && isPlaying ? (
                      <div className="flex items-end gap-[2px] h-4">
                        <div className="w-[3px] bg-[#FFD700] animate-[eq-bar_0.8s_ease-in-out_infinite]" style={{ height: '60%' }} />
                        <div className="w-[3px] bg-[#FFD700] animate-[eq-bar_0.8s_ease-in-out_infinite_0.2s]" style={{ height: '100%' }} />
                        <div className="w-[3px] bg-[#FFD700] animate-[eq-bar_0.8s_ease-in-out_infinite_0.4s]" style={{ height: '40%' }} />
                      </div>
                    ) : (
                      <span className={cn('text-[13px] font-bold group-hover:hidden', isCurrentlyPlaying ? 'text-[#FFD700]' : 'text-[#A7A7A7]')}>
                        {index + 1}
                      </span>
                    )}
                    {!isCurrentlyPlaying && (
                      <Play className="w-4 h-4 text-white fill-current hidden group-hover:block" />
                    )}
                  </div>

                  {/* Thumbnail */}
                  <div className="w-10 h-10 rounded-sm overflow-hidden shrink-0 relative">
                    {img ? (
                      <img src={img} alt={song.name} className="w-full h-full object-cover" loading="lazy" />
                    ) : (
                      <div className="w-full h-full bg-[#282828]" />
                    )}
                  </div>

                  {/* Song info */}
                  <div className="flex-1 min-w-0">
                    <h4 className={cn('text-[14px] font-bold truncate', isCurrentlyPlaying ? 'text-[#FFD700]' : 'text-white')}>
                      {song.name}
                    </h4>
                    <p className="text-[12px] text-[#A7A7A7] truncate">{artists}</p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 shrink-0" onClick={e => e.stopPropagation()}>
                    <button
                      className={cn('p-2 transition-colors opacity-0 group-hover:opacity-100', liked ? 'text-[#FFD700]' : 'text-[#A7A7A7] hover:text-white')}
                      onClick={() => toggleLike(song)}
                    >
                      <Heart className={cn('w-4 h-4', liked ? 'fill-current' : '')} />
                    </button>
                    <button
                      className="p-2 text-[#A7A7A7] hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => setSelectedSongForPlaylist(song)}
                    >
                      <ListPlus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <AddToPlaylistModal
        isOpen={!!selectedSongForPlaylist}
        onClose={() => setSelectedSongForPlaylist(null)}
        song={selectedSongForPlaylist}
      />
    </div>
  );
}
