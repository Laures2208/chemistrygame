import React, { useEffect, useState } from 'react';
import { getTopScores, saveScore, LeaderboardEntry, getLocalUserId } from '../utils/leaderboard';
import { Trophy, Medal, Clock, Target, PlusCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function Leaderboard() {
  const [scores, setScores] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  // States for testing submission
  const [testMode, setTestMode] = useState(false);
  const [newName, setNewName] = useState('');
  const [newTime, setNewTime] = useState(30);
  const [newAccuracy, setNewAccuracy] = useState(100);

  useEffect(() => {
    setLoading(true);
    // Realtime connection to firestore top scores
    const unsubscribe = getTopScores((fetchedScores) => {
      setScores(fetchedScores);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleTestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName) return;
    await saveScore(newName, newTime, newAccuracy);
    setNewName('');
    setTestMode(false);
  };

  return (
    <div className="flex flex-col mx-auto w-full max-w-4xl glass-panel rounded-3xl text-white relative border border-fuchsia-900/30 overflow-hidden min-h-[600px] p-6 sm:p-10">
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-fuchsia-900/10 blur-[120px] pointer-events-none" />

      {/* Header */}
      <div className="flex justify-between items-end border-b border-fuchsia-900/30 pb-6 mb-8 relative z-10">
        <div className="flex items-center space-x-4 text-fuchsia-400">
          <Trophy size={40} className="drop-shadow-[0_0_15px_rgba(192,38,211,0.5)]" />
          <h2 className="text-2xl sm:text-3xl font-black font-sans tracking-widest uppercase text-shadow-sm shadow-fuchsia-400/50">Bảng Xếp Hạng</h2>
        </div>
        <button 
          onClick={() => setTestMode(!testMode)}
          className="flex items-center space-x-2 text-[10px] sm:text-xs font-bold tracking-widest uppercase bg-fuchsia-600 hover:bg-fuchsia-500 text-white px-3 sm:px-4 py-2 rounded-lg transition-all"
        >
          <PlusCircle size={14} />
          <span className="hidden sm:inline">Ghi Danh Tự Do</span>
          <span className="inline sm:hidden">Ghi Danh</span>
        </button>
      </div>

      <AnimatePresence>
        {testMode && (
          <motion.form 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            onSubmit={handleTestSubmit}
            className="bg-navy-surface/50 border border-fuchsia-500/30 p-6 rounded-2xl mb-8 flex flex-wrap gap-4 overflow-hidden"
          >
            <div className="flex-1 min-w-[200px]">
              <label className="text-xs text-gray-400 uppercase tracking-widest mb-1 block">Tên người chơi</label>
              <input type="text" maxLength={20} required value={newName} onChange={e => setNewName(e.target.value)} placeholder="Nhập tên..." className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:border-fuchsia-400 outline-none" />
            </div>
            <div className="w-32">
              <label className="text-xs text-gray-400 uppercase tracking-widest mb-1 block">Thời gian (s)</label>
              <input type="number" step="0.1" required min={0.1} value={newTime} onChange={e => setNewTime(parseFloat(e.target.value))} className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:border-fuchsia-400 outline-none" />
            </div>
            <div className="w-32">
              <label className="text-xs text-gray-400 uppercase tracking-widest mb-1 block">Độ chính xác (%)</label>
              <input type="number" required min={96} max={100} value={newAccuracy} onChange={e => setNewAccuracy(parseFloat(e.target.value))} className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:border-fuchsia-400 outline-none" />
            </div>
            <div className="flex items-end">
              <button type="submit" className="bg-fuchsia-500 hover:bg-fuchsia-400 text-white px-6 py-2 h-[38px] rounded-lg font-bold text-sm tracking-widest uppercase transition-all shadow-lg shadow-fuchsia-500/20">
                GỬI
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      <div className="w-full bg-navy-surface/30 rounded-2xl border border-white/5 overflow-hidden flex-1 relative min-h-[300px]">
        {loading ? (
             <div className="absolute inset-0 flex items-center justify-center">
                 <div className="animate-spin w-8 h-8 border-4 border-fuchsia-500/20 border-t-fuchsia-500 rounded-full" />
             </div>
        ) : scores.length === 0 ? (
             <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500">
                <Medal size={48} className="mb-4 opacity-20" />
                <p className="font-mono text-sm tracking-widest uppercase">Chưa có ai ghi danh</p>
             </div>
        ) : (
          <div className="w-full">
            <div className="grid grid-cols-12 gap-2 sm:gap-4 px-4 sm:px-6 py-4 bg-black/40 border-b border-white/5 text-[9px] sm:text-[10px] text-gray-500 uppercase tracking-widest font-bold sticky top-0 z-20 backdrop-blur-md">
              <div className="col-span-2 sm:col-span-1 text-center">Hạng</div>
              <div className="col-span-4 sm:col-span-5">Điệp viên</div>
              <div className="col-span-3">Thời gian</div>
              <div className="col-span-3 text-right">Khoa Giao</div>
            </div>
            <div className="flex flex-col p-2 sm:p-4 space-y-3">
              <AnimatePresence>
                {scores.map((score, index) => {
                   const isTop3 = index < 3;
                   const isCurrentUser = score.userId === getLocalUserId();
                   
                   // Rank mapping (Gold/Silver/Bronze)
                   const rankColors = [
                     { text: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/30', shadow: 'shadow-[0_0_15px_rgba(250,204,21,0.2)]', iconBg: 'bg-gradient-to-br from-yellow-300 to-yellow-600' },
                     { text: 'text-slate-300', bg: 'bg-slate-400/10', border: 'border-slate-400/30', shadow: 'shadow-[0_0_10px_rgba(203,213,225,0.1)]', iconBg: 'bg-gradient-to-br from-slate-300 to-slate-500' },
                     { text: 'text-amber-600', bg: 'bg-amber-600/10', border: 'border-amber-600/30', shadow: 'shadow-[0_0_10px_rgba(217,119,6,0.1)]', iconBg: 'bg-gradient-to-br from-amber-500 to-amber-700' }
                   ];
                   
                   const style = index < 3 ? rankColors[index] : { text: 'text-gray-400', bg: 'bg-white/5 hover:bg-white/10', border: 'border-white/5', shadow: 'shadow-none', iconBg: 'bg-white/10' };
                   
                   // From RankCard
                   const getRankDetails = (time: number) => {
                      if (time < 180) return { title: 'Master', color: 'text-yellow-400', border: 'border-yellow-400/40', bg: 'bg-yellow-400/10' };
                      if (time <= 360) return { title: 'Expert', color: 'text-fuchsia-400', border: 'border-fuchsia-400/40', bg: 'bg-fuchsia-400/10' };
                      if (time <= 600) return { title: 'Intern', color: 'text-cyan-400', border: 'border-cyan-400/40', bg: 'bg-cyan-400/10' };
                      return { title: 'Explorer', color: 'text-emerald-400', border: 'border-emerald-400/40', bg: 'bg-emerald-400/10' };
                   };
                   const rankBadge = getRankDetails(score.completionTime);
                   
                   const minutes = Math.floor(score.completionTime / 60);
                   const seconds = Math.floor(score.completionTime % 60);

                   return (
                      <motion.div
                        key={score.id}
                        layout
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ type: 'spring', damping: 20 }}
                        className={`relative group rounded-2xl p-[1px] overflow-hidden ${isCurrentUser ? 'animate-pulse-gold' : ''}`}
                      >
                         {/* Glowing Animated Border for Current User */}
                         {isCurrentUser && (
                            <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-amber-200 to-yellow-600 animate-[spin_3s_linear_infinite]" />
                         )}

                         <div className={`relative z-10 w-full h-full grid grid-cols-12 gap-2 sm:gap-4 items-center px-4 sm:px-6 py-4 rounded-2xl backdrop-blur-xl transition-all ${style.bg} ${style.border} ${style.shadow} ${isCurrentUser ? 'bg-black/90' : ''} border`}>
                            
                            {/* Hạng */}
                            <div className="col-span-2 sm:col-span-1 flex justify-center items-center">
                              {index < 3 ? (
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${style.iconBg} text-black font-black shadow-lg relative`}>
                                   <Trophy size={16} />
                                   <div className="absolute inset-0 bg-white/20 rounded-full mix-blend-overlay"></div>
                                </div>
                              ) : (
                                <span className={`font-mono text-lg font-bold opacity-50 ${style.text}`}>#{index + 1}</span>
                              )}
                            </div>
                            
                            {/* Điệp Viên */}
                            <div className="col-span-4 sm:col-span-5 flex flex-col justify-center">
                               <div className="flex items-center space-x-2">
                                  <span className="font-bold font-sans text-sm sm:text-base text-gray-100 truncate">{score.playerName}</span>
                                  {isCurrentUser && (
                                     <span className="hidden sm:inline-flex px-2 py-0.5 rounded text-[8px] bg-yellow-500/20 text-yellow-300 border border-yellow-500/30 uppercase tracking-widest">Bạn</span>
                                  )}
                               </div>
                               <span className="text-[10px] text-gray-500 font-mono mt-0.5 hidden sm:block">Accuracy: {score.accuracy.toFixed(1)}%</span>
                            </div>

                            {/* Thời gian */}
                            <div className="col-span-3 flex flex-col justify-center">
                               <div className="flex items-center space-x-1.5 font-mono text-sm sm:text-base font-bold text-white tracking-wider">
                                  <Clock size={14} className="hidden sm:block text-gray-500" />
                                  <span>{minutes}:{seconds.toString().padStart(2, '0')}</span>
                               </div>
                            </div>

                            {/* Khoa Giao (Rank Badge) */}
                            <div className="col-span-3 flex justify-end items-center">
                               <div className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg border flexitems-center space-x-1 ${rankBadge.bg} ${rankBadge.border} ${rankBadge.color}`}>
                                  <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest">{rankBadge.title}</span>
                               </div>
                            </div>
                         </div>
                      </motion.div>
                   )
                })}
              </AnimatePresence>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
