'use client';

import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { saavnApi } from '@/services/api';
import { usePlayerStore } from '@/store/usePlayerStore';
import { Play, Pause, Heart, MoreVertical, Clock, Disc, ListPlus } from 'lucide-react';
import { Song } from '@/types';
import { cn } from '@/lib/utils';
import { useLibraryStore } from '@/store/useLibraryStore';
import { AddToPlaylistModal } from '@/components/shared/AddToPlaylistModal';
import { useState } from 'react';

export default function AlbumPage() {
  const { id } = useParams();
  const { setCurrentSong, setQueue, currentSong, isPlaying, togglePlay } = usePlayerStore();
  const { isLiked, toggleLike } = useLibraryStore();
  const [selectedSongForPlaylist, setSelectedSongForPlaylist] = useState<Song | null>(null);

  const { data: album, isLoading } = useQuery({
    queryKey: ['album', id],
    queryFn: () => saavnApi.getAlbumDetails(id as string),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full bg-[#05050f]">
        <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin shadow-[0_0_15px_rgba(168,85,247,0.5)]" />
      </div>
    );
  }

  if (!album) return <div className="p-8 text-white">Album not found</div>;

  const songs: Song[] = album.songs || [];
  const img = album.image?.[2]?.url || album.image?.[0]?.url;

  const handlePlaySong = (song: Song, index: number) => {
    setCurrentSong(song);
    setQueue(songs.slice(index));
  };

  const handlePlayAll = () => {
    if (songs.length > 0) {
      handlePlaySong(songs[0], 0);
    }
  };

  return (
    <div className="flex flex-col min-h-full">
      {/* Immersive Hero Header */}
      <div className="relative w-full h-[45vh] min-h-[350px] flex items-end p-6 md:p-10 z-10 overflow-hidden">
        {/* Background Image (Optimized: removed blur-2xl) */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20 scale-110"
          style={{ backgroundImage: `url(${img})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#05050f] via-[#05050f]/80 to-transparent z-0"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-secondary/10 to-transparent z-0"></div>

        <div className="relative z-10 flex flex-col md:flex-row items-center md:items-end gap-6 md:gap-8 w-full mt-10 md:mt-0">
          <div className="w-40 h-40 md:w-56 md:h-56 rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] shrink-0 border border-white/10 group">
            {img ? (
              <img src={img} alt={album.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
            ) : (
              <div className="w-full h-full bg-white/10 flex items-center justify-center">
                <Disc className="w-12 h-12 text-white/40" />
              </div>
            )}
          </div>
          <div className="flex flex-col flex-1 pb-2 items-center md:items-start text-center md:text-left">
            <span className="text-white/80 font-bold uppercase tracking-widest text-xs md:text-sm mb-2 drop-shadow-md">Album</span>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white drop-shadow-lg tracking-tight mb-4 line-clamp-2">
              {album.name}
            </h1>
            <div className="flex items-center justify-center md:justify-start gap-3">
              {album.primaryArtists?.[0] && (
                <div className="w-8 h-8 rounded-full bg-white/10 overflow-hidden shrink-0">
                  <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(album.primaryArtists[0].name)}&background=random`} className="w-full h-full object-cover" />
                </div>
              )}
              <p className="text-white/60 text-sm md:text-base font-medium flex items-center justify-center md:justify-start gap-2 flex-wrap">
                <span className="text-white font-bold">{album.primaryArtists?.map(a => a.name).join(', ') || 'Various Artists'}</span>
                • {(album.year || new Date().getFullYear())} • {songs.length} songs
              </p>
            </div>
          </div>
        </div>

        {/* Floating Neon Play Button */}
        <div className="absolute -bottom-8 right-8 md:right-12 z-20">
          <button
            onClick={handlePlayAll}
            className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-secondary to-primary flex items-center justify-center text-white shadow-[0_0_30px_rgba(236,72,153,0.6)] hover:scale-105 active:scale-95 transition-all"
          >
            <Play className="w-8 h-8 fill-current ml-1.5" />
          </button>
        </div>
      </div>

      {/* Main Content (Songs List) */}
      <div className="px-4 md:px-10 pt-12 max-w-5xl animate-in slide-in-from-bottom-8 duration-500">
        <div className="flex flex-col w-full">
          <div className="flex items-center text-white/40 text-xs font-bold uppercase tracking-wider px-2 md:px-4 pb-4 border-b border-white/10 mb-4">
            <div className="w-8 text-center">#</div>
            <div className="flex-1">Title</div>
            <div className="w-16 text-right hidden md:block"><Clock className="w-4 h-4 ml-auto" /></div>
          </div>

          <div className="flex flex-col gap-1">
            {songs.map((song, index) => {
              const isActive = currentSong?.id === song.id;
              const isLikedSong = isLiked(song.id);

              return (
                <div
                  key={song.id}
                  onClick={() => handlePlaySong(song, index)}
                  className="flex items-center p-2 md:p-3 rounded-xl hover:bg-white/5 active:scale-95 transition-all group cursor-pointer"
                >
                  <div className="w-8 flex justify-center shrink-0 text-white/50 text-sm font-bold">
                    {isActive && isPlaying ? (
                      <div className="flex items-end justify-center gap-[3px] h-4">
                        <div className="w-1 h-3 bg-secondary animate-[eq-bar_1s_infinite]" />
                        <div className="w-1 h-4 bg-secondary animate-[eq-bar_1s_infinite_0.2s]" />
                        <div className="w-1 h-2 bg-secondary animate-[eq-bar_1s_infinite_0.4s]" />
                      </div>
                    ) : (
                      <span className="group-hover:hidden">{index + 1}</span>
                    )}
                    {!isActive && <Play className="w-4 h-4 text-white fill-current hidden group-hover:block drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]" />}
                  </div>

                  <div className="flex-1 min-w-0 flex flex-col justify-center pr-4 ml-3">
                    <h4 className={cn("text-[14px] md:text-base font-bold truncate transition-colors", isActive ? "text-secondary drop-shadow-[0_0_8px_rgba(236,72,153,0.5)]" : "text-white group-hover:text-primary")}>
                      {song.name}
                    </h4>
                    <p className="text-[12px] md:text-[13px] text-white/50 truncate font-medium">
                      {song.artists?.primary?.map((a: any) => a.name).join(', ') || 'Unknown Artist'}
                    </p>
                  </div>

                  <div className="flex items-center shrink-0">
                    <button
                      onClick={(e) => { e.stopPropagation(); toggleLike(song); }}
                      className="p-2 text-white/40 hover:text-white hover:scale-110 transition-all"
                    >
                      <Heart className={cn("w-5 h-5 transition-colors", isLikedSong ? "fill-secondary text-secondary drop-shadow-[0_0_10px_rgba(236,72,153,0.6)]" : "")} />
                    </button>

                    <button
                      onClick={(e) => { e.stopPropagation(); setSelectedSongForPlaylist(song); }}
                      className="p-2 text-white/40 hover:text-white transition touch-sm hidden md:block"
                    >
                      <ListPlus className="w-5 h-5" />
                    </button>

                    <button className="p-2 text-white/40 hover:text-white md:opacity-0 md:group-hover:opacity-100 transition-opacity touch-sm">
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="w-16 text-right hidden md:flex items-center justify-end text-xs text-white/40 font-medium">
                    {Math.floor((song.duration || 0) / 60)}:{String((song.duration || 0) % 60).padStart(2, '0')}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <AddToPlaylistModal
        isOpen={!!selectedSongForPlaylist}
        onClose={() => setSelectedSongForPlaylist(null)}
        song={selectedSongForPlaylist}
      />
    </div>
  );
}
