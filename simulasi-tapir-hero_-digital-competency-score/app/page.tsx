'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { quizData } from '@/lib/quiz-data';
import { StarGame } from '@/components/star-game';
import { SearchGame } from '@/components/search-game';
import { EmailGame } from '@/components/email-game';
import { CodingGame } from '@/components/coding-game';
import { TapirGame } from '@/components/tapir-game';
import { CopyPasteGame } from '@/components/copy-paste-game';
import { PipeGame } from '@/components/pipe-game';
import { PlayCircle, RefreshCcw, CheckCircle2, XCircle, Award, Star, Search, Mail, Rocket, Target, ClipboardPaste, Droplets } from 'lucide-react';
import { cn } from '@/lib/utils';


export default function GamePage() {
  const [gameState, setGameState] = useState<'main_menu' | 'menu' | 'playing' | 'result' | 'star_game' | 'search_game' | 'email_game' | 'coding_game' | 'tapir_game' | 'copy_paste_game' | 'pipe_game'>('main_menu');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, { selectedOptionId: string, isCorrect: boolean }>>({});

  const startGame = () => {
    setGameState('playing');
    setCurrentQuestionIndex(0);
    setAnswers({});
  };

  const handleOptionSelect = (optionId: string, isCorrect: boolean) => {
    if (answers[currentQuestionIndex]) return;
    
    setAnswers(prev => ({
      ...prev,
      [currentQuestionIndex]: { selectedOptionId: optionId, isCorrect }
    }));

    if (isCorrect) {
      triggerMiniConfetti();
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < quizData.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      setGameState('result');
      triggerFinalConfetti();
    }
  };

  const currentQuestion = quizData[currentQuestionIndex];
  const currentAnswer = answers[currentQuestionIndex];
  const hasAnswered = !!currentAnswer;
  const selectedOptionId = currentAnswer?.selectedOptionId;
  const selectedOption = currentQuestion?.options.find(o => o.id === selectedOptionId);
  const correctCount = Object.values(answers).filter(a => a.isCorrect).length;

  const triggerFinalConfetti = () => {
    const duration = 3 * 1000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#26ccff', '#a25afd', '#ff5e7e', '#88ff5a', '#fcff42', '#ffa62d', '#ff36ff']
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#26ccff', '#a25afd', '#ff5e7e', '#88ff5a', '#fcff42', '#ffa62d', '#ff36ff']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  };

  const triggerMiniConfetti = () => {
    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.8 },
      zIndex: 100,
    });
  };

  const isFullScreenGame = gameState === 'star_game' || gameState === 'search_game' || gameState === 'email_game' || gameState === 'coding_game' || gameState === 'tapir_game' || gameState === 'copy_paste_game' || gameState === 'pipe_game';

  return (
    <main className="min-h-screen bg-[#0F172A] text-white flex flex-col relative font-sans overflow-hidden">
      
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#1E293B_0%,#0F172A_100%)] z-0"></div>
      
      {/* Decorative Bottom Left */}
      <div className="absolute bottom-10 left-10 opacity-20 pointer-events-none z-0">
        <svg viewBox="0 0 100 100" width="120" height="120">
          <circle cx="50" cy="50" r="40" fill="none" stroke="white" strokeWidth="2" strokeDasharray="10 5" />
          <path d="M50 10 L50 90 M10 50 L90 50" stroke="white" strokeWidth="1" opacity="0.5" />
        </svg>
      </div>

      {/* Game Header */}
      {!isFullScreenGame && gameState !== 'main_menu' && (
        <header className="relative z-10 p-6 flex justify-between items-center bg-white/5 border-b border-white/10 backdrop-blur-md">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center border-4 border-yellow-200 shadow-[0_0_15px_rgba(250,204,21,0.5)]">
              <span className="text-2xl">🦛</span>
            </div>
            <div>
              <h1 className="flex flex-col font-black tracking-tight leading-none mb-1">
                <span className="text-xs md:text-sm text-emerald-400">SIMULASI</span>
                <span className="text-xl md:text-2xl text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
                  TAPIR HERO
                </span>
              </h1>
              <p className="text-[8px] md:text-[10px] uppercase tracking-[0.2em] text-blue-300 font-bold">Digital Competency Score</p>
            </div>
          </div>
          
          <div className="flex gap-4 md:gap-6">
            {gameState === 'playing' && (
              <button
                onClick={() => {
                  setGameState('result');
                  triggerFinalConfetti();
                }}
                className="bg-red-500/20 text-red-300 border border-red-500/50 px-4 py-2 rounded-xl text-xs md:text-sm font-bold uppercase tracking-widest hover:bg-red-500 hover:text-white transition-colors"
                >
                TAMAT
              </button>
            )}
          </div>
        </header>
      )}

      <div className={cn("flex-1 flex flex-col items-center justify-center relative z-10 w-full mx-auto", isFullScreenGame ? "w-full p-0" : "max-w-4xl p-4 md:p-8")}>
        <AnimatePresence mode="wait">
          
          {/* MAIN MENU STATE */}
          {gameState === 'main_menu' && (
            <motion.div
              key="main_menu"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-[40px] p-8 md:p-16 text-center shadow-2xl relative w-full max-w-4xl mx-auto"
            >
               <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-24 h-24 bg-yellow-400 rounded-full flex items-center justify-center border-4 border-yellow-200 shadow-[0_0_20px_rgba(250,204,21,0.6)]">
                <span className="text-6xl">🦛</span>
              </div>

              <div className="mt-8 mb-16 flex flex-col items-center">
                <h1 className="font-black tracking-tight mb-4 drop-shadow-sm flex flex-col items-center gap-1">
                  <span className="text-2xl md:text-4xl text-emerald-400">
                    SIMULASI
                  </span>
                  <span className="text-5xl md:text-7xl text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
                    TAPIR HERO
                  </span>
                </h1>
                <p className="text-xl md:text-2xl text-cyan-300 font-medium max-w-xl mx-auto mt-6">
                  Ayuh pahlawan, selesaikan pelbagai misi mencabar di bawah!
                </p>
              </div>

              <div className="flex flex-col md:flex-row justify-center gap-6 flex-wrap max-w-3xl mx-auto">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setGameState('menu')}
                  className="flex flex-col items-center gap-4 bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/30 p-8 rounded-3xl transition-all w-full max-w-xs group relative overflow-hidden"
                >
                  <div className="w-16 h-16 bg-blue-500/20 text-blue-400 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:bg-blue-500 group-hover:text-white transition-all shadow-[0_0_20px_rgba(59,130,246,0.2)]">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <span className="text-xl font-bold tracking-widest text-white text-center">
                    KUIZ KEMAHIRAN DIGITAL
                  </span>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setGameState('star_game')}
                  className="flex flex-col items-center gap-4 bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/30 p-8 rounded-3xl transition-all w-full max-w-xs group relative overflow-hidden"
                >
                  <div className="w-16 h-16 bg-yellow-400/20 text-yellow-400 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:bg-yellow-400 group-hover:text-black transition-all shadow-[0_0_20px_rgba(250,204,21,0.2)]">
                    <Star className="w-8 h-8" />
                  </div>
                  <span className="text-xl font-bold tracking-widest text-white text-center">
                    MISI KIRA BINTANG
                  </span>
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setGameState('search_game')}
                  className="flex flex-col items-center gap-4 bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/30 p-8 rounded-3xl transition-all w-full max-w-xs group relative overflow-hidden"
                >
                  <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:bg-emerald-500 group-hover:text-white transition-all shadow-[0_0_20px_rgba(16,185,129,0.2)]">
                    <Search className="w-8 h-8" />
                  </div>
                  <span className="text-xl font-bold tracking-widest text-white text-center">
                    MISI CARIAN PINTAR
                  </span>
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setGameState('email_game')}
                  className="flex flex-col items-center gap-4 bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/30 p-8 rounded-3xl transition-all w-full max-w-xs group relative overflow-hidden"
                >
                  <div className="w-16 h-16 bg-purple-500/20 text-purple-400 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:bg-purple-500 group-hover:text-white transition-all shadow-[0_0_20px_rgba(168,85,247,0.2)]">
                    <Mail className="w-8 h-8" />
                  </div>
                  <span className="text-xl font-bold tracking-widest text-white text-center">
                    MISI KESELAMATAN E-MEL
                  </span>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setGameState('coding_game')}
                  className="flex flex-col items-center gap-4 bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/30 p-8 rounded-3xl transition-all w-full max-w-xs group relative overflow-hidden"
                >
                  <div className="w-16 h-16 bg-red-500/20 text-red-400 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:bg-red-500 group-hover:text-white transition-all shadow-[0_0_20px_rgba(239,68,68,0.2)]">
                    <Rocket className="w-8 h-8" />
                  </div>
                  <span className="text-xl font-bold tracking-widest text-white text-center">
                    MISI KAWALAN ROKET
                  </span>
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setGameState('tapir_game')}
                  className="flex flex-col items-center gap-4 bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/30 p-8 rounded-3xl transition-all w-full max-w-xs group relative overflow-hidden"
                >
                  <div className="w-16 h-16 bg-orange-500/20 text-orange-400 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:bg-orange-500 group-hover:text-white transition-all shadow-[0_0_20px_rgba(249,115,22,0.2)]">
                    <Target className="w-8 h-8" />
                  </div>
                  <span className="text-xl font-bold tracking-widest text-white text-center">
                    MISI SOKOBAN TAPIR
                  </span>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setGameState('copy_paste_game')}
                  className="flex flex-col items-center gap-4 bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/30 p-8 rounded-3xl transition-all w-full max-w-xs group relative overflow-hidden"
                >
                  <div className="w-16 h-16 bg-fuchsia-500/20 text-fuchsia-400 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:bg-fuchsia-500 group-hover:text-white transition-all shadow-[0_0_20px_rgba(217,70,239,0.2)]">
                    <ClipboardPaste className="w-8 h-8" />
                  </div>
                  <span className="text-xl font-bold tracking-widest text-white text-center">
                    MISI SALIN & TAMPAL
                  </span>
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setGameState('pipe_game')}
                  className="flex flex-col items-center gap-4 bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/30 p-8 rounded-3xl transition-all w-full max-w-xs group relative overflow-hidden"
                >
                  <div className="w-16 h-16 bg-teal-500/20 text-teal-400 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:bg-teal-500 group-hover:text-white transition-all shadow-[0_0_20px_rgba(20,184,166,0.2)]">
                    <Droplets className="w-8 h-8" />
                  </div>
                  <span className="text-xl font-bold tracking-widest text-white text-center">
                    MISI PAIP AIR
                  </span>
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* MENU STATE */}
          {gameState === 'menu' && (
            <motion.div
              key="menu"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-[40px] p-8 md:p-16 text-center shadow-2xl relative w-full max-w-4xl mx-auto"
            >
               <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-24 h-24 bg-yellow-400 rounded-full flex items-center justify-center border-4 border-yellow-200 shadow-[0_0_20px_rgba(250,204,21,0.6)]">
                <span className="text-6xl">🦛</span>
              </div>

              <div className="mt-8 mb-10 flex flex-col items-center">
                <h1 className="font-black tracking-tight mb-4 drop-shadow-sm flex flex-col items-center gap-1">
                  <span className="text-2xl md:text-4xl text-emerald-400">
                    SIMULASI
                  </span>
                  <span className="text-5xl md:text-7xl text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
                    TAPIR HERO
                  </span>
                </h1>
                <h2 className="text-lg md:text-2xl font-bold text-blue-300 tracking-[0.2em] uppercase mb-2">
                  Digital Competency Score
                </h2>
                <p className="text-base md:text-lg text-gray-300 max-w-xl mx-auto mt-6">
                  Uji kemahiran digital anda!
                </p>
              </div>

              <div className="flex flex-col md:flex-row justify-center gap-6">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={startGame}
                  className="inline-flex items-center justify-center gap-3 bg-gradient-to-r from-emerald-400 to-emerald-600 text-white font-black tracking-widest text-xl md:text-2xl py-4 px-12 rounded-2xl shadow-[0_0_20px_rgba(52,211,153,0.4)] hover:shadow-[0_0_30px_rgba(52,211,153,0.6)] transition-all"
                >
                  <PlayCircle className="w-8 h-8" />
                  MULA BERMAIN
                </motion.button>
              
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setGameState('main_menu')}
                  className="inline-flex items-center justify-center bg-white/5 border border-white/20 hover:bg-white/10 hover:border-white/30 text-white font-bold tracking-widest text-lg md:text-xl py-4 px-8 rounded-2xl transition-all"
                >
                  KEMBALI
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* PLAYING STATE */}
          {gameState === 'playing' && currentQuestion && (
            <motion.div
              key={`question-${currentQuestionIndex}`}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ type: "spring", bounce: 0.3, duration: 0.6 }}
              className="w-full flex justify-center items-center flex-col"
            >
              {/* Question Navigation */}
              <div className="w-full max-w-3xl mb-8">
                <div className="flex flex-wrap justify-center gap-2">
                  {quizData.map((_, index) => {
                    const isCurrent = index === currentQuestionIndex;
                    const isAnswered = answers[index] !== undefined;
                    const isCorrect = answers[index]?.isCorrect;
                    return (
                      <button
                        key={index}
                        onClick={() => setCurrentQuestionIndex(index)}
                        className={cn(
                          "w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center font-bold text-xs md:text-sm border-2 transition-all",
                          isCurrent ? "border-yellow-400 bg-yellow-400 text-black scale-110 shadow-[0_0_15px_rgba(250,204,21,0.5)] z-10" :
                          isAnswered ? (isCorrect ? "border-emerald-500 bg-emerald-500/20 text-emerald-400" : "border-red-500 bg-red-500/20 text-red-400") :
                          "border-white/20 bg-white/5 text-gray-400 hover:border-white/50 hover:text-white"
                        )}
                      >
                        {index + 1}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Question Card */}
              <div className="w-full max-w-3xl bg-white/10 backdrop-blur-xl border border-white/20 rounded-[40px] p-6 md:p-10 shadow-2xl relative mb-8">
                <div className="absolute -top-6 -left-6 w-16 h-16 md:w-20 md:h-20 bg-indigo-600 rounded-2xl rotate-12 flex items-center justify-center text-3xl md:text-4xl shadow-xl">
                  ❓
                </div>
                
                <h2 className="text-xl md:text-3xl font-bold text-center mb-10 mt-4 md:mt-0 leading-tight px-2 md:px-12 text-white whitespace-pre-line">
                  {currentQuestion.text}
                </h2>

                <div className={cn(
                  "grid gap-4",
                  currentQuestion.options.length === 2 ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1 sm:grid-cols-2"
                )}>
                  {currentQuestion.options.map((option, index) => {
                    const isSelected = selectedOptionId === option.id;
                    const showCorrect = hasAnswered && option.isCorrect;
                    const showWrong = hasAnswered && isSelected && !option.isCorrect;

                    return (
                      <motion.button
                        key={option.id}
                        disabled={hasAnswered}
                        whileHover={!hasAnswered ? { scale: 1.02 } : {}}
                        whileTap={!hasAnswered ? { scale: 0.98 } : {}}
                        onClick={() => handleOptionSelect(option.id, option.isCorrect)}
                        className={cn(
                          "group p-4 md:p-6 rounded-3xl transition-all text-left flex items-center gap-4 relative w-full",
                          !hasAnswered ? "bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/30 cursor-pointer" : "",
                          hasAnswered && !showCorrect && !showWrong ? "bg-white/5 border border-white/10 opacity-50 cursor-not-allowed" : "",
                          showCorrect ? "bg-emerald-500/20 border-2 border-emerald-400/50 shadow-md transform scale-[1.02] z-10" : "",
                          showWrong ? "bg-red-500/20 border-2 border-red-400/50 shadow-md" : ""
                        )}
                      >
                        <div className={cn(
                          "w-10 h-10 shrink-0 rounded-full flex items-center justify-center font-bold text-lg md:text-xl transition-colors",
                           !hasAnswered ? "bg-white/10 group-hover:bg-yellow-400 group-hover:text-black" : "",
                           showCorrect ? "bg-emerald-500 text-black" : "",
                           showWrong ? "bg-red-500 text-black" : "",
                           hasAnswered && !showCorrect && !showWrong ? "bg-white/10 font-bold" : ""
                        )}>
                          {String.fromCharCode(65 + index)}
                        </div>
                        
                        {option.icon && (
                          <div className={cn(
                            "flex items-center justify-center p-2 rounded-xl shrink-0 opacity-90",
                            showCorrect ? "text-emerald-400" : showWrong ? "text-red-400" : "text-current"
                          )}>
                            {option.icon}
                          </div>
                        )}
                        {option.text && (
                          <span className={cn(
                            "text-base md:text-lg font-bold break-words",
                            showCorrect ? "text-white" : showWrong ? "text-white" : "text-gray-200 group-hover:text-white"
                          )}>
                            {option.text}
                          </span>
                        )}

                        {/* Result Overlay Icons */}
                        {showCorrect && <div className="absolute right-4 text-emerald-400 font-bold text-xl">✔</div>}
                        {showWrong && <div className="absolute right-4 text-red-400 font-bold text-xl">✘</div>}
                      </motion.button>
                    );
                  })}
                </div>
              </div>

              <AnimatePresence>
                {hasAnswered && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    className="w-full flex-col md:flex-row flex items-center justify-between gap-6"
                  >
                    
                    {/* Feedback Overlay */}
                    <div className="flex flex-col md:flex-row items-center gap-4 animate-bounce text-center md:text-left flex-1">
                      <div className={cn(
                        "text-black px-6 py-3 rounded-2xl font-black text-xl whitespace-nowrap",
                        selectedOption?.isCorrect ? "bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.4)]" : "bg-red-500 shadow-[0_0_20px_rgba(239,68,68,0.4)] text-white"
                      )}>
                         {selectedOption?.isCorrect ? 'SYABAS! BETUL!' : 'KURANG TEPAT!'}
                      </div>
                      <div className="text-gray-300 italic text-sm max-w-sm">
                        "{currentQuestion.explanation}"
                      </div>
                    </div>

                    {/* Next Button */}
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleNextQuestion}
                      className="px-10 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl font-black tracking-widest text-base md:text-lg shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center gap-3 shrink-0 whitespace-nowrap"
                    >
                      {currentQuestionIndex === quizData.length - 1 ? 'KEPUTUSAN' : 'SETERUSNYA'} <span className="text-2xl">➜</span>
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}

          {/* RESULT STATE */}
          {gameState === 'result' && (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-[40px] p-8 md:p-16 text-center shadow-2xl relative w-full"
            >
              <div className="mb-10 text-center">
                <div className="inline-flex bg-yellow-400 p-6 rounded-full mb-6 border-4 border-yellow-200 shadow-[0_0_30px_rgba(250,204,21,0.6)]">
                  <Award className="w-20 h-20 text-black" />
                </div>
                <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white mb-4">
                  TAHNIAH!
                </h2>
                <p className="text-lg md:text-xl text-gray-300 mb-10 max-w-md mx-auto">
                  Anda telah melengkapkan cabaran kemahiran digital.
                </p>
                
                <div className="bg-white/5 border border-white/10 rounded-3xl p-8 max-w-sm mx-auto shadow-inner">
                  <p className="text-gray-400 font-bold text-sm tracking-widest uppercase mb-2">Skor Akhir</p>
                  <div className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500 drop-shadow-sm flex justify-center items-baseline gap-2">
                    {correctCount * 100}
                  </div>
                  <div className="text-gray-400 mt-2 font-medium">
                    {correctCount} / {quizData.length} Betul
                  </div>
                </div>
              </div>

              <div className="flex flex-col md:flex-row justify-center gap-6 mt-10">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={startGame}
                  className="inline-flex items-center justify-center gap-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-black tracking-widest text-xl py-4 px-10 rounded-2xl shadow-[0_0_20px_rgba(59,130,246,0.4)] hover:shadow-[0_0_30px_rgba(59,130,246,0.6)] transition-all"
                >
                  <RefreshCcw className="w-6 h-6" />
                  MAIN SEMULA
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setGameState('main_menu')}
                  className="inline-flex items-center justify-center bg-white/5 border border-white/20 hover:bg-white/10 hover:border-white/30 text-white font-bold tracking-widest text-lg py-4 px-8 rounded-2xl transition-all"
                >
                  KEMBALI
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* STAR GAME STATE */}
          {gameState === 'star_game' && (
            <motion.div
              key="star_game"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full flex-1 flex"
            >
              <StarGame onBack={() => setGameState('main_menu')} />
            </motion.div>
          )}

          {/* SEARCH GAME STATE */}
          {gameState === 'search_game' && (
            <motion.div
              key="search_game"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full flex-1 flex"
            >
              <SearchGame onBack={() => setGameState('main_menu')} />
            </motion.div>
          )}

          {/* EMAIL GAME STATE */}
          {gameState === 'email_game' && (
            <motion.div
              key="email_game"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full flex-1 flex"
            >
              <EmailGame onBack={() => setGameState('main_menu')} />
            </motion.div>
          )}

          {/* CODING GAME STATE */}
          {gameState === 'coding_game' && (
            <motion.div
              key="coding_game"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full flex-1 flex"
            >
              <CodingGame onBack={() => setGameState('main_menu')} />
            </motion.div>
          )}
          
          {/* TAPIR GAME STATE */}
          {gameState === 'tapir_game' && (
            <motion.div
              key="tapir_game"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full flex-1 flex"
            >
              <TapirGame onBack={() => setGameState('main_menu')} />
            </motion.div>
          )}

          {/* COPY PASTE GAME STATE */}
          {gameState === 'copy_paste_game' && (
            <motion.div
              key="copy_paste_game"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full flex-1 flex"
            >
              <CopyPasteGame onBack={() => setGameState('main_menu')} />
            </motion.div>
          )}

          {/* PIPE GAME STATE */}
          {gameState === 'pipe_game' && (
            <motion.div
              key="pipe_game"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full flex-1 flex"
            >
              <PipeGame onBack={() => setGameState('main_menu')} />
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </main>
  );
}
