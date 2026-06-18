'use client';

import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { saavnApi } from '@/services/api';
import { Mic2, CheckCircle2, Search } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

const POPULAR_ARTISTS = [
  'AP Dhillon', 'AR Rahman', 'Alka Yagnik', 'Arijit Singh', 'Armaan Malik', 'Atif Aslam',
  'B Praak', 'Badshah', 'Bappi Lahiri', 'Benny Dayal',
  'Charlie Puth', 'Coldplay',
  'Darshan Raval', 'Diljit Dosanjh', 'Divine', 'Dua Lipa',
  'Ed Sheeran', 'Eminem',
  'Falak Shabir', 'Farhan Akhtar',
  'Gajendra Verma', 'Guru Randhawa',
  'Harrdy Sandhu', 'Himesh Reshammiya',
  'Imagine Dragons', 'Imran Khan',
  'Javed Ali', 'Jubin Nautiyal', 'Justin Bieber',
  'KK', 'Kailash Kher', 'Kishore Kumar', 'Kumar Sanu',
  'Lata Mangeshkar', 'Lucky Ali',
  'Mika Singh', 'Mohit Chauhan', 'Mukesh',
  'Neeti Mohan', 'Neha Kakkar', 'Nusrat Fateh Ali Khan',
  'One Direction',
  'Papon', 'Post Malone', 'Prateek Kuhad', 'Pritam',
  'Qurat-ul-Ain Balouch',
  'Raftaar', 'Rahat Fateh Ali Khan', 'Rihanna',
  'Shankar Mahadevan', 'Shreya Ghoshal', 'Sidhu Moose Wala', 'Sonu Nigam', 'Sunidhi Chauhan',
  'Taylor Swift', 'The Weeknd', 'Tulsi Kumar',
  'Udit Narayan',
  'Vishal Dadlani', 'Vishal Mishra',
  'Wiz Khalifa',
  'XXXTentacion',
  'Yo Yo Honey Singh',
  'Zayn', 'Zubeen Garg'
].sort((a, b) => a.localeCompare(b));

function ArtistCardSkeleton() {
  return (
    <div className="flex flex-col items-center text-center gap-3 animate-pulse">
      <div className="w-24 h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 rounded-full bg-white/8 ring-2 ring-white/5" />
      <div className="h-3 w-16 bg-white/8 rounded-full" />
      <div className="h-2.5 w-10 bg-white/5 rounded-full" />
    </div>
  );
}

function ArtistCard({ name, index }: { name: string; index: number }) {
  const { data, isLoading } = useQuery({
    queryKey: ['artist-search', name],
    queryFn: () => saavnApi.searchArtists(name, 1, 1),
  });

  if (isLoading) return <ArtistCardSkeleton />;

  const artist = data?.results?.[0];
  if (!artist) return null;

  const imgUrl =
    artist.image?.[2]?.url ||
    artist.image?.[1]?.url ||
    artist.image?.[0]?.url ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=7c3aed&color=fff&size=200`;

  return (
    <Link
      href={`/artist/${artist.id}`}
      className="group cursor-pointer flex flex-col items-center text-center gap-2"
      style={{ animationDelay: `${index * 40}ms` }}
    >
      {/* Circle Image */}
      <div className="relative w-24 h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 shrink-0">
        {/* Glow ring on hover */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/60 to-secondary/60 opacity-0 group-hover:opacity-100 transition-all duration-500 blur-md scale-110" />

        {/* Image container */}
        <div className="relative w-full h-full rounded-full overflow-hidden ring-2 ring-white/10 group-hover:ring-primary/60 transition-all duration-300 shadow-lg group-hover:shadow-primary/30 group-hover:shadow-xl">
          <img
            src={imgUrl}
            alt={artist.title || name}
            className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110"
            loading="lazy"
          />
          {/* Overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        {/* Verified badge */}
        <div className="absolute bottom-0.5 right-0.5 w-5 h-5 rounded-full bg-blue-500 border-2 border-[#05050f] flex items-center justify-center shadow-md">
          <CheckCircle2 className="w-3 h-3 text-white fill-blue-500" />
        </div>
      </div>

      {/* Name */}
      <div>
        <h4 className="text-xs md:text-sm font-bold text-white group-hover:text-primary transition-colors duration-200 truncate w-full max-w-[110px]">
          {artist.title || name}
        </h4>
        <p className="text-[10px] md:text-xs text-white/40 mt-0.5 font-medium">Artist</p>
      </div>
    </Link>
  );
}

export default function ArtistsPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const displayArtists = useMemo(() => {
    if (!searchQuery.trim()) return POPULAR_ARTISTS;
    
    const filtered = POPULAR_ARTISTS.filter(a => 
      a.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    // If no match in the popular list, just pass the query directly to the ArtistCard 
    // so it fetches the artist from the API
    return filtered.length > 0 ? filtered : [searchQuery.trim()];
  }, [searchQuery]);

  return (
    <div className="min-h-full bg-[#05050f] pb-[140px]">
      {/* Hero Header */}
      <div className="relative overflow-hidden px-6 md:px-10 pt-8 pb-10">
        {/* Background blobs */}
        <div className="absolute -right-20 -top-20 w-80 h-80 bg-secondary/20 blur-[100px] rounded-full pointer-events-none" />
        <div className="absolute -left-10 top-10 w-60 h-60 bg-primary/15 blur-[80px] rounded-full pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-gradient-to-br from-secondary to-primary flex items-center justify-center shadow-[0_0_30px_rgba(236,72,153,0.4)] shrink-0">
              <Mic2 className="w-8 h-8 md:w-10 md:h-10 text-white" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">Artists</h1>
              <p className="text-white/50 mt-1 text-sm md:text-base font-medium">
                Discover your favourite artists
              </p>
            </div>
          </div>
          
          {/* Search Bar */}
          <div className="relative w-full md:w-72">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-white/40" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-all"
              placeholder="Search artists..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Artists Grid */}
      <div className="px-4 md:px-10 mt-2">
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-x-4 gap-y-8">
          {displayArtists.map((name, index) => (
            <ArtistCard key={name + index} name={name} index={index} />
          ))}
        </div>
      </div>
    </div>
  );
}
