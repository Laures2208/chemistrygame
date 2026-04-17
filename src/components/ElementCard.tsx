import React from 'react';
import { ChemicalElement } from '../data/elements';

interface ElementCardProps {
  element: ChemicalElement;
}

export default function ElementCard({ element }: ElementCardProps) {
  // Mapping color based on element category
  const getCategoryStyles = (category: string) => {
    switch (category) {
      case 'alkali metal': 
        return 'from-red-900/60 border-red-500/50 hover:shadow-[0_0_20px_rgba(239,68,68,0.6)] text-red-100 hover:border-red-400';
      case 'alkaline earth metal': 
        return 'from-orange-900/60 border-orange-500/50 hover:shadow-[0_0_20px_rgba(249,115,22,0.6)] text-orange-100 hover:border-orange-400';
      case 'transition metal': 
        return 'from-yellow-900/60 border-yellow-500/50 hover:shadow-[0_0_20px_rgba(234,179,8,0.6)] text-yellow-100 hover:border-yellow-400';
      case 'post-transition metal': 
        return 'from-blue-900/60 border-blue-500/50 hover:shadow-[0_0_20px_rgba(59,130,246,0.6)] text-blue-100 hover:border-blue-400';
      case 'metalloid': 
        return 'from-teal-900/60 border-teal-500/50 hover:shadow-[0_0_20px_rgba(20,184,166,0.6)] text-teal-100 hover:border-teal-400';
      case 'nonmetal': 
        return 'from-green-900/60 border-green-500/50 hover:shadow-[0_0_20px_rgba(34,197,94,0.6)] text-green-100 hover:border-green-400';
      case 'halogen': 
        return 'from-cyan-900/60 border-cyan-500/50 hover:shadow-[0_0_20px_rgba(6,182,212,0.6)] text-cyan-100 hover:border-cyan-400';
      case 'noble gas': 
        return 'from-purple-900/60 border-purple-500/50 hover:shadow-[0_0_20px_rgba(168,85,247,0.6)] text-purple-100 hover:border-purple-400';
      case 'lanthanide':
        return 'from-pink-900/60 border-pink-500/50 hover:shadow-[0_0_20px_rgba(236,72,153,0.6)] text-pink-100 hover:border-pink-400';
      case 'actinide':
        return 'from-rose-900/60 border-rose-500/50 hover:shadow-[0_0_20px_rgba(244,63,94,0.6)] text-rose-100 hover:border-rose-400';
      default: 
        return 'from-slate-900/60 border-slate-500/50 hover:shadow-[0_0_20px_rgba(100,116,139,0.6)] text-slate-100 hover:border-slate-400';
    }
  };

  const styleClass = getCategoryStyles(element.category);

  return (
    <div 
      className={`group relative flex flex-col p-2 sm:p-3 rounded-lg border bg-gradient-to-br hover:scale-105 transition-all duration-300 cursor-pointer aspect-square ${styleClass} to-navy-surface backdrop-blur-md overflow-hidden`}
    >
      {/* Cyberpunk Glitch Line Effect on Hover */}
      <div className="absolute inset-0 bg-gradient-to-t from-white/0 via-white/10 to-white/0 -translate-y-full group-hover:animate-[shimmer_1s_ease-out] pointer-events-none" />

      {/* Atomic Number - Top Left */}
      <span className="text-xs sm:text-sm font-mono opacity-80 leading-none">
        {element.atomic_number}
      </span>
      
      {/* Symbol - Center */}
      <span className="m-auto text-3xl sm:text-5xl font-bold font-sans drop-shadow-md group-hover:drop-shadow-xl transition-all">
        {element.symbol}
      </span>
      
      {/* Container for Name & Mass (bottom) */}
      <div className="flex flex-col items-center mt-auto">
        <span className="text-center text-[10px] sm:text-[11px] font-bold tracking-wider uppercase truncate w-full opacity-90 drop-shadow-sm">
          {element.name}
        </span>
        <span className="text-center text-[9px] sm:text-[10px] font-mono opacity-70 mt-0.5">
          {element.atomic_mass.toFixed(3)}
        </span>
      </div>
    </div>
  );
}
