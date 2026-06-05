'use client';

import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { saavnApi } from '@/services/api';
import { usePlayerStore } from '@/store/usePlayerStore';
import { Song } from '@/types';
import { Play, Shuffle, Music, Mic2, Heart, Clock, Bell, Search, History, Moon, Sun, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

const topMixes = [
  { title: 'Chill Vibes', color: 'from-blue-600 to-indigo-500', count: '32 songs', icon: <Moon className="w-5 h-5 text-white" /> },
  { title: 'Focus Mode', color: 'from-emerald-600 to-teal-500', count: '24 songs', icon: <div className="w-5 h-5 bg-white/20 rounded-full" /> },
  { title: 'Workout Mix', color: 'from-orange-600 to-red-500', count: '28 songs', icon: <div className="w-5 h-5 bg-white/20 rounded-sm" /> },
  { title: 'Romantic Hits', color: 'from-pink-600 to-rose-500', count: '21 songs', icon: <Heart className="w-5 h-5 text-white" /> },
];

function CompactSongCard({ song, onPlay }: { song: Song; onPlay: (song: Song) => void }) {
  const img = song.image?.[2]?.url || song.image?.[1]?.url || song.image?.[0]?.url || '';
  return (
    <div 
      className="w-[150px] md:w-[180px] shrink-0 group cursor-pointer tap-highlight-transparent snap-start" 
      onClick={() => onPlay(song)}
    >
      <div className="relative w-full aspect-square rounded-2xl overflow-hidden mb-3 shadow-lg border border-white/5">
        <img src={img} alt={song.name} className="object-cover w-full h-full" loading="lazy" decoding="async" />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center" style={{ transition: 'opacity 0.2s' }}>
          <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white shadow-lg">
            <Play className="w-5 h-5 fill-current ml-1" />
          </div>
        </div>
      </div>
      <h3 className="font-bold text-white text-[14px] md:text-[15px] truncate mb-0.5">{song.name}</h3>
      <p className="text-[12px] md:text-[13px] text-white/50 truncate">{song.artists?.primary?.[0]?.name || 'Unknown'}</p>
    </div>
  );
}

function CompactPlaylistCard({ playlist, onClick }: { playlist: any; onClick: (id: string) => void }) {
  const img = playlist.image?.[2]?.url || playlist.image?.[1]?.url || playlist.image?.[0]?.url || '';
  return (
    <div 
      className="w-[150px] md:w-[180px] shrink-0 group cursor-pointer tap-highlight-transparent snap-start" 
      onClick={() => onClick(playlist.id)}
    >
      <div className="relative w-full aspect-square rounded-2xl overflow-hidden mb-3 shadow-lg border border-white/5">
        <img src={img} alt={playlist.title || playlist.name} className="object-cover w-full h-full" loading="lazy" decoding="async" />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center" style={{ transition: 'opacity 0.2s' }}>
          <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white shadow-lg">
            <Play className="w-5 h-5 fill-current ml-1" />
          </div>
        </div>
      </div>
      <h3 className="font-bold text-white text-[14px] md:text-[15px] truncate mb-0.5">{playlist.title || playlist.name}</h3>
      <p className="text-[12px] md:text-[13px] text-white/50 truncate">Playlist • {(playlist.songCount || Math.floor(Math.random() * 40) + 10)} Songs</p>
    </div>
  );
}

export default function Home() {
  const router = useRouter();
  const setCurrentSong = usePlayerStore((s) => s.setCurrentSong);
  const setQueue = usePlayerStore((s) => s.setQueue);
  const isPlaying = usePlayerStore((s) => s.isPlaying);
  const togglePlay = usePlayerStore((s) => s.togglePlay);

  const { data: playlistData, isLoading } = useQuery({
    queryKey: ['featured-playlists-2024'],
    queryFn: () => saavnApi.searchPlaylists('latest hindi 2024', 1, 10),
  });

  const featuredPlaylists = playlistData?.results || [];

  const { data: mixData } = useQuery({
    queryKey: ['hero-mix-songs'],
    queryFn: () => saavnApi.searchSongs('party mix', 1, 10),
  });
  const heroSongs = mixData?.results || [];

  const { data: latestData, isLoading: latestLoading } = useQuery({
    queryKey: ['latest-songs-home'],
    queryFn: () => saavnApi.searchSongs('latest hindi songs 2024', 1, 10),
  });

  const latestSongs: Song[] = latestData?.results || [];

  const handlePlayLatest = (song: Song) => {
    setCurrentSong(song);
    setQueue(latestSongs);
  };

  const handlePlayMixClick = () => {
    if (heroSongs.length > 0) {
      setCurrentSong(heroSongs[0]);
      setQueue(heroSongs);
      if (!isPlaying) togglePlay();
    }
  };

  const handleShuffleClick = () => {
    if (heroSongs.length > 0) {
      const shuffled = [...heroSongs].sort(() => Math.random() - 0.5);
      setCurrentSong(shuffled[0]);
      setQueue(shuffled);
      if (!isPlaying) togglePlay();
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="max-w-7xl mx-auto flex flex-col gap-10 pb-[120px] pt-4 md:pt-8 px-4 md:px-8">
      
      {/* Top Header - Mobile Only */}
      <div className="md:hidden flex items-center justify-between mb-2">
        <div className="flex flex-col">
          <h1 className="text-sm text-white/60 font-medium">{getGreeting()},</h1>
          <h2 className="text-2xl font-bold text-white">Akshay <span className="text-xl">👋</span></h2>
        </div>
        <div className="flex items-center gap-4">
          <button className="text-white hover:text-primary transition"><Bell className="w-6 h-6" /></button>
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary overflow-hidden border border-white/20">
            <img src="https://i.pravatar.cc/150?u=a042581f4e29026704d" alt="Profile" className="w-full h-full object-cover" />
          </div>
        </div>
      </div>

      {/* Top Header - Desktop Search & Actions */}
      <div className="hidden md:flex items-center justify-between">
        <div className="relative w-[360px]">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
          <input 
            type="text" 
            placeholder="Search songs, artists, albums..." 
            className="w-full h-11 bg-white/5 border border-white/10 rounded-full pl-11 pr-4 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-all"
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1 text-[10px] text-white/40 border border-white/10 px-1.5 rounded bg-white/5">
            <span>⌘K</span>
          </div>
        </div>
        <div className="flex items-center gap-5">
          <button className="text-white/60 hover:text-white transition"><Bell className="w-5 h-5" /></button>
          <button className="text-white/60 hover:text-white transition"><Moon className="w-5 h-5" /></button>
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-secondary overflow-hidden border-2 border-primary cursor-pointer shadow-[0_0_15px_rgba(168,85,247,0.5)]">
             <img src="https://i.pravatar.cc/150?u=a042581f4e29026704d" alt="Profile" className="w-full h-full object-cover" />
          </div>
        </div>
      </div>

      {/* Huge Glowing Hero Card - Desktop Only */}
      <div className="hidden md:flex relative w-full rounded-3xl overflow-hidden bg-[#0A0A15] border border-white/10 shadow-2xl p-8 items-center justify-between">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1614149162883-504ce4d13909?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center opacity-20 mix-blend-screen"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#05050f] via-[#05050f]/80 to-transparent z-0"></div>
        
        {/* Glow Effects (Optimized for performance) */}
        <div className="absolute right-20 top-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-primary/40 rounded-full blur-[60px] opacity-60"></div>
        <div className="absolute right-40 top-1/2 -translate-y-1/2 w-[200px] h-[200px] bg-secondary/40 rounded-full blur-[60px] opacity-60"></div>
        
        <div className="relative z-10 flex flex-col max-w-xl">
          <h1 className="text-5xl font-extrabold text-white mb-3 drop-shadow-lg tracking-tight">
            {getGreeting()}, <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Akshay!</span> 👋
          </h1>
          <p className="text-lg text-white/70 mb-8 font-medium">Let's enjoy some amazing music today.</p>
          
          <div className="flex items-center gap-4 mb-10">
            <button 
              onClick={handlePlayMixClick}
              className="flex items-center gap-2 px-8 py-3.5 rounded-full bg-gradient-to-r from-primary to-secondary text-white font-bold text-[15px] shadow-[0_0_20px_rgba(168,85,247,0.5)] hover:scale-105 active:scale-95 transition-all"
            >
              <Play className="w-5 h-5 fill-current" /> Play Your Mix
            </button>
            <button 
              onClick={handleShuffleClick}
              className="flex items-center gap-2 px-8 py-3.5 rounded-full bg-white/5 border border-white/10 text-white font-bold text-[15px] hover:bg-white/10 transition-all backdrop-blur-md"
            >
              <Shuffle className="w-5 h-5" /> Shuffle
            </button>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
              <div className="w-10 h-10 rounded-xl bg-pink-500/20 flex items-center justify-center text-pink-500"><Music className="w-5 h-5" /></div>
              <div className="flex flex-col"><span className="text-white font-bold text-lg leading-none">12.4K</span><span className="text-white/50 text-[11px] uppercase tracking-wider font-bold">Songs</span></div>
            </div>
            <div className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-500"><Mic2 className="w-5 h-5" /></div>
              <div className="flex flex-col"><span className="text-white font-bold text-lg leading-none">487</span><span className="text-white/50 text-[11px] uppercase tracking-wider font-bold">Artists</span></div>
            </div>
            <div className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-500"><Heart className="w-5 h-5" /></div>
              <div className="flex flex-col"><span className="text-white font-bold text-lg leading-none">1.2K</span><span className="text-white/50 text-[11px] uppercase tracking-wider font-bold">Liked Songs</span></div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Search Bar */}
      <div className="md:hidden relative w-full mb-2">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
        <input 
          type="text" 
          placeholder="Search songs, artists, albums..." 
          className="w-full h-12 bg-white/5 border border-white/10 rounded-full pl-11 pr-4 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-all"
        />
        <div className="absolute right-4 top-1/2 -translate-y-1/2">
          <Mic2 className="w-4 h-4 text-white/40" />
        </div>
      </div>

      {/* Featured Playlists */}
      <section>
        <div className="flex items-end justify-between mb-6">
          <h2 className="text-[20px] md:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            Curated Playlists <span className="text-primary">🎧</span>
          </h2>
          <span onClick={() => router.push('/search?q=playlists')} className="text-xs text-white/40 hover:text-white cursor-pointer font-medium uppercase tracking-wider">See All</span>
        </div>

        {isLoading ? (
          <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-4">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="w-[150px] md:w-[180px] shrink-0 animate-pulse">
                <div className="w-full aspect-square rounded-2xl bg-white/5 mb-3" />
                <div className="h-4 bg-white/5 rounded mb-2 w-3/4" />
                <div className="h-3 bg-white/5 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex overflow-x-auto gap-5 scrollbar-hide pb-4 -mx-4 px-4 md:mx-0 md:px-0 snap-x">
            {featuredPlaylists.map((pl: any) => (
              <CompactPlaylistCard key={pl.id} playlist={pl} onClick={(id) => router.push(`/playlist/${id}`)} />
            ))}
          </div>
        )}
      </section>

      {/* Latest Releases */}
      <section>
        <div className="flex items-end justify-between mb-6">
          <h2 className="text-[20px] md:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            Latest Releases <span className="text-orange-500">🔥</span>
          </h2>
          <span onClick={() => router.push('/search?q=latest')} className="text-xs text-white/40 hover:text-white cursor-pointer font-medium uppercase tracking-wider">See All</span>
        </div>

        {latestLoading ? (
          <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-4">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="w-[150px] md:w-[180px] shrink-0 animate-pulse">
                <div className="w-full aspect-square rounded-2xl bg-white/5 mb-3" />
                <div className="h-4 bg-white/5 rounded mb-2 w-3/4" />
                <div className="h-3 bg-white/5 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex overflow-x-auto gap-5 scrollbar-hide pb-4 -mx-4 px-4 md:mx-0 md:px-0 snap-x">
            {latestSongs.map((song) => (
              <CompactSongCard key={song.id} song={song} onPlay={handlePlayLatest} />
            ))}
          </div>
        )}
      </section>

      {/* Top Mixes (Pills style) */}
      <section>
        <div className="flex items-end justify-between mb-6">
          <h2 className="text-[20px] md:text-2xl font-bold text-white tracking-tight">
            Your Top Mixes
          </h2>
          <span className="text-xs text-white/40 hover:text-white cursor-pointer font-medium uppercase tracking-wider">See All</span>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {topMixes.map((mix) => (
            <div 
              key={mix.title} 
              onClick={() => router.push(`/search?q=${encodeURIComponent(mix.title)}`)}
              className="group relative rounded-2xl p-4 overflow-hidden border border-white/5 cursor-pointer hover:border-white/10 transition-colors"
            >
              <div className={cn("absolute inset-0 bg-gradient-to-br opacity-20 group-hover:opacity-30 transition-opacity", mix.color)}></div>
              <div className="relative z-10 flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-[15px] font-bold text-white mb-1 group-hover:text-primary transition-colors">{mix.title}</span>
                  <span className="text-[11px] text-white/50 font-medium">{mix.count}</span>
                </div>
                <div className={cn("w-10 h-10 rounded-full flex items-center justify-center shadow-lg shadow-black/20 bg-gradient-to-br", mix.color)}>
                  <Play className="w-4 h-4 fill-white text-white ml-0.5" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
