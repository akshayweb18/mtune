'use client';

import { useQuery } from '@tanstack/react-query';
import { saavnApi } from '@/services/api';
import { Disc, Play } from 'lucide-react';
import Link from 'next/link';

const ALBUM_QUERIES = ['Brahmastra', 'Animal', 'Kabir Singh', 'Aashiqui 2', 'Rockstar', 'Kal Ho Naa Ho'];

export default function AlbumsPage() {
  const { data: allAlbums, isLoading } = useQuery({
    queryKey: ['albums-page'],
    queryFn: async () => {
      const results = await Promise.all(
        ALBUM_QUERIES.map(q => saavnApi.searchAlbums(q, 1, 4))
      );
      return results.flatMap(r => r?.results || []);
    },
  });

  const albums = allAlbums || [];

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto mb-24 md:mb-0">
      <div className="glass-panel rounded-3xl p-8 mb-8 relative overflow-hidden">
        <div className="absolute -right-10 -top-10 w-48 h-48 bg-indigo-500/30 blur-[80px] rounded-full" />
        <div className="relative z-10 flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <Disc className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">Albums</h1>
            <p className="text-white/60 mt-1">Browse popular albums</p>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="w-full aspect-square bg-white/5 rounded-xl mb-2" />
              <div className="h-3 bg-white/5 rounded w-3/4 mb-1" />
              <div className="h-2 bg-white/5 rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {albums.map((album: any) => (
            <Link
              key={album.id}
              href={`/album/${album.id}`}
              className="group cursor-pointer"
            >
              <div className="relative w-full aspect-square rounded-xl overflow-hidden mb-2">
                <img
                  src={album.image?.[2]?.url || album.image?.[0]?.url}
                  alt={album.title}
                  className="object-cover w-full h-full transition duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                  <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white shadow-lg">
                    <Play className="w-4 h-4 fill-current ml-0.5" />
                  </div>
                </div>
              </div>
              <h4 className="text-sm font-medium text-white truncate group-hover:text-primary transition">{album.title}</h4>
              <p className="text-xs text-white/50 truncate">{album.description || album.artist}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
