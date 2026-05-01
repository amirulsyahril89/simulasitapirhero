'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { ArrowLeft, RotateCcw, ArrowUp, ArrowDown, ArrowRight, ArrowLeft as ArrowLeftIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Position { x: number; y: number; }

const GRID_COLS = 7;
const GRID_ROWS = 5;

const INITIAL_TAPIR: Position = { x: 6, y: 0 };
const TARGET_TOOLBOX: Position = { x: 2, y: 4 };

const INITIAL_KEYS: Position[] = [
  { x: 0, y: 0 },
  { x: 0, y: 4 },
  { x: 6, y: 4 },
];

const INITIAL_BOXES: Position[] = [
  { x: 2, y: 0 },
  { x: 4, y: 0 },
  { x: 2, y: 1 },
  { x: 4, y: 1 },
  { x: 5, y: 1 },
  { x: 6, y: 1 },
  { x: 1, y: 2 },
  { x: 2, y: 2 },
  { x: 6, y: 2 },
  { x: 2, y: 3 },
  { x: 3, y: 3 },
  { x: 4, y: 3 },
  { x: 3, y: 4 },
];

const BoxIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 100 100" className={className}>
    <rect x="10" y="10" width="80" height="80" fill="#b45309" rx="5" />
    <rect x="20" y="20" width="60" height="60" fill="#d97706" rx="3" />
    <line x1="20" y1="20" x2="80" y2="80" stroke="#b45309" strokeWidth="4" />
    <line x1="80" y1="20" x2="20" y2="80" stroke="#b45309" strokeWidth="4" />
  </svg>
);

const ToolboxIcon = ({ className, unlocked }: { className?: string, unlocked?: boolean }) => (
  <svg viewBox="0 0 100 100" className={className}>
    <rect x="15" y="30" width="70" height="50" fill={unlocked ? "#22c55e" : "#ef4444"} rx="5" />
    <path d="M 40 30 L 40 20 C 40 10, 60 10, 60 20 L 60 30" fill="transparent" stroke="#e2e8f0" strokeWidth="6" />
    <circle cx="50" cy="55" r="8" fill="#e2e8f0" />
    {unlocked && <path d="M 45 55 L 48 58 L 55 52" fill="transparent" stroke="#22c55e" strokeWidth="3" />}
  </svg>
);

const KeyIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 100 100" className={className}>
    <circle cx="30" cy="50" r="15" fill="#fbbf24" stroke="#d97706" strokeWidth="4" />
    <circle cx="30" cy="50" r="6" fill="#fef3c7" />
    <path d="M 45 50 L 80 50 L 80 65 L 70 65 L 70 50 L 60 50 L 60 65 L 50 65 L 50 50" fill="transparent" stroke="#fbbf24" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

interface TapirGameProps {
  onBack: () => void;
}

export function TapirGame({ onBack }: TapirGameProps) {
  const [tapir, setTapir] = useState<Position>(INITIAL_TAPIR);
  const [boxes, setBoxes] = useState<Position[]>(INITIAL_BOXES);
  const [keys, setKeys] = useState<Position[]>(INITIAL_KEYS);
  const [steps, setSteps] = useState(0);
  const [status, setStatus] = useState<'playing' | 'success'>('playing');

  const handleMove = useCallback((dx: number, dy: number) => {
    if (status === 'success') return;

    const newX = tapir.x + dx;
    const newY = tapir.y + dy;

    // bounds check
    if (newX < 0 || newX >= GRID_COLS || newY < 0 || newY >= GRID_ROWS) return;

    let moved = false;
    let newBoxes = [...boxes];
    let newKeys = [...keys];

    // Toolbox check
    if (newX === TARGET_TOOLBOX.x && newY === TARGET_TOOLBOX.y) {
      if (keys.length === 0) {
        setTapir({ x: newX, y: newY });
        setSteps(s => s + 1);
        setStatus('success');
        confetti({ particleCount: 150, spread: 100, origin: { y: 0.6 }});
      }
      return; 
    }

    const boxIndex = boxes.findIndex(b => b.x === newX && b.y === newY);
    if (boxIndex !== -1) {
      // try to push box
      const pushX = newX + dx;
      const pushY = newY + dy;

      if (pushX < 0 || pushX >= GRID_COLS || pushY < 0 || pushY >= GRID_ROWS) return;
      if (boxes.some(b => b.x === pushX && b.y === pushY)) return;
      if (TARGET_TOOLBOX.x === pushX && TARGET_TOOLBOX.y === pushY) return;
      if (keys.some(k => k.x === pushX && k.y === pushY)) return; 

      newBoxes[boxIndex] = { x: pushX, y: pushY };
      setBoxes(newBoxes);
      moved = true;
    } else {
      moved = true;
    }

    if (moved) {
      setTapir({ x: newX, y: newY });
      setSteps(s => s + 1);

      const keyIndex = newKeys.findIndex(k => k.x === newX && k.y === newY);
      if (keyIndex !== -1) {
        newKeys.splice(keyIndex, 1);
        setKeys(newKeys);
      }
    }
  }, [tapir, boxes, keys, status]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault();
      }
      switch (e.key) {
        case 'ArrowUp': handleMove(0, -1); break;
        case 'ArrowDown': handleMove(0, 1); break;
        case 'ArrowLeft': handleMove(-1, 0); break;
        case 'ArrowRight': handleMove(1, 0); break;
      }
    };
    window.addEventListener('keydown', handleKeyDown, { passive: false });
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleMove]);

  const resetGame = () => {
    setTapir(INITIAL_TAPIR);
    setBoxes(INITIAL_BOXES);
    setKeys(INITIAL_KEYS);
    setSteps(0);
    setStatus('playing');
  };

  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col pt-4 animate-in fade-in zoom-in duration-500 pb-12">
      <div className="flex items-center justify-between mb-8 px-4 md:px-0">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-blue-300 hover:text-white transition-colors uppercase tracking-widest text-sm font-bold bg-white/5 px-4 py-2 rounded-xl border border-white/10 hover:bg-white/10"
        >
          <ArrowLeft className="w-5 h-5" /> KEMBALI
        </button>
        <div className="bg-white/10 px-6 py-2 rounded-2xl border border-white/20 text-center">
          <h2 className="text-xl md:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500 drop-shadow-sm uppercase tracking-wider">
            MISI SOKOBAN TAPIR
          </h2>
        </div>
        <div className="w-[100px]"></div>
      </div>

      <div className="w-full bg-slate-900/80 backdrop-blur-xl border border-white/20 rounded-[40px] p-6 shadow-2xl relative overflow-hidden">
        
        <div className="flex flex-col md:flex-row gap-4 items-center mb-6 pl-4">
            <div className="w-16 h-16 bg-blue-500/20 rounded-full border border-blue-400 p-1 flex-shrink-0">
                <Image src={`https://api.dicebear.com/7.x/bottts/svg?seed=Commander`} alt="Commander" width={64} height={64} className="w-full h-full rounded-full" unoptimized />
            </div>
            <div className="bg-cyan-950/80 border border-cyan-500 text-cyan-400 font-bold px-6 py-3 rounded-2xl rounded-tl-none relative before:content-[''] before:absolute before:border-[10px] before:border-transparent before:border-r-cyan-500 before:-left-[20px] before:top-2 drop-shadow-lg max-w-2xl">
                Tolak kotak-kotak penghalang dan kumpul semua kunci untuk membuka kotak alat.
            </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start">
            
            {/* The Game Grid */}
              <div className="w-full lg:w-3/4 relative bg-gray-300 border-[12px] border-slate-700 rounded-xl overflow-hidden shadow-[0_0_30px_rgba(0,0,0,0.5)]" style={{ aspectRatio: `${GRID_COLS} / ${GRID_ROWS}` }}>
                
                {/* Dots background layer */}
                <div className="absolute inset-0 grid" style={{ gridTemplateColumns: `repeat(${GRID_COLS}, 1fr)`, gridTemplateRows: `repeat(${GRID_ROWS}, 1fr)` }}>
                    {Array.from({ length: GRID_COLS * GRID_ROWS }).map((_, i) => (
                        <div key={i} className="border border-gray-400/50 flex flex-col justify-evenly items-center">
                            {/* Adding multiple dots per cell for the texture effect from the image */}
                            <div className="flex justify-evenly w-full"><div className="w-1.5 h-1.5 bg-gray-400 rounded-full" /><div className="w-1.5 h-1.5 bg-gray-400 rounded-full" /><div className="w-1.5 h-1.5 bg-gray-400 rounded-full" /></div>
                            <div className="flex justify-evenly w-full"><div className="w-1.5 h-1.5 bg-gray-400 rounded-full" /><div className="w-1.5 h-1.5 bg-gray-400 rounded-full" /></div>
                            <div className="flex justify-evenly w-full"><div className="w-1.5 h-1.5 bg-gray-400 rounded-full" /><div className="w-1.5 h-1.5 bg-gray-400 rounded-full" /><div className="w-1.5 h-1.5 bg-gray-400 rounded-full" /></div>
                        </div>
                    ))}
                </div>

                {/* Keys */}
                <AnimatePresence>
                    {keys.map((key, i) => (
                        <motion.div 
                            key={`key-${key.x}-${key.y}`} 
                            initial={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0, transition: { duration: 0.3 } }}
                            className="absolute" style={{ left: `${(key.x / GRID_COLS) * 100}%`, top: `${(key.y / GRID_ROWS) * 100}%`, width: `${100/GRID_COLS}%`, height: `${100/GRID_ROWS}%` }}
                        >
                            <KeyIcon className="w-full h-full p-[15%] drop-shadow-md animate-pulse" />
                        </motion.div>
                    ))}
                </AnimatePresence>

                {/* Toolbox */}
                <div className="absolute transition-all" style={{ left: `${(TARGET_TOOLBOX.x / GRID_COLS) * 100}%`, top: `${(TARGET_TOOLBOX.y / GRID_ROWS) * 100}%`, width: `${100/GRID_COLS}%`, height: `${100/GRID_ROWS}%` }}>
                    <ToolboxIcon className="w-full h-full p-[10%] drop-shadow-xl" unlocked={keys.length === 0} />
                </div>

                {/* Boxes */}
                {boxes.map((box, i) => (
                    <motion.div 
                        key={`box-${i}`} className="absolute z-10" 
                        animate={{ left: `${(box.x / GRID_COLS) * 100}%`, top: `${(box.y / GRID_ROWS) * 100}%` }}
                        transition={{ type: 'spring', stiffness: 400, damping: 40 }}
                        style={{ width: `${100/GRID_COLS}%`, height: `${100/GRID_ROWS}%` }}
                    >
                        <BoxIcon className="w-full h-full p-[5%] drop-shadow-xl" />
                    </motion.div>
                ))}

                {/* Player */}
                <motion.div 
                    className="absolute z-20"
                    animate={{ left: `${(tapir.x / GRID_COLS) * 100}%`, top: `${(tapir.y / GRID_ROWS) * 100}%` }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    style={{ width: `${100/GRID_COLS}%`, height: `${100/GRID_ROWS}%` }}
                >
                    <div className="w-full h-full p-[10%] flex items-center justify-center">
                        <div className="w-full h-full bg-white border-2 border-slate-400 rounded-full shadow-lg relative overflow-hidden">
                            <Image src="https://api.dicebear.com/7.x/bottts/svg?seed=Tapir" layout="fill" alt="Tapir" unoptimized className="object-cover scale-150 relative top-1" />
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Sidebar Controls */}
            <div className="w-full lg:w-1/4 flex flex-col gap-6">
                <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700 text-gray-200">
                    <p className="text-sm/relaxed">Tekan butang arah pada skrin atau papan kekunci anda untuk menggerakkan Tapir.</p>
                </div>

                <div className="flex justify-center shrink-0 my-4">
                    <div className="grid grid-cols-3 gap-3">
                        <div />
                        <button onClick={() => handleMove(0, -1)} className="w-16 h-16 bg-cyan-950 border-[3px] border-cyan-500 rounded-xl flex items-center justify-center text-cyan-400 active:bg-cyan-800 active:scale-95 transition-all shadow-[0_0_15px_rgba(6,182,212,0.3)]"><ArrowUp className="w-8 h-8" strokeWidth={3} /></button>
                        <div />
                        <button onClick={() => handleMove(-1, 0)} className="w-16 h-16 bg-cyan-950 border-[3px] border-cyan-500 rounded-xl flex items-center justify-center text-cyan-400 active:bg-cyan-800 active:scale-95 transition-all shadow-[0_0_15px_rgba(6,182,212,0.3)]"><ArrowLeftIcon className="w-8 h-8" strokeWidth={3} /></button>
                        <button onClick={() => handleMove(0, 1)} className="w-16 h-16 bg-cyan-950 border-[3px] border-cyan-500 rounded-xl flex items-center justify-center text-cyan-400 active:bg-cyan-800 active:scale-95 transition-all shadow-[0_0_15px_rgba(6,182,212,0.3)]"><ArrowDown className="w-8 h-8" strokeWidth={3} /></button>
                        <button onClick={() => handleMove(1, 0)} className="w-16 h-16 bg-cyan-950 border-[3px] border-cyan-500 rounded-xl flex items-center justify-center text-cyan-400 active:bg-cyan-800 active:scale-95 transition-all shadow-[0_0_15px_rgba(6,182,212,0.3)]"><ArrowRight className="w-8 h-8" strokeWidth={3} /></button>
                    </div>
                </div>

                <button onClick={resetGame} className="w-full bg-gradient-to-b from-red-500 to-red-700 hover:from-red-400 hover:to-red-600 border border-red-400 text-white font-bold py-4 px-6 rounded-2xl flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-transform text-lg tracking-wider">
                    <RotateCcw className="w-6 h-6" /> Semula
                </button>

                <div className="bg-white px-6 py-4 rounded-xl flex justify-between items-center text-2xl font-black shadow-inner border-b-4 border-slate-200">
                    <span className="text-slate-600">Langkah:</span>
                    <span className="text-blue-600">{steps}</span>
                </div>

                {status === 'success' && (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-emerald-500 text-white font-bold p-4 rounded-xl text-center shadow-lg"
                    >
                        Taniah! Anda berjaya membuka kotak alat!
                    </motion.div>
                )}
            </div>
        </div>

      </div>
    </div>
  );
}
