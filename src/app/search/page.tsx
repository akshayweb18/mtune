'use client';

import { Suspense, useState, useCallback, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { saavnApi } from '@/services/api';
import { useDebounce } from '@/hooks/useDebounce';
import { Search as SearchIcon, Mic, X, MoreVertical, Music, Mic2, Disc, ListMusic, Radio, Podcast, Play, ChevronRight, CheckCircle2, ListPlus } from 'lucide-react';
import { usePlayerStore } from '@/store/usePlayerStore';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { AddToPlaylistModal } from '@/components/shared/AddToPlaylistModal';
import { SongContextMenu } from '@/components/shared/SongContextMenu';
import { Song } from '@/types';

const decodeHtml = (str: string) => str
  .replace(/&quot;/g, '"')
  .replace(/&#x27;/g, "'")
  .replace(/&amp;/g, '&')
  .replace(/&lt;/g, '<')
  .replace(/&gt;/g, '>');


const BROWSE_ALL = [
  { title: 'Hindi Hits', searchTerm: 'Top Hindi Songs', color: 'from-pink-600 to-rose-500', icon: <Music className="w-6 h-6 text-white" /> },
  { title: 'Global Top 50', searchTerm: 'Global Top 50 English', color: 'from-purple-600 to-violet-500', icon: <Music className="w-6 h-6 text-white" /> },
  { title: 'Indian Artists', searchTerm: 'Popular Indian Artists', color: 'from-orange-600 to-amber-500', icon: <Mic2 className="w-6 h-6 text-white" /> },
  { title: 'Pop Artists', searchTerm: 'Popular English Artists', color: 'from-blue-600 to-sky-500', icon: <Mic2 className="w-6 h-6 text-white" /> },
  { title: 'Bollywood', searchTerm: 'Bollywood Playlists', color: 'from-indigo-600 to-blue-500', icon: <ListMusic className="w-6 h-6 text-white" /> },
  { title: 'New Albums', searchTerm: 'Latest Albums', color: 'from-teal-600 to-emerald-500', icon: <Disc className="w-6 h-6 text-white" /> },
];

const TRENDING_SEARCHES = ['Kesariya', 'Shape of You', 'Husn', 'Blinding Lights', 'Arijit Singh', 'Taylor Swift', 'Apna Bana Le', 'Justin Bieber'];

const getArtistImage = (artist: any) => {
  const url = artist.image?.[2]?.url || artist.image?.[1]?.url || artist.image?.[0]?.url;
  if (!url || url.includes('default') || url.includes('artist-default')) {
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(artist.title || artist.name || 'A')}&background=FFD700&color=000&size=256&font-size=0.4`;
  }
  return url;
};

function SearchContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const [query, setQuery] = useState(initialQuery);
  const [selectedSongForPlaylist, setSelectedSongForPlaylist] = useState<Song | null>(null);
  const debouncedQuery = useDebounce(query, 400);
  const router = useRouter();

  // Sync initial query if it changes in URL
  useEffect(() => {
    const q = searchParams.get('q');
    if (q) setQuery(q);
  }, [searchParams]);
  const setCurrentSong = usePlayerStore((s) => s.setCurrentSong);
  const setQueue = usePlayerStore((s) => s.setQueue);

  const { data: searchResults, isLoading: globalLoading } = useQuery({
    queryKey: ['globalSearch', debouncedQuery],
    queryFn: () => saavnApi.searchGlobal(debouncedQuery),
    enabled: debouncedQuery.length > 2,
  });

  const { data: songsResults, isLoading: songsLoading } = useQuery({
    queryKey: ['songsSearch', debouncedQuery],
    queryFn: () => saavnApi.searchSongs(debouncedQuery, 1, 10),
    enabled: debouncedQuery.length > 2,
  });

  const isLoading = globalLoading || songsLoading;

  const handlePlaySong = useCallback((song: Song, index: number) => {
    const queue = songsResults?.results || [];
    setCurrentSong(song);
    setQueue(queue.slice(index));
  }, [setCurrentSong, setQueue, songsResults]);

  const handleBrowseClick = (searchTerm: string) => {
    setQuery(searchTerm);
  };

  const handleTrendingClick = (term: string) => {
    setQuery(term);
  };

  const hasResults = (searchResults && (
    (searchResults.artists?.results?.length > 0) ||
    (searchResults.albums?.results?.length > 0) ||
    (searchResults.playlists?.results?.length > 0)
  )) || (songsResults && songsResults.results?.length > 0);

  return (
    <div className="flex flex-col pb-8" style={{ paddingTop: 'max(env(safe-area-inset-top, 0px), 0px)' }}>
      {/* Sticky Header with Search Bar */}
      <div className="sticky top-0 z-20 bg-[#121212] px-4 md:px-8 pt-4 pb-4">
        <h1 className="text-[22px] md:text-[26px] font-black text-white tracking-tight mb-4">Search</h1>
        <div className="relative">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <SearchIcon className="w-5 h-5 text-black" />
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="What do you want to play?"
            className="w-full h-12 pl-12 pr-12 rounded-full bg-white text-black text-[15px] font-medium placeholder:text-[#737373] focus:outline-none focus:ring-2 focus:ring-white/40 transition-all"
          />
          {query ? (
            <button
              onClick={() => setQuery('')}
              className="absolute inset-y-0 right-4 flex items-center text-black/50 hover:text-black"
            >
              <X className="w-5 h-5" />
            </button>
          ) : (
            <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
              <Mic className="w-5 h-5 text-black/40" />
            </div>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 px-4 md:px-8 pb-8">
        {!debouncedQuery || debouncedQuery.length <= 2 ? (
          <div className="space-y-6">
            <h2 className="text-[18px] font-bold text-white">Browse all</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {BROWSE_ALL.map((item) => (
                <div
                  key={item.title}
                  onClick={() => handleBrowseClick(item.searchTerm)}
                  className={`relative flex items-end h-[100px] rounded-md p-4 cursor-pointer overflow-hidden active:opacity-80 bg-gradient-to-br ${item.color}`}
                >
                  <h3 className="font-black text-white text-[15px] drop-shadow-sm leading-tight">{item.title}</h3>
                  <div className="absolute -right-2 -bottom-2 w-[60px] h-[60px] rounded-md rotate-[25deg] overflow-hidden shadow-lg opacity-80">
                    {item.icon}
                  </div>
                </div>
              ))}
            </div>

            <div>
              <h2 className="text-[18px] font-bold text-white mb-3">Trending</h2>
              <div className="flex flex-wrap gap-2">
                {TRENDING_SEARCHES.map(term => (
                  <button
                    key={term}
                    onClick={() => handleTrendingClick(term)}
                    className="px-4 py-2 rounded-full bg-[#2a2a2a] hover:bg-[#3a3a3a] text-white text-[13px] font-bold transition-colors"
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
                {songsResults?.results?.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-lg font-bold text-white flex items-center gap-2">
                        <Music className="w-4 h-4 text-primary" /> Songs
                      </h2>
                      <span className="text-xs text-white/40 font-medium">{songsResults.results.length} results</span>
                    </div>
                    <div className="space-y-1">
                      {songsResults.results.slice(0, 8).map((song: Song, index: number) => (
                        <div
                          key={song.id}
                          className="flex items-center gap-3 px-2 py-2 rounded-md hover:bg-[#2a2a2a] cursor-pointer group transition-colors"
                          onClick={() => handlePlaySong(song, index)}
                        >
                          <div className="relative w-10 h-10 shrink-0 rounded-sm overflow-hidden">
                            <img
                              src={song.image?.[2]?.url || song.image?.[0]?.url || ''}
                              alt={song.name}
                              className="object-cover w-full h-full"
                              loading="lazy"
                            />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                              <Play className="w-4 h-4 fill-white text-white" />
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-[14px] font-bold text-white truncate">{decodeHtml(song.name)}</h4>
                            <p className="text-[12px] text-[#A7A7A7] truncate">
                              {decodeHtml(song.artists?.primary?.map((a: any) => a.name).join(', ') || 'Song')}
                            </p>
                          </div>
                          <SongContextMenu song={song} queue={songsResults.results} className="opacity-0 group-hover:opacity-100 touch-sm shrink-0" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* ─── Artists Section ─── */}
                {(searchResults?.artists?.results?.length ?? 0) > 0 && (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-lg font-bold text-white flex items-center gap-2">
                        <Mic2 className="w-4 h-4 text-secondary" /> Artists
                      </h2>
                      <span className="text-xs text-white/40 font-medium">{searchResults?.artists.results.length} results</span>
                    </div>
                    <div className="flex overflow-x-auto gap-4 scrollbar-hide pb-2 -mx-4 px-4 md:mx-0 md:px-0 snap-x">
                      {searchResults?.artists.results.map((artist: any) => (
                        <Link
                          key={artist.id}
                          href={`/artist/${artist.id}`}
                          className="flex flex-col items-center gap-2.5 shrink-0 w-[90px] md:w-[100px] group cursor-pointer snap-start active:scale-95 transition-transform"
                        >
                          <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden border border-white/10 group-hover:border-primary/50 shadow-lg shrink-0">
                            <img
                              src={getArtistImage(artist)}
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
                {(searchResults?.albums?.results?.length ?? 0) > 0 && (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-lg font-bold text-white flex items-center gap-2">
                        <Disc className="w-4 h-4 text-orange-400" /> Albums
                      </h2>
                      <span className="text-xs text-white/40 font-medium">{searchResults?.albums.results.length} results</span>
                    </div>
                    <div className="flex overflow-x-auto gap-4 scrollbar-hide pb-2 -mx-4 px-4 md:mx-0 md:px-0 snap-x">
                      {searchResults?.albums.results.map((album: any) => (
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
                          <h4 className="text-[13px] font-bold text-white truncate w-full text-center">{album.title || album.name}</h4>
                          <p className="text-[11px] text-white/40 truncate w-full text-center mt-0.5">{album.description || album.year || 'Album'}</p>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* ─── Playlists Section ─── */}
                {(searchResults?.playlists?.results?.length ?? 0) > 0 && (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-lg font-bold text-white flex items-center gap-2">
                        <ListMusic className="w-4 h-4 text-blue-400" /> Playlists
                      </h2>
                      <span className="text-xs text-white/40 font-medium">{searchResults?.playlists.results.length} results</span>
                    </div>
                    <div className="flex overflow-x-auto gap-4 scrollbar-hide pb-2 -mx-4 px-4 md:mx-0 md:px-0 snap-x">
                      {searchResults?.playlists.results.map((pl: any) => (
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
                          <h4 className="text-[13px] font-bold text-white truncate w-full text-center">{pl.title || pl.name}</h4>
                          <p className="text-[11px] text-white/40 truncate w-full text-center mt-0.5">{pl.description || 'Playlist'}</p>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </>
            ) : (
          <div className="text-center py-20 flex flex-col items-center gap-4">
            <SearchIcon className="w-12 h-12 text-[#535353]" />
            <p className="text-white font-bold text-[18px]">No results found for "{debouncedQuery}"</p>
            <p className="text-[#A7A7A7] text-[14px]">Please make sure your words are spelled correctly or use fewer or different keywords.</p>
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

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="p-8 text-white">Loading search...</div>}>
      <SearchContent />
    </Suspense>
  );
}
