import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Hexagon, Zap, Clock, Play, RotateCcw } from 'lucide-react';
import { elementsList, ChemicalElement } from '../data/elements';

const TIME_PER_ROUND = 10; // seconds
const TOTAL_HEARTS = 3;
const GRID_SIZE = 20;

export default function AtomicCityGame() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);

  const [availableElements, setAvailableElements] = useState<ChemicalElement[]>([]);
  const [targetElement, setTargetElement] = useState<ChemicalElement | null>(null);
  const [filledSlots, setFilledSlots] = useState<Record<number, ChemicalElement>>({});
  
  const [hearts, setHearts] = useState(TOTAL_HEARTS);
  const [timeLeft, setTimeLeft] = useState(TIME_PER_ROUND);
  const [score, setScore] = useState(0);

  const timerRef = useRef<number | null>(null);

  const startGame = () => {
    const subset = elementsList.filter(e => e.atomic_number <= GRID_SIZE);
    let shuffled = [...subset].sort(() => 0.5 - Math.random());
    
    setAvailableElements(shuffled);
    setTargetElement(shuffled[0]);
    setFilledSlots({});
    setHearts(TOTAL_HEARTS);
    setScore(0);
    setTimeLeft(TIME_PER_ROUND);
    setGameOver(false);
    setGameWon(false);
    setIsPlaying(true);
  };

  const nextRound = (currentAvailable: ChemicalElement[], currentFilled: Record<number, ChemicalElement>) => {
    const remaining = currentAvailable.filter(e => !currentFilled[e.atomic_number]);
    if (remaining.length === 0) {
      setGameWon(true);
      setGameOver(true);
      setIsPlaying(false);
      return;
    }
    const nextTarget = remaining.sort(() => 0.5 - Math.random())[0];
    setTargetElement(nextTarget);
    setTimeLeft(TIME_PER_ROUND);
  };

  const handleLoseLife = () => {
    setHearts(h => {
      if (h <= 1) {
        setGameOver(true);
        setIsPlaying(false);
        return 0;
      }
      return h - 1;
    });
    // Skip to next element after losing a life
    nextRound(availableElements, filledSlots);
  };

  useEffect(() => {
    if (isPlaying && !gameOver && !gameWon) {
      timerRef.current = window.setInterval(() => {
        setTimeLeft(t => {
          if (t <= 0.1) {
            handleLoseLife();
            return TIME_PER_ROUND;
          }
          return t - 0.1;
        });
      }, 100);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, gameOver, gameWon, availableElements, filledSlots]);

  const handleSlotClick = (slotNumber: number) => {
    if (!isPlaying || gameOver || !targetElement) return;

    if (slotNumber === targetElement.atomic_number) {
      // Correct
      const newFilled = { ...filledSlots, [slotNumber]: targetElement };
      setFilledSlots(newFilled);
      setScore(s => s + 10 * Math.ceil(timeLeft));
      nextRound(availableElements, newFilled);
    } else {
      // Wrong slot
      if (!filledSlots[slotNumber]) {
        // Only lose life if clicking an empty wrong slot (don't penalize clicking already filled)
        handleLoseLife();
      }
    }
  };

  return (
    <div className="flex flex-col items-center max-w-5xl mx-auto w-full p-6 sm:p-10 glass-panel rounded-3xl text-white relative">
      <div className="absolute top-0 right-0 w-64 h-64 bg-gold-neon opacity-5 blur-[120px] pointer-events-none" />

      <div className="flex flex-col md:flex-row items-center justify-between w-full mb-10 gap-6">
        <div className="flex items-center space-x-3 text-gold-neon">
          <Hexagon size={28} className="drop-shadow-[0_0_10px_rgba(251,191,36,0.5)]" />
          <h2 className="text-xl font-bold font-sans tracking-widest uppercase neon-text-gold">THÀNH PHỐ NGUYÊN TỬ</h2>
        </div>
        
        <div className="flex items-center space-x-6 bg-navy-surface/50 border border-gold-neon/20 px-6 py-3 rounded-xl backdrop-blur-md">
          <div className="flex items-center space-x-2">
            <span className="text-xs text-gray-400 uppercase tracking-widest mr-2">MẠNG</span>
            {Array.from({ length: TOTAL_HEARTS }).map((_, i) => (
              <div 
                key={i} 
                className={`w-2 h-6 skew-x-12 transition-all ${
                  i < hearts 
                    ? "bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)]" 
                    : "bg-red-500/20 border border-red-500/30"
                }`} 
              />
            ))}
          </div>
          <div className="w-px h-6 bg-white/10" />
          <div className="flex items-center space-x-2">
             <span className="text-xs text-gray-400 uppercase tracking-widest">ĐIỂM SỐ</span>
             <span className="font-mono text-xl font-bold text-white tracking-widest">{score.toString().padStart(4, '0')}</span>
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {!isPlaying && !gameOver && !gameWon ? (
          <motion.div 
            key="start"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="flex flex-col items-center justify-center py-20 w-full"
          >
            <div className="w-28 h-28 glass-panel rounded-full flex flex-col items-center justify-center mb-8 border border-gold-neon/30 shadow-[0_0_30px_rgba(251,191,36,0.15)] relative">
               <div className="absolute inset-2 border border-dashed border-gold-neon/40 rounded-full animate-[spin_10s_linear_infinite]" />
               <Zap size={40} className="text-gold-neon drop-shadow-[0_0_15px_rgba(251,191,36,0.8)]" />
            </div>
            <h3 className="text-3xl font-bold font-sans mb-4 tracking-wider uppercase text-center neon-text-gold">Chế Độ Tính Giờ</h3>
            <p className="text-gray-400 text-center max-w-md mb-10 leading-relaxed font-mono text-sm tracking-wide">
              Sắp xếp từng nguyên tố vào đúng block năng lượng (Z). Rất nhanh thôi, bạn chỉ có {TIME_PER_ROUND} giây cho mỗi nguyên tố!
            </p>
            <button 
              onClick={startGame}
              className="group relative flex items-center space-x-3 bg-white text-navy-bg px-10 py-4 rounded-lg font-bold tracking-widest uppercase transition-all hover:bg-gold-neon hover:shadow-[0_0_30px_rgba(251,191,36,0.4)] active:scale-95 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
              <Play fill="currentColor" size={18} />
              <span>BẮT ĐẦU TÍCH HỢP</span>
            </button>
          </motion.div>
        ) : (
          <motion.div key="game" className="w-full relative" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="flex flex-col items-center mb-10">
              <AnimatePresence mode="wait">
                {!gameOver && !gameWon && targetElement ? (
                  <motion.div 
                    key={targetElement.symbol}
                    initial={{ y: -20, opacity: 0, rotateX: -90 }}
                    animate={{ y: 0, opacity: 1, rotateX: 0 }}
                    exit={{ y: 20, opacity: 0, rotateX: 90 }}
                    transition={{ type: "spring", damping: 15 }}
                    className="flex flex-col md:flex-row items-center gap-6 glass-panel border border-gold-neon/30 px-8 py-5 rounded-2xl shadow-[0_0_20px_rgba(251,191,36,0.1)] relative overflow-hidden"
                  >
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-gold-neon shadow-[0_0_10px_rgba(251,191,36,1)]" />
                    <div className="text-center md:text-left">
                      <p className="text-[10px] text-gray-400 uppercase tracking-[0.3em] mb-1">Đang chờ xử lý</p>
                      <div className="flex items-baseline space-x-3">
                         <span className="text-3xl font-bold text-white tracking-widest">{targetElement.name}</span>
                         <span className="text-xl font-mono text-gold-neon">({targetElement.symbol})</span>
                      </div>
                    </div>
                    <div className="hidden md:block w-px h-12 bg-white/10" />
                    <div className="flex items-center space-x-3 bg-navy-bg/50 px-4 py-2 rounded-lg border border-white/5">
                      <Clock size={20} className={timeLeft <= 3 ? "text-red-500 animate-pulse" : "text-gray-400"} />
                      <span className={`font-mono text-3xl font-bold w-16 text-center ${timeLeft <= 3 ? "text-red-500 neon-text-red" : "text-white"}`}>
                        {timeLeft.toFixed(1)}
                      </span>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div 
                    key="result"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="flex flex-col items-center py-4"
                  >
                    <h3 className={`text-4xl font-black mb-6 uppercase tracking-widest ${gameWon ? 'text-emerald-400 neon-text-emerald' : 'text-red-500'}`}>
                      {gameWon ? 'ĐỒNG BỘ THÀNH CÔNG' : 'LỖI HỆ THỐNG'}
                    </h3>
                    <button onClick={startGame} className="flex items-center space-x-3 text-sm font-bold tracking-widest text-white uppercase bg-white/10 hover:bg-white/20 border border-white/20 px-6 py-3 rounded-lg transition-all hover:shadow-[0_0_15px_rgba(255,255,255,0.2)]">
                      <RotateCcw size={16} />
                      <span>THỬ LẠI</span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Time Bar */}
            {!gameOver && !gameWon && (
               <div className="w-full bg-navy-surface border border-white/5 h-1.5 mb-10 overflow-hidden rounded-full shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)]">
                 <motion.div 
                   className="h-full bg-gold-neon origin-left shadow-[0_0_10px_rgba(251,191,36,0.8)]"
                   style={{ width: `${(timeLeft / TIME_PER_ROUND) * 100}%` }}
                   animate={{ backgroundColor: timeLeft <= 3 ? '#ef4444' : '#fbbf24' }}
                   transition={{ duration: 0.1 }}
                 />
               </div>
            )}

            {/* Integration Grid */}
            <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-10 gap-2 sm:gap-3 w-full">
              {Array.from({ length: GRID_SIZE }).map((_, i) => {
                const slotNumber = i + 1;
                const isFilled = !!filledSlots[slotNumber];
                const element = filledSlots[slotNumber];
                const isTargetSlot = gameOver && targetElement?.atomic_number === slotNumber;

                return (
                  <motion.button
                    key={slotNumber}
                    disabled={!isPlaying || isFilled}
                    onClick={() => handleSlotClick(slotNumber)}
                    whileHover={!isFilled && isPlaying ? { scale: 1.05, backgroundColor: 'rgba(251,191,36,0.1)' } : {}}
                    whileTap={!isFilled && isPlaying ? { scale: 0.95 } : {}}
                    className={`
                      relative flex flex-col items-center justify-center aspect-square rounded-xl transition-all duration-300 overflow-hidden
                      ${isFilled 
                        ? 'border border-emerald-500/80 bg-emerald-900/40 shadow-[0_0_15px_rgba(16,185,129,0.3),inset_0_0_20px_rgba(16,185,129,0.2)]' 
                        : 'border border-white/10 bg-navy-surface hover:border-gold-neon/50 cursor-pointer'}
                      ${isTargetSlot ? 'ring-2 ring-red-500 bg-red-900/30 animate-pulse' : ''}
                    `}
                  >
                    {!isFilled && (
                      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
                    )}

                    <span className={`absolute top-1.5 left-2 text-[10px] font-mono tracking-widest ${isFilled ? 'text-emerald-200/60' : 'text-gray-600'}`}>
                      {slotNumber.toString().padStart(2, '0')}
                    </span>
                    
                    {isFilled && element && (
                      <motion.div 
                        initial={{ scale: 0, rotate: -45, opacity: 0 }}
                        animate={{ scale: 1, rotate: 0, opacity: 1 }}
                        type="spring" 
                        className="flex flex-col items-center justify-center mt-2 relative z-10"
                      >
                        <span className="text-xl sm:text-2xl font-bold font-sans text-white neon-text-emerald leading-none mb-1">
                          {element.symbol}
                        </span>
                      </motion.div>
                    )}
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
