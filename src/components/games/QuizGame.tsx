import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, Timer, Zap, Star, Trophy, ArrowRight, RotateCcw, Flame } from 'lucide-react';

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

interface QuizGameProps {
  title: string;
  questions: QuizQuestion[];
  onComplete: (score: number, total: number, correctCount: number) => void;
  onExit: () => void;
}

const difficultyConfig = {
  easy: { color: '#58CC02', label: 'Easy', time: 20 },
  medium: { color: '#FF9600', label: 'Medium', time: 15 },
  hard: { color: '#FF4B4B', label: 'Hard', time: 10 },
};

export default function QuizGame({ title, questions, onComplete, onExit }: QuizGameProps) {
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [timeLeft, setTimeLeft] = useState(20);
  const [isActive, setIsActive] = useState(true);
  const [gameOver, setGameOver] = useState(false);
  const [answers, setAnswers] = useState<{ q: number; correct: boolean }[]>([]);

  const question = questions[currentQ];
  const diff = difficultyConfig[question.difficulty];

  // Timer
  useEffect(() => {
    if (!isActive || showResult || gameOver) return;
    setTimeLeft(diff.time);
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleTimeout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [currentQ, isActive, showResult, gameOver]);

  const handleTimeout = useCallback(() => {
    setIsActive(false);
    setShowResult(true);
    setSelected(null);
    setStreak(0);
    setAnswers(prev => [...prev, { q: currentQ, correct: false }]);
  }, [currentQ]);

  const handleAnswer = (index: number) => {
    if (!isActive || showResult) return;
    setIsActive(false);
    setSelected(index);
    setShowResult(true);

    const isCorrect = index === question.correctIndex;
    if (isCorrect) {
      const streakBonus = Math.min(streak * 10, 50);
      const timeBonus = Math.floor(timeLeft * 2);
      const points = 100 + streakBonus + timeBonus;
      setScore(prev => prev + points);
      setCorrectCount(prev => prev + 1);
      const newStreak = streak + 1;
      setStreak(newStreak);
      setMaxStreak(prev => Math.max(prev, newStreak));
    } else {
      setStreak(0);
    }
    setAnswers(prev => [...prev, { q: currentQ, correct: isCorrect }]);
  };

  const handleNext = () => {
    if (currentQ < questions.length - 1) {
      setCurrentQ(prev => prev + 1);
      setSelected(null);
      setShowResult(false);
      setIsActive(true);
    } else {
      setGameOver(true);
    }
  };

  const handleRestart = () => {
    setCurrentQ(0);
    setSelected(null);
    setShowResult(false);
    setScore(0);
    setCorrectCount(0);
    setStreak(0);
    setMaxStreak(0);
    setIsActive(true);
    setGameOver(false);
    setAnswers([]);
  };

  const handleFinish = () => {
    onComplete(score, questions.length * 100 + questions.length * 20, correctCount);
  };

  const progress = ((currentQ + (showResult ? 1 : 0)) / questions.length) * 100;

  // Results screen
  if (gameOver) {
    const perfect = correctCount === questions.length;
    const percent = Math.round((correctCount / questions.length) * 100);
    const stars = perfect ? 3 : percent >= 70 ? 2 : percent >= 40 ? 1 : 0;

    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 260, damping: 20 }} className="text-center">
          <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg" style={{ backgroundColor: '#58CC02' }}>
            <Trophy className="w-10 h-10 text-white" />
          </div>
          <h2 className="font-display text-2xl font-bold g-title mb-1">Quiz Complete!</h2>
          <p className="text-sm g-muted mb-4">{title}</p>

          <div className="flex justify-center gap-2 mb-4">
            {[1, 2, 3].map(s => (
              <motion.div key={s} initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }} transition={{ delay: s * 0.2, type: 'spring' }}>
                <Star className="w-10 h-10" style={{ color: s <= stars ? '#FFC800' : 'var(--border)', fill: s <= stars ? '#FFC800' : 'none' }} />
              </motion.div>
            ))}
          </div>

          <div className="d-card p-4 mb-4 max-w-xs mx-auto">
            <div className="grid grid-cols-2 gap-3 text-center">
              <div>
                <p className="font-display text-2xl font-bold" style={{ color: '#58CC02' }}>{correctCount}/{questions.length}</p>
                <p className="text-xs g-muted">Correct</p>
              </div>
              <div>
                <p className="font-display text-2xl font-bold" style={{ color: '#FFC800' }}>{score}</p>
                <p className="text-xs g-muted">Points</p>
              </div>
              <div>
                <p className="font-display text-2xl font-bold" style={{ color: '#FF9600' }}>{maxStreak}</p>
                <p className="text-xs g-muted">Best Streak</p>
              </div>
              <div>
                <p className="font-display text-2xl font-bold" style={{ color: '#1CB0F6' }}>{percent}%</p>
                <p className="text-xs g-muted">Accuracy</p>
              </div>
            </div>
          </div>

          <div className="flex justify-center gap-1 mb-4">
            {answers.map((a, i) => (
              <div key={i} className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${a.correct ? 'text-white' : 'text-white'}`} style={{ backgroundColor: a.correct ? '#58CC02' : '#FF4B4B' }}>
                {a.correct ? 'V' : 'X'}
              </div>
            ))}
          </div>

          <div className="flex gap-3 justify-center">
            <button onClick={handleRestart} className="btn-3d btn-3d-blue px-6 py-3 text-sm flex items-center gap-2">
              <RotateCcw className="w-4 h-4" /> Retry
            </button>
            <button onClick={handleFinish} className="btn-3d btn-3d-green px-6 py-3 text-sm flex items-center gap-2">
              Continue <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-shrink-0 mb-4">
        <div className="flex items-center justify-between mb-2">
          <button onClick={onExit} className="text-sm g-muted font-medium hover:opacity-70">Exit</button>
          <span className="text-xs font-bold g-muted">{currentQ + 1} / {questions.length}</span>
        </div>

        <div className="g-track h-2 rounded-full overflow-hidden">
          <motion.div className="h-full rounded-full" style={{ backgroundColor: '#58CC02' }} animate={{ width: `${progress}%` }} transition={{ duration: 0.3 }} />
        </div>

        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-1">
            <Zap className="w-4 h-4" style={{ color: '#FFC800' }} />
            <span className="text-sm font-bold" style={{ color: '#FFC800' }}>{score}</span>
          </div>

          {streak > 1 && (
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex items-center gap-1 px-2 py-0.5 rounded-full border" style={{ backgroundColor: '#FF9600' + '10', borderColor: '#FF9600' + '25' }}>
              <Flame className="w-4 h-4" style={{ color: '#FF9600' }} />
              <span className="text-xs font-bold" style={{ color: '#FF9600' }}>{streak}x</span>
            </motion.div>
          )}

          <div className={`flex items-center gap-1 ${timeLeft <= 5 ? 'animate-pulse' : ''}`} style={{ color: timeLeft <= 5 ? '#FF4B4B' : 'var(--text-muted)' }}>
            <Timer className="w-4 h-4" />
            <span className="text-sm font-bold">{timeLeft}s</span>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        <motion.div key={currentQ} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex-1">
          <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded-full mb-2" style={{ backgroundColor: diff.color + '15', color: diff.color }}>
            {diff.label}
          </span>

          <h3 className="font-display text-lg font-bold g-title mb-4">{question.question}</h3>

          <div className="space-y-2">
            <AnimatePresence>
              {question.options.map((option, i) => {
                let btnClass = 'd-card w-full p-4 text-left text-sm font-medium transition-all border-2 ';
                if (showResult) {
                  if (i === question.correctIndex) {
                    btnClass += 'd-card-green';
                  } else if (i === selected && i !== question.correctIndex) {
                    btnClass += 'd-card-red';
                  } else {
                    btnClass += 'opacity-40';
                  }
                } else {
                  btnClass += 'cursor-pointer';
                }

                return (
                  <motion.button key={`${currentQ}-${i}`} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}
                    whileTap={!showResult ? { scale: 0.98 } : {}} onClick={() => handleAnswer(i)} disabled={showResult} className={btnClass}>
                    <div className="flex items-center gap-3">
                      <span className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                        showResult && i === question.correctIndex
                          ? 'bg-[#58CC02] text-white'
                          : showResult && i === selected
                          ? 'bg-[#FF4B4B] text-white'
                          : 'g-track g-muted'
                      }`}>
                        {showResult && i === question.correctIndex ? <CheckCircle2 className="w-5 h-5" /> : showResult && i === selected ? <XCircle className="w-5 h-5" /> : String.fromCharCode(65 + i)}
                      </span>
                      <span className="g-title">{option}</span>
                    </div>
                  </motion.button>
                );
              })}
            </AnimatePresence>
          </div>

          <AnimatePresence>
            {showResult && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-4 p-4 rounded-2xl border-2" style={{ backgroundColor: '#1CB0F6' + '08', borderColor: '#1CB0F6' + '25' }}>
                <p className="text-xs font-medium mb-1" style={{ color: '#1CB0F6' }}>Explanation</p>
                <p className="text-sm g-title">{question.explanation}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        <AnimatePresence>
          {showResult && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex-shrink-0 mt-4">
              <button onClick={handleNext} className="btn-3d btn-3d-green w-full py-3 text-sm flex items-center justify-center gap-2">
                {currentQ < questions.length - 1 ? 'Next Question' : 'See Results'} <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
