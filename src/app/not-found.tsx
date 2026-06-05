'use client';

import Link from 'next/link';
import { Compass, Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-full p-8 text-center animate-in fade-in duration-700">
      <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center mb-6 relative group">
        <div className="absolute inset-0 bg-primary/30 blur-2xl rounded-full animate-pulse" />
        <Compass className="w-10 h-10 text-white relative z-10 group-hover:rotate-180 transition-transform duration-700" />
      </div>
      <h2 className="text-3xl font-bold text-white mb-2">Coming Soon</h2>
      <p className="text-white/60 max-w-md mb-8">
        We are crafting something amazing for this section. Check back later to discover new music features!
      </p>
      <Link 
        href="/"
        className="px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white font-medium flex items-center gap-2 transition"
      >
        <Home className="w-5 h-5" /> Back to Home
      </Link>
    </div>
  );
}
