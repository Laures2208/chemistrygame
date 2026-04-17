import React, { useState, useEffect } from 'react';
import { elementsList, ChemicalElement } from '../data/elements';
import { Play, RotateCcw, CheckCircle2, Dna } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const shuffleArray = <T,>(array: T[]) => {
  const newArr = [...array];
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr;
};

const getRandomElements = (arr: ChemicalElement[], count: number, exclude?: ChemicalElement) => {
  let shuffled = [...arr].sort(() => 0.5 - Math.random());
  if (exclude) {
    shuffled = shuffled.filter(e => e.symbol !== exclude.symbol);
  }
  return shuffled.slice(0, count);
};

const formatTime = (ms: number) => {
  const totalSeconds = Math.floor(ms / 1000);
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

const TOTAL_ROUNDS = 20;

export default function NamingGame() {
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'gameOver'>('idle');
  const [queue, setQueue] = useState<ChemicalElement[]>([]);
  const [options, setOptions] = useState<ChemicalElement[]>([]);
  
  const [score, setScore] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [timeElapsed, setTimeElapsed] = useState(0);

  // States for effects
  const [shakeCell, setShakeCell] = useState<string | null>(null);
  const [revealed, setRevealed] = useState<Record<string, 'correct' | 'wrongRevealed' | 'clickedWrong'>>({});

  const currentElement = queue[0];
  const roundsPlayed = TOTAL_ROUNDS - queue.length;

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
    setGameState('playing');
    const shuffled = shuffleArray(elementsList).slice(0, TOTAL_ROUNDS);
    setQueue(shuffled);
    setScore(0);
    setMistakes(0);
    setStartTime(Date.now());
    setTimeElapsed(0);
    setRevealed({});
    setShakeCell(null);
    setupOptions(shuffled[0]);
  };

  const setupOptions = (target: ChemicalElement) => {
    const wrongOptions = getRandomElements(elementsList, 3, target);
    const allOptions = shuffleArray([...wrongOptions, target]);
    setOptions(allOptions);
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

  const handleOptionClick = (opt: ChemicalElement) => {
    if (Object.keys(revealed).length > 0 || gameState !== 'playing' || !currentElement) return;

    if (opt.symbol === currentElement.symbol) {
      // Correct Match
      setScore(s => s + 1);
      setRevealed({ [opt.symbol]: 'correct' });
      playTingSound();

      setTimeout(() => advanceQueue(queue), 1500);
    } else {
      // Wrong Match
      setMistakes(m => m + 1);
      setShakeCell(opt.symbol);
      setRevealed({
        [opt.symbol]: 'clickedWrong',
        [currentElement.symbol]: 'wrongRevealed'
      });

      setTimeout(() => {
        setShakeCell(null);
        advanceQueue(queue);
      }, 2000);
    }
  };

  const advanceQueue = (currentQueue: ChemicalElement[]) => {
    const newQueue = currentQueue.slice(1);
    if (newQueue.length === 0) {
      setGameState('gameOver');
    } else {
      setQueue(newQueue);
      setRevealed({});
      setupOptions(newQueue[0]);
    }
  };

  const accuracy = score + mistakes > 0 ? Math.round((score / (score + mistakes)) * 100) : 0;

  return (
    <div className="flex flex-col items-center w-full max-w-5xl mx-auto text-white">
      
      {/* HEADER BAR (Desktop) */}
      <div className="hidden sm:flex w-full justify-between items-end mb-8 px-4">
        <div>
           <h2 className="text-3xl font-black font-sans uppercase tracking-widest text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.5)] flex items-center">
             <Dna className="mr-3 text-emerald-400" size={32} />
             ĐỊNH DANH NGUYÊN TỐ
           </h2>
           <p className="text-emerald-500/80 font-mono text-sm tracking-widest mt-1">HỆ THỐNG KIỂM TRA DỮ LIỆU v2.0</p>
        </div>
        
        <div className="flex space-x-8">
           <div className="flex flex-col items-end">
              <span className="text-emerald-700 font-mono text-[10px] uppercase tracking-[0.2em] mb-1 leading-none">THỜI GIAN</span>
              <div className="text-2xl font-mono font-bold text-emerald-400 drop-shadow-[0_0_8px_rgba(16,185,129,0.5)] leading-none">
                {formatTime(timeElapsed)}
              </div>
           </div>
           <div className="flex flex-col items-end">
              <span className="text-emerald-700 font-mono text-[10px] uppercase tracking-[0.2em] mb-1 leading-none">ĐIỂM SỐ</span>
              <div className="text-2xl font-mono font-bold text-emerald-400 drop-shadow-[0_0_8px_rgba(16,185,129,0.5)] leading-none">
                {score.toString().padStart(4, '0')}
              </div>
           </div>
        </div>
      </div>

      {/* MOBILE STATS */}
      <div className="sm:hidden flex w-full justify-between px-6 mb-6">
          <div className="flex flex-col items-start">
              <span className="text-emerald-700 font-mono text-[10px] uppercase tracking-[0.2em]">THỜI GIAN</span>
              <div className="text-lg font-mono text-emerald-400">{formatTime(timeElapsed)}</div>
          </div>
          <div className="flex flex-col items-end">
              <span className="text-emerald-700 font-mono text-[10px] uppercase tracking-[0.2em]">ĐIỂM SỐ</span>
              <div className="text-lg font-mono text-emerald-400">{score.toString().padStart(4, '0')}</div>
          </div>
      </div>

      {/* GLASSMORPHISM CONTAINER */}
      <div className="relative w-full p-4 md:p-8 bg-navy-surface/40 backdrop-blur-md rounded-[2.5rem] border border-emerald-500/20 shadow-[0_0_50px_rgba(16,185,129,0.05),inset_0_0_20px_rgba(16,185,129,0.05)] overflow-hidden">
         
         <AnimatePresence>
           {gameState === 'idle' && (
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md rounded-[2.5rem]"
              >
                  <div className="max-w-md w-full p-8 bg-navy-surface/90 border border-emerald-500/40 rounded-3xl text-center shadow-[0_0_50px_rgba(16,185,129,0.2)]">
                      <Dna size={56} className="mx-auto text-emerald-400 mb-6 drop-shadow-[0_0_15px_rgba(16,185,129,0.5)] animate-[spin_4s_linear_infinite]" />
                      <h2 className="text-3xl font-black font-sans uppercase mb-4 text-white">ĐỊNH DANH NGUYÊN TỐ</h2>
                      <p className="text-gray-400 mb-8 font-mono text-sm leading-relaxed border-l-2 border-emerald-500/50 pl-4 text-left">
                         Hệ thống sẽ cung cấp Ký hiệu hóa học (Symbol) của các nguyên tố.
                         <br/><br/>
                         <strong className="text-emerald-300">Nhiệm vụ:</strong> Định vị và chọn đúng <strong className="text-white">Tên (Name)</strong> của nguyên tố đó từ 4 thẻ dữ liệu bên dưới.
                      </p>
                      <button onClick={startGame} className="w-full py-4 bg-emerald-600/20 border border-emerald-400 hover:bg-emerald-500 hover:text-navy-bg text-emerald-400 rounded-xl font-bold font-mono text-lg flex items-center justify-center transition-all hover:shadow-[0_0_25px_rgba(16,185,129,0.6)] group">
                         <Play size={20} className="mr-3" fill="currentColor" /> BẮT ĐẦU KẾT NỐI
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
                      <div className="text-emerald-400 font-mono mb-8 text-sm">TỔNG THỜI GIAN: {formatTime(timeElapsed)}</div>
                      
                      <div className="grid grid-cols-2 gap-4 mb-8 relative">
                          <div className="absolute inset-0 bg-emerald-500/5 blur-[30px]" />
                          <div className="bg-black/40 border border-emerald-500/20 p-4 rounded-xl relative z-10">
                              <div className="text-[10px] text-gray-400 font-mono tracking-widest mb-1">ĐIỂM SỐ</div>
                              <div className="text-3xl font-bold text-emerald-400 drop-shadow-[0_0_10px_rgba(16,185,129,0.5)]">{score}</div>
                          </div>
                          <div className="bg-black/40 border border-emerald-500/20 p-4 rounded-xl relative z-10">
                              <div className="text-[10px] text-gray-400 font-mono tracking-widest mb-1">ĐỘ CHÍNH XÁC</div>
                              <div className="text-3xl font-bold text-emerald-400 drop-shadow-[0_0_10px_rgba(16,185,129,0.5)]">{accuracy}%</div>
                          </div>
                      </div>

                      <button onClick={startGame} className="w-full py-4 bg-transparent border-2 border-emerald-600 text-emerald-400 hover:bg-emerald-900/30 rounded-xl font-bold font-mono text-lg flex items-center justify-center transition-all">
                         <RotateCcw size={20} className="mr-3" /> CHẠY LẠI CHƯƠNG TRÌNH
                      </button>
                  </div>
              </motion.div>
           )}
         </AnimatePresence>

         <div className="flex flex-col items-center justify-center mt-4">
             {/* Digital Center Circle HUD */}
             <div className="relative flex justify-center items-center w-40 h-40 sm:w-48 sm:h-48 rounded-full border border-emerald-500/30 shadow-[0_0_40px_rgba(16,185,129,0.15)] bg-navy-surface/80 backdrop-blur-xl z-20">
                 <div className="absolute inset-1.5 border-[3px] border-dashed border-emerald-400/40 rounded-full animate-[spin_30s_linear_infinite]" />
                 <div className="absolute inset-4 border-[1px] border-emerald-500/30 rounded-full animate-[spin_20s_linear_infinite_reverse]" />
                 <div className="absolute inset-6 border-[2px] border-emerald-800/50 rounded-full" />
                 
                 <div className="relative z-10 flex flex-col items-center justify-center pt-2">
                     <span className="text-emerald-500/80 font-mono text-[8px] sm:text-[9px] uppercase tracking-[0.2em] mb-2 sm:mb-3 flex items-center mt-[-5px]">
                        <Dna size={10} className="mr-1.5" /> MỤC TIÊU
                     </span>
                     <span className="text-5xl sm:text-7xl font-black font-sans text-emerald-300 drop-shadow-[0_0_20px_rgba(16,185,129,0.9)] transition-all leading-none">
                         {gameState === 'playing' && currentElement ? currentElement.symbol : '--'}
                     </span>
                 </div>
             </div>

             {/* Progress Bar under HUD */}
             <div className="mt-8 flex flex-col items-center w-full max-w-sm relative z-10">
                 <div className="flex justify-between w-full mb-2">
                   <span className="text-emerald-600 font-mono text-[10px] tracking-widest uppercase">Tiến Độ</span>
                   <span className="text-emerald-400 font-mono text-[10px] tracking-widest uppercase">{Math.round((roundsPlayed/TOTAL_ROUNDS)*100)}%</span>
                 </div>
                 <div className="w-full bg-black/50 h-1.5 rounded-full overflow-hidden border border-emerald-900/60 shadow-[inset_0_1px_3px_rgba(0,0,0,0.8)]">
                    <motion.div 
                       className="h-full bg-emerald-400 shadow-[0_0_10px_rgba(16,185,129,1)]"
                       initial={{ width: 0 }}
                       animate={{ width: `${(roundsPlayed / TOTAL_ROUNDS) * 100}%` }}
                       transition={{ ease: 'easeOut', duration: 0.4 }}
                    />
                 </div>
             </div>
         </div>

         {/* 4 Options Grid */}
         <div className="w-full max-w-3xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mt-12 pb-4 px-2">
            {options.map((opt) => {
              const rState = revealed[opt.symbol];
              const isShaking = shakeCell === opt.symbol;
              
              return (
                <motion.button
                  key={opt.symbol}
                  onClick={() => handleOptionClick(opt)}
                  disabled={gameState !== 'playing' || Object.keys(revealed).length > 0}
                  animate={isShaking ? { x: [-5, 5, -5, 5, 0] } : {}}
                  transition={{ duration: 0.15 }}
                  className="relative flex flex-col items-center justify-center p-0 outline-none w-full h-[120px] sm:h-[140px] group cursor-pointer"
                  style={{ perspective: 1000 }}
                >
                  <motion.div
                    className="relative w-full h-full"
                    style={{ transformStyle: 'preserve-3d' }}
                    animate={{ 
                      rotateY: (rState === 'correct' || rState === 'wrongRevealed') ? 180 : 0, 
                      scale: (rState === 'correct' || rState === 'wrongRevealed') ? 1.05 : 1 
                    }}
                    transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                  >
                     {/* FRONT FACE -> Just Name */}
                     <div 
                        className={`absolute inset-0 flex flex-col items-center justify-center rounded-2xl border transition-all duration-300 
                        ${rState === 'clickedWrong' 
                           ? 'bg-red-900/60 border-red-500/80 shadow-[0_0_30px_rgba(239,68,68,0.4)]' 
                           : 'bg-navy-surface/60 border-emerald-500/30 shadow-[inset_0_0_20px_rgba(16,185,129,0.05)] group-hover:bg-emerald-900/40 group-hover:border-emerald-400/60 group-hover:shadow-[0_0_25px_rgba(52,211,153,0.3)]'}`}
                        style={{ backfaceVisibility: 'hidden' }}
                      >
                         <span className={`text-2xl sm:text-3xl tracking-widest font-bold font-sans drop-shadow-md transition-colors ${rState === 'clickedWrong' ? 'text-red-100' : 'text-emerald-100'}`}>
                           {opt.name}
                         </span>
                     </div>

                     {/* BACK FACE -> Full Info Card (Glowing Emerald) */}
                     <div 
                        className={`absolute inset-0 flex flex-col items-center justify-center rounded-2xl border overflow-hidden bg-emerald-500/20 border-emerald-400/80 shadow-[0_0_35px_rgba(16,185,129,0.5)]`}
                        style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                     >
                       <span className="absolute top-2 left-3 text-xs font-mono text-emerald-300">
                         {opt.atomic_number}
                       </span>
                       <span className="text-5xl font-black font-sans leading-none mt-2 text-emerald-50 drop-shadow-[0_0_12px_rgba(16,185,129,1)]">
                         {opt.symbol}
                       </span>
                       <span className="text-base tracking-wider font-sans mt-2 text-emerald-200/90 uppercase font-bold">
                         {opt.name}
                       </span>
                       <span className="text-xs font-mono mt-1 text-emerald-400/60">
                         {opt.atomic_mass.toFixed(2)}
                       </span>
                     </div>
                  </motion.div>
                </motion.button>
              );
            })}
         </div>
      </div>
    </div>
  );
}
