'use client';

import React, { useState } from 'react';
import { motion } from 'motion/react';
import confetti from 'canvas-confetti';
import { RefreshCcw, CheckCircle2, XCircle, ArrowLeft, MailOpen, Trash2, Mail } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EmailData {
  id: number;
  sender: string;
  subject: string;
  correctAnswer: 'buka' | 'padam';
}

const emails: EmailData[] = [
  { id: 1, sender: 'yess.com', subject: 'Anda telah memenangi RM20,000!', correctAnswer: 'padam' },
  { id: 2, sender: 'Siti', subject: 'Selamat pagi, sahabat!', correctAnswer: 'buka' },
  { id: 3, sender: 'devil@psa.com', subject: 'Saya akan menghantui awak selamanya!', correctAnswer: 'padam' },
  { id: 4, sender: 'Vicky', subject: 'Pergi dari sini!', correctAnswer: 'padam' },
  { id: 5, sender: 'Xy2q@gqzcom', subject: 'Hello daripada Tim Schneider', correctAnswer: 'padam' }
];

interface EmailGameProps {
  onBack: () => void;
}

export function EmailGame({ onBack }: EmailGameProps) {
  const [answers, setAnswers] = useState<Record<number, 'buka' | 'padam'>>({});
  const [status, setStatus] = useState<'playing' | 'checking' | 'success'>('playing');
  const [feedback, setFeedback] = useState<Record<number, boolean | null>>({});

  const handleAnswer = (id: number, answer: 'buka' | 'padam') => {
    if (status === 'success') return;
    
    setAnswers(prev => ({ ...prev, [id]: answer }));
    if (status === 'checking') {
      setStatus('playing');
      setFeedback(prev => ({ ...prev, [id]: null }));
    }
  };

  const handleCheck = () => {
    let allCorrect = true;
    const newFeedback: Record<number, boolean | null> = {};

    emails.forEach(email => {
      const isCorrect = answers[email.id] === email.correctAnswer;
      newFeedback[email.id] = isCorrect;
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
            MISI PETI MASUK E-MEL
          </h2>
        </div>
        <div className="w-[100px]"></div>
      </div>

      <div className="space-y-8 px-4 md:px-0">
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-[40px] p-6 md:p-10 shadow-2xl">
          <div className="mb-8 text-center max-w-2xl mx-auto">
            <h3 className="text-xl md:text-2xl font-bold text-white drop-shadow-md mb-4 flex items-center justify-center gap-3">
              <Mail className="w-8 h-8 text-blue-400" />
              Ada e-mel baru!
            </h3>
            <p className="text-gray-300 text-lg">
              Anda telah menerima beberapa e-mel baru. Lihat siapa yang menghantar e-mel tersebut kemudian klik sama ada anda mahu <strong>Membuka</strong> atau <strong>Memadamnya</strong>.
            </p>
          </div>

          <div className="space-y-4">
            <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3 bg-white/5 rounded-t-2xl border-b border-white/10 text-gray-400 font-bold text-sm tracking-wider uppercase">
              <div className="col-span-3">Daripada</div>
              <div className="col-span-5">Subjek</div>
              <div className="col-span-4 text-center">Tindakan</div>
            </div>

            {emails.map((email) => (
              <div 
                key={email.id} 
                className={cn(
                  "flex flex-col md:grid md:grid-cols-12 gap-4 items-center bg-white/5 border rounded-3xl md:rounded-xl p-6 md:p-4 transition-all relative overflow-hidden",
                  feedback[email.id] === true ? "border-emerald-500/50 bg-emerald-500/10" :
                  feedback[email.id] === false ? "border-red-500/50 bg-red-500/10" :
                  "border-white/10 hover:bg-white/10 hover:border-white/20"
                )}
              >
                {/* Mobile labels */}
                <div className="w-full md:hidden flex justify-center mb-2">
                  <div className="w-12 h-1 bg-white/10 rounded-full"></div>
                </div>

                <div className="w-full md:col-span-3">
                  <div className="text-xs text-gray-500 uppercase font-bold md:hidden mb-1">Daripada</div>
                  <div className="font-bold text-blue-300 break-all">{email.sender}</div>
                </div>
                
                <div className="w-full md:col-span-5">
                  <div className="text-xs text-gray-500 uppercase font-bold md:hidden mb-1">Subjek</div>
                  <div className="text-gray-200">{email.subject}</div>
                </div>
                
                <div className="w-full md:col-span-4 flex justify-center md:justify-end gap-3 pb-2 md:pb-0 pt-2 md:pt-0">
                  <button
                    onClick={() => handleAnswer(email.id, 'buka')}
                    disabled={status === 'success'}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition-all disabled:opacity-80 disabled:cursor-not-allowed flex-1 md:flex-none justify-center",
                      answers[email.id] === 'buka' 
                        ? "bg-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.4)]" 
                        : "bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10 hover:text-white"
                    )}
                  >
                    <MailOpen className="w-4 h-4" /> Buka
                  </button>
                  <button
                    onClick={() => handleAnswer(email.id, 'padam')}
                    disabled={status === 'success'}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition-all disabled:opacity-80 disabled:cursor-not-allowed flex-1 md:flex-none justify-center",
                      answers[email.id] === 'padam' 
                        ? "bg-red-500 text-white shadow-[0_0_15px_rgba(239,68,68,0.4)]" 
                        : "bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10 hover:text-white"
                    )}
                  >
                    <Trash2 className="w-4 h-4" /> Padam
                  </button>

                  {/* Feedback indicator overlay */}
                  {feedback[email.id] !== undefined && feedback[email.id] !== null && (
                    <div className="absolute right-0 top-0 bottom-0 w-2 flex flex-col">
                      {feedback[email.id] ? (
                        <div className="w-full h-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)]"></div>
                      ) : (
                         <div className="w-full h-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.8)]"></div>
                      )}
                    </div>
                  )}
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
                disabled={emails.some(e => !answers[e.id])}
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
