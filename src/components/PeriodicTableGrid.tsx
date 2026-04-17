import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ChemicalElement } from '../data/elements';

export interface PeriodicTableGridProps {
  elements: ChemicalElement[];
  targetZ: number | null;
  revealed: Record<string, { status: 'correct' | 'wrongRevealed'; showZ: boolean }>;
  shakeCell: string | null;
  onCellClick: (element: ChemicalElement) => void;
  isActive: boolean;
  displayMode: 'show_symbol' | 'show_z';
}

export default function PeriodicTableGrid({
  elements,
  targetZ,
  revealed,
  shakeCell,
  onCellClick,
  isActive,
  displayMode,
}: PeriodicTableGridProps) {
  const [hoveredPos, setHoveredPos] = useState<{ x: number | null; y: number | null }>({ x: null, y: null });

  return (
    <div 
      className="min-w-[800px] grid gap-1 mx-auto relative select-none pb-4"
      style={{ gridTemplateColumns: 'repeat(18, minmax(0, 1fr))', gridTemplateRows: 'repeat(10, minmax(0, 1fr))' }}
      onMouseLeave={() => setHoveredPos({ x: null, y: null })}
    >
      {elements.map((e) => {
        const rCell = revealed[e.symbol];
        const isSolved = !!rCell;
        const isCorrect = rCell?.status === 'correct';
        const isShaking = shakeCell === e.symbol;

        const isHoveredCrosshair = hoveredPos.x === e.xpos || hoveredPos.y === e.ypos;
        const isExactlyHovered = hoveredPos.x === e.xpos && hoveredPos.y === e.ypos;

        let bgClass = "bg-navy-bg/30 border-cyan-900/20";
        let textClass = "text-cyan-500/80";

        if (isActive && !isSolved) {
          if (isExactlyHovered) {
            bgClass = "bg-cyan-500/30 border-cyan-300 z-30 scale-110 shadow-[0_0_20px_rgba(6,182,212,0.6),inset_0_0_15px_rgba(6,182,212,0.4)]";
            textClass = "text-white font-bold drop-shadow-[0_0_8px_rgba(103,232,249,1)]";
          } else if (isHoveredCrosshair) {
            bgClass = "bg-cyan-900/70 border-cyan-400/50 z-20 shadow-[inset_0_0_10px_rgba(6,182,212,0.4)]";
            textClass = "text-cyan-200 drop-shadow-[0_0_5px_rgba(6,182,212,0.6)]";
          }
        }

        return (
          <motion.button
            key={e.symbol}
            onClick={() => onCellClick(e)}
            onMouseEnter={() => setHoveredPos({ x: e.xpos, y: e.ypos })}
            disabled={!isActive || isSolved}
            animate={isShaking ? { x: [-5, 5, -5, 5, 0] } : {}}
            transition={{ duration: 0.15 }}
            style={{ gridColumn: e.xpos, gridRow: e.ypos, perspective: 1000 }}
            className={`relative flex items-center justify-center outline-none ${!isSolved && isActive ? 'cursor-pointer hover:z-30' : 'cursor-default'}`}
          >
            <motion.div
              className="relative w-full h-full aspect-square"
              style={{ transformStyle: 'preserve-3d' }}
              animate={{ rotateY: isSolved ? 180 : 0, scale: isSolved ? 1.05 : 1 }}
              transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            >
              {/* FRONT FACE */}
              <div 
                className={`absolute inset-0 flex flex-col items-center justify-center rounded border transition-all duration-150 ${bgClass}`}
                style={{ backfaceVisibility: 'hidden' }}
              >
                {displayMode === 'show_z' ? (
                  <span className={`text-xl sm:text-2xl font-mono font-bold ${textClass}`}>
                    {e.atomic_number}
                  </span>
                ) : (
                  <>
                    <span className="absolute top-0.5 left-1 sm:left-1.5 text-[8px] sm:text-[10px] font-mono opacity-0">
                      {e.atomic_number}
                    </span>
                    <span className={`text-base sm:text-lg md:text-xl font-sans ${textClass}`}>
                      {e.symbol}
                    </span>
                  </>
                )}
              </div>

              {/* BACK FACE (Lật thẻ lộ thông tin) */}
              <div 
                className={`absolute inset-0 flex flex-col items-center justify-center rounded border overflow-hidden ${
                  isCorrect 
                    ? 'bg-emerald-500/20 border-emerald-400/80 shadow-[0_0_15px_rgba(16,185,129,0.4)]' 
                    : 'bg-red-500/20 border-red-500/80 shadow-[0_0_15px_rgba(239,68,68,0.4)]'
                }`}
                style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
              >
                <span className={`absolute top-0.5 left-1 sm:left-1.5 text-[8px] sm:text-[10px] font-mono leading-none ${isCorrect ? 'text-emerald-300' : 'text-red-300'}`}>
                  {e.atomic_number}
                </span>
                <span className={`text-lg sm:text-xl font-bold font-sans leading-none mt-2 ${isCorrect ? 'text-emerald-50 drop-shadow-[0_0_8px_rgba(16,185,129,1)]' : 'text-red-50 drop-shadow-[0_0_8px_rgba(239,68,68,1)]'}`}>
                  {e.symbol}
                </span>
                <span className={`text-[6px] sm:text-[7px] text-center px-0.5 uppercase tracking-wider font-sans truncate w-full mt-0.5 ${isCorrect ? 'text-emerald-200/90' : 'text-red-200/90'}`}>
                  {e.name}
                </span>
                <span className={`text-[5px] sm:text-[6px] font-mono mt-px mb-0.5 ${isCorrect ? 'text-emerald-400/60' : 'text-red-400/60'}`}>
                  {e.atomic_mass.toFixed(2)}
                </span>
              </div>
            </motion.div>
          </motion.button>
        );
      })}
    </div>
  );
}
