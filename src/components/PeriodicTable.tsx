import React, { useState } from 'react';
import { elementsList, ChemicalElement } from '../data/elements';
import { Database, Search, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function PeriodicTable() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedElement, setSelectedElement] = useState<ChemicalElement | null>(null);

  const getCategoryStyles = (category: string) => {
    switch (category) {
      case 'alkali metal': return 'bg-red-900/30 border-red-500/40 hover:bg-red-800/80 hover:shadow-[0_0_20px_rgba(239,68,68,0.8)] text-red-50 hover:border-red-400 hover:text-white';
      case 'alkaline earth metal': return 'bg-orange-900/30 border-orange-500/40 hover:bg-orange-800/80 hover:shadow-[0_0_20px_rgba(249,115,22,0.8)] text-orange-50 hover:border-orange-400 hover:text-white';
      case 'transition metal': return 'bg-yellow-900/30 border-yellow-500/40 hover:bg-yellow-800/80 hover:shadow-[0_0_20px_rgba(234,179,8,0.8)] text-yellow-50 hover:border-yellow-400 hover:text-white';
      case 'post-transition metal': return 'bg-blue-900/30 border-blue-500/40 hover:bg-blue-800/80 hover:shadow-[0_0_20px_rgba(59,130,246,0.8)] text-blue-50 hover:border-blue-400 hover:text-white';
      case 'metalloid': return 'bg-teal-900/30 border-teal-500/40 hover:bg-teal-800/80 hover:shadow-[0_0_20px_rgba(20,184,166,0.8)] text-teal-50 hover:border-teal-400 hover:text-white';
      case 'nonmetal': return 'bg-green-900/30 border-green-500/40 hover:bg-green-800/80 hover:shadow-[0_0_20px_rgba(34,197,94,0.8)] text-green-50 hover:border-green-400 hover:text-white';
      case 'halogen': return 'bg-cyan-900/30 border-cyan-500/40 hover:bg-cyan-800/80 hover:shadow-[0_0_20px_rgba(6,182,212,0.8)] text-cyan-50 hover:border-cyan-400 hover:text-white';
      case 'noble gas': return 'bg-purple-900/30 border-purple-500/40 hover:bg-purple-800/80 hover:shadow-[0_0_20px_rgba(168,85,247,0.8)] text-purple-50 hover:border-purple-400 hover:text-white';
      case 'lanthanide': return 'bg-pink-900/30 border-pink-500/40 hover:bg-pink-800/80 hover:shadow-[0_0_20px_rgba(236,72,153,0.8)] text-pink-50 hover:border-pink-400 hover:text-white';
      case 'actinide': return 'bg-rose-900/30 border-rose-500/40 hover:bg-rose-800/80 hover:shadow-[0_0_20px_rgba(244,63,94,0.8)] text-rose-50 hover:border-rose-400 hover:text-white';
      default: return 'bg-slate-900/30 border-slate-500/40 hover:bg-slate-800/80 hover:shadow-[0_0_20px_rgba(100,116,139,0.8)] text-slate-50 hover:border-slate-400 hover:text-white';
    }
  };

  const getLegendColor = (category: string) => {
     switch (category) {
       case 'alkali metal': return 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]';
       case 'alkaline earth metal': return 'bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.8)]';
       case 'transition metal': return 'bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.8)]';
       case 'post-transition metal': return 'bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]';
       case 'metalloid': return 'bg-teal-500 shadow-[0_0_8px_rgba(20,184,166,0.8)]';
       case 'nonmetal': return 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)]';
       case 'halogen': return 'bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.8)]';
       case 'noble gas': return 'bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.8)]';
       case 'lanthanide': return 'bg-pink-500 shadow-[0_0_8px_rgba(236,72,153,0.8)]';
       case 'actinide': return 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.8)]';
       default: return 'bg-slate-500 shadow-[0_0_8px_rgba(100,116,139,0.8)]';
     }
  };

  const checkMatch = (e: ChemicalElement) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return e.name.toLowerCase().includes(term) || 
           e.symbol.toLowerCase().includes(term) || 
           e.atomic_number.toString() === term;
  };

  return (
    <div className="flex flex-col mx-auto w-full glass-panel rounded-3xl text-white relative border border-cyan-900/30 overflow-hidden">
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-cyan-900/10 blur-[120px] pointer-events-none" />

      {/* Header and Controls */}
      <div className="flex flex-col md:flex-row items-center justify-between w-full p-6 md:p-8 border-b border-cyan-900/30 relative z-10 gap-6">
        <div className="flex items-center space-x-3 text-cyan-400">
          <Database size={28} className="drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]" />
          <h2 className="text-xl font-bold font-sans tracking-widest uppercase text-shadow-sm shadow-cyan-400/50">Từ Điển Tương Tác</h2>
        </div>
        
        {/* Search */}
        <div className="flex items-center bg-navy-surface/50 border border-cyan-500/30 px-4 py-2.5 rounded-xl backdrop-blur-md w-full sm:w-80 focus-within:border-cyan-400/80 transition-all shadow-inner focus-within:shadow-[0_0_15px_rgba(34,211,238,0.2)]">
          <Search size={16} className="text-cyan-600 mr-2" />
          <input 
            type="text" 
            placeholder="Tìm kiếm theo Ký hiệu, Tên hoặc Z..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-transparent border-none outline-none text-sm text-cyan-50 placeholder-cyan-950 w-full font-mono tracking-wider"
          />
          {searchTerm && (
            <button onClick={() => setSearchTerm('')} className="text-cyan-500 hover:text-cyan-300 transition-colors">
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row min-h-[600px] w-full items-stretch">
        {/* Main Grid Wrapper */}
        <div className="flex-1 p-6 overflow-x-auto no-scrollbar scroll-smooth">
          <div 
            className="min-w-[800px] grid gap-1 mx-auto relative select-none"
            style={{ 
              gridTemplateColumns: 'repeat(18, minmax(0, 1fr))',
              gridTemplateRows: 'repeat(10, minmax(0, 1fr))'
            }}
          >
            {elementsList.map((e) => {
              const isMatch = checkMatch(e);
              const isSelected = selectedElement?.symbol === e.symbol;
              const hasHover = isMatch && !selectedElement;
              
              return (
                <button
                  key={e.symbol}
                  onClick={() => setSelectedElement(isSelected ? null : e)}
                  style={{ gridColumn: e.xpos, gridRow: e.ypos }}
                  className={`
                    group relative flex flex-col items-center justify-center aspect-square 
                    rounded-md transition-all duration-300 border backdrop-blur-sm overflow-hidden 
                    ${isMatch ? getCategoryStyles(e.category) : 'bg-gray-900/10 border-white/5 text-gray-700 opacity-20 filter grayscale blur-[1px]'}
                    ${hasHover ? 'hover:scale-125 hover:z-20 cursor-pointer' : isSelected ? 'scale-110 z-30 shadow-[0_0_30px_rgba(255,255,255,0.2)] ring-2 ring-white/50' : 'cursor-default z-10'}
                  `}
                >
                  <span className="absolute top-0.5 left-1 text-[8px] md:text-[10px] font-mono opacity-80 leading-none pointer-events-none">{e.atomic_number}</span>
                  <span className="text-base sm:text-lg md:text-xl font-bold font-sans pointer-events-none">{e.symbol}</span>
                </button>
              );
            })}

            {/* Empty space decorators to make it look high-tech */}
            <div className="col-start-3 col-span-10 row-start-1 row-span-3 border border-dashed border-white/5 rounded-2xl flex items-center justify-center p-8 m-2 pointer-events-none opacity-30 select-none">
                <span className="text-4xl text-cyan-900/30 font-black tracking-[1em] uppercase -rotate-6">Cyber.Grid</span>
            </div>
            
            {/* Legend Line connecting La/Ac to bottom rows */}
            <div className="col-start-3 row-start-6 row-span-2 flex flex-col justify-end items-center pointer-events-none opacity-50">
                <div className="w-px h-full bg-gradient-to-b from-white/20 to-white/0" />
            </div>
          </div>
          
          {/* Responsive Legend */}
          <div className="mt-12 flex flex-wrap gap-x-4 gap-y-2 text-[10px] uppercase font-mono tracking-widest text-gray-500 justify-center pb-4">
             {Object.entries({
               'alkali metal': 'Kim loại kiềm',
               'alkaline earth metal': 'Kim loại kiềm thổ',
               'transition metal': 'Kim loại chuyển tiếp',
               'post-transition metal': 'Kim loại sau chuyển tiếp',
               'metalloid': 'Á kim',
               'nonmetal': 'Phi kim',
               'halogen': 'Halogen',
               'noble gas': 'Khí hiếm',
               'lanthanide': 'Họ Lanthan',
               'actinide': 'Họ Actini',
               'unknown': 'Chưa rõ'
             }).map(([key, label]) => (
                <div key={key} className="flex items-center space-x-1.5 opacity-80 hover:opacity-100 cursor-default transition-opacity">
                   <div className={`w-2 h-2 rounded-full ${getLegendColor(key)}`} />
                   <span>{label}</span>
                </div>
             ))}
          </div>
        </div>

        {/* Selected Element Side Panel */}
        <AnimatePresence>
          {selectedElement && (
            <motion.div 
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 320, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              className="border-l border-cyan-900/30 bg-navy-surface/40 backdrop-blur-xl shrink-0 overflow-hidden relative"
            >
              <div className="w-80 h-full p-6 flex flex-col">
                <div className="flex justify-between items-start mb-6">
                   <div className={`text-[10px] font-mono tracking-widest uppercase pb-1 border-b-2 border-white/20 inline-block`}>
                      Z = {selectedElement.atomic_number.toString().padStart(3, '0')}
                   </div>
                   <button onClick={() => setSelectedElement(null)} className="text-gray-500 hover:text-white transition-colors bg-white/5 p-1 rounded-md">
                     <X size={16} />
                   </button>
                </div>
                
                <div className="flex flex-col items-center justify-center py-8 mb-6 border border-white/10 rounded-2xl bg-gradient-to-b from-white/5 to-transparent relative overflow-hidden group">
                   <div className={`absolute inset-0 opacity-20 blur-xl transition-all duration-500 group-hover:opacity-40 group-hover:scale-150 ${getLegendColor(selectedElement.category).replace('shadow-','').split(' ')[0]}`} />
                   <h2 className="text-7xl font-black font-sans drop-shadow-2xl relative z-10">{selectedElement.symbol}</h2>
                   <h3 className="text-xl font-light tracking-wider text-cyan-100 mt-2 relative z-10">{selectedElement.name}</h3>
                </div>

                <div className="space-y-4 font-mono text-sm">
                   <div className="flex justify-between items-center bg-black/20 p-3 rounded-lg border border-white/5">
                      <span className="text-gray-500 uppercase text-xs">Khối lượng</span>
                      <span className="text-cyan-100">{selectedElement.atomic_mass.toFixed(4)} u</span>
                   </div>
                   <div className="flex justify-between items-center bg-black/20 p-3 rounded-lg border border-white/5">
                      <span className="text-gray-500 uppercase text-xs">Nhóm</span>
                      <span className="text-cyan-100 capitalize text-right ml-4">{selectedElement.category}</span>
                   </div>
                   <div className="flex justify-between items-center bg-black/20 p-3 rounded-lg border border-white/5">
                      <span className="text-gray-500 uppercase text-xs">Chu kỳ / Cột</span>
                      <span className="text-cyan-100">{selectedElement.period} / {selectedElement.xpos}</span>
                   </div>
                   
                   <div className="mt-6">
                      <span className="text-gray-600 uppercase text-[10px] tracking-widest flex items-center gap-2 mb-2">
                        <Database size={10} /> Thông tin thú vị
                      </span>
                      <p className="text-sm text-gray-400 bg-white/5 p-4 rounded-xl border border-white/5 leading-relaxed font-sans shadow-inner">
                        {selectedElement.fun_fact}
                      </p>
                   </div>
                </div>
                
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
