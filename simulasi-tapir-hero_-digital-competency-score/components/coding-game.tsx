'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { ArrowLeft, RotateCcw, RotateCw, Play, RotateCcw as ResetIcon, Trash2, ArrowUp, Rocket, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

type Direction = 'NORTH' | 'EAST' | 'SOUTH' | 'WEST';
type CommandType = 'FORWARD' | 'TURN_LEFT' | 'TURN_RIGHT';

interface Position {
  x: number;
  y: number;
}

interface PlayerState extends Position {
  dir: Direction;
}

const GRID_COLS = 8;
const GRID_ROWS = 4;

const START_POS: PlayerState = { x: 0, y: 0, dir: 'EAST' };
const EARTH_POS: Position = { x: 4, y: 2 };

const INITIAL_METEORS: Position[] = [
  { x: 2, y: 1 },
  { x: 6, y: 2 },
  { x: 3, y: 3 }
];

const INITIAL_SATELLITES: Position[] = [
  { x: 7, y: 0 },
  { x: 1, y: 3 }
];

const INITIAL_ASTRONAUTS: Position[] = [
  { x: 5, y: 0 },
  { x: 1, y: 2 },
  { x: 6, y: 3 }
];

// SVGs
const RocketIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 100 100" className={className}>
    <path d="M80 50 C80 30, 40 20, 20 20 C30 40, 30 60, 20 80 C40 80, 80 70, 80 50 Z" fill="#ef4444" />
    <circle cx="55" cy="50" r="8" fill="#93c5fd" />
    <path d="M20 20 L0 30 L20 40 Z M20 80 L0 70 L20 60 Z" fill="#64748b" />
    <path d="M20 40 C10 40, 0 45, 0 50 C0 55, 10 60, 20 60 Z" fill="#f59e0b" />
  </svg>
);

const EarthIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 100 100" className={className}>
    <circle cx="50" cy="50" r="45" fill="#3b82f6" />
    <path d="M20 30 Q40 50, 60 20 Q80 40, 90 50 Q70 80, 40 90 Q10 70, 20 30 Z" fill="#22c55e" opacity="0.8" />
  </svg>
);

const MeteorIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 100 100" className={className}>
    <circle cx="60" cy="60" r="20" fill="#b45309" />
    <circle cx="55" cy="55" r="5" fill="#78350f" opacity="0.5" />
    <circle cx="68" cy="65" r="3" fill="#78350f" opacity="0.5" />
    <circle cx="58" cy="70" r="4" fill="#78350f" opacity="0.5" />
    <path d="M60 40 Q40 20, 10 10 Q20 30, 40 60 Z" fill="#f59e0b" />
    <path d="M50 45 Q30 30, 15 20 Q25 35, 45 50 Z" fill="#fcd34d" />
  </svg>
);

const SatelliteIcon = ({ className, activated = false }: { className?: string, activated?: boolean }) => (
  <svg viewBox="0 0 100 100" className={className}>
    <rect x="40" y="40" width="20" height="20" fill={activated ? "#60a5fa" : "#cbd5e1"} rx="2" />
    <rect x="10" y="20" width="20" height="40" fill={activated ? "#2563eb" : "#3b82f6"} transform="rotate(-30 20 40)" />
    <rect x="70" y="40" width="20" height="40" fill={activated ? "#2563eb" : "#3b82f6"} transform="rotate(-30 80 60)" />
    <line x1="30" y1="50" x2="40" y2="50" stroke={activated ? "#93c5fd" : "#94a3b8"} strokeWidth="4" />
    <line x1="60" y1="50" x2="70" y2="50" stroke={activated ? "#93c5fd" : "#94a3b8"} strokeWidth="4" />
    <circle cx="50" cy="65" r="5" fill={activated ? "#4ade80" : "#f87171"} className={activated ? "animate-pulse" : ""} />
  </svg>
);

const AstronautIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 100 100" className={className}>
    <rect x="35" y="50" width="30" height="30" fill="#f1f5f9" rx="5" />
    <rect x="25" y="45" width="50" height="30" fill="#cbd5e1" rx="5" />
    <circle cx="50" cy="35" r="20" fill="#f1f5f9" />
    <circle cx="50" cy="35" r="14" fill="#0f172a" />
    <rect x="20" y="55" width="15" height="10" fill="#f1f5f9" rx="3" transform="rotate(-30 20 55)" />
    <rect x="65" y="55" width="15" height="10" fill="#f1f5f9" rx="3" transform="rotate(30 80 55)" />
    <rect x="40" y="80" width="8" height="15" fill="#f1f5f9" rx="2" />
    <rect x="52" y="80" width="8" height="15" fill="#f1f5f9" rx="2" />
    <circle cx="42" cy="65" r="3" fill="#ef4444" />
    <circle cx="50" cy="65" r="3" fill="#3b82f6" />
    <circle cx="58" cy="65" r="3" fill="#22c55e" />
  </svg>
);

const getRotation = (dir: Direction) => {
    switch (dir) {
        case 'NORTH': return -90;
        case 'EAST': return 0;
        case 'SOUTH': return 90;
        case 'WEST': return 180;
    }
};

const turnLeft = (dir: Direction): Direction => {
  switch (dir) {
    case 'NORTH': return 'WEST';
    case 'WEST': return 'SOUTH';
    case 'SOUTH': return 'EAST';
    case 'EAST': return 'NORTH';
  }
};

const turnRight = (dir: Direction): Direction => {
  switch (dir) {
    case 'NORTH': return 'EAST';
    case 'EAST': return 'SOUTH';
    case 'SOUTH': return 'WEST';
    case 'WEST': return 'NORTH';
  }
};

const moveForward = (pos: PlayerState): PlayerState => {
  let { x, y } = pos;
  switch (pos.dir) {
    case 'NORTH': y -= 1; break;
    case 'SOUTH': y += 1; break;
    case 'EAST': x += 1; break;
    case 'WEST': x -= 1; break;
  }
  return { ...pos, x, y };
};

interface CodingGameProps {
  onBack: () => void;
}

export function CodingGame({ onBack }: CodingGameProps) {
  const [player, setPlayer] = useState<PlayerState>(START_POS);
  const [commands, setCommands] = useState<CommandType[]>([]);
  const [status, setStatus] = useState<'idle' | 'success' | 'failed'>('idle');
  const [astronauts, setAstronauts] = useState<Position[]>(INITIAL_ASTRONAUTS);
  const [satellites, setSatellites] = useState<Position[]>(INITIAL_SATELLITES);

  const handleCommand = (cmd: CommandType) => {
    if (status === 'success' || status === 'failed') return;
    
    const newCommandsCount = commands.length + 1;
    setCommands(prev => [...prev, cmd]);
    
    let currentPlayer = { ...player };
    if (cmd === 'TURN_LEFT') {
        currentPlayer = { ...currentPlayer, dir: turnLeft(currentPlayer.dir) };
    } else if (cmd === 'TURN_RIGHT') {
        currentPlayer = { ...currentPlayer, dir: turnRight(currentPlayer.dir) };
    } else if (cmd === 'FORWARD') {
        currentPlayer = moveForward(currentPlayer);
    }
    
    setPlayer(currentPlayer);
    
    // Check bounds
    if (currentPlayer.x < 0 || currentPlayer.x >= GRID_COLS || currentPlayer.y < 0 || currentPlayer.y >= GRID_ROWS) {
        setStatus('failed');
        return;
    }

    // Check obstacles
    if (INITIAL_METEORS.some(obs => obs.x === currentPlayer.x && obs.y === currentPlayer.y)) {
        setStatus('failed');
        return;
    }

    // Collect astronauts
    let currentAstronauts = astronauts;
    const astIndex = astronauts.findIndex(ast => ast.x === currentPlayer.x && ast.y === currentPlayer.y);
    if (astIndex !== -1) {
        const newAstronauts = [...astronauts];
        newAstronauts.splice(astIndex, 1);
        setAstronauts(newAstronauts);
        currentAstronauts = newAstronauts;
    }

    // Collect satellites
    let currentSatellites = satellites;
    const satIndex = satellites.findIndex(sat => sat.x === currentPlayer.x && sat.y === currentPlayer.y);
    if (satIndex !== -1) {
        const newSatellites = [...satellites];
        newSatellites.splice(satIndex, 1);
        setSatellites(newSatellites);
        currentSatellites = newSatellites;
    }

    // Check success (Earth and all missions done)
    if (currentPlayer.x === EARTH_POS.x && currentPlayer.y === EARTH_POS.y && currentAstronauts.length === 0 && currentSatellites.length === 0) {
        if (newCommandsCount >= 30) {
            setStatus('failed');
        } else {
            setStatus('success');
            confetti({ particleCount: 150, spread: 100, origin: { y: 0.6 }});
        }
        return;
    } 
    
    if (newCommandsCount >= 30) {
        setStatus('failed');
    }
  };

  const resetGame = () => {
    setStatus('idle');
    setPlayer(START_POS);
    setCommands([]);
    setAstronauts(INITIAL_ASTRONAUTS);
    setSatellites(INITIAL_SATELLITES);
  };

  const retryGame = () => {
    setStatus('idle');
    setPlayer(START_POS);
    setCommands([]);
    setAstronauts(INITIAL_ASTRONAUTS);
    setSatellites(INITIAL_SATELLITES);
  }

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
          <h2 className="text-xl md:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500 drop-shadow-sm uppercase tracking-wider">
            MISI KAWALAN ROKET
          </h2>
        </div>
        <div className="w-[100px]"></div>
      </div>

      <div className="w-full bg-slate-900/80 backdrop-blur-xl border border-white/20 rounded-[40px] p-6 shadow-2xl relative overflow-hidden">
        
        <div className="flex flex-col md:flex-row gap-4 items-center mb-6 pl-4">
            <div className="flex gap-4 items-center">
                <div className="w-16 h-16 bg-blue-500/20 rounded-full border border-blue-400 p-1 flex-shrink-0">
                    <Image src={`https://api.dicebear.com/7.x/bottts/svg?seed=Commander`} alt="Commander" width={64} height={64} className="w-full h-full rounded-full" unoptimized />
                </div>
                <div className="bg-cyan-950/80 border border-cyan-500 text-cyan-400 font-bold px-6 py-3 rounded-2xl rounded-tl-none relative before:content-[''] before:absolute before:border-[10px] before:border-transparent before:border-r-cyan-500 before:-left-[20px] before:top-2 drop-shadow-lg">
                    Selesaikan 3 misi ini untuk menang. Gunakan kurang dari 30 arahan!
                </div>
            </div>
            
            <div className="flex flex-col gap-2 md:ml-auto w-full md:w-auto bg-white/5 border border-white/10 rounded-xl p-4 text-sm font-bold text-gray-200">
                <div className="flex items-center gap-3">
                    <div className={cn("w-5 h-5 rounded-full flex items-center justify-center shrink-0", astronauts.length === 0 ? "bg-emerald-500 text-white" : "bg-black/50 border border-white/20")}>
                        {astronauts.length === 0 && <CheckCircle2 className="w-4 h-4" />}
                    </div>
                    <span>1. Jemput semua rakan angkasawan ({INITIAL_ASTRONAUTS.length - astronauts.length}/{INITIAL_ASTRONAUTS.length})</span>
                </div>
                <div className="flex items-center gap-3">
                    <div className={cn("w-5 h-5 rounded-full flex items-center justify-center shrink-0", satellites.length === 0 ? "bg-emerald-500 text-white" : "bg-black/50 border border-white/20")}>
                        {satellites.length === 0 && <CheckCircle2 className="w-4 h-4" />}
                    </div>
                    <span>2. Hidupkan semua satelit ({INITIAL_SATELLITES.length - satellites.length}/{INITIAL_SATELLITES.length})</span>
                </div>
                <div className="flex items-center gap-3">
                    <div className={cn("w-5 h-5 rounded-full flex items-center justify-center shrink-0", status === 'success' ? "bg-emerald-500 text-white" : "bg-black/50 border border-white/20")}>
                        {status === 'success' && <CheckCircle2 className="w-4 h-4" />}
                    </div>
                    <span>3. Kembali ke bumi</span>
                </div>
            </div>
        </div>

        {/* Action Controls */}
        <div className="flex justify-center gap-4 mb-8">
            <button 
                onClick={() => handleCommand('TURN_LEFT')} 
                disabled={status === 'success' || status === 'failed'} 
                className="w-16 h-16 bg-white/10 hover:bg-white/20 rounded-2xl border-b-4 border-white/20 hover:border-white/40 flex items-center justify-center transition-all active:scale-95 active:border-b disabled:opacity-50 disabled:pointer-events-none shadow-md"
            >
                <RotateCcw className="w-8 h-8 text-red-500" strokeWidth={3} />
            </button>
            <button 
                onClick={() => handleCommand('FORWARD')} 
                disabled={status === 'success' || status === 'failed'} 
                className="w-16 h-16 bg-white/10 hover:bg-white/20 rounded-2xl border-b-4 border-white/20 hover:border-white/40 flex items-center justify-center transition-all active:scale-95 active:border-b disabled:opacity-50 disabled:pointer-events-none shadow-md"
            >
                <ArrowUp className="w-8 h-8 text-blue-400" strokeWidth={3} />
            </button>
            <button 
                onClick={() => handleCommand('TURN_RIGHT')} 
                disabled={status === 'success' || status === 'failed'} 
                className="w-16 h-16 bg-white/10 hover:bg-white/20 rounded-2xl border-b-4 border-white/20 hover:border-white/40 flex items-center justify-center transition-all active:scale-95 active:border-b disabled:opacity-50 disabled:pointer-events-none shadow-md"
            >
                <RotateCw className="w-8 h-8 text-red-500" strokeWidth={3} />
            </button>
        </div>

        {/* The Game Grid */}
        <div className="relative w-full max-w-4xl mx-auto aspect-[2/1] bg-sky-950 border-4 border-cyan-500 rounded-lg overflow-hidden shadow-[0_0_30px_rgba(6,182,212,0.3)]">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-sky-900 via-sky-950 to-black pointer-events-none"></div>
            
            {/* grid lines */}
            <div className="absolute inset-0 grid grid-cols-8 grid-rows-4">
                {Array.from({ length: 32 }).map((_, i) => (
                    <div key={i} className="border border-cyan-800/60" />
                ))}
            </div>

            {/* Earth */}
            <div className="absolute transition-all" style={{ left: `${EARTH_POS.x * (100/8)}%`, top: `${EARTH_POS.y * (100/4)}%`, width: `${100/8}%`, height: `${100/4}%` }}>
                <EarthIcon className="w-full h-full p-[10%]" />
            </div>

            {/* Meteors */}
            {INITIAL_METEORS.map((obs, i) => (
                <div key={`meteor-${i}`} className="absolute" style={{ left: `${obs.x * (100/8)}%`, top: `${obs.y * (100/4)}%`, width: `${100/8}%`, height: `${100/4}%` }}>
                    <MeteorIcon className="w-full h-full p-[15%]" />
                </div>
            ))}

            {/* Satellites */}
            {INITIAL_SATELLITES.map((sat, i) => {
                const isActivated = !satellites.some(s => s.x === sat.x && s.y === sat.y);
                return (
                    <div key={`sat-${i}`} className="absolute" style={{ left: `${sat.x * (100/8)}%`, top: `${sat.y * (100/4)}%`, width: `${100/8}%`, height: `${100/4}%` }}>
                        <SatelliteIcon className="w-full h-full p-[15%] transition-all duration-500" activated={isActivated} />
                    </div>
                );
            })}

            {/* Astronauts */}
            <AnimatePresence>
                {astronauts.map((ast, i) => (
                    <motion.div 
                        key={`ast-${ast.x}-${ast.y}`} 
                        initial={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0, transition: { duration: 0.3 } }}
                        className="absolute" style={{ left: `${ast.x * (100/8)}%`, top: `${ast.y * (100/4)}%`, width: `${100/8}%`, height: `${100/4}%` }}
                    >
                        <AstronautIcon className="w-full h-full p-[15%]" />
                    </motion.div>
                ))}
            </AnimatePresence>

            {/* Player */}
            <motion.div 
                className="absolute z-10"
                animate={{ 
                    left: `${player.x * (100/8)}%`, 
                    top: `${player.y * (100/4)}%`,
                    rotate: getRotation(player.dir) 
                }}
                transition={{ type: 'spring', stiffness: 200, damping: 25 }}
                style={{ width: `${100/8}%`, height: `${100/4}%` }}
            >
                <RocketIcon className="w-full h-full p-2" />
            </motion.div>
        </div>

        {/* Status messages */}
        <div className="h-10 mt-4 flex items-center justify-center">
            {status === 'failed' && commands.length >= 30 && (
                <div className="text-red-400 font-bold text-lg bg-red-950/50 px-6 py-2 rounded-full border border-red-500/50 animate-bounce text-center">
                    Aduh! Arahan telah mencecah had. Anda mesti gunakan kurang dari 30 arahan!
                </div>
            )}
            {status === 'failed' && commands.length < 30 && (
                <div className="text-red-400 font-bold text-lg bg-red-950/50 px-6 py-2 rounded-full border border-red-500/50 animate-bounce">
                    Aduh! Misi tergendala. Sila cuba lagi.
                </div>
            )}
            {status === 'success' && (
                <div className="text-emerald-400 font-bold text-lg bg-emerald-950/50 px-6 py-2 rounded-full border border-emerald-500/50 animate-pulse">
                    Hebat! Misi ke Bumi berjaya.
                </div>
            )}
        </div>

        {/* Sequence Tray */}
        <div className="mt-2 flex flex-col items-center max-w-3xl mx-auto">
            <div className="bg-white/10 px-8 py-2 rounded-t-2xl border-x border-t border-white/20 font-bold text-gray-200 shadow-sm flex items-center gap-3 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 opacity-0 group-hover:opacity-10 transition-opacity"></div>
                Arahan digunakan: <span className={cn("text-2xl drop-shadow-md", commands.length >= 30 ? "text-red-500" : "text-blue-400")}>{commands.length}</span> <span className="text-sm opacity-80">(Mesti &lt; 30)</span>
            </div>
            <div className="w-full min-h-[90px] bg-white/5 border border-white/20 rounded-3xl p-4 flex flex-wrap gap-2 justify-center items-center backdrop-blur-sm shadow-inner relative z-10">
                {commands.length === 0 && <span className="text-gray-500 italic">Tiada arahan laksana lagi</span>}
                {commands.map((cmd, i) => (
                    <div 
                        key={i} 
                        className={cn(
                            "p-2 rounded-xl border-2 transition-all duration-300", 
                            i === commands.length - 1 ? "bg-blue-600 border-blue-400 scale-110 shadow-[0_0_15px_rgba(96,165,250,0.6)]" : "bg-black/50 border-white/10"
                        )}
                    >
                        {cmd === 'TURN_LEFT' && <RotateCcw className="w-6 h-6 text-red-400" />}
                        {cmd === 'FORWARD' && <ArrowUp className="w-6 h-6 text-blue-400" />}
                        {cmd === 'TURN_RIGHT' && <RotateCw className="w-6 h-6 text-red-400" />}
                    </div>
                ))}
            </div>
        </div>

        {/* Controls */}
        <div className="flex gap-4 justify-center mt-6">
            {status === 'failed' || status === 'success' ? (
                 <button 
                    onClick={status === 'success' ? resetGame : retryGame} 
                    className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black tracking-widest flex items-center gap-2 shadow-[0_0_20px_rgba(37,99,235,0.4)] transition-all active:scale-95"
                 >
                    <ResetIcon className="w-5 h-5" /> {status === 'success' ? 'MAIN LAGI' : 'CUBA LAGI'}
                </button>
            ) : (
                <button 
                    onClick={resetGame} 
                    className="px-8 py-4 bg-white/5 hover:bg-white/10 text-gray-300 rounded-2xl font-bold tracking-wider flex items-center gap-2 transition-all active:scale-95"
                >
                    MULA SEMULA
                </button>
            )}
        </div>
      </div>
    </div>
  );
}
