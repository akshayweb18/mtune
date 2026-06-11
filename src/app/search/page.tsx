'use client';

import { useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { saavnApi } from '@/services/api';
import { useDebounce } from '@/hooks/useDebounce';
import { Search as SearchIcon, Mic, X, MoreVertical, Music, Mic2, Disc, ListMusic, Radio, Podcast, Play, ChevronRight, CheckCircle2, ListPlus } from 'lucide-react';
import { usePlayerStore } from '@/store/usePlayerStore';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AddToPlaylistModal } from '@/components/shared/AddToPlaylistModal';
import { Song } from '@/types';

const BROWSE_ALL = [
  { title: 'Hindi Hits', searchTerm: 'Top Hindi Songs', color: 'from-pink-600 to-rose-500', icon: <Music className="w-6 h-6 text-white" /> },
  { title: 'Global Top 50', searchTerm: 'Global Top 50 English', color: 'from-purple-600 to-violet-500', icon: <Music className="w-6 h-6 text-white" /> },
  { title: 'Indian Artists', searchTerm: 'Popular Indian Artists', color: 'from-orange-600 to-amber-500', icon: <Mic2 className="w-6 h-6 text-white" /> },
  { title: 'Pop Artists', searchTerm: 'Popular English Artists', color: 'from-blue-600 to-sky-500', icon: <Mic2 className="w-6 h-6 text-white" /> },
  { title: 'Bollywood', searchTerm: 'Bollywood Playlists', color: 'from-indigo-600 to-blue-500', icon: <ListMusic className="w-6 h-6 text-white" /> },
  { title: 'New Albums', searchTerm: 'Latest Albums', color: 'from-teal-600 to-emerald-500', icon: <Disc className="w-6 h-6 text-white" /> },
];

const TRENDING_SEARCHES = ['Kesariya', 'Shape of You', 'Husn', 'Blinding Lights', 'Arijit Singh', 'Taylor Swift', 'Apna Bana Le', 'Justin Bieber'];

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [selectedSongForPlaylist, setSelectedSongForPlaylist] = useState<Song | null>(null);
  const debouncedQuery = useDebounce(query, 400);
  const router = useRouter();
  const setCurrentSong = usePlayerStore((s) => s.setCurrentSong);
  const setQueue = usePlayerStore((s) => s.setQueue);

  const { data: searchResults, isLoading } = useQuery({
    queryKey: ['globalSearch', debouncedQuery],
    queryFn: () => saavnApi.searchGlobal(debouncedQuery),
    enabled: debouncedQuery.length > 2,
  });

  const handlePlaySong = useCallback(async (songId: string) => {
    try {
      const songDetails = await saavnApi.getSongDetails(songId);
      if (songDetails && songDetails.length > 0) {
        setCurrentSong(songDetails[0]);
        setQueue([songDetails[0]]);
      }
    } catch (error) {
      console.error('Error fetching song details', error);
    }
  }, [setCurrentSong, setQueue]);

  const handleBrowseClick = (searchTerm: string) => {
    setQuery(searchTerm);
  };

  const handleTrendingClick = (term: string) => {
    setQuery(term);
  };

  const hasResults = searchResults && (
    (searchResults.songs?.results?.length > 0) ||
    (searchResults.artists?.results?.length > 0) ||
    (searchResults.albums?.results?.length > 0) ||
    (searchResults.playlists?.results?.length > 0)
  );

  return (
    <div className="flex flex-col pt-safe px-4 md:px-8 max-w-4xl mx-auto pb-6" style={{ paddingTop: 'max(env(safe-area-inset-top, 0px), 16px)' }}>
      {/* Sticky Header with Search Bar */}
      <div className="sticky top-0 z-20 bg-background/90 backdrop-blur-md pt-2 pb-5">
        <div className="flex items-center gap-4 mb-4">
          <h1 className="text-[22px] md:text-2xl font-extrabold text-white tracking-tight">Search</h1>
        </div>

        <div className="relative">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <SearchIcon className="w-4 h-4 text-white/40" />
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="What do you want to listen to?"
            className="w-full h-12 pl-11 pr-12 rounded-full bg-white/10 border border-white/10 text-white text-[15px] font-medium placeholder:text-white/40 focus:outline-none focus:border-white/20 focus:bg-white/15 transition-all shadow-md"
          />
          {query ? (
            <button
              onClick={() => setQuery('')}
              className="absolute inset-y-0 right-4 flex items-center text-white/40 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          ) : (
            <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
              <Mic className="w-4 h-4 text-white/40" />
            </div>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1">
        {!debouncedQuery || debouncedQuery.length <= 2 ? (
          <div className="space-y-8">

            {/* Browse All Categories Grid */}
            <div>
              <h2 className="text-[15px] font-bold text-white mb-3 tracking-tight">Browse All</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {BROWSE_ALL.map((item) => (
                  <div
                    key={item.title}
                    onClick={() => handleBrowseClick(item.searchTerm)}
                    className="relative flex flex-col justify-end h-24 rounded-xl p-3 cursor-pointer overflow-hidden group active:scale-95 transition-transform"
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-90 group-hover:opacity-100 transition-opacity`} />
                    <div className="absolute -right-4 -bottom-4 w-16 h-16 rounded-xl bg-black/20 flex items-center justify-center shrink-0 rotate-12 shadow-lg">
                      {item.icon}
                    </div>
                    <h3 className="relative z-10 font-bold text-white text-sm drop-shadow-md">{item.title}</h3>
                  </div>
                ))}
              </div>
            </div>

            {/* Trending Searches Pills */}
            <div>
              <h2 className="text-base font-bold text-white mb-4 tracking-tight">🔥 Trending Searches</h2>
              <div className="flex flex-wrap gap-2">
                {TRENDING_SEARCHES.map(term => (
                  <button
                    key={term}
                    onClick={() => handleTrendingClick(term)}
                    className="px-4 py-2.5 rounded-full bg-white/5 border border-white/10 text-white/70 text-xs font-bold hover:bg-primary/20 hover:border-primary/30 hover:text-white active:scale-95"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>

          </div>
        ) : (
          /* Search Results */
          <div className="space-y-8 pt-2">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-20 gap-3">
                <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin shadow-[0_0_15px_rgba(168,85,247,0.5)]" />
                <span className="text-white/40 text-sm font-medium">Searching...</span>
              </div>
            ) : hasResults ? (
              <>
                {/* ─── Songs Section ─── */}
                {searchResults.songs?.results?.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-lg font-bold text-white flex items-center gap-2">
                        <Music className="w-4 h-4 text-primary" /> Songs
                      </h2>
                      <span className="text-xs text-white/40 font-medium">{searchResults.songs.results.length} results</span>
                    </div>
                    <div className="space-y-1">
                      {searchResults.songs.results.slice(0, 6).map((song: any) => (
                        <div
                          key={song.id}
                          className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 active:scale-95 group cursor-pointer transition-all"
                          onClick={() => handlePlaySong(song.id)}
                        >
                          <div className="relative w-12 h-12 shrink-0 rounded-lg overflow-hidden shadow-md">
                            <img
                              src={song.image?.[2]?.url || song.image?.[0]?.url || ''}
                              alt={song.title}
                              className="object-cover w-full h-full"
                              loading="lazy"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-200">
                              <Play className="w-4 h-4 fill-white text-white" />
                            </div>
                          </div>
                          <div className="flex-1 min-w-0 flex flex-col justify-center">
                            <h4 className="text-[14px] font-bold text-white truncate">{song.title}</h4>
                            <span className="text-[12px] text-white/50 truncate mt-0.5">{song.description || song.subtitle || 'Song'}</span>
                          </div>
                          <div className="flex items-center">
                            <button 
                              className="p-2 text-white/40 hover:text-white touch-sm shrink-0 active:scale-90"
                              onClick={(e) => { e.stopPropagation(); setSelectedSongForPlaylist(song); }}
                            >
                              <ListPlus className="w-5 h-5" />
                            </button>
                            <button className="p-2 text-white/40 hover:text-white touch-sm shrink-0">
                              <MoreVertical className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* ─── Artists Section ─── */}
                {searchResults.artists?.results?.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-lg font-bold text-white flex items-center gap-2">
                        <Mic2 className="w-4 h-4 text-secondary" /> Artists
                      </h2>
                      <span className="text-xs text-white/40 font-medium">{searchResults.artists.results.length} results</span>
                    </div>
                    <div className="flex overflow-x-auto gap-4 scrollbar-hide pb-2 -mx-4 px-4 md:mx-0 md:px-0 snap-x">
                      {searchResults.artists.results.map((artist: any) => (
                        <Link
                          key={artist.id}
                          href={`/artist/${artist.id}`}
                          className="flex flex-col items-center gap-2.5 shrink-0 w-[90px] md:w-[100px] group cursor-pointer snap-start active:scale-95 transition-transform"
                        >
                          <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden border border-white/10 group-hover:border-primary/50 shadow-lg">
                            <img
                              src={artist.image?.[2]?.url || artist.image?.[0]?.url || `https://ui-avatars.com/api/?name=${encodeURIComponent(artist.title || artist.name)}&background=7c3aed&color=fff`}
                              alt={artist.title || artist.name}
                              className="w-full h-full object-cover"
                              loading="lazy"
                            />
                          </div>
                          <div className="text-center w-full px-1">
                            <h4 className="text-[13px] font-bold text-white truncate group-hover:text-primary">{artist.title || artist.name}</h4>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* ─── Albums Section ─── */}
                {searchResults.albums?.results?.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-lg font-bold text-white flex items-center gap-2">
                        <Disc className="w-4 h-4 text-orange-400" /> Albums
                      </h2>
                      <span className="text-xs text-white/40 font-medium">{searchResults.albums.results.length} results</span>
                    </div>
                    <div className="flex overflow-x-auto gap-4 scrollbar-hide pb-2 -mx-4 px-4 md:mx-0 md:px-0 snap-x">
                      {searchResults.albums.results.map((album: any) => (
                        <Link
                          key={album.id}
                          href={`/album/${album.id}`}
                          className="flex flex-col shrink-0 w-[120px] md:w-[130px] group cursor-pointer snap-start active:scale-95 transition-transform"
                        >
                          <div className="relative w-full aspect-square rounded-xl overflow-hidden mb-2 shadow-lg border border-white/5">
                            <img
                              src={album.image?.[2]?.url || album.image?.[0]?.url || ''}
                              alt={album.title || album.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              loading="lazy"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-200">
                              <Play className="w-5 h-5 fill-white text-white" />
                            </div>
                          </div>
                          <h4 className="text-[13px] font-bold text-white truncate">{album.title || album.name}</h4>
                          <span className="text-[11px] text-white/40 truncate mt-0.5">{album.description || album.year || 'Album'}</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* ─── Playlists Section ─── */}
                {searchResults.playlists?.results?.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-lg font-bold text-white flex items-center gap-2">
                        <ListMusic className="w-4 h-4 text-blue-400" /> Playlists
                      </h2>
                      <span className="text-xs text-white/40 font-medium">{searchResults.playlists.results.length} results</span>
                    </div>
                    <div className="flex overflow-x-auto gap-4 scrollbar-hide pb-2 -mx-4 px-4 md:mx-0 md:px-0 snap-x">
                      {searchResults.playlists.results.map((pl: any) => (
                        <Link
                          key={pl.id}
                          href={`/playlist/${pl.id}`}
                          className="flex flex-col shrink-0 w-[120px] md:w-[130px] group cursor-pointer snap-start active:scale-95 transition-transform"
                        >
                          <div className="relative w-full aspect-square rounded-xl overflow-hidden mb-2 shadow-lg border border-white/5">
                            <img
                              src={pl.image?.[2]?.url || pl.image?.[0]?.url || ''}
                              alt={pl.title || pl.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              loading="lazy"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-200">
                              <Play className="w-5 h-5 fill-white text-white" />
                            </div>
                          </div>
                          <h4 className="text-[13px] font-bold text-white truncate">{pl.title || pl.name}</h4>
                          <span className="text-[11px] text-white/40 truncate mt-0.5">{pl.description || 'Playlist'}</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-20 flex flex-col items-center gap-3">
                <SearchIcon className="w-12 h-12 text-white/10" />
                <p className="text-white/40 font-bold text-lg">No results found</p>
                <p className="text-white/30 text-sm">Try searching for something else</p>
              </div>
            )}
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
