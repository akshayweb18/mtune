'use client';

import { Crown, Sparkles, Check, Music, Headphones, Download, Zap } from 'lucide-react';

const features = [
  { icon: <Music className="w-5 h-5" />, text: 'Ad-free music listening' },
  { icon: <Download className="w-5 h-5" />, text: 'Download to listen offline' },
  { icon: <Headphones className="w-5 h-5" />, text: 'High quality audio (320kbps)' },
  { icon: <Zap className="w-5 h-5" />, text: 'Unlimited skips' },
  { icon: <Sparkles className="w-5 h-5" />, text: 'AI-powered recommendations' },
];

export default function PremiumPage() {
  return (
    <div className="p-6 md:p-8 max-w-3xl mx-auto mb-24 md:mb-0 flex flex-col items-center">
      {/* Hero */}
      <div className="w-full glass-panel rounded-3xl p-8 md:p-12 text-center relative overflow-hidden mb-8">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-secondary/20" />
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary/30 blur-[100px] rounded-full" />
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-secondary/30 blur-[100px] rounded-full" />
        
        <div className="relative z-10">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-amber-500/30">
            <Crown className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
            Go <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">Premium</span>
          </h1>
          <p className="text-white/60 text-lg mb-8 max-w-md mx-auto">
            Unlock the ultimate music experience with Akshay Music Premium
          </p>

          {/* Features */}
          <div className="space-y-4 text-left max-w-sm mx-auto mb-8">
            {features.map((f, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary shrink-0">
                  {f.icon}
                </div>
                <span className="text-white/80 text-sm font-medium">{f.text}</span>
              </div>
            ))}
          </div>

          {/* CTA */}
          <button className="w-full max-w-sm py-4 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-500 text-black font-bold text-lg hover:opacity-90 transition hover:scale-[1.02] active:scale-95 shadow-lg shadow-amber-500/25 relative overflow-hidden group">
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            <span className="relative">Get Premium - ₹119/month</span>
          </button>
          <p className="text-white/40 text-xs mt-3">Free for 1 month, cancel anytime</p>
        </div>
      </div>
    </div>
  );
}
