/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  CheckCircle2, 
  Terminal, 
  Dumbbell, 
  Timer as TimerIcon,
  Sparkles,
  Zap
} from 'lucide-react';

interface Routine {
  title: string;
  exercises: string[];
  description: string;
}

const ROUTINES: Record<number, Routine> = {
  1: {
    title: "Quick Pull-up Burnout",
    exercises: ["Max Pull-ups", "Dead Hang"],
    description: "Short burst to reset your dopamine while the AI compiles."
  },
  5: {
    title: "Arch Body Holds & Core",
    exercises: ["Arch Body Holds (45s)", "Plank (45s)", "Hollow Body Holds (45s)", "L-Sit Progressions"],
    description: "Focus on posterior chain and core stability for better posture."
  },
  10: {
    title: "Ring Chest Flys & Push-ups",
    exercises: ["Ring Flys (3x8)", "Pseudo Planche Push-ups", "Diamond Push-ups", "Wide Push-ups"],
    description: "Building push strength and chest hypertrophy."
  },
  15: {
    title: "Dips & Explosive Pull-ups",
    exercises: ["Deep Dips on Parallel Bars", "Explosive Pull-ups", "Chin-ups", "Australian Pull-ups"],
    description: "Focus on explosive power and vertical push/pull mechanics."
  },
  20: {
    title: "Handstand Practice & Tuck Front Levers",
    exercises: ["Wall Walks", "Handstand Holds (facing wall)", "Tuck Front Lever Holds", "Shoulder Taps"],
    description: "Advanced skill training. Balance and overhead stability."
  },
  30: {
    title: "Full Muscle-Up Progressions",
    exercises: ["High Pull-ups", "Bar Dips", "Transitions (Russian Dips)", "Negative Muscle-ups", "Leg Raises"],
    description: "The ultimate upper body pull-to-push skill routine."
  }
};

export default function App() {
  const [minutes, setMinutes] = useState<number>(5);
  const [timeLeft, setTimeLeft] = useState<number>(5 * 60);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [routine, setRoutine] = useState<Routine | null>(null);
  const [showSuccess, setShowSuccess] = useState<boolean>(false);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleComplete();
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, timeLeft]);

  const handleGenerate = () => {
    setRoutine(ROUTINES[minutes]);
    setTimeLeft(minutes * 60);
    setIsActive(false);
    setShowSuccess(false);
  };

  const toggleTimer = () => setIsActive(!isActive);

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(minutes * 60);
    setShowSuccess(false);
  };

  const handleComplete = () => {
    setIsActive(false);
    setShowSuccess(true);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-mono flex flex-col items-center p-4 selection:bg-emerald-500/30">
      {/* Header */}
      <header className="w-full max-w-2xl mt-12 mb-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs mb-4"
        >
          <Terminal size={14} />
          <span>v1.0.4-stable</span>
        </motion.div>
        <h1 className="text-5xl font-bold tracking-tight text-white mb-2 font-sans italic">
          Cali<span className="text-emerald-500">Code</span>
        </h1>
        <p className="text-slate-400 sm:text-lg">
          Transform deployment wait time into gains.
        </p>
      </header>

      <main className="w-full max-w-2xl space-y-8">
        {/* Controls */}
        <section className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-sm uppercase tracking-widest text-slate-500 font-bold flex items-center gap-2">
              <Zap size={16} /> Choose Duration
            </h2>
          </div>
          
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mb-8">
            {[1, 5, 10, 15, 20, 30].map((m) => (
              <button
                key={m}
                onClick={() => {
                  setMinutes(m);
                  setTimeLeft(m * 60);
                  setIsActive(false);
                  setRoutine(null);
                  setShowSuccess(false);
                }}
                className={`py-3 rounded-xl border transition-all duration-200 ${
                  minutes === m 
                    ? 'bg-emerald-500 border-emerald-400 text-slate-950 font-bold shadow-[0_0_15px_rgba(16,185,129,0.3)]' 
                    : 'bg-slate-800/50 border-slate-700 hover:border-slate-500 text-slate-400'
                }`}
              >
                {m}m
              </button>
            ))}
          </div>

          <button
            onClick={handleGenerate}
            className="w-full py-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl transition-all flex items-center justify-center gap-3 active:scale-95"
          >
            <Dumbbell size={20} />
            GENERATE ROUTINE
          </button>
        </section>

        {/* Workout Display */}
        <AnimatePresence mode="wait">
          {routine && !showSuccess && (
            <motion.section
              key="routine"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="space-y-6"
            >
              <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
                <div className="p-6 bg-emerald-500/5 border-b border-slate-800 flex items-center justify-between">
                  <div>
                    <h3 className="text-emerald-400 font-bold text-xl">{routine.title}</h3>
                    <p className="text-slate-500 text-sm">{routine.description}</p>
                  </div>
                  <div className="bg-slate-950 p-2 rounded-lg border border-slate-800">
                    <TimerIcon className="text-emerald-500" size={24} />
                  </div>
                </div>
                
                <div className="p-6 grid gap-4">
                  {routine.exercises.map((ex, i) => (
                    <div key={i} className="flex items-center gap-4 group">
                      <span className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-emerald-500 font-bold text-sm">
                        {i + 1}
                      </span>
                      <span className="text-slate-300 group-hover:text-white transition-colors">{ex}</span>
                    </div>
                  ))}
                </div>

                <div className="p-8 bg-slate-950/50 flex flex-col items-center">
                  <div className="text-7xl font-bold tabular-nums text-white mb-8 tracking-tighter drop-shadow-[0_0_10px_rgba(255,255,255,0.1)]">
                    {formatTime(timeLeft)}
                  </div>
                  
                  <div className="flex gap-4 w-full max-w-xs">
                    <button
                      onClick={toggleTimer}
                      className={`flex-1 py-4 flex items-center justify-center gap-2 rounded-xl text-lg font-bold transition-all border ${
                        isActive 
                          ? 'bg-amber-500/10 border-amber-500/50 text-amber-500' 
                          : 'bg-emerald-500/10 border-emerald-500/50 text-emerald-500'
                      }`}
                    >
                      {isActive ? <Pause size={24} /> : <Play size={24} />}
                      {isActive ? 'PAUSE' : 'START'}
                    </button>
                    <button
                      onClick={resetTimer}
                      className="p-4 rounded-xl bg-slate-800/50 border border-slate-700 text-slate-400 hover:text-white transition-all"
                    >
                      <RotateCcw size={24} />
                    </button>
                  </div>

                  <button
                    onClick={handleComplete}
                    className="mt-6 text-slate-500 hover:text-emerald-400 text-sm transition-colors flex items-center gap-2 underline underline-offset-4"
                  >
                    <CheckCircle2 size={16} />
                    Mark as Done
                  </button>
                </div>
              </div>
            </motion.section>
          )}

          {showSuccess && (
            <motion.section
              key="success"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center p-12 bg-emerald-500/10 border border-emerald-500/30 rounded-3xl"
            >
              <div className="inline-flex p-4 bg-emerald-500 rounded-full text-slate-950 mb-6 shadow-[0_0_30px_rgba(16,185,129,0.4)]">
                <CheckCircle2 size={48} />
              </div>
              <h2 className="text-3xl font-bold text-white mb-3">Commit Successful!</h2>
              <p className="text-emerald-400 mb-8 max-w-md mx-auto">
                You just improved your physical boilerplate. Your AI agent should be ready now.
              </p>
              <button
                onClick={resetTimer}
                className="px-8 py-3 bg-white text-slate-950 font-bold rounded-xl hover:bg-slate-200 transition-all flex items-center gap-2 mx-auto"
              >
                <Sparkles size={18} />
                START NEW SESSION
              </button>
            </motion.section>
          )}
        </AnimatePresence>
      </main>

      <footer className="mt-auto py-12 text-slate-600 text-xs text-center border-t border-slate-900 w-full">
        <p>© {new Date().getFullYear()} CaliCode // Muscle Memory for Software Engineers</p>
        <p className="mt-2">Built with React + Tailwind + Discipline</p>
      </footer>
    </div>
  );
}

