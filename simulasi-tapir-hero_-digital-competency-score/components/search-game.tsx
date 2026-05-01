'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { RefreshCcw, CheckCircle2, XCircle, ArrowLeft, Search } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SearchQuestion {
  id: string;
  textPrefix: string;
  textSuffix: string;
  searchQuery: string;
  correctAnswers: string[];
}

const searchQuestions: SearchQuestion[] = [
  {
    id: 'q1',
    textPrefix: "Marikh dirujuk sebagai 'Planet Merah' kerana Marikh mempunyai",
    textSuffix: "di atas permukaannya.",
    searchQuery: "Kenapa Marikh dipanggil Planet Merah",
    correctAnswers: ['besi oksida', 'iron oxide']
  },
  {
    id: 'q2',
    textPrefix: "Marikh dinamakan sempena nama tuhan orang Roman iaitu Tuhan",
    textSuffix: ".",
    searchQuery: "Marikh dinamakan sempena tuhan Roman apa",
    correctAnswers: ['ares', 'perang', 'war']
  },
  {
    id: 'q3',
    textPrefix: "Planet Marikh merupakan planet yang ke-",
    textSuffix: "dari Matahari.",
    searchQuery: "Marikh planet ke berapa dari matahari",
    correctAnswers: ['4', 'empat']
  }
];

interface SearchGameProps {
  onBack: () => void;
}

export function SearchGame({ onBack }: SearchGameProps) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<'playing' | 'checking' | 'success'>('playing');
  const [feedback, setFeedback] = useState<Record<string, boolean | null>>({});

  const handleInputChange = (id: string, value: string) => {
    setAnswers(prev => ({ ...prev, [id]: value }));
    if (status === 'checking') {
      setStatus('playing');
      setFeedback(prev => ({ ...prev, [id]: null }));
    }
  };

  const handleCheck = () => {
    let allCorrect = true;
    const newFeedback: Record<string, boolean | null> = {};

    searchQuestions.forEach(q => {
      const userAnswer = (answers[q.id] || '').trim().toLowerCase();
      const isCorrect = q.correctAnswers.some(ans => userAnswer.includes(ans.toLowerCase()));
      
      newFeedback[q.id] = isCorrect;
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

  const resetGame = () => {
    setAnswers({});
    setStatus('playing');
    setFeedback({});
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
          <h2 className="text-xl md:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500 drop-shadow-sm uppercase tracking-wider">
            MISI CARIAN PINTAR
          </h2>
        </div>
        <div className="w-[100px]"></div>
      </div>

      <div className="space-y-8 px-4 md:px-0">
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-[40px] p-6 md:p-10 shadow-2xl">
          <div className="mb-8 text-center">
            <h3 className="text-xl md:text-2xl font-bold text-white drop-shadow-md mb-2">
              Praktikal Cara Membuat Carian
            </h3>
            <p className="text-gray-300">
              Gunakan pautan carian yang disediakan untuk mencari jawapan, kemudian isikan tempat kosong di bawah.
            </p>
          </div>

          <div className="space-y-8">
            {searchQuestions.map((q, index) => (
              <div key={q.id} className="bg-white/5 border border-white/10 rounded-3xl p-6 md:p-8 relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-12 h-12 bg-blue-500/20 rounded-br-3xl flex items-center justify-center font-black text-blue-300 border-r border-b border-white/10">
                  {index + 1}
                </div>
                
                <div className="mt-4 md:mt-0 md:pl-10">
                  <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center mb-6">
                    <p className="text-lg text-gray-200 leading-relaxed max-w-xl">
                      {q.textPrefix} <span className="inline-block w-24 border-b-2 border-dashed border-gray-500"></span> {q.textSuffix}
                    </p>
                    <a 
                      href="https://www.google.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="shrink-0 inline-flex items-center gap-2 bg-white/10 hover:bg-blue-500 text-blue-300 hover:text-white px-5 py-3 rounded-xl border border-white/20 hover:border-blue-400 transition-all text-sm font-bold tracking-wider uppercase group-hover:shadow-[0_0_15px_rgba(59,130,246,0.3)]"
                    >
                      <Search className="w-4 h-4" /> Cari Jawapan
                    </a>
                  </div>

                  <div className="relative max-w-sm">
                    <input
                      type="text"
                      value={answers[q.id] || ''}
                      onChange={(e) => handleInputChange(q.id, e.target.value)}
                      disabled={status === 'success'}
                      className={cn(
                        "w-full bg-black/40 border-2 rounded-xl px-4 py-3 text-lg font-bold text-white outline-none transition-all focus:scale-[1.02]",
                        feedback[q.id] === true ? "border-emerald-500 bg-emerald-500/20 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.3)]" :
                        feedback[q.id] === false ? "border-red-500 bg-red-500/20 text-red-400 shadow-[0_0_15px_rgba(239,68,68,0.3)]" :
                        "border-white/20 focus:border-blue-400"
                      )}
                      placeholder="Masukkan jawapan anda"
                    />
                    {feedback[q.id] === true && (
                      <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 text-emerald-500" />
                    )}
                    {feedback[q.id] === false && (
                      <XCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 text-red-500 drop-shadow-md" />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 max-w-md mx-auto space-y-4">
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
                disabled={searchQuestions.some(q => !answers[q.id])}
                className="w-full py-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-2xl font-black tracking-widest text-lg shadow-[0_0_20px_rgba(59,130,246,0.4)] hover:shadow-[0_0_30px_rgba(59,130,246,0.6)] hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:pointer-events-none"
              >
                SEMAK JAWAPAN
              </button>
            )}

            <button
              onClick={resetGame}
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
