'use client';

import { useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { saavnApi } from '@/services/api';
import { useDebounce } from '@/hooks/useDebounce';
import { Search as SearchIcon, Mic, X, MoreVertical, Music, Mic2, Disc, ListMusic, Radio, Podcast, Play, ChevronRight, CheckCircle2 } from 'lucide-react';
import { usePlayerStore } from '@/store/usePlayerStore';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const BROWSE_ALL = [
  { title: 'Songs', searchTerm: 'Top Hindi Songs', color: 'from-pink-600 to-rose-500', icon: <Music className="w-6 h-6 text-white" /> },
  { title: 'Artists', searchTerm: 'Popular Indian Artists', color: 'from-purple-600 to-violet-500', icon: <Mic2 className="w-6 h-6 text-white" /> },
  { title: 'Albums', searchTerm: 'New Hindi Albums', color: 'from-orange-600 to-amber-500', icon: <Disc className="w-6 h-6 text-white" /> },
  { title: 'Playlists', searchTerm: 'Best Bollywood Playlists', color: 'from-blue-600 to-sky-500', icon: <ListMusic className="w-6 h-6 text-white" /> },
  { title: 'Genres', searchTerm: 'Romantic Hindi Songs', color: 'from-indigo-600 to-blue-500', icon: <Radio className="w-6 h-6 text-white" /> },
  { title: 'Podcasts', searchTerm: 'Hindi Podcasts', color: 'from-teal-600 to-emerald-500', icon: <Podcast className="w-6 h-6 text-white" /> },
];

const TRENDING_SEARCHES = ['Kesariya', 'Night Changes', 'Unstoppable', 'Husn', 'Heeriye', 'Tum Hi Ho', 'Apna Bana Le', 'Chaleya'];

export default function SearchPage() {
  const [query, setQuery] = useState('');
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
    <div className="flex flex-col h-full bg-[#05050f] pb-[120px] pt-4 md:pt-8 px-4 md:px-8 max-w-4xl mx-auto">
      {/* Sticky Header with Search Bar */}
      <div className="sticky top-0 z-20 bg-[#05050f]/90 backdrop-blur-md pt-2 pb-6">
        <div className="flex items-center gap-4 mb-4">
          <h1 className="text-2xl font-bold text-white">Search</h1>
        </div>

        <div className="relative">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <SearchIcon className="w-4 h-4 text-white/40" />
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search songs, artists, albums..."
            className="w-full h-12 pl-11 pr-12 rounded-full bg-white/5 border border-white/10 text-white font-medium placeholder:text-white/40 focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-all shadow-[0_4px_20px_rgba(0,0,0,0.3)]"
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
              <h2 className="text-base font-bold text-white mb-4 tracking-tight">Browse All</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {BROWSE_ALL.map((item) => (
                  <div
                    key={item.title}
                    onClick={() => handleBrowseClick(item.searchTerm)}
                    className="relative flex items-center gap-4 rounded-2xl p-4 cursor-pointer overflow-hidden group active:scale-[0.98]"
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-80 group-hover:opacity-100`} />
                    <div className="relative z-10 w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0 group-hover:scale-110 shadow-lg">
                      {item.icon}
                    </div>
                    <h3 className="relative z-10 font-bold text-white text-sm">{item.title}</h3>
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
                          className="flex items-center gap-4 p-2.5 rounded-xl hover:bg-white/5 group cursor-pointer active:scale-[0.99]"
                          onClick={() => handlePlaySong(song.id)}
                        >
                          <div className="relative w-12 h-12 shrink-0 rounded-lg overflow-hidden shadow-md">
                            <img
                              src={song.image?.[2]?.url || song.image?.[0]?.url || ''}
                              alt={song.title}
                              className="object-cover w-full h-full"
                              loading="lazy"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center" style={{ transition: 'opacity 0.15s' }}>
                              <Play className="w-4 h-4 fill-white text-white" />
                            </div>
                          </div>
                          <div className="flex-1 min-w-0 flex flex-col justify-center">
                            <h4 className="text-sm font-bold text-white truncate">{song.title}</h4>
                            <span className="text-xs text-white/50 truncate mt-0.5">{song.description || song.subtitle || 'Song'}</span>
                          </div>
                          <button className="p-2 text-white/30 hover:text-white">
                            <MoreVertical className="w-4 h-4" />
                          </button>
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
                    <div className="flex overflow-x-auto gap-5 scrollbar-hide pb-2 -mx-2 px-2 snap-x">
                      {searchResults.artists.results.map((artist: any) => (
                        <Link
                          key={artist.id}
                          href={`/artist/${artist.id}`}
                          className="flex flex-col items-center gap-3 shrink-0 w-[100px] group cursor-pointer snap-start"
                        >
                          <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-white/10 group-hover:border-primary/50 shadow-lg">
                            <img
                              src={artist.image?.[2]?.url || artist.image?.[0]?.url || `https://ui-avatars.com/api/?name=${encodeURIComponent(artist.title || artist.name)}&background=7c3aed&color=fff`}
                              alt={artist.title || artist.name}
                              className="w-full h-full object-cover"
                              loading="lazy"
                            />
                            <div className="absolute bottom-0 right-0 w-5 h-5 rounded-full bg-blue-500 border-2 border-[#0A0A10] flex items-center justify-center">
                              <CheckCircle2 className="w-3 h-3 text-white fill-blue-500" />
                            </div>
                          </div>
                          <div className="text-center w-full">
                            <h4 className="text-xs font-bold text-white truncate group-hover:text-primary">{artist.title || artist.name}</h4>
                            <span className="text-[10px] text-white/40 font-medium">Artist</span>
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
                    <div className="flex overflow-x-auto gap-4 scrollbar-hide pb-2 -mx-2 px-2 snap-x">
                      {searchResults.albums.results.map((album: any) => (
                        <Link
                          key={album.id}
                          href={`/album/${album.id}`}
                          className="flex flex-col shrink-0 w-[130px] group cursor-pointer snap-start"
                        >
                          <div className="relative w-full aspect-square rounded-xl overflow-hidden mb-2 shadow-lg border border-white/5">
                            <img
                              src={album.image?.[2]?.url || album.image?.[0]?.url || ''}
                              alt={album.title || album.name}
                              className="w-full h-full object-cover"
                              loading="lazy"
                            />
                            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center" style={{ transition: 'opacity 0.15s' }}>
                              <Play className="w-6 h-6 fill-white text-white" />
                            </div>
                          </div>
                          <h4 className="text-xs font-bold text-white truncate">{album.title || album.name}</h4>
                          <span className="text-[10px] text-white/40 truncate mt-0.5">{album.description || album.year || 'Album'}</span>
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
                    <div className="flex overflow-x-auto gap-4 scrollbar-hide pb-2 -mx-2 px-2 snap-x">
                      {searchResults.playlists.results.map((pl: any) => (
                        <Link
                          key={pl.id}
                          href={`/playlist/${pl.id}`}
                          className="flex flex-col shrink-0 w-[130px] group cursor-pointer snap-start"
                        >
                          <div className="relative w-full aspect-square rounded-xl overflow-hidden mb-2 shadow-lg border border-white/5">
                            <img
                              src={pl.image?.[2]?.url || pl.image?.[0]?.url || ''}
                              alt={pl.title || pl.name}
                              className="w-full h-full object-cover"
                              loading="lazy"
                            />
                            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center" style={{ transition: 'opacity 0.15s' }}>
                              <Play className="w-6 h-6 fill-white text-white" />
                            </div>
                          </div>
                          <h4 className="text-xs font-bold text-white truncate">{pl.title || pl.name}</h4>
                          <span className="text-[10px] text-white/40 truncate mt-0.5">{pl.description || 'Playlist'}</span>
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
    </div>
  );
}
