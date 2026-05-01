'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { ArrowLeft, Droplets } from 'lucide-react';
import { cn } from '@/lib/utils';

const Label = ({ x, y, children }: { x: number, y: number, children: React.ReactNode }) => (
    <g transform={`translate(${x},${y})`}>
        <rect x="-12" y="-12" width="24" height="24" fill="#334155" rx="4" className="shadow-lg" />
        <text x="0" y="5" textAnchor="middle" fill="white" fontSize="16" fontWeight="bold" fontFamily="sans-serif">{children}</text>
    </g>
);

interface PipeGameProps {
  onBack: () => void;
}

export function PipeGame({ onBack }: PipeGameProps) {
  const [inputText, setInputText] = useState("");
  const [status, setStatus] = useState<'playing' | 'wrong' | 'success'>('playing');

  const handleSubmit = () => {
    if (!inputText) return;
    
    // Normalize input: uppercase, remove all spaces.
    const actual = inputText.toUpperCase().replace(/\s+/g, '');
    const expected = "A-D-G-F-T";
    const expectedNoDash = "ADGFT";

    // We accept with or without dashes to be forgiving, but the primary target is with dashes
    if (actual === expected || actual === expectedNoDash || actual === "A-D-G-F-T") {
      setStatus('success');
      confetti({ particleCount: 150, spread: 100, origin: { y: 0.6 }});
    } else {
      setStatus('wrong');
      setTimeout(() => setStatus('playing'), 3000);
    }
  };

  const resetGame = () => {
    setInputText("");
    setStatus('playing');
  };

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col pt-4 animate-in fade-in zoom-in duration-500 pb-12">
      <div className="flex items-center justify-between mb-8 px-4 md:px-0">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-blue-300 hover:text-white transition-colors uppercase tracking-widest text-sm font-bold bg-white/5 px-4 py-2 rounded-xl border border-white/10 hover:bg-white/10"
        >
          <ArrowLeft className="w-5 h-5" /> KEMBALI
        </button>
        <div className="bg-white/10 px-6 py-2 rounded-2xl border border-white/20 text-center">
          <h2 className="text-xl md:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-500 drop-shadow-sm uppercase tracking-wider flex items-center justify-center gap-2">
            <Droplets className="w-6 h-6 text-teal-400" /> MISI PAIP AIR
          </h2>
        </div>
        <div className="w-[100px]"></div>
      </div>

      <div className="w-full bg-[#1e293b]/90 backdrop-blur-xl border border-white/20 rounded-[40px] p-6 md:p-8 shadow-2xl relative overflow-hidden">
        
        {/* Avatar Chat */}
        <div className="flex items-start gap-4 mb-6 pl-2">
            <div className="w-20 h-20 bg-teal-900/50 rounded-full border border-teal-500 p-1 flex-shrink-0 relative">
                <Image src={`https://api.dicebear.com/7.x/bottts/svg?seed=Plumber`} alt="Commander" width={80} height={80} className="w-full h-full rounded-full" unoptimized />
            </div>
            <div className="flex flex-col gap-3">
                <div className="bg-black/60 border border-teal-500/50 text-teal-400 font-bold px-6 py-3 rounded-2xl rounded-tl-none relative before:content-[''] before:absolute before:border-[10px] before:border-transparent before:border-r-teal-500/50 before:-left-[20px] before:top-4 max-w-2xl">
                    Anda mendapati sumber air mengalir menerusi paip ke empat tangki yang berbeza.
                </div>
                <div className="bg-white text-rose-600 font-bold px-6 py-3 rounded-xl shadow-lg border-l-4 border-rose-600 inline-block">
                    Apakah urutan (dalam huruf) bagi pengaliran air untuk sampai ke <span className="text-blue-800">Tangki 1</span>?
                </div>
            </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start mt-8">
            
            {/* SVG Game Board */}
            <div className="w-full lg:w-1/2 bg-[#148378] p-6 rounded-3xl border-4 border-[#0d5f57] border-b-8 shadow-[0_15px_30px_rgba(0,0,0,0.4)] relative">
                <svg viewBox="0 -20 400 340" className="w-full h-auto drop-shadow-xl">
                    {/* Water source */}
                    <path d="M 0,-15 Q 25,-25 50,-15 Q 75,-5 100,-15 L 100,-20 L 0,-20 Z" fill="#38bdf8" />
                    <ellipse cx="50" cy="-5" rx="30" ry="10" fill="#0ea5e9" opacity="0.8" />
                    <ellipse cx="50" cy="0" rx="20" ry="8" fill="#38bdf8" />
                    
                    {/* Pipe definitions - stroke white or light gray */}
                    <g stroke="#cbd5e1" strokeWidth="18" strokeLinecap="square" strokeLinejoin="miter">
                        {/* A */}
                        <line x1="50" y1="0" x2="50" y2="60" />
                        {/* D */}
                        <line x1="50" y1="60" x2="160" y2="60" />
                        {/* G */}
                        <line x1="160" y1="60" x2="160" y2="160" />
                        {/* F */}
                        <line x1="160" y1="160" x2="50" y2="160" />
                        {/* T */}
                        <line x1="50" y1="160" x2="50" y2="260" />
                        
                        {/* C */}
                        <line x1="160" y1="60" x2="270" y2="60" />
                        {/* M */}
                        <line x1="270" y1="60" x2="350" y2="60" />
                        
                        {/* H */}
                        <line x1="270" y1="60" x2="270" y2="160" />
                        
                        {/* L */}
                        <line x1="270" y1="160" x2="350" y2="160" />
                        
                        {/* U */}
                        <line x1="160" y1="160" x2="160" y2="260" />
                        {/* V */}
                        <line x1="270" y1="160" x2="270" y2="260" />
                        {/* S */}
                        <line x1="350" y1="160" x2="350" y2="260" />
                    </g>

                    {/* Pipe central joints to look nicer */}
                    <g fill="#94a3b8">
                        <circle cx="50" cy="60" r="9" />
                        <circle cx="160" cy="60" r="9" />
                        <circle cx="270" cy="60" r="9" />
                        <circle cx="160" cy="160" r="9" />
                        <circle cx="50" cy="160" r="9" />
                        <circle cx="270" cy="160" r="9" />
                    </g>

                    {/* Labels */}
                    <Label x={50} y={30}>A</Label>
                    <Label x={105} y={60}>D</Label>
                    <Label x={160} y={110}>G</Label>
                    <Label x={105} y={160}>F</Label>
                    <Label x={50} y={210}>T</Label>

                    <Label x={215} y={60}>C</Label>
                    <Label x={310} y={60}>M</Label>

                    <Label x={270} y={110}>H</Label>
                    <Label x={310} y={160}>L</Label>

                    <Label x={160} y={210}>U</Label>
                    <Label x={270} y={210}>V</Label>
                    <Label x={350} y={210}>S</Label>

                    {/* Tanks */}
                    <g transform="translate(50, 270)">
                        <rect x="-35" y="-15" width="70" height="50" fill="#000033" stroke="#94a3b8" strokeWidth="4" rx="4" />
                        <text x="0" y="20" textAnchor="middle" fill="white" fontSize="28" fontWeight="bold">1</text>
                    </g>
                    <g transform="translate(160, 270)">
                        <rect x="-35" y="-15" width="70" height="50" fill="#000033" stroke="#94a3b8" strokeWidth="4" rx="4" />
                        <text x="0" y="20" textAnchor="middle" fill="white" fontSize="28" fontWeight="bold">2</text>
                    </g>
                    <g transform="translate(270, 270)">
                        <rect x="-35" y="-15" width="70" height="50" fill="#000033" stroke="#94a3b8" strokeWidth="4" rx="4" />
                        <text x="0" y="20" textAnchor="middle" fill="white" fontSize="28" fontWeight="bold">3</text>
                    </g>
                    <g transform="translate(350, 270)">
                        <rect x="-35" y="-15" width="70" height="50" fill="#000033" stroke="#94a3b8" strokeWidth="4" rx="4" />
                        <text x="0" y="20" textAnchor="middle" fill="white" fontSize="28" fontWeight="bold">4</text>
                    </g>
                </svg>
            </div>

            {/* Controls */}
            <div className="w-full lg:w-1/2 flex flex-col gap-6">
                
                {status === 'success' ? (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-emerald-500/20 border border-emerald-400 p-8 rounded-2xl text-center"
                    >
                        <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center text-white text-4xl mx-auto mb-6 shadow-lg shadow-emerald-500/50">
                            ✓
                        </div>
                        <h3 className="text-3xl font-black text-white mb-2 uppercase">Hebat!</h3>
                        <p className="text-emerald-100 text-lg mb-8">Anda berjaya menyalurkan air ke Tangki 1!</p>
                        
                        <button 
                            onClick={resetGame}
                            className="bg-white text-emerald-600 hover:bg-emerald-50 font-bold py-4 px-8 rounded-xl shadow-lg transition-transform active:scale-95 text-lg"
                        >
                            Main Semula
                        </button>
                    </motion.div>
                ) : (
                    <>
                        <div className="bg-slate-800/80 p-6 rounded-2xl border border-slate-700 text-gray-200">
                            <p className="text-lg/relaxed font-medium mb-3">Gunakan tanda sengkang antara setiap huruf.</p>
                            <p className="text-slate-400">Contoh:</p>
                            <p className="text-2xl font-mono text-teal-300 mt-1">A-B-C-D-E</p>
                        </div>

                        <div className="flex flex-col gap-4 mt-4">
                            <label className="text-xl font-bold text-slate-300">Jawapan:</label>
                            <div className="relative">
                                <input 
                                    type="text" 
                                    value={inputText}
                                    onChange={(e) => setInputText(e.target.value)}
                                    placeholder="A-B-C-..."
                                    className={cn(
                                        "w-full bg-white text-slate-800 text-2xl font-mono font-bold py-5 px-6 rounded-xl outline-none transition-all shadow-inner",
                                        status === 'wrong' ? "border-4 border-red-500 text-red-600 bg-red-50" : "border-4 border-transparent focus:border-teal-400"
                                    )}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') handleSubmit();
                                    }}
                                />
                                <AnimatePresence>
                                    {status === 'wrong' && (
                                        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="absolute -bottom-10 left-0 text-red-400 font-bold">
                                            Laluan kurang tepat. Sila semak semula!
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            <button 
                                onClick={handleSubmit}
                                disabled={!inputText || status === 'wrong'}
                                className="mt-8 bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-400 hover:to-emerald-500 border border-teal-400 text-white font-black py-4 px-8 rounded-xl flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(20,184,166,0.4)] active:scale-95 transition-all text-xl disabled:opacity-50 tracking-widest uppercase"
                            >
                                Hantar
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>

      </div>
    </div>
  );
}
