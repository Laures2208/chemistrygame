import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Terminal, Heart, Play, RotateCcw, AlertTriangle, ShieldCheck } from 'lucide-react';
import { elementsList, ChemicalElement } from '../data/elements';
import { checkGuessAtomicNumber } from '../utils/gameLogic';

const TOTAL_HEARTS = 3;
const ROUND_TIME = 15; // 15 seconds max bonus time

export default function ZDecoderGame() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  
  const [targetElement, setTargetElement] = useState<ChemicalElement | null>(null);
  const [inputValue, setInputValue] = useState('');
  
  const [timeLeft, setTimeLeft] = useState(ROUND_TIME);
  const [hearts, setHearts] = useState(TOTAL_HEARTS);
  const [score, setScore] = useState(0);
  
  const [hints, setHints] = useState<string[]>([]);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isShaking, setIsShaking] = useState(false);

  const timerRef = useRef<number | null>(null);

  const pickRandomElement = () => {
    const random = elementsList[Math.floor(Math.random() * elementsList.length)];
    setTargetElement(random);
    setHints([]);
    setSuccessMsg(null);
    setInputValue('');
    setTimeLeft(ROUND_TIME);
  };

  const startGame = () => {
    setHearts(TOTAL_HEARTS);
    setScore(0);
    setGameOver(false);
    pickRandomElement();
    setIsPlaying(true);
  };

  // Timer logic for scoring
  useEffect(() => {
    if (isPlaying && !gameOver && !successMsg) {
      timerRef.current = window.setInterval(() => {
        setTimeLeft(t => Math.max(0, t - 0.1));
      }, 100);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [isPlaying, gameOver, successMsg]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isPlaying || gameOver || !targetElement || successMsg) return;
    
    const parsedZ = parseInt(inputValue, 10);
    if (isNaN(parsedZ)) return;

    const timeElapsed = ROUND_TIME - timeLeft;
    const result = checkGuessAtomicNumber(parsedZ, targetElement, timeElapsed, ROUND_TIME);

    if (result.status === 'success') {
      setSuccessMsg(result.message);
      setScore(s => s + result.scoreAdded);
      // Wait a bit, then next round
      setTimeout(() => {
        pickRandomElement();
      }, 2000);
    } else {
      // Wrong guess
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
      
      setHints(prev => [result.message, ...prev]);
      setHearts(h => {
        const newHearts = h - 1;
        if (newHearts <= 0) {
          setGameOver(true);
          setIsPlaying(false);
        }
        return newHearts;
      });
      setInputValue('');
    }
  };

  return (
    <div className="flex flex-col items-center max-w-3xl mx-auto w-full p-6 sm:p-10 glass-panel rounded-3xl text-white relative border border-fuchsia-900/30">
      {/* Background neon flare */}
      <div className="absolute top-0 left-1/4 w-full h-1/2 bg-fuchsia-600 opacity-5 blur-[120px] pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between w-full mb-8 gap-4 relative z-10">
        <div className="flex items-center space-x-3 text-fuchsia-400">
          <Terminal size={28} className="drop-shadow-[0_0_10px_rgba(192,38,211,0.5)]" />
          <h2 className="text-xl font-bold font-sans tracking-widest uppercase text-shadow-sm shadow-fuchsia-400/50">GIẢI MÃ (Z)</h2>
        </div>
        
        {/* Status */}
        <div className="flex items-center space-x-6 bg-navy-surface/60 border border-fuchsia-500/20 px-5 py-2.5 rounded-xl backdrop-blur-md">
          <div className="flex items-center space-x-1.5">
            {Array.from({ length: TOTAL_HEARTS }).map((_, i) => (
              <Heart 
                key={i} 
                size={18} 
                className={i < hearts 
                  ? "text-fuchsia-500 fill-fuchsia-500 drop-shadow-[0_0_8px_rgba(192,38,211,0.8)]" 
                  : "text-gray-700"} 
              />
            ))}
          </div>
          <div className="w-px h-6 bg-white/10" />
          <div className="flex items-center space-x-2">
             <span className="text-xs text-gray-500 uppercase tracking-widest">ĐIỂM</span>
             <span className="font-mono text-xl font-bold text-white tracking-widest">{score.toString().padStart(5, '0')}</span>
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {!isPlaying && !gameOver ? (
          <motion.div 
            key="start"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex flex-col items-center py-16 w-full"
          >
            <div className="w-24 h-24 rounded-2xl bg-navy-surface border border-fuchsia-500/30 flex items-center justify-center mb-8 shadow-[0_0_30px_rgba(192,38,211,0.2)] rotate-3">
              <Terminal size={40} className="text-fuchsia-400" />
            </div>
            <h3 className="text-2xl font-bold font-sans mb-4 tracking-widest uppercase text-center text-fuchsia-400">ĐOÁN SỐ (Z)</h3>
            <p className="text-gray-400 text-center max-w-md mb-10 font-mono text-sm leading-relaxed">
              Nhập Số hiệu nguyên tử (Z). Trả lời sai sẽ làm rò rỉ dữ liệu (Chu kỳ & Nhóm). Thời gian xử lý càng nhanh, điểm DATA càng lớn.
            </p>
            <button 
              onClick={startGame}
              className="group relative flex items-center space-x-3 bg-fuchsia-600 text-white px-10 py-4 rounded-lg font-bold tracking-widest uppercase transition-all hover:bg-fuchsia-500 hover:shadow-[0_0_30px_rgba(192,38,211,0.5)] active:scale-95 overflow-hidden"
            >
              <Play fill="currentColor" size={18} />
              <span>BẮT ĐẦU GIẢI MÃ</span>
            </button>
          </motion.div>
        ) : gameOver ? (
          <motion.div 
            key="gameover"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center py-16 w-full text-center"
          >
            <AlertTriangle size={64} className="text-red-500 mb-6 drop-shadow-[0_0_20px_rgba(239,68,68,0.8)]" />
            <h3 className="text-4xl font-black mb-2 uppercase tracking-widest text-red-500">KHOÁ HỆ THỐNG</h3>
            <p className="text-gray-400 mb-8 font-mono">Đã hết số lần thử. Nguyên tố bị ẩn là {targetElement?.name} (Z={targetElement?.atomic_number}).</p>
            <button onClick={startGame} className="flex items-center space-x-3 px-8 py-3 bg-white/5 border border-white/20 hover:bg-white/10 rounded-xl transition-all">
              <RotateCcw size={18} />
              <span className="font-bold tracking-widest uppercase">KẾT NỐI LẠI</span>
            </button>
          </motion.div>
        ) : (
          <motion.div 
            key="gameplay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full flex flex-col items-center"
          >
            {/* Target Element Display */}
            {targetElement && (
              <div className="flex flex-col items-center mb-10">
                <span className="text-[10px] text-gray-500 uppercase tracking-[0.3em] mb-4">MỤC TIÊU ĐÃ ĐƯỢC XÁC ĐỊNH</span>
                <div className="flex items-end space-x-4 border-b border-fuchsia-500/30 pb-4">
                  <span className="text-5xl font-black uppercase text-white tracking-widest drop-shadow-lg">{targetElement.symbol}</span>
                  <span className="text-2xl font-light text-fuchsia-300 pb-1 uppercase">{targetElement.name}</span>
                </div>
              </div>
            )}

            {/* Success Overlay */}
            {successMsg && (
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="absolute inset-0 z-20 flex items-center justify-center bg-navy-surface/80 backdrop-blur-sm rounded-3xl rounded-tl-none rounded-tr-none px-6"
              >
                <div className="bg-emerald-900/60 border border-emerald-500 p-8 rounded-2xl flex flex-col items-center shadow-[0_0_50px_rgba(16,185,129,0.3)]">
                  <ShieldCheck size={48} className="text-emerald-400 mb-4 drop-shadow-[0_0_15px_rgba(16,185,129,1)]" />
                  <p className="text-emerald-400 font-mono text-center font-bold tracking-wider">{successMsg}</p>
                </div>
              </motion.div>
            )}

            {/* Input Form */}
            <motion.form 
              onSubmit={handleSubmit}
              animate={isShaking ? { x: [-10, 10, -10, 10, 0] } : {}}
              transition={{ duration: 0.4 }}
              className="flex items-center space-x-3 w-full max-w-md relative z-10 mb-8"
            >
              <div className="font-mono text-fuchsia-500 text-xl font-bold bg-navy-surface px-4 py-4 rounded-xl border border-fuchsia-900 shadow-inner">
                Z=
              </div>
              <input
                type="number"
                min="1"
                max="118"
                autoFocus
                disabled={!!successMsg}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="00"
                className="flex-1 bg-navy-surface border border-fuchsia-500/50 rounded-xl px-6 py-4 text-2xl font-mono text-white tracking-wider outline-none focus:border-fuchsia-400 focus:shadow-[0_0_15px_rgba(192,38,211,0.3)] transition-all placeholder-gray-700 text-center disabled:opacity-50"
              />
              <button 
                type="submit"
                disabled={!!successMsg || !inputValue}
                className="bg-fuchsia-600/20 text-fuchsia-400 border border-fuchsia-500/50 px-6 py-4 rounded-xl font-bold tracking-widest uppercase hover:bg-fuchsia-600 hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                GỬI MÃ
              </button>
            </motion.form>

            {/* Hints Box */}
            <div className="w-full max-w-lg bg-navy-surface/40 border border-white/5 rounded-xl p-4 min-h-[120px] font-mono text-sm shadow-inner relative overflow-hidden">
              <span className="absolute top-2 left-3 text-[9px] text-gray-600 uppercase tracking-widest">Nhật Ký Hệ Thống</span>
              <div className="mt-4 flex flex-col space-y-2">
                <AnimatePresence>
                  {hints.length === 0 && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-gray-500 text-center mt-4">
                      Đang chờ phân tích mã Z cho {targetElement?.symbol}...
                    </motion.div>
                  )}
                  {hints.map((hint, idx) => (
                    <motion.div 
                      key={idx}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="text-red-400 bg-red-900/10 border-l-[3px] border-red-500 px-3 py-2 rounded-r-md text-xs sm:text-sm tracking-wide"
                    >
                      {hint}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
            
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
