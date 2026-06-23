'use client';

import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { saavnApi } from '@/services/api';
import { usePlayerStore } from '@/store/usePlayerStore';
import { Play, Pause, Heart, MoreVertical, Clock, ListMusic, ListPlus, Trash2 } from 'lucide-react';
import { Song, CustomPlaylist } from '@/types';
import { cn } from '@/lib/utils';
import { useLibraryStore } from '@/store/useLibraryStore';
import { AddToPlaylistModal } from '@/components/shared/AddToPlaylistModal';
import { SongContextMenu } from '@/components/shared/SongContextMenu';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const decodeHtml = (str: string) => str
  .replace(/&quot;/g, '"')
  .replace(/&#x27;/g, "'")
  .replace(/&amp;/g, '&')
  .replace(/&lt;/g, '<')
  .replace(/&gt;/g, '>');

export default function PlaylistPage() {
  const { id } = useParams();
  const router = useRouter();
  const { setCurrentSong, setQueue, currentSong, isPlaying, togglePlay } = usePlayerStore();
  const { isLiked, toggleLike, customPlaylists, removeSongFromPlaylist, deletePlaylist } = useLibraryStore();
  const [selectedSongForPlaylist, setSelectedSongForPlaylist] = useState<Song | null>(null);

  const isCustom = typeof id === 'string' && id.startsWith('custom_');
  const customPlaylist = isCustom ? customPlaylists.find(p => p.id === id) : null;

  const { data: apiPlaylist, isLoading: isApiLoading } = useQuery({
    queryKey: ['playlist', id],
    queryFn: () => saavnApi.getPlaylistDetails(id as string),
    enabled: !!id && !isCustom,
  });

  const isLoading = isCustom ? false : isApiLoading;
  const playlist = isCustom ? customPlaylist : apiPlaylist;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full bg-[#05050A] min-h-[50vh]">
        <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin shadow-[0_0_15px_rgba(168,85,247,0.5)]" />
      </div>
    );
  }

  if (!playlist) return <div className="p-8 text-white flex justify-center py-20 text-xl font-bold">Playlist not found</div>;

  const songs: Song[] = playlist.songs || [];
  
  // Custom playlists might not have an image property directly on the playlist object
  const img = isCustom 
    ? (songs[0]?.image?.[2]?.url || songs[0]?.image?.[0]?.url || '') 
    : (playlist as any).image?.[2]?.url || (playlist as any).image?.[0]?.url;

  const handlePlaySong = (song: Song, index: number) => {
    setCurrentSong(song);
    setQueue(songs.slice(index));
  };

  const handlePlayAll = () => {
    if (songs.length > 0) {
      handlePlaySong(songs[0], 0);
    }
  };

  const handleDeletePlaylist = () => {
    if (isCustom && typeof id === 'string') {
      deletePlaylist(id);
      router.push('/library');
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
        <div className="absolute inset-0 bg-gradient-to-t from-[#05050A] via-[#05050A]/80 to-transparent z-0"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent z-0"></div>

        <div className="relative z-10 flex flex-col md:flex-row items-center md:items-end gap-6 md:gap-8 w-full mt-10 md:mt-0">
          <div className="w-40 h-40 md:w-56 md:h-56 rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] shrink-0 border border-white/10 group">
             {img ? (
               <img src={img} alt={playlist.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
             ) : (
               <div className="w-full h-full bg-white/10 flex items-center justify-center">
                 <ListMusic className="w-12 h-12 text-white/40" />
               </div>
             )}
          </div>
          <div className="flex flex-col flex-1 pb-2 items-center md:items-start text-center md:text-left">
            <span className="text-white/80 font-bold uppercase tracking-widest text-xs md:text-sm mb-2 drop-shadow-md">
              {isCustom ? 'Custom Playlist' : 'Playlist'}
            </span>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white drop-shadow-lg tracking-tight mb-4 line-clamp-2">
              {decodeHtml(playlist.name)}
            </h1>
            <p className="text-white/60 text-sm md:text-base font-medium flex items-center justify-center md:justify-start gap-2 flex-wrap">
               <span className="text-white font-bold">{isCustom ? 'You' : 'Akshay Music'}</span>
               • {(playlist as any).songCount || songs.length} songs
            </p>
            {isCustom && (
              <div className="mt-4 flex justify-center md:justify-start">
                <button 
                  onClick={handleDeletePlaylist}
                  className="px-4 py-2 bg-white/10 hover:bg-red-500/80 text-white rounded-full text-sm font-bold backdrop-blur-md border border-white/20 transition flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" /> Delete Playlist
                </button>
              </div>
            )}
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
              const songImg = song.image?.[1]?.url || song.image?.[0]?.url;
              
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

                  <div className="relative w-10 h-10 md:w-12 md:h-12 rounded-md overflow-hidden shrink-0 mx-3 shadow-md border border-white/5">
                    <img src={songImg} alt={song.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  </div>

                  <div className="flex-1 min-w-0 flex flex-col justify-center pr-4">
                    <h4 className={cn("text-[14px] md:text-base font-bold truncate transition-colors", isActive ? "text-secondary drop-shadow-[0_0_8px_rgba(236,72,153,0.5)]" : "text-white group-hover:text-primary")}>
                      {decodeHtml(song.name)}
                    </h4>
                    <p className="text-[12px] md:text-[13px] text-white/50 truncate font-medium">
                      {decodeHtml(song.artists?.primary?.map((a: any) => a.name).join(', ') || 'Unknown Artist')}
                    </p>
                  </div>

                  <div className="flex items-center shrink-0">
                    <button 
                      onClick={(e) => { e.stopPropagation(); toggleLike(song); }}
                      className="p-2 text-white/40 hover:text-white hover:scale-110 transition-all hidden md:block"
                    >
                      <Heart className={cn("w-5 h-5 transition-colors", isLikedSong ? "fill-secondary text-secondary drop-shadow-[0_0_10px_rgba(236,72,153,0.6)]" : "")} />
                    </button>

                    <SongContextMenu 
                      song={song} 
                      queue={songs} 
                      className="md:opacity-0 md:group-hover:opacity-100" 
                      iconClassName="w-10 h-10" 
                    />

                    {isCustom && (
                      <button 
                        onClick={(e) => { 
                          e.stopPropagation(); 
                          removeSongFromPlaylist(id as string, song.id); 
                        }}
                        className="w-10 h-10 flex items-center justify-center text-white/40 hover:text-red-400 transition"
                        title="Remove from playlist"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    )}
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
