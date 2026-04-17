import React, { useState, useEffect, useCallback } from 'react';
import { elementsList, ChemicalElement } from '../data/elements';
import { EyeOff, AlertTriangle, Crosshair, Play } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function BlindModeGame() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [targetElement, setTargetElement] = useState<ChemicalElement | null>(null);
  const [unlockedElements, setUnlockedElements] = useState<number[]>([]);
  const [wrongSlots, setWrongSlots] = useState<number[]>([]); // Track incorrect Zs to flash red temporarily
  const [score, setScore] = useState(0);

  const getCategoryStyles = (category: string) => {
    switch (category) {
      case 'alkali metal': return 'bg-red-900/60 border-red-500 text-red-50';
      case 'alkaline earth metal': return 'bg-orange-900/60 border-orange-500 text-orange-50';
      case 'transition metal': return 'bg-yellow-900/60 border-yellow-500 text-yellow-50';
      case 'post-transition metal': return 'bg-blue-900/60 border-blue-500 text-blue-50';
      case 'metalloid': return 'bg-teal-900/60 border-teal-500 text-teal-50';
      case 'nonmetal': return 'bg-green-900/60 border-green-500 text-green-50';
      case 'halogen': return 'bg-cyan-900/60 border-cyan-500 text-cyan-50';
      case 'noble gas': return 'bg-purple-900/60 border-purple-500 text-purple-50';
      case 'lanthanide': return 'bg-pink-900/60 border-pink-500 text-pink-50';
      case 'actinide': return 'bg-rose-900/60 border-rose-500 text-rose-50';
      default: return 'bg-slate-900/60 border-slate-500 text-slate-50';
    }
  };

  const pickNewTarget = useCallback((currentUnlocked: number[]) => {
    const available = elementsList.filter(e => !currentUnlocked.includes(e.atomic_number));
    if (available.length === 0) {
      return null;
    }
    const random = available[Math.floor(Math.random() * available.length)];
    return random;
  }, []);

  const startGame = () => {
    setIsPlaying(true);
    setUnlockedElements([]);
    setScore(0);
    setTargetElement(pickNewTarget([]));
  };

  const handleCellClick = (element: ChemicalElement) => {
    if (!isPlaying || !targetElement || unlockedElements.includes(element.atomic_number)) return;

    if (element.atomic_number === targetElement.atomic_number) {
      // Đúng
      const newUnlocked = [...unlockedElements, element.atomic_number];
      setUnlockedElements(newUnlocked);
      setScore(prev => prev + 10);
      setTargetElement(pickNewTarget(newUnlocked));
    } else {
      // Sai
      setWrongSlots(prev => [...prev, element.atomic_number]);
      setScore(prev => Math.max(0, prev - 2)); // Trừ điểm nhỏ nếu sai
      
      // Xóa trạng thái chớp đỏ sau 500ms
      setTimeout(() => {
        setWrongSlots(prev => prev.filter(z => z !== element.atomic_number));
      }, 500);
    }
  };

  return (
    <div className="flex flex-col mx-auto w-full glass-panel rounded-3xl text-white relative border border-gray-700/50 overflow-hidden min-h-[700px]">
      {/* Background Decor */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-gray-600/10 blur-[120px] pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between w-full p-6 md:p-8 border-b border-gray-700/50 relative z-10 gap-6">
        <div className="flex items-center space-x-3 text-gray-300">
          <EyeOff size={28} className="drop-shadow-[0_0_10px_rgba(156,163,175,0.5)]" />
          <h2 className="text-xl font-bold font-sans tracking-widest uppercase text-shadow-sm shadow-gray-400/50">CHẾ ĐỘ MÙ (BLIND MODE)</h2>
        </div>
        
        {isPlaying && (
          <div className="flex items-center space-x-6">
            <div className="flex flex-col items-center">
               <span className="text-[10px] text-gray-500 uppercase tracking-widest leading-none mb-1">MỤC TIÊU</span>
               <span className="font-mono text-xl font-bold text-white tracking-widest bg-gray-800/80 px-4 py-1 rounded border border-gray-600 shadow-[0_0_10px_rgba(255,255,255,0.1)]">
                 Z = {targetElement?.atomic_number.toString().padStart(3, '0')}
               </span>
            </div>
            <div className="w-px h-8 bg-white/10" />
            <div className="flex items-center space-x-2">
               <span className="text-[10px] text-gray-500 uppercase tracking-widest">ĐIỂM</span>
               <span className="font-mono text-xl font-bold text-emerald-400 tracking-widest">{score.toString().padStart(4, '0')}</span>
            </div>
          </div>
        )}
      </div>

      <div className="flex-1 w-full flex flex-col items-center justify-center p-6 relative">
        <AnimatePresence mode="wait">
          {!isPlaying ? (
            <motion.div 
              key="start"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex flex-col items-center max-w-lg text-center"
            >
              <div className="w-24 h-24 rounded-2xl bg-gray-900 border border-gray-700 mb-8 flex items-center justify-center shadow-lg relative overflow-hidden">
                 <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.1)_0%,transparent_70%)]" />
                 <Crosshair size={40} className="text-gray-400 opacity-80" />
              </div>
              <h3 className="text-2xl font-bold mb-4 tracking-widest uppercase text-gray-200">ĐỊNH VỊ ẨN</h3>
              <p className="text-gray-400 mb-10 font-mono text-sm leading-relaxed">
                Bảng tuần hoàn sẽ bị ẩn hoàn toàn. Hệ thống sẽ cấp một Số hiệu nguyên tử (Z). Nhiệm vụ của bạn là định vị chính xác vị trí của nó trên lưới.
              </p>
              <button 
                onClick={startGame}
                className="group flex items-center space-x-3 bg-white text-black px-10 py-4 rounded-lg font-bold tracking-widest uppercase transition-all hover:bg-gray-200 hover:shadow-[0_0_20px_rgba(255,255,255,0.5)] active:scale-95"
              >
                <Play fill="currentColor" size={18} />
                <span>BẮT ĐẦU</span>
              </button>
            </motion.div>
          ) : (
            <motion.div 
              key="grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="w-full overflow-x-auto no-scrollbar scroll-smooth flex justify-center pb-12"
            >
              <div 
                className="min-w-[800px] grid gap-1 mx-auto relative select-none"
                style={{ 
                  gridTemplateColumns: 'repeat(18, minmax(0, 1fr))',
                  gridTemplateRows: 'repeat(10, minmax(0, 1fr))'
                }}
              >
                {elementsList.map((e) => {
                  const isUnlocked = unlockedElements.includes(e.atomic_number);
                  const isWrong = wrongSlots.includes(e.atomic_number);
                  
                  return (
                    <motion.button
                      key={e.symbol}
                      onClick={() => handleCellClick(e)}
                      style={{ gridColumn: e.xpos, gridRow: e.ypos }}
                      animate={isWrong ? { x: [-4, 4, -4, 4, 0] } : {}}
                      transition={{ duration: 0.3 }}
                      className={`
                        relative aspect-square flex flex-col items-center justify-center rounded-md transition-all duration-300 overflow-hidden
                        ${isUnlocked 
                          ? `${getCategoryStyles(e.category)} shadow-[0_0_15px_rgba(255,255,255,0.3)] z-10 scale-105 border` 
                          : isWrong
                            ? 'bg-red-600/80 border border-red-400 z-20 shadow-[0_0_20px_rgba(239,68,68,0.8)]'
                            : 'bg-transparent border border-white/10 opacity-40 hover:opacity-100 hover:border-white/40 cursor-crosshair'}
                      `}
                    >
                      <AnimatePresence>
                        {isUnlocked && (
                          <motion.div
                             initial={{ opacity: 0, scale: 0.5, rotateY: 90 }}
                             animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                             className="flex flex-col items-center justify-center w-full h-full pointer-events-none"
                          >
                             <span className="absolute top-0.5 left-1 text-[8px] font-mono opacity-80 leading-none">{e.atomic_number}</span>
                             <span className="text-sm font-bold font-sans drop-shadow-md">{e.symbol}</span>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
