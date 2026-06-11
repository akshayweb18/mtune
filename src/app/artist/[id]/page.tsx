'use client';

import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { saavnApi } from '@/services/api';
import { usePlayerStore } from '@/store/usePlayerStore';
import { Play, Pause, Heart, MoreVertical, ChevronLeft, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { Song } from '@/types';
import { cn } from '@/lib/utils';

export default function ArtistPage() {
  const { id } = useParams();
  const { setCurrentSong, setQueue, currentSong, isPlaying, togglePlay } = usePlayerStore();

  const { data: artist, isLoading: artistLoading } = useQuery({
    queryKey: ['artist', id],
    queryFn: () => saavnApi.getArtistDetails(id as string),
    enabled: !!id,
  });

  const { data: songsData, isLoading: songsLoading } = useQuery({
    queryKey: ['artistSongs', id],
    queryFn: () => saavnApi.getArtistSongs(id as string, 1, 'popularity', 'desc'),
    enabled: !!id,
  });

  if (artistLoading || songsLoading) {
    return (
      <div className="flex items-center justify-center h-full bg-[#05050f]">
        <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin shadow-[0_0_15px_rgba(168,85,247,0.5)]" />
      </div>
    );
  }

  if (!artist) return <div className="p-8 text-white">Artist not found</div>;

  const topSongs: Song[] = songsData?.songs || [];
  const artistImg = artist.image?.[2]?.url || artist.image?.[1]?.url || artist.image?.[0]?.url;
  const isThisArtistPlaying = currentSong?.artists?.primary?.some((a: any) => a.id === artist.id);

  const handlePlaySong = (song: Song, index: number) => {
    setCurrentSong(song);
    setQueue(topSongs.slice(index));
  };

  const handlePlayAll = () => {
    if (topSongs.length > 0) {
      if (isThisArtistPlaying) {
        togglePlay();
      } else {
        handlePlaySong(topSongs[0], 0);
      }
    }
  };

  return (
    <div className="flex flex-col min-h-full">
      
      {/* Immersive Hero Header */}
      <div className="relative w-full h-[45vh] md:h-[50vh] min-h-[350px]">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${artistImg})` }}
        />
        {/* Gradients to fade into background */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#05050f] via-[#05050f]/60 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#05050f]/80 via-transparent to-transparent hidden md:block"></div>
        
        {/* Top Nav (Mobile mostly) */}
        <div className="absolute top-0 left-0 right-0 p-4 flex items-center justify-between z-20">
          <Link href="/" className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/10 transition-colors">
             <ChevronLeft className="w-6 h-6" />
          </Link>
          <button className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/10 transition-colors">
             <MoreVertical className="w-5 h-5" />
          </button>
        </div>

        {/* Artist Info Content */}
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 z-10">
          <h1 className="text-5xl md:text-7xl font-extrabold text-white drop-shadow-lg tracking-tight mb-2 flex items-center gap-4">
            {artist.name}
            <CheckCircle2 className="w-8 h-8 md:w-10 md:h-10 text-secondary fill-white shadow-xl rounded-full" />
          </h1>
          <p className="text-white/80 font-medium text-sm md:text-base drop-shadow-md mb-6">
            {(28400000).toLocaleString()} Monthly Listeners
          </p>
          
          <div className="flex items-center gap-4">
            <button className="px-6 py-2 rounded-full border border-white/40 text-white font-bold text-sm hover:bg-white/10 hover:border-white transition-all backdrop-blur-sm">
              Follow
            </button>
          </div>
        </div>

        {/* Floating Neon Play Button */}
        <div className="absolute -bottom-8 right-8 z-20">
           <button 
             onClick={handlePlayAll}
             className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-secondary to-primary flex items-center justify-center text-white shadow-[0_0_30px_rgba(236,72,153,0.6)] hover:scale-105 active:scale-95 transition-all"
           >
             {isThisArtistPlaying && isPlaying ? <Pause className="w-8 h-8 fill-current" /> : <Play className="w-8 h-8 fill-current ml-1.5" />}
           </button>
        </div>
      </div>

      {/* Main Content (Popular Songs) */}
      <div className="px-4 md:px-10 pt-8 animate-in slide-in-from-bottom-8 duration-500 max-w-5xl">
        <div className="flex items-end justify-between mb-6">
          <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">Popular Songs</h2>
          <span className="text-xs font-bold text-secondary uppercase tracking-wider hover:underline cursor-pointer">See All</span>
        </div>

        <div className="flex flex-col gap-1 md:gap-2">
          {topSongs.slice(0, 10).map((song, index) => {
            const isCurrentlyPlaying = currentSong?.id === song.id;
            return (
              <div 
                key={song.id}
                onClick={() => handlePlaySong(song, index)}
                className="flex items-center gap-3 md:gap-4 p-2 md:p-3 rounded-xl hover:bg-white/5 active:scale-95 transition-all group cursor-pointer"
              >
                {/* Number or EQ */}
                <div className="w-8 flex justify-center shrink-0 text-white/50 text-sm font-bold">
                  {isCurrentlyPlaying && isPlaying ? (
                    <div className="flex items-end justify-center gap-[3px] h-4">
                      <div className="w-1 h-3 bg-secondary animate-[eq-bar_1s_infinite]" />
                      <div className="w-1 h-4 bg-secondary animate-[eq-bar_1s_infinite_0.2s]" />
                      <div className="w-1 h-2 bg-secondary animate-[eq-bar_1s_infinite_0.4s]" />
                    </div>
                  ) : (
                    <span className="group-hover:hidden">{index + 1}</span>
                  )}
                  {!isCurrentlyPlaying && <Play className="w-4 h-4 text-white fill-current hidden group-hover:block drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]" />}
                </div>
                
                {/* Thumbnail */}
                <div className="relative w-12 h-12 md:w-14 md:h-14 rounded-lg overflow-hidden shrink-0 shadow-md border border-white/5">
                  <img src={song.image?.[2]?.url || song.image?.[0]?.url} alt={song.name} className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <Play className="w-4 h-4 fill-white text-white" />
                  </div>
                </div>
                
                {/* Info */}
                <div className="flex-1 min-w-0 flex flex-col justify-center">
                  <h4 className={cn("text-[15px] md:text-base font-bold truncate transition-colors", isCurrentlyPlaying ? "text-secondary drop-shadow-[0_0_8px_rgba(236,72,153,0.5)]" : "text-white group-hover:text-primary")}>
                    {song.name}
                  </h4>
                  <p className="text-[13px] text-white/50 truncate font-medium">{(song.playCount || Math.floor(Math.random() * 500) + 'M').toLocaleString()} streams</p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3 md:gap-4 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                  <button className="p-2 -mr-1 touch-sm text-white/40 hover:text-white transition-colors">
                    <Heart className="w-5 h-5" />
                  </button>
                  <button className="p-2 touch-sm text-white/40 hover:text-white transition-colors">
                    <MoreVertical className="w-5 h-5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
