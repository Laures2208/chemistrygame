import React, { useState, useEffect } from 'react';
import { elementsList, ChemicalElement } from '../data/elements';
import { Play, RotateCcw, Target, CheckCircle2, MapPin } from 'lucide-react';
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

const formatTime = (ms: number) => {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

export default function PlacementGame() {
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'gameOver'>('idle');
  const [queue, setQueue] = useState<ChemicalElement[]>([]);
  const [revealed, setRevealed] = useState<Record<string, { status: 'correct' | 'wrongRevealed', showZ: boolean }>>({});
  const [shakeCell, setShakeCell] = useState<string | null>(null);
  
  const [score, setScore] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [timeElapsed, setTimeElapsed] = useState(0);

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

  const startGame = () => {
    setQueue(shuffleArray(elementsList));
    setScore(0);
    setMistakes(0);
    setStartTime(Date.now());
    setTimeElapsed(0);
    setRevealed({});
    setGameState('playing');
    setShakeCell(null);
  };

  const playTingSound = () => {
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      const audioCtx = new AudioContext();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(800, audioCtx.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(1200, audioCtx.currentTime + 0.1);
      gainNode.gain.setValueAtTime(0.5, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.5);
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 0.5);
    } catch(e) {}
  };

  const handleCellClick = (clickedElement: ChemicalElement) => {
    if (gameState !== 'playing' || !currentElement) return;
    if (revealed[clickedElement.symbol]) return;

    if (clickedElement.symbol === currentElement.symbol) {
      setRevealed(prev => ({ 
        ...prev, 
        [currentElement.symbol]: { status: 'correct', showZ: true } 
      }));
      setScore(s => s + 1);
      playTingSound();
      
      setTimeout(() => advanceQueue(), 400); 
    } else {
      setShakeCell(clickedElement.symbol);
      setTimeout(() => setShakeCell(null), 400);
      
      setRevealed(prev => ({ 
        ...prev, 
        [currentElement.symbol]: { status: 'wrongRevealed', showZ: true }
      }));
      setMistakes(m => m + 1);
      
      setTimeout(() => advanceQueue(), 1200);
    }
  };

  const advanceQueue = () => {
    setQueue(prev => {
      const newQueue = prev.slice(1);
      if (newQueue.length === 0) {
        setGameState('gameOver');
      }
      return newQueue;
    });
  };

  const totalAttempted = score + mistakes;
  const accuracy = totalAttempted === 0 ? 0 : Math.round((score / totalAttempted) * 100);

  return (
    <div className="flex flex-col items-center w-full max-w-6xl mx-auto text-white">
      {/* HEADER BAR (Desktop) */}
      <div className="hidden sm:flex w-full justify-between items-end mb-8 px-4">
        <div>
           <h2 className="text-3xl font-black font-sans uppercase tracking-widest text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.5)] flex items-center">
             <MapPin className="mr-3 text-cyan-400" size={32} />
             LOCATOR PROTOCOL
           </h2>
           <p className="text-cyan-500/80 font-mono text-sm tracking-widest mt-1">GRID RECOVERY SYSTEM v2.0</p>
        </div>
        
        <div className="flex space-x-8">
           <div className="flex flex-col items-end">
              <span className="text-cyan-700 font-mono text-[10px] uppercase tracking-[0.2em] mb-1 leading-none">THỜI GIAN</span>
              <div className="text-2xl font-mono font-bold text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.5)] leading-none">
                {formatTime(timeElapsed)}
              </div>
           </div>
           <div className="flex flex-col items-end">
              <span className="text-cyan-700 font-mono text-[10px] uppercase tracking-[0.2em] mb-1 leading-none">ĐIỂM SỐ</span>
              <div className="text-2xl font-mono font-bold text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.5)] leading-none">
                {score.toString().padStart(4, '0')}
              </div>
           </div>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center -mt-6 sm:mt-0 mb-6">
         {/* Digital Center Circle HUD */}
         <div className="relative flex justify-center items-center w-48 h-48 sm:w-56 sm:h-56 rounded-full border border-cyan-500/30 shadow-[0_0_40px_rgba(34,211,238,0.15)] bg-navy-surface/80 backdrop-blur-xl z-20">
             <div className="absolute inset-1.5 border-[3px] border-dashed border-cyan-400/40 rounded-full animate-[spin_30s_linear_infinite]" />
             <div className="absolute inset-4 border-[1px] border-cyan-500/30 rounded-full animate-[spin_20s_linear_infinite_reverse]" />
             <div className="absolute inset-6 border-[2px] border-cyan-800/50 rounded-full" />
             
             <div className="relative z-10 flex flex-col items-center justify-center pt-2 px-6">
                 <span className="text-cyan-500/80 font-mono text-[10px] sm:text-xs uppercase tracking-[0.2em] mb-2 flex items-center mt-[-5px]">
                    <Target size={12} className="mr-1.5" /> TÊN MỤC TIÊU
                 </span>
                 <span className="text-2xl sm:text-3xl md:text-3xl font-black font-sans text-cyan-300 drop-shadow-[0_0_20px_rgba(34,211,238,0.9)] transition-all text-center leading-tight uppercase">
                     {gameState === 'playing' && currentElement ? currentElement.name : 'ĐANG CHỜ'}
                 </span>
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
                   className="h-full bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,1)]"
                   initial={{ width: 0 }}
                   animate={{ width: `${(totalAttempted / 118) * 100}%` }}
                   transition={{ ease: 'easeOut', duration: 0.4 }}
                />
             </div>
         </div>
      </div>

      {/* MOBILE STATS */}
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
      <div className="relative w-full p-4 md:p-8 bg-navy-surface/40 backdrop-blur-md rounded-[2.5rem] border border-cyan-500/20 shadow-[0_0_50px_rgba(34,211,238,0.05),inset_0_0_20px_rgba(34,211,238,0.05)] overflow-x-auto no-scrollbar">
         
         <AnimatePresence>
           {gameState === 'idle' && (
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md rounded-[2.5rem]"
              >
                  <div className="max-w-md w-full p-8 bg-navy-surface/90 border border-cyan-500/40 rounded-3xl text-center shadow-[0_0_50px_rgba(34,211,238,0.2)]">
                      <Target size={56} className="mx-auto text-cyan-400 mb-6 drop-shadow-[0_0_15px_rgba(34,211,238,0.5)] animate-[pulse_2s_ease-in-out_infinite]" />
                      <h2 className="text-3xl font-black font-sans uppercase mb-4 text-white">TỌA ĐỘ KÝ HIỆU</h2>

                      <p className="text-gray-400 mb-8 font-mono text-sm leading-relaxed border-l-2 border-cyan-500/50 pl-4 text-left">
                         Hệ thống sẽ xuất <strong className="text-cyan-300">Tên (Name)</strong> của nguyên tố.
                         <br/><br/>
                         <strong className="text-cyan-300">Nhiệm vụ:</strong> Định vị tọa độ chính xác của <strong className="text-white">Ký hiệu hóa học (Symbol)</strong> tương ứng trên không gian lưới ma trận.
                      </p>
                      
                      <button onClick={startGame} className="w-full py-4 bg-cyan-600/20 border border-cyan-400 hover:bg-cyan-500 hover:text-navy-bg text-cyan-400 rounded-xl font-bold font-mono text-lg flex items-center justify-center transition-all hover:shadow-[0_0_25px_rgba(34,211,238,0.6)] group">
                         <Play size={20} className="mr-3" fill="currentColor" /> BẮT ĐẦU
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
                              <div className="text-3xl font-bold text-cyan-400 drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]">{accuracy}%</div>
                          </div>
                      </div>

                      <button onClick={startGame} className="w-full py-4 bg-transparent border-2 border-emerald-600 text-emerald-400 hover:bg-emerald-900/30 rounded-xl font-bold font-mono text-lg flex items-center justify-center transition-all">
                         <RotateCcw size={20} className="mr-3" /> CHƠI LẠI
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
           displayMode={'show_symbol'}
         />
      </div>
    </div>
  );
}
