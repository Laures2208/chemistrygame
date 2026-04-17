import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import RankCard from './RankCard';
import { SlidersHorizontal, UserCircle, RefreshCcw } from 'lucide-react';
import { motion } from 'motion/react';
import { getLocalUserId } from '../utils/leaderboard';

export default function Profile() {
  const [userBestScore, setUserBestScore] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // Simulator States
  const [simulatedTime, setSimulatedTime] = useState(150); // Mặc định 2m30s

  const fetchUserBestScore = async () => {
    setLoading(true);
    try {
       const localUserId = getLocalUserId();
       const q = query(collection(db, 'leaderboard'), where('userId', '==', localUserId));
       const snapshot = await getDocs(q);
       let scores = snapshot.docs.map(doc => doc.data() as any);
       
       if (scores.length > 0) {
          scores.sort((a, b) => a.completionTime - b.completionTime);
          setUserBestScore(scores[0]);
       } else {
          setUserBestScore(null);
       }
    } catch(e) {
       console.error("Lỗi tải điểm:", e);
    } finally {
       setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserBestScore();
  }, []);

  return (
    <div className="flex flex-col mx-auto w-full max-w-5xl glass-panel rounded-3xl text-white relative border border-cyan-900/30 overflow-hidden min-h-[700px]">
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-cyan-900/10 blur-[120px] pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between w-full p-6 md:p-8 border-b border-cyan-900/30 relative z-10 gap-6">
        <div className="flex items-center space-x-3 text-cyan-400">
          <UserCircle size={28} className="drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]" />
          <h2 className="text-xl font-bold font-sans tracking-widest uppercase text-shadow-sm shadow-cyan-400/50">Hồ Sơ Điệp Viên</h2>
        </div>
        
        <div className="flex items-center space-x-4">
           <div className="hidden sm:flex items-center space-x-3 bg-black/40 px-4 py-2 rounded-xl border border-white/5">
              <div className="flex flex-col">
                 <span className="text-xs font-bold text-gray-200">Người chơi Ẩn danh</span>
                 <span className="text-[9px] text-gray-500 font-mono tracking-widest uppercase truncate max-w-[120px]">Phiên bản ghi danh tự do</span>
              </div>
           </div>
           <button onClick={fetchUserBestScore} className="p-2.5 bg-cyan-600/20 hover:bg-cyan-500/30 text-cyan-400 rounded-xl transition-colors border border-cyan-500/20">
              <RefreshCcw size={16} />
           </button>
        </div>
      </div>

      {/* Main Area */}
      <div className="flex-1 p-6 md:p-10 flex flex-col items-center justify-center relative z-10 w-full">
         
         {loading ? (
            <div className="animate-spin w-10 h-10 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full shadow-[0_0_15px_rgba(34,211,238,0.5)]" />
         ) : userBestScore ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center w-full"
            >
               <h2 className="text-lg font-bold font-mono tracking-[0.2em] text-cyan-400 mb-8 flex items-center gap-2">
                 Thành tích tốt nhất của bạn
               </h2>
               <div className="w-full max-w-sm">
                 <RankCard 
                    playerName={userBestScore.playerName || "ĐIỆP VIÊN"} 
                    completionTime={userBestScore.completionTime} 
                    correctCount={118} // Demo base standard full
                 />
               </div>
            </motion.div>
         ) : (
            <motion.div 
               initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
               className="flex flex-col lg:flex-row items-center lg:items-start justify-center gap-12 w-full max-w-4xl"
            >
               {/* Mô phỏng Settings */}
               <div className="flex-1 max-w-sm w-full flex flex-col items-center bg-navy-surface/40 p-8 rounded-3xl border border-white/5 shadow-2xl">
                  <h2 className="text-xl font-bold font-sans uppercase tracking-widest text-cyan-400 mb-4 text-center w-full border-b border-white/10 pb-4">
                     MÔ PHỎNG HUY HIỆU
                  </h2>
                  <p className="text-xs text-gray-400 text-center mb-8 font-mono leading-relaxed">
                     Bạn chưa có Kỷ lục nào. Hãy điều chỉnh thanh kéo thời gian bên dưới để xem sự thay đổi của Hệ thống Phân Hạng dành cho các điệp viên xuất sắc.
                  </p>

                  <div className="w-full bg-black/40 border border-white/5 p-6 rounded-2xl">
                     <div className="flex justify-between items-center mb-4">
                        <span className="text-[10px] uppercase tracking-widest text-gray-500 flex items-center gap-2">
                           <SlidersHorizontal size={14} className="text-cyan-500"/> THỜI GIAN G.LẬP
                        </span>
                        <span className="font-mono text-xl font-bold text-white bg-white/5 px-3 py-1 rounded-lg">
                          {Math.floor(simulatedTime / 60)}:{Math.floor(simulatedTime % 60).toString().padStart(2, '0')}
                        </span>
                     </div>
                     <input 
                        type="range" 
                        min="60" 
                        max="800" 
                        step="5"
                        value={simulatedTime}
                        onChange={(e) => setSimulatedTime(parseInt(e.target.value))}
                        className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-cyan-500 hover:accent-cyan-400 transition-all"
                     />
                     <div className="flex justify-between text-[10px] font-mono text-gray-500 mt-3 pt-2 border-t border-white/5">
                        <span className="text-yellow-500/70">Master (&lt;3p)</span>
                        <span className="text-fuchsia-500/70">Expert (&lt;6p)</span>
                        <span className="text-blue-500/70">Intern (&lt;10p)</span>
                        <span className="text-emerald-500/70">Explorer</span>
                     </div>
                  </div>
               </div>

               {/* View Thẻ Rank */}
               <div className="flex-1 w-full flex justify-center items-center">
                  <div className="w-full max-w-sm">
                     <RankCard 
                        playerName={"ĐIỆP VIÊN 007"} 
                        completionTime={simulatedTime} 
                        correctCount={118} 
                     />
                  </div>
               </div>
            </motion.div>
         )}
      </div>
    </div>
  );
}
