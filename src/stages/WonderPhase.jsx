import React, { useEffect } from 'react';
import { BgSymbols } from '../components/TopNav.jsx';
import { narrate, stopNarration } from '../utils/audio.js';
import { wonderNarration } from '../utils/narration.js';
import { WONDER } from '../utils/lessonScript.js';

/* Leo's suitcase on the airport scale: 20.05 kg against a 20 kg limit */
function LuggageScale() {
  return (
    <svg viewBox="0 0 300 200" className="w-40 sm:w-52 shrink-0 h-auto max-h-[20vh] drop-shadow-[0_0_18px_rgba(250,204,21,0.4)]">
      {/* scale base */}
      <rect x="40" y="160" width="220" height="22" rx="6" fill="#334155" stroke="#94a3b8" strokeWidth="2" />
      <rect x="30" y="150" width="240" height="12" rx="4" fill="#64748b" />
      {/* display */}
      <rect x="185" y="30" width="100" height="50" rx="8" fill="#0c0424" stroke="#4ade80" strokeWidth="2.5" />
      <text x="235" y="62" fill="#f87171" fontSize="20" fontWeight="900" textAnchor="middle" fontFamily="monospace">20.05</text>
      <text x="235" y="76" fill="#94a3b8" fontSize="10" fontWeight="800" textAnchor="middle">kg</text>
      <line x1="235" y1="80" x2="235" y2="150" stroke="#64748b" strokeWidth="5" />
      {/* suitcase */}
      <rect x="55" y="62" width="120" height="88" rx="12" fill="#f472b6" fillOpacity="0.55" stroke="#f472b6" strokeWidth="3" />
      <path d="M95 62 v-16 h40 v16" fill="none" stroke="#f472b6" strokeWidth="5" strokeLinecap="round" />
      <line x1="85" y1="66" x2="85" y2="146" stroke="#ffffff" strokeOpacity="0.4" strokeWidth="3" />
      <line x1="145" y1="66" x2="145" y2="146" stroke="#ffffff" strokeOpacity="0.4" strokeWidth="3" />
      <rect x="98" y="92" width="34" height="22" rx="4" fill="#fde047" />
      <text x="115" y="107" fill="#0c0424" fontSize="10" fontWeight="900" textAnchor="middle">LEO</text>
      <text x="115" y="196" fill="#cbd5e1" fontSize="12" fontWeight="800" textAnchor="middle">limit 20 kg</text>
    </svg>
  );
}

export function WonderPhase({ muted, onNext }) {
  useEffect(() => {
    narrate(wonderNarration(), !muted);
    return () => stopNarration();
  }, [muted]);

  return (
    <div className="flex-1 min-h-0 flex flex-col items-center justify-center p-4 relative overflow-hidden select-none z-10">
      <BgSymbols />

      <div className="w-full max-w-2xl glass-card flex flex-col items-center text-center fade-in-up z-20 my-auto">
        {/* Glowing Phase Band */}
        <div className="phase-band phase-band--wonder" />

        <div className="flex items-center gap-2 mb-2">
          <span className="text-3xl">🔍</span>
          <span className="text-purple-300 font-display font-800 text-xs sm:text-sm tracking-wider uppercase">
            Phase 1: Wonder & Curiosity
          </span>
        </div>

        <h2 className="text-main-heading text-purple-200 mb-3 max-w-xl">
          Is Leo's Suitcase Too Heavy?
        </h2>

        {/* Feature Stat Box */}
        <div className="w-full bg-[#1e143c]/90 border border-purple-400/30 rounded-2xl p-4 sm:p-6 mb-4 flex flex-col items-center shadow-xl">
          <div className="text-number text-amber-300 text-4xl sm:text-6xl mb-1">
            50 Grams Over!
          </div>
          <div className="flex items-center gap-4 w-full">
            <LuggageScale />
            <p className="text-body text-slate-200 text-left">
              {WONDER.paragraph}
            </p>
          </div>
        </div>

        {/* Mascot Thinking Bubble */}
        <div className="flex items-center gap-3 bg-[#14082c]/80 border border-purple-500/30 rounded-full px-5 py-2 mb-5">
          <div className="w-8 h-8 rounded-full bg-purple-500/30 text-purple-200 flex items-center justify-center font-bold text-sm shrink-0">
            🤖
          </div>
          <p className="text-slate-300 text-xs sm:text-sm font-semibold">
            {WONDER.question}
          </p>
        </div>

        <button onClick={onNext} className="btn-gold flex items-center gap-2">
          <span>Explore the Story</span>
          <span>→</span>
        </button>
      </div>
    </div>
  );
}
