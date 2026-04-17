import React from 'react';
import { Trophy, Zap, Beaker, Compass } from 'lucide-react';
import { motion } from 'motion/react';

export interface RankCardProps {
  playerName?: string;
  completionTime: number; // in seconds
  correctCount?: number;
}

export const getRankDetails = (time: number) => {
  if (time < 180) { // < 3 mins
    return {
      title: 'Bậc Thầy Hạt Nhân',
      english: 'Nuclear Master',
      colors: 'from-amber-200 via-yellow-400 to-yellow-600',
      shadow: 'shadow-[0_0_50px_rgba(250,204,21,0.5)]',
      border: 'border-yellow-400/50',
      bgGlow: 'bg-yellow-500/20',
      Icon: Trophy,
      text: 'text-yellow-400'
    };
  }
  if (time <= 360) { // 3 - 6 mins
    return {
      title: 'Chuyên Gia Phản Ứng',
      english: 'Reaction Expert',
      colors: 'from-fuchsia-400 via-purple-500 to-violet-600',
      shadow: 'shadow-[0_0_50px_rgba(168,85,247,0.5)]',
      border: 'border-fuchsia-400/50',
      bgGlow: 'bg-fuchsia-500/20',
      Icon: Zap,
      text: 'text-fuchsia-400'
    };
  }
  if (time <= 600) { // 6 - 10 mins
    return {
      title: 'TT.Sinh Hóa Phòng',
      english: 'Lab Intern',
      colors: 'from-cyan-300 via-blue-500 to-blue-700',
      shadow: 'shadow-[0_0_50px_rgba(59,130,246,0.5)]',
      border: 'border-cyan-400/50',
      bgGlow: 'bg-blue-500/20',
      Icon: Beaker,
      text: 'text-cyan-400'
    };
  }
  // > 10 mins
  return {
    title: 'Người Khám Phá',
    english: 'Explorer',
    colors: 'from-emerald-300 via-emerald-500 to-teal-700',
    shadow: 'shadow-[0_0_50px_rgba(16,185,129,0.4)]',
    border: 'border-emerald-400/50',
    bgGlow: 'bg-emerald-500/20',
    Icon: Compass,
    text: 'text-emerald-400'
  };
};

export default function RankCard({ playerName = "Khách", completionTime, correctCount = 118 }: RankCardProps) {
  const rank = getRankDetails(completionTime);
  const minutes = Math.floor(completionTime / 60);
  const seconds = Math.floor(completionTime % 60);
  const { Icon } = rank;

  return (
    <motion.div 
      initial={{ scale: 0.95, opacity: 0, y: 10 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className={`relative overflow-hidden rounded-3xl border ${rank.border} p-1 ${rank.shadow} transition-all max-w-sm w-full bg-black/80 backdrop-blur-xl group cursor-default mx-auto`}
    >
      {/* Inner core */}
      <div className="relative z-10 bg-navy-surface/90 rounded-[22px] p-8 flex flex-col items-center justify-center h-full border border-white/5 shadow-inner">
         {/* Badge Icon */}
         <div className="relative mb-6">
            <div className={`absolute inset-0 bg-gradient-to-br ${rank.colors} blur-xl opacity-50 rounded-full group-hover:opacity-80 transition-opacity duration-500`} />
            <div className={`w-28 h-28 rounded-full flex items-center justify-center bg-gradient-to-br ${rank.colors} shadow-2xl relative border-4 border-white/10 z-10`}>
               <div className="absolute inset-0 bg-black/10 rounded-full mix-blend-overlay"></div>
               <Icon size={50} className="text-white drop-shadow-lg" />
            </div>
         </div>

         {/* Titles */}
         <h3 className={`text-2xl sm:text-3xl font-black uppercase tracking-widest text-center mb-1 bg-clip-text text-transparent bg-gradient-to-r ${rank.colors} drop-shadow-sm leading-tight min-h-[4rem] flex items-center justify-center`}>
           {rank.title}
         </h3>
         <p className="text-[10px] sm:text-xs uppercase tracking-[0.3em] text-gray-400 mb-8 font-mono bg-black/40 px-4 py-1.5 rounded-full border border-white/5">
           {rank.english}
         </p>

         {/* Stats Box */}
         <div className="w-full bg-black/40 rounded-xl p-5 border border-white/5 flex justify-between items-center mb-6 shadow-inner relative overflow-hidden">
            <div className={`absolute top-0 left-0 w-1 h-full bg-gradient-to-b ${rank.colors}`} />
            <div className="flex flex-col pl-2">
               <span className="text-[10px] uppercase tracking-widest text-gray-500 mb-1">Thời gian</span>
               <span className="font-mono text-xl sm:text-2xl text-white font-bold tracking-wider relative z-10">
                 {minutes}:{seconds.toString().padStart(2, '0')}
               </span>
            </div>
            <div className={`w-px h-12 bg-gradient-to-b ${rank.colors} opacity-30 mx-2 sm:mx-4`}></div>
            <div className="flex flex-col text-right pr-2">
               <span className="text-[10px] uppercase tracking-widest text-gray-500 mb-1">Câu đúng</span>
               <div className="font-mono text-xl sm:text-2xl text-white font-bold tracking-wider relative z-10">
                 <span className={rank.text}>{correctCount}</span>
                 <span className="text-[10px] sm:text-sm text-gray-600">/118</span>
               </div>
            </div>
         </div>

         {/* Player Name */}
         <div className="w-full text-center flex flex-col items-center">
            <div className="h-px w-1/2 bg-gradient-to-r from-transparent via-white/20 to-transparent mb-4" />
            <span className="text-[10px] uppercase tracking-widest text-gray-500 mb-1">Điệp viên</span>
            <span className="text-lg font-bold text-gray-200 tracking-wider font-sans uppercase truncate max-w-full px-2">{playerName}</span>
         </div>
      </div>
      
      {/* Ambient Lighting Background */}
      <div className={`absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl ${rank.colors} opacity-20 blur-[60px] mix-blend-screen pointer-events-none -z-0`} />
      <div className={`absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr ${rank.colors} opacity-10 blur-[60px] mix-blend-screen pointer-events-none -z-0`} />
    </motion.div>
  )
}
