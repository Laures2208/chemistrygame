/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import NamingGame from './components/NamingGame';
import AtomicCityGame from './components/AtomicCityGame';
import PeriodicTable from './components/PeriodicTable';
import ZDecoderGame from './components/ZDecoderGame';
import PlacementGame from './components/PlacementGame';
import AtomicLocatorGame from './components/AtomicLocatorGame';
import BlindModeGame from './components/BlindModeGame';
import Leaderboard from './components/Leaderboard';
import Profile from './components/Profile';
import { Hexagon, Zap, Database, Terminal, MapPin, Hash, EyeOff, Trophy, UserCircle } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'naming' | 'atomic' | 'decoder' | 'database' | 'placement' | 'zlocator' | 'blind' | 'leaderboard' | 'profile'>('profile');

  return (
    <div className="min-h-screen bg-transparent font-sans selection:bg-emerald-500/30 flex flex-col">
      <header className="glass-panel sticky top-0 z-50 border-b border-emerald-900/30 backdrop-blur-md shrink-0">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-20 flex justify-between items-center overflow-x-auto no-scrollbar scroll-smooth">
          <div className="flex items-center space-x-3 shrink-0 mr-8">
            <div className="w-10 h-10 rounded-xl bg-navy-surface border border-emerald-neon/30 flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.2)]">
              <Hexagon size={22} className="text-emerald-neon neon-text-emerald" />
            </div>
            <h1 className="font-bold text-xl sm:text-2xl tracking-tighter uppercase text-white neon-text-emerald">Bảng Tuần Hoàn</h1>
          </div>
          <nav className="flex space-x-2 bg-navy-surface/50 p-1.5 rounded-xl border border-white/5 shrink-0">
            <button
              onClick={() => setActiveTab('naming')}
              className={`flex items-center space-x-2 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-bold tracking-wide transition-all ${
                activeTab === 'naming' ? 'bg-emerald-neon/10 text-emerald-neon border border-emerald-neon/30 shadow-[0_0_10px_rgba(16,185,129,0.1)]' : 'text-gray-400 hover:text-gray-200 border border-transparent'
              }`}
            >
              <Zap size={15} />
              <span className="hidden md:inline">ĐÌNH DANH</span>
              <span className="md:hidden">TÊN</span>
            </button>
            <button
              onClick={() => setActiveTab('atomic')}
              className={`flex items-center space-x-2 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-bold tracking-wide transition-all ${
                activeTab === 'atomic' ? 'bg-gold-neon/10 text-gold-neon border border-gold-neon/30 shadow-[0_0_10px_rgba(251,191,36,0.1)]' : 'text-gray-400 hover:text-gray-200 border border-transparent'
              }`}
            >
              <Hexagon size={15} />
              <span className="hidden md:inline">THÀNH PHỐ (Z)</span>
              <span className="md:hidden">CITY</span>
            </button>
            <button
              onClick={() => setActiveTab('placement')}
              className={`flex items-center space-x-2 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-bold tracking-wide transition-all ${
                activeTab === 'placement' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/30 shadow-[0_0_10px_rgba(59,130,246,0.1)]' : 'text-gray-400 hover:text-gray-200 border border-transparent'
              }`}
            >
              <MapPin size={15} />
              <span className="hidden md:inline">TÌM KÝ HIỆU</span>
              <span className="md:hidden">KÝ HIỆU</span>
            </button>
            <button
              onClick={() => setActiveTab('zlocator')}
              className={`flex items-center space-x-2 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-bold tracking-wide transition-all ${
                activeTab === 'zlocator' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30 shadow-[0_0_10px_rgba(244,63,94,0.1)]' : 'text-gray-400 hover:text-gray-200 border border-transparent'
              }`}
            >
              <Hash size={15} />
              <span className="hidden md:inline">TÌM SỐ HIỆU</span>
              <span className="md:hidden">SỐ (Z)</span>
            </button>
            <button
              onClick={() => setActiveTab('decoder')}
              className={`flex items-center space-x-2 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-bold tracking-wide transition-all ${
                activeTab === 'decoder' ? 'bg-fuchsia-500/10 text-fuchsia-400 border border-fuchsia-500/30 shadow-[0_0_10px_rgba(192,38,211,0.1)]' : 'text-gray-400 hover:text-gray-200 border border-transparent'
              }`}
            >
              <Terminal size={15} />
              <span className="hidden md:inline">GIẢI MÃ</span>
              <span className="md:hidden">GIẢI MÃ</span>
            </button>
            <button
              onClick={() => setActiveTab('database')}
              className={`flex items-center space-x-2 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-bold tracking-wide transition-all ${
                activeTab === 'database' ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 shadow-[0_0_10px_rgba(34,211,238,0.1)]' : 'text-gray-400 hover:text-gray-200 border border-transparent'
              }`}
            >
              <Database size={15} />
              <span className="hidden md:inline">TỪ ĐIỂN</span>
              <span className="md:hidden">TỪ ĐIỂN</span>
            </button>
            <button
              onClick={() => setActiveTab('blind')}
              className={`flex items-center space-x-2 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-bold tracking-wide transition-all ${
                activeTab === 'blind' ? 'bg-gray-500/10 text-gray-300 border border-gray-500/30 shadow-[0_0_10px_rgba(156,163,175,0.1)]' : 'text-gray-400 hover:text-gray-200 border border-transparent'
              }`}
            >
              <EyeOff size={15} />
              <span className="hidden md:inline">CHẾ ĐỘ MÙ</span>
              <span className="md:hidden">MÙ</span>
            </button>
            <button
              onClick={() => setActiveTab('leaderboard')}
              className={`flex items-center space-x-2 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-bold tracking-wide transition-all ${
                activeTab === 'leaderboard' ? 'bg-fuchsia-500/20 text-fuchsia-300 border border-fuchsia-500/40 shadow-[0_0_10px_rgba(192,38,211,0.2)]' : 'text-gray-400 hover:text-gray-200 border border-transparent'
              }`}
            >
              <Trophy size={15} />
              <span className="hidden md:inline">XẾP HẠNG</span>
              <span className="md:hidden">RANK</span>
            </button>
            <button
              onClick={() => setActiveTab('profile')}
              className={`flex items-center space-x-2 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-bold tracking-wide transition-all ${
                activeTab === 'profile' ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 shadow-[0_0_10px_rgba(99,102,241,0.2)]' : 'text-gray-400 hover:text-gray-200 border border-transparent'
              }`}
            >
              <UserCircle size={15} />
              <span className="hidden md:inline">HỒ SƠ / RANK</span>
              <span className="md:hidden">HỒ SƠ</span>
            </button>
          </nav>
        </div>
      </header>

      <main className="flex-1 max-w-6xl mx-auto px-4 py-8 sm:py-12 relative w-full z-10 flex flex-col justify-center">
        {activeTab === 'naming' && <NamingGame />}
        {activeTab === 'atomic' && <AtomicCityGame />}
        {activeTab === 'placement' && <PlacementGame />}
        {activeTab === 'zlocator' && <AtomicLocatorGame />}
        {activeTab === 'decoder' && <ZDecoderGame />}
        {activeTab === 'database' && <PeriodicTable />}
        {activeTab === 'blind' && <BlindModeGame />}
        {activeTab === 'leaderboard' && <Leaderboard />}
        {activeTab === 'profile' && <Profile />}
      </main>

      <footer className="shrink-0 text-center py-6 text-[10px] sm:text-xs tracking-widest uppercase text-gray-600 relative z-10 flex flex-col gap-1 border-t border-white/5">
        <p>Bảng Tuần Hoàn v2.0 - Giao diện số hoá</p>
        <p className="text-gray-700/50 font-mono">SYS.REQ: H2O. O2. C.</p>
      </footer>
    </div>
  );
}
