'use client';

import { Sparkles, X } from 'lucide-react';

interface AiMoodMixModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AiMoodMixModal({ isOpen, onClose }: AiMoodMixModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-[#121212] w-full max-w-md p-6 rounded-xl overflow-hidden border border-[#282828] shadow-2xl">
        <button onClick={onClose} className="absolute top-4 right-4 text-[#b3b3b3] hover:text-white transition">
          <X className="w-6 h-6" />
        </button>
        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
          AI Mood Mix <Sparkles className="w-5 h-5 text-[#1DB954]" />
        </h2>
        <p className="text-[#b3b3b3] mb-6">Tell us your mood and we'll generate the perfect playlist for you using AI.</p>
        <button onClick={onClose} className="w-full py-3 rounded-full bg-[#1DB954] text-black font-bold text-base hover:scale-105 transition">
          Generate Mix
        </button>
      </div>
    </div>
  );
}
