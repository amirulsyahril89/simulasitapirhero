'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { ArrowLeft, Scissors, Copy, ClipboardPaste, Send } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Question {
  instruction: React.ReactNode;
  text: string;
  expected: string;
}

const QUESTIONS: Question[] = [
  {
    instruction: <>Salin dan tampal <span className="text-orange-500 font-bold">jurutera angkasa</span>.</>,
    text: "Neil Alden Armstrong ialah angkasawan Amerika Syarikat yang pertama. Beliau juga merupakan manusia pertama yang menjejakkan kaki ke bulan. Neil ialah seorang jurutera angkasa, kapten angkatan laut, juruterbang penguji, dan profesor universiti.",
    expected: "jurutera angkasa"
  },
  {
    instruction: <>Salin dan tampal <span className="text-orange-500 font-bold">Sistem Suria</span>.</>,
    text: "Bumi ialah planet ketiga dari Matahari. Ia merupakan satu-satunya planet yang diketahui mempunyai kehidupan dalam Sistem Suria kita. 71% permukaan Bumi terdiri daripada air.",
    expected: "Sistem Suria"
  },
  {
    instruction: <>Salin dan tampal <span className="text-orange-500 font-bold">graviti</span>.</>,
    text: "Ketiadaan graviti di ruang angkasa menyebabkan angkasawan terapung. Mereka perlu menjalani latihan khas untuk membiasakan diri dengan keadaan mikrograviti sebelum menjalankan misi.",
    expected: "graviti"
  }
];

interface CopyPasteGameProps {
  onBack: () => void;
}

export function CopyPasteGame({ onBack }: CopyPasteGameProps) {
  const [currentQ, setCurrentQ] = useState(0);
  const [inputText, setInputText] = useState("");
  const [internalClipboard, setInternalClipboard] = useState("");
  const [status, setStatus] = useState<'playing' | 'wrong' | 'success' | 'completed'>('playing');

  const question = QUESTIONS[currentQ];

  const handleCopy = () => {
    const text = window.getSelection()?.toString();
    if (text) {
      setInternalClipboard(text);
      try {
        navigator.clipboard.writeText(text);
      } catch (e) {
        console.warn("Clipboard API failed, using internal clipboard", e);
      }
    }
  };

  const handleCut = () => {
    const text = window.getSelection()?.toString();
    if (text) {
      setInternalClipboard(text);
      try {
        navigator.clipboard.writeText(text);
      } catch (e) {
        console.warn("Clipboard API failed, using internal clipboard", e);
      }
    }
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setInputText(text);
        return;
      }
    } catch (e) {
      console.warn("Clipboard read API failed, using internal clipboard", e);
    }
    if (internalClipboard) {
      setInputText(internalClipboard);
    }
  };

  const handleSubmit = () => {
    if (!inputText) return;
    
    const expected = question.expected.toLowerCase().trim();
    const actual = inputText.toLowerCase().trim();

    if (actual === expected) {
      confetti({ particleCount: 150, spread: 100, origin: { y: 0.6 }});
      if (currentQ < QUESTIONS.length - 1) {
        setStatus('success');
        setTimeout(() => {
          setCurrentQ(prev => prev + 1);
          setInputText("");
          setStatus('playing');
        }, 2000);
      } else {
        setStatus('completed');
      }
    } else {
      setStatus('wrong');
      setTimeout(() => setStatus('playing'), 2000);
    }
  };

  const resetGame = () => {
    setCurrentQ(0);
    setInputText("");
    setInternalClipboard("");
    setStatus('playing');
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col pt-4 animate-in fade-in zoom-in duration-500 pb-12">
      <div className="flex items-center justify-between mb-8 px-4 md:px-0">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-blue-300 hover:text-white transition-colors uppercase tracking-widest text-sm font-bold bg-white/5 px-4 py-2 rounded-xl border border-white/10 hover:bg-white/10"
        >
          <ArrowLeft className="w-5 h-5" /> KEMBALI
        </button>
        <div className="bg-white/10 px-6 py-2 rounded-2xl border border-white/20 text-center">
          <h2 className="text-xl md:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 drop-shadow-sm uppercase tracking-wider">
            MISI SALIN & TAMPAL
          </h2>
        </div>
        <div className="w-[100px]"></div>
      </div>

      <div className="w-full bg-[#1a2942]/90 backdrop-blur-xl border border-white/20 rounded-[40px] p-6 md:p-10 shadow-2xl relative overflow-hidden">
        
        {/* Avatar Chat */}
        <div className="flex items-start gap-4 mb-8">
            <div className="w-20 h-20 bg-emerald-500/20 rounded-full border-2 border-emerald-400 p-1 flex-shrink-0 relative">
                <Image src={`https://api.dicebear.com/7.x/bottts/svg?seed=Robot2`} alt="Robot" width={80} height={80} className="w-full h-full rounded-full" unoptimized />
            </div>
            <div className="bg-black/80 border-2 border-cyan-500 text-cyan-400 font-bold px-6 py-4 rounded-xl rounded-tl-none relative before:content-[''] before:absolute before:border-[10px] before:border-transparent before:border-r-cyan-500 before:-left-[20px] before:top-4 mt-2">
                <span className="text-xl italic text-cyan-300">Jawab soalan-soalan berikut.</span>
            </div>
        </div>

        {status === 'completed' ? (
            <div className="flex flex-col items-center justify-center py-20">
                <div className="w-32 h-32 bg-yellow-500/20 rounded-full flex items-center justify-center border-4 border-yellow-400 mb-6 drop-shadow-[0_0_30px_rgba(234,179,8,0.5)]">
                    <span className="text-6xl">🏆</span>
                </div>
                <h3 className="text-4xl font-black text-white mb-4">MISI SELESAI!</h3>
                <p className="text-xl text-blue-200 mb-8 text-center max-w-lg">Anda telah berjaya menguasai kemahiran salin dan tampal di angkasa lepas!</p>
                <button 
                    onClick={resetGame}
                    className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-2xl font-black tracking-widest text-lg shadow-[0_0_20px_rgba(37,99,235,0.5)] transition-all active:scale-95"
                >
                    MAIN SEMULA
                </button>
            </div>
        ) : (
            <div className="flex flex-col items-center">
                
                {/* Instruction Tag */}
                <div className="bg-white text-slate-800 text-xl md:text-2xl font-medium px-8 py-3 relative border-b-4 border-red-600 mb-10 shadow-lg">
                    <div className="absolute left-0 top-0 bottom-0 w-8 bg-[#1a2942] -translate-x-full" style={{ clipPath: 'polygon(100% 0, 100% 100%, 0 50%)' }}></div>
                    {question.instruction}
                </div>

                {/* Toolbar */}
                <div className="flex flex-wrap justify-center gap-4 mb-6">
                    <button onClick={handleCut} className="flex items-center gap-2 bg-gradient-to-b from-fuchsia-400 to-fuchsia-600 hover:from-fuchsia-300 hover:to-fuchsia-500 text-white font-bold py-3 px-8 rounded-xl border border-fuchsia-300 shadow-[0_4px_0_rgb(162,28,175)] active:translate-y-1 active:shadow-none transition-all text-xl">
                        <Scissors className="w-6 h-6" /> Cut
                    </button>
                    <button onClick={handleCopy} className="flex items-center gap-2 bg-gradient-to-b from-fuchsia-400 to-fuchsia-600 hover:from-fuchsia-300 hover:to-fuchsia-500 text-white font-bold py-3 px-8 rounded-xl border border-fuchsia-300 shadow-[0_4px_0_rgb(162,28,175)] active:translate-y-1 active:shadow-none transition-all text-xl">
                        <Copy className="w-6 h-6" /> Copy
                    </button>
                    <button onClick={handlePaste} className="flex items-center gap-2 bg-gradient-to-b from-yellow-400 to-yellow-600 hover:from-yellow-300 hover:to-yellow-500 text-white font-bold py-3 px-8 rounded-xl border border-yellow-300 shadow-[0_4px_0_rgb(202,138,4)] active:translate-y-1 active:shadow-none transition-all text-xl ml-4">
                        <ClipboardPaste className="w-6 h-6" /> Paste
                    </button>
                </div>

                {/* Text Block */}
                <div className="bg-white p-6 md:p-8 rounded-sm w-full max-w-3xl mb-10 shadow-inner">
                    <p className="text-slate-900 text-xl md:text-2xl leading-relaxed font-serif select-auto selection:bg-blue-300 selection:text-blue-900">
                        {question.text}
                    </p>
                </div>

                {/* Input Area */}
                <div className="flex flex-col items-center gap-6 w-full max-w-lg">
                    <div className="w-full relative">
                        <input 
                            type="text" 
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            placeholder="Tampal jawapan di sini..."
                            className={cn(
                                "w-full bg-white text-slate-800 text-center text-xl font-bold py-4 px-6 rounded-md outline-none transition-colors",
                                status === 'wrong' && "border-4 border-red-500 bg-red-50 text-red-700",
                                status === 'success' && "border-4 border-emerald-500 bg-emerald-50 text-emerald-700"
                            )}
                        />
                        <AnimatePresence>
                            {status === 'wrong' && (
                                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="absolute -bottom-8 left-0 right-0 text-center text-red-400 font-bold">
                                    Jawapan kurang tepat. Sila cuba lagi!
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <button 
                        onClick={handleSubmit}
                        disabled={!inputText || status === 'success' || status === 'wrong'}
                        className="flex items-center justify-center gap-2 bg-gradient-to-b from-red-500 to-red-700 hover:from-red-400 hover:to-red-600 text-white font-black uppercase tracking-widest py-3 px-10 rounded-md border-b-4 border-red-900 active:translate-y-1 active:border-b-0 transition-all text-xl disabled:opacity-50 disabled:active:translate-y-0 disabled:active:border-b-4 shadow-lg w-48"
                    >
                        Hantar
                    </button>
                </div>

            </div>
        )}

      </div>
    </div>
  );
}
