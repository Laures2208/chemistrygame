import React, { useState, useEffect } from 'react';
import { elementsList, ChemicalElement } from '../data/elements';
import { Play, RotateCcw, Target, CheckCircle2, Crosshair, Hexagon, Clock, ArrowLeftRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import PeriodicTableGrid from './PeriodicTableGrid';

const shuffleArray = <T,>(array: T[]) => {
  const newArr = [...array];
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr;
};

export default function AtomicLocatorGame() {
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'gameOver'>('idle');
  const [locatorMode, setLocatorMode] = useState<'find_z' | 'find_symbol'>('find_z');
  const [queue, setQueue] = useState<ChemicalElement[]>([]);
  const [revealed, setRevealed] = useState<Record<string, { status: 'correct' | 'wrongRevealed', showZ: boolean }>>({});
  const [shakeCell, setShakeCell] = useState<string | null>(null);
  
  const [score, setScore] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [timeElapsed, setTimeElapsed] = useState(0);

  // Futuristic Crosshair Hover State
  const [hoveredPos, setHoveredPos] = useState<{x: number | null, y: number | null}>({x: null, y: null});

  const currentElement = queue[0];

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (gameState === 'playing' && startTime) {
      timer = setInterval(() => {
        setTimeElapsed(Date.now() - startTime);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [gameState, startTime]);

  const playTingSound = () => {
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.5, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
      osc.start();
      osc.stop(ctx.currentTime + 0.5);
    } catch (e) {
      // Ignore audio context errors
    }
  };

  const startGame = () => {
    setQueue(shuffleArray(elementsList));
    setRevealed({});
    setScore(0);
    setMistakes(0);
    setStartTime(Date.now());
    setTimeElapsed(0);
    setGameState('playing');
  };

  const handleCellClick = (clickedElement: ChemicalElement) => {
    if (gameState !== 'playing' || !currentElement) return;
    if (revealed[clickedElement.symbol]) return;

    if (clickedElement.atomic_number === currentElement.atomic_number) {
      playTingSound();
      setRevealed(prev => ({ 
        ...prev, 
        [currentElement.symbol]: { status: 'correct', showZ: true } 
      }));
      setScore(s => s + 10);
      advanceQueue();
    } else {
      setShakeCell(clickedElement.symbol);
      setTimeout(() => setShakeCell(null), 400);
      
      setRevealed(prev => ({ 
        ...prev, 
        [currentElement.symbol]: { status: 'wrongRevealed', showZ: true } 
      }));
      setMistakes(m => m + 1);
      advanceQueue();
    }
  };

  const advanceQueue = () => {
    setQueue(prev => {
      const newQueue = prev.slice(1);
      if (newQueue.length === 0) setGameState('gameOver');
      return newQueue;
    });
  };

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const totalAttempted = 118 - queue.length;
  const accuracy = totalAttempted === 0 ? 0 : Math.round(((totalAttempted - mistakes) / totalAttempted) * 100);

  return (
    <div className="flex flex-col items-center w-full max-w-6xl mx-auto pb-10">
      
      {/* FUTURISTIC HUD */}
      <div className="w-full relative flex flex-col items-center mb-8 xl:mb-12">
         {/* Ambient Background Glow */}
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-32 bg-cyan-500/20 blur-[100px] pointer-events-none" />
         
         {/* Top Stats Left & Right */}
         <div className="w-full max-w-3xl flex justify-between items-center absolute top-1/2 -translate-y-1/2 px-4 pointer-events-none">
            <div className="flex flex-col items-start hidden sm:flex">
               <span className="text-cyan-700 font-mono text-[10px] uppercase tracking-[0.2em] mb-1 flex items-center">
                 <Clock size={12} className="mr-1" /> THỜI GIAN
               </span>
               <div className="text-2xl font-mono text-cyan-400 drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]">{formatTime(timeElapsed)}</div>
            </div>
            
            <div className="flex flex-col items-end hidden sm:flex">
               <span className="text-cyan-700 font-mono text-[10px] uppercase tracking-[0.2em] mb-1 flex items-center">
                 ĐIỂM SỐ <Target size={12} className="ml-1" />
               </span>
               <div className="text-2xl font-mono text-cyan-400 drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]">{score.toString().padStart(4, '0')}</div>
            </div>
         </div>

         {/* Digital Center Circle HUD */}
         <div className="relative flex justify-center items-center w-40 h-40 sm:w-48 sm:h-48 rounded-full border border-cyan-500/30 shadow-[0_0_40px_rgba(6,182,212,0.15)] bg-navy-surface/80 backdrop-blur-xl z-20">
             <div className="absolute inset-1.5 border-[3px] border-dashed border-cyan-400/40 rounded-full animate-[spin_30s_linear_infinite]" />
             <div className="absolute inset-4 border-[1px] border-cyan-500/30 rounded-full animate-[spin_20s_linear_infinite_reverse]" />
             <div className="absolute inset-6 border-[2px] border-cyan-800/50 rounded-full" />
             
             <div className="relative z-10 flex flex-col items-center justify-center pt-2">
                 <span className="text-cyan-500/80 font-mono text-[8px] sm:text-[9px] uppercase tracking-[0.2em] mb-2 sm:mb-3 flex items-center mt-[-5px]">
                    <Crosshair size={10} className="mr-1.5" /> {locatorMode === 'find_z' ? 'KÝ HIỆU MỤC TIÊU' : 'SỐ Z MỤC TIÊU'}
                 </span>
                 {locatorMode === 'find_z' ? (
                   <>
                     <span className="text-4xl sm:text-5xl md:text-6xl font-black font-sans text-cyan-300 drop-shadow-[0_0_20px_rgba(6,182,212,0.9)] transition-all leading-none">
                         {gameState === 'playing' && currentElement ? currentElement.symbol : '--'}
                     </span>
                     <span className="text-cyan-400 font-mono text-[8px] sm:text-[10px] uppercase tracking-widest mt-1 sm:mt-2 truncate max-w-[120px] text-center">
                         {gameState === 'playing' && currentElement ? currentElement.name : 'ĐANG CHỜ'}
                     </span>
                   </>
                 ) : (
                   <span className="text-6xl sm:text-7xl font-black font-mono text-cyan-300 drop-shadow-[0_0_20px_rgba(6,182,212,0.9)] transition-all">
                       {gameState === 'playing' && currentElement ? currentElement.atomic_number.toString().padStart(2, '0') : '--'}
                   </span>
                 )}
             </div>
         </div>

         {/* Progress Bar under HUD */}
         <div className="mt-6 flex flex-col items-center w-full max-w-sm relative z-10">
             <div className="flex justify-between w-full mb-2">
               <span className="text-cyan-600 font-mono text-[10px] tracking-widest uppercase">Quét Lưới</span>
               <span className="text-cyan-400 font-mono text-[10px] tracking-widest uppercase">{Math.round((totalAttempted/118)*100)}%</span>
             </div>
             <div className="w-full bg-black/50 h-1.5 rounded-full overflow-hidden border border-cyan-900/60 shadow-[inset_0_1px_3px_rgba(0,0,0,0.8)]">
                <motion.div 
                   className="h-full bg-cyan-400 shadow-[0_0_10px_rgba(6,182,212,1)]"
                   initial={{ width: 0 }}
                   animate={{ width: `${(totalAttempted / 118) * 100}%` }}
                   transition={{ ease: 'easeOut', duration: 0.4 }}
                />
             </div>
         </div>
      </div>

      {/* MOBILE STATS (Visible only on xs screens) */}
      <div className="sm:hidden flex w-full justify-between px-6 mb-6">
          <div className="flex flex-col items-start">
              <span className="text-cyan-700 font-mono text-[10px] uppercase tracking-[0.2em]">THỜI GIAN</span>
              <div className="text-lg font-mono text-cyan-400">{formatTime(timeElapsed)}</div>
          </div>
          <div className="flex flex-col items-end">
              <span className="text-cyan-700 font-mono text-[10px] uppercase tracking-[0.2em]">ĐIỂM SỐ</span>
              <div className="text-lg font-mono text-cyan-400">{score.toString().padStart(4, '0')}</div>
          </div>
      </div>

      {/* GLASSMORPHISM GRID CONTAINER */}
      <div className="relative w-full p-4 md:p-8 bg-navy-surface/40 backdrop-blur-md rounded-[2.5rem] border border-cyan-500/20 shadow-[0_0_50px_rgba(6,182,212,0.05),inset_0_0_20px_rgba(6,182,212,0.05)] overflow-x-auto no-scrollbar">
         
         <AnimatePresence>
           {gameState === 'idle' && (
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md rounded-[2.5rem]"
              >
                  <div className="max-w-md w-full p-8 bg-navy-surface/90 border border-cyan-500/40 rounded-3xl text-center shadow-[0_0_50px_rgba(6,182,212,0.2)]">
                      <Crosshair size={56} className="mx-auto text-cyan-400 mb-6 drop-shadow-[0_0_15px_rgba(6,182,212,0.5)] animate-[spin_4s_linear_infinite]" />
                      <h2 className="text-3xl font-black font-sans uppercase mb-4 text-white">TÌM SỐ HIỆU (Z)</h2>
                      
                      <button 
                        onClick={() => setLocatorMode(prev => prev === 'find_z' ? 'find_symbol' : 'find_z')}
                        className="w-full flex items-center justify-between px-4 py-3 bg-navy-bg/50 border border-cyan-500/30 rounded-xl mb-6 hover:bg-cyan-900/30 transition-colors group"
                      >
                         <span className="text-xs font-mono text-cyan-300">
                           {locatorMode === 'find_z' ? 'MỤC TIÊU: TÌM SỐ THỨ TỰ (Z)' : 'MỤC TIÊU: TÌM KÝ HIỆU'}
                         </span>
                         <ArrowLeftRight size={16} className="text-cyan-500 group-hover:text-cyan-300" />
                      </button>

                      <p className="text-gray-400 mb-8 font-mono text-sm leading-relaxed border-l-2 border-cyan-500/50 pl-4 text-left">
                         {locatorMode === 'find_z' ? (
                           <>
                             Hệ thống sẽ xuất dữ liệu nhận dạng của nguyên tố (Ký hiệu & Tên).
                             <br/><br/>
                             <strong className="text-cyan-300">Nhiệm vụ:</strong> Quét bảng tuần hoàn và xác định <strong className="text-white">Số hiệu nguyên tử (Z)</strong> tương ứng của nó.
                           </>
                         ) : (
                           <>
                             Hệ thống sẽ xuất Số hiệu nguyên tử (Z).
                             <br/><br/>
                             <strong className="text-cyan-300">Nhiệm vụ:</strong> Quét bảng tuần hoàn và xác định <strong className="text-white">Ký hiệu</strong> tương ứng của nó.
                           </>
                         )}
                      </p>
                      
                      <button onClick={startGame} className="w-full py-4 bg-cyan-600/20 border border-cyan-400 hover:bg-cyan-500 hover:text-navy-bg text-cyan-400 rounded-xl font-bold font-mono text-lg flex items-center justify-center transition-all hover:shadow-[0_0_25px_rgba(6,182,212,0.6)] group">
                         <Play size={20} className="mr-3" fill="currentColor" /> THIẾT LẬP KẾT NỐI
                      </button>
                  </div>
              </motion.div>
           )}

           {gameState === 'gameOver' && (
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md rounded-[2.5rem]"
              >
                  <div className="max-w-md w-full p-8 bg-navy-surface/90 border border-emerald-500/50 rounded-3xl text-center shadow-[0_0_50px_rgba(16,185,129,0.2)]">
                      <CheckCircle2 size={64} className="mx-auto text-emerald-400 mb-6 drop-shadow-[0_0_15px_rgba(16,185,129,0.8)]" />
                      <h2 className="text-3xl font-black font-sans uppercase mb-2 text-white">HOÀN THÀNH</h2>
                      <div className="text-cyan-400 font-mono mb-8 text-sm">TỔNG THỜI GIAN: {formatTime(timeElapsed)}</div>
                      
                      <div className="grid grid-cols-2 gap-4 mb-8 relative">
                          <div className="absolute inset-0 bg-emerald-500/5 blur-[30px]" />
                          <div className="bg-black/40 border border-emerald-500/20 p-4 rounded-xl relative z-10">
                              <div className="text-[10px] text-gray-400 font-mono tracking-widest mb-1">ĐIỂM SỐ</div>
                              <div className="text-3xl font-bold text-emerald-400 drop-shadow-[0_0_10px_rgba(16,185,129,0.5)]">{score}</div>
                          </div>
                          <div className="bg-black/40 border border-emerald-500/20 p-4 rounded-xl relative z-10">
                              <div className="text-[10px] text-gray-400 font-mono tracking-widest mb-1">ĐỘ CHÍNH XÁC</div>
                              <div className="text-3xl font-bold text-cyan-400 drop-shadow-[0_0_10px_rgba(6,182,212,0.5)]">{accuracy}%</div>
                          </div>
                      </div>

                      <button onClick={startGame} className="w-full py-4 bg-transparent border-2 border-emerald-600 text-emerald-400 hover:bg-emerald-900/30 rounded-xl font-bold font-mono text-lg flex items-center justify-center transition-all">
                         <RotateCcw size={20} className="mr-3" /> CHẠY LẠI CHƯƠNG TRÌNH
                      </button>
                  </div>
              </motion.div>
           )}
         </AnimatePresence>

         <PeriodicTableGrid
           elements={elementsList}
           targetZ={currentElement?.atomic_number ?? null}
           revealed={revealed}
           shakeCell={shakeCell}
           onCellClick={handleCellClick}
           isActive={gameState === 'playing'}
           displayMode={locatorMode === 'find_z' ? 'show_z' : 'show_symbol'}
         />
      </div>
    </div>
  );
}
