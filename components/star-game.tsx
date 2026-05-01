'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { RefreshCcw, CheckCircle2, XCircle, ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

const Star4 = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className}>
    <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41Z" fill="currentColor"/>
  </svg>
);

const Star5 = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className}>
    <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" fill="currentColor" />
  </svg>
);

interface StarData {
  id: number;
  type: 4 | 5;
  x: number;
  y: number;
  color: string;
  size: number;
  rotation: number;
}

const colors = [
  'text-orange-400',
  'text-violet-400',
  'text-cyan-400',
  'text-yellow-400',
  'text-pink-400'
];

interface StarGameProps {
  onBack: () => void;
}

export function StarGame({ onBack }: StarGameProps) {
  const [stars, setStars] = useState<StarData[]>([]);
  const [targetCounts, setTargetCounts] = useState<Record<string, number>>({});
  const [inputs, setInputs] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<'playing' | 'checking' | 'success'>('playing');
  const [feedback, setFeedback] = useState<Record<string, boolean | null>>({});

  const inputConfigs = [
    { key: '4', label: '4 Bucu', icon: <Star4 className="w-8 h-8 drop-shadow-md text-yellow-400" /> },
    { key: '5', label: '5 Bucu', icon: <Star5 className="w-8 h-8 drop-shadow-md text-pink-400" /> },
    { key: 'orange', label: 'Jingga', icon: <Star5 className="w-8 h-8 drop-shadow-md text-orange-400" /> },
    { key: 'violet', label: 'Ungu', icon: <Star5 className="w-8 h-8 drop-shadow-md text-violet-400" /> },
    { key: 'cyan', label: 'Biru', icon: <Star5 className="w-8 h-8 drop-shadow-md text-cyan-400" /> },
  ];

  const generateGame = () => {
    const newStars: StarData[] = [];
    let id = 0;

    const addStars = (count: number, type: 4 | 5, specificColor?: string) => {
      for (let i = 0; i < count; i++) {
        newStars.push({
          id: id++,
          type,
          x: 5 + Math.random() * 85, // 5% to 90%
          y: 5 + Math.random() * 80, // 5% to 85%
          color: specificColor || colors[Math.floor(Math.random() * colors.length)],
          size: 25 + Math.random() * 20, // 25px to 45px
          rotation: Math.random() * 360,
        });
      }
    };

    // Guarantee some specific colors/shapes
    addStars(Math.floor(Math.random() * 2) + 2, 4, 'text-orange-400');
    addStars(Math.floor(Math.random() * 2) + 2, 5, 'text-violet-400');
    addStars(Math.floor(Math.random() * 2) + 2, 4, 'text-cyan-400');
    addStars(Math.floor(Math.random() * 2) + 1, 5, 'text-orange-400');
    
    // Add random stars
    addStars(Math.floor(Math.random() * 6) + 8, 4);
    addStars(Math.floor(Math.random() * 6) + 8, 5);

    // Shuffle
    newStars.sort(() => Math.random() - 0.5);

    const counts: Record<string, number> = {
      '4': 0, '5': 0,
      'orange': 0, 'violet': 0, 'cyan': 0
    };

    newStars.forEach(s => {
      if (s.type === 4) counts['4']++;
      if (s.type === 5) counts['5']++;
      if (s.color === 'text-orange-400') counts['orange']++;
      if (s.color === 'text-violet-400') counts['violet']++;
      if (s.color === 'text-cyan-400') counts['cyan']++;
    });

    setTargetCounts(counts);
    setInputs({ '4': '', '5': '', 'orange': '', 'violet': '', 'cyan': '' });
    setFeedback({ '4': null, '5': null, 'orange': null, 'violet': null, 'cyan': null });
    setStars(newStars);
    setStatus('playing');
  };

  useEffect(() => {
    generateGame();
  }, []);

  const handleCheck = () => {
    let allCorrect = true;
    const newFeedback: Record<string, boolean | null> = {};

    ['4', '5', 'orange', 'violet', 'cyan'].forEach(key => {
      const isCorrect = parseInt(inputs[key]) === targetCounts[key];
      newFeedback[key] = isCorrect;
      if (!isCorrect) allCorrect = false;
    });

    setFeedback(newFeedback);

    if (allCorrect) {
      setStatus('success');
      confetti({
        particleCount: 150,
        spread: 100,
        origin: { y: 0.6 }
      });
    } else {
      setStatus('checking');
    }
  };

  const handleInputChange = (key: string, value: string) => {
    if (/^\d*$/.test(value)) {
      setInputs(prev => ({ ...prev, [key]: value }));
      if (status === 'checking') {
        setStatus('playing');
        setFeedback(prev => ({ ...prev, [key]: null }));
      }
    }
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
          <h2 className="text-xl md:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500 drop-shadow-sm uppercase tracking-wider">
            MISI KIRA BINTANG
          </h2>
        </div>
        <div className="w-[100px]"></div> {/* Spacer for centering */}
      </div>

      <div className="flex flex-col gap-6 px-4 md:px-0">
        {/* Star Field */}
        <div className="w-full bg-sky-950 border-4 border-white/20 rounded-[40px] relative overflow-hidden h-[300px] md:h-[400px] shadow-2xl shrink-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#1e293b_0%,#020617_100%)] opacity-80 z-0"></div>
          
          <AnimatePresence>
            {stars.map((star) => (
              <motion.div
                key={star.id} 
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1, rotate: star.rotation }}
                transition={{ duration: 0.5, delay: Math.random() * 0.5 }}
                className={cn("absolute drop-shadow-[0_0_8px_rgba(255,255,255,0.3)] filter text-white", star.color)}
                style={{
                  left: `${star.x}%`,
                  top: `${star.y}%`,
                  width: star.size,
                  height: star.size,
                  zIndex: 10
                }}
              >
                {star.type === 4 && <Star4 />}
                {star.type === 5 && <Star5 />}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Control Panel */}
        <div className="w-full bg-white/10 backdrop-blur-xl border border-white/20 rounded-[40px] p-6 md:p-8 shadow-2xl">
          <h3 className="text-xl md:text-2xl font-bold text-white mb-8 text-center drop-shadow-md">
            Kira jumlah bintang mengikut kategori:
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-6 mb-10">
            {inputConfigs.map((item, index) => (
              <div key={item.key} className={cn("flex flex-col items-center bg-white/5 p-4 md:p-6 rounded-3xl border border-white/10 shadow-inner group transition-all hover:bg-white/10", index === 4 ? "col-span-2 md:col-span-1" : "")}>
                <div className="w-16 h-16 md:w-20 md:h-20 bg-white/10 rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110 group-hover:rotate-6">
                  {item.icon}
                </div>
                <div className="text-gray-300 font-bold mb-3 text-sm md:text-base">{item.label}</div>
                <div className="relative w-full max-w-[120px]">
                  <input
                    type="text"
                    inputMode="numeric"
                    value={inputs[item.key] || ''}
                    onChange={(e) => handleInputChange(item.key, e.target.value)}
                    disabled={status === 'success'}
                    className={cn(
                      "w-full bg-black/40 border-2 rounded-xl px-4 py-3 text-2xl font-black text-center text-white outline-none transition-all focus:scale-105",
                      feedback[item.key] === true ? "border-emerald-500 bg-emerald-500/20 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.3)]" :
                      feedback[item.key] === false ? "border-red-500 bg-red-500/20 text-red-400 shadow-[0_0_15px_rgba(239,68,68,0.3)]" :
                      "border-white/20 focus:border-yellow-400"
                    )}
                    placeholder="0"
                  />
                  {feedback[item.key] === true && (
                    <CheckCircle2 className="absolute right-2 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-500" />
                  )}
                  {feedback[item.key] === false && (
                    <XCircle className="absolute right-2 top-1/2 -translate-y-1/2 w-5 h-5 text-red-500 drop-shadow-md" />
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="max-w-md mx-auto space-y-4">
            {status === 'success' ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-r from-emerald-400 to-emerald-600 text-white font-black tracking-widest text-center py-4 px-6 rounded-2xl text-xl md:text-2xl shadow-[0_0_30px_rgba(52,211,153,0.5)]"
              >
                HEBAT! SEMUA TEPAT!
              </motion.div>
            ) : (
              <button
                onClick={handleCheck}
                disabled={['4', '5', 'orange', 'violet', 'cyan'].some(key => !inputs[key])}
                className="w-full py-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-2xl font-black tracking-widest text-lg shadow-[0_0_20px_rgba(59,130,246,0.4)] hover:shadow-[0_0_30px_rgba(59,130,246,0.6)] hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:pointer-events-none"
              >
                SEMAK JAWAPAN
              </button>
            )}

            <button
              onClick={generateGame}
              className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl font-bold tracking-widest text-gray-300 hover:bg-white/10 hover:text-white transition-all flex items-center justify-center gap-2 group"
            >
              <RefreshCcw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" /> {status === 'success' ? 'MAIN LAGI' : 'MULA SEMULA'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
