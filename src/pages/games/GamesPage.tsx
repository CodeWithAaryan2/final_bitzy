import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Gamepad2, Zap, Trophy, Flame, Star,
  Target, Swords, Keyboard, Bug, Brain, Eye, Pencil,
} from 'lucide-react';
import { useGame } from '@/context/GameContext';
import { useAuth, getLevelFromXP } from '@/context/AuthContext';
import QuizGame from '@/components/games/QuizGame';
import CodeBattleGame from '@/components/games/CodeBattleGame';
import SpeedTypingGame from '@/components/games/SpeedTypingGame';
import BugHuntGame from '@/components/games/BugHuntGame';
import MemoryMatchGame from '@/components/games/MemoryMatchGame';
import CodePredictionGame from '@/components/games/CodePredictionGame';
import FillBlankGame from '@/components/games/FillBlankGame';
import {
  getQuizQuestions,
  battleChallenges,
  typingSnippets,
  bugSnippets,
} from '@/data/gameData';
import {
  memoryCards,
  predictionQuestions,
  fillBlankQuestions,
  pythonQuizQuestions,
  reactQuizQuestions,
  cppQuizQuestions,
} from '@/data/gameDataExtended';

type ActiveGame = 'quiz' | 'battle' | 'typing' | 'bughunt' | 'memory' | 'prediction' | 'fillblank' | null;
type QuizTopic = 'html' | 'css' | 'javascript' | 'python' | 'react' | 'cpp' | 'mixed';

const gameCards = [
  { id: 'quiz' as ActiveGame, title: 'Code Quiz', desc: 'Test your knowledge!', icon: Target, color: '#58CC02', bg: '#F0FFE5', shadow: '#45A301' },
  { id: 'battle' as ActiveGame, title: 'Code Battle', desc: 'Duel AI opponents!', icon: Swords, color: '#FF4B4B', bg: '#FFE8E8', shadow: '#E54343' },
  { id: 'typing' as ActiveGame, title: 'Speed Typing', desc: 'Race to type code!', icon: Keyboard, color: '#1CB0F6', bg: '#E5F6FF', shadow: '#0C9BDE' },
  { id: 'bughunt' as ActiveGame, title: 'Bug Hunt', desc: 'Find and fix bugs!', icon: Bug, color: '#FF9600', bg: '#FFF3E0', shadow: '#E88700' },
  { id: 'memory' as ActiveGame, title: 'Memory Match', desc: 'Match concepts!', icon: Brain, color: '#CE82FF', bg: '#F5E8FF', shadow: '#B563F5' },
  { id: 'prediction' as ActiveGame, title: 'Code Prediction', desc: 'Predict the output!', icon: Eye, color: '#FF9600', bg: '#FFF3E0', shadow: '#E88700' },
  { id: 'fillblank' as ActiveGame, title: 'Fill the Blank', desc: 'Complete the code!', icon: Pencil, color: '#00C6B6', bg: '#E8FDF5', shadow: '#00A896' },
];

const quizTopics: { key: QuizTopic; label: string }[] = [
  { key: 'html', label: 'HTML' },
  { key: 'css', label: 'CSS' },
  { key: 'javascript', label: 'JavaScript' },
  { key: 'python', label: 'Python' },
  { key: 'react', label: 'React' },
  { key: 'cpp', label: 'C++' },
  { key: 'mixed', label: 'Mixed' },
];

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.06 } } };
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

export default function GamesPage() {
  const { addXP, addCoins, showXPPopup } = useGame();
  const { profile } = useAuth();
  const [activeGame, setActiveGame] = useState<ActiveGame>(null);
  const [quizTopic, setQuizTopic] = useState<QuizTopic>('mixed');

  const handleComplete = (xp: number, coins: number) => {
    addXP(xp, 'game');
    addCoins(coins);
    showXPPopup(xp, 'xp', `+${xp} XP from game!`);
    setActiveGame(null);
  };

  if (activeGame === 'quiz') {
    let questions = getQuizQuestions(quizTopic);
    if (quizTopic === 'python') questions = pythonQuizQuestions;
    if (quizTopic === 'react') questions = reactQuizQuestions;
    if (quizTopic === 'cpp') questions = cppQuizQuestions;
    if (quizTopic === 'mixed') questions = [...getQuizQuestions('html').slice(0, 2), ...pythonQuizQuestions.slice(0, 2), ...reactQuizQuestions.slice(0, 1)];
    return (
      <div className="h-full">
        <QuizGame title={`${quizTopic.toUpperCase()} Quiz`} questions={questions}
          onComplete={(score, _total, correct) => handleComplete(Math.round(score / 10), correct * 10)}
          onExit={() => setActiveGame(null)} />
      </div>
    );
  }

  if (activeGame === 'battle') {
    return (
      <div className="h-full">
        <CodeBattleGame challenges={battleChallenges}
          onComplete={(ph, _oh, wins) => handleComplete(ph > 0 ? wins * 50 + 20 : wins * 30, ph > 0 ? wins * 15 + 10 : wins * 10)}
          onExit={() => setActiveGame(null)} />
      </div>
    );
  }

  if (activeGame === 'typing') {
    return (
      <div className="h-full">
        <SpeedTypingGame snippets={typingSnippets}
          onComplete={(wpm, accuracy, _score) => handleComplete(Math.round(wpm * (accuracy / 100)), Math.round(wpm / 3))}
          onExit={() => setActiveGame(null)} />
      </div>
    );
  }

  if (activeGame === 'bughunt') {
    return (
      <div className="h-full">
        <BugHuntGame snippets={bugSnippets}
          onComplete={(score) => handleComplete(Math.round(score / 2), Math.round(score / 5))}
          onExit={() => setActiveGame(null)} />
      </div>
    );
  }

  if (activeGame === 'memory') {
    return (
      <div className="h-full">
        <MemoryMatchGame cards={memoryCards}
          onComplete={(score, _matches, timeBonus) => handleComplete(score + timeBonus, Math.round(score / 20))}
          onExit={() => setActiveGame(null)} />
      </div>
    );
  }

  if (activeGame === 'prediction') {
    return (
      <div className="h-full">
        <CodePredictionGame questions={predictionQuestions}
          onComplete={(score, correct, streak) => handleComplete(score + streak * 10, correct * 15)}
          onExit={() => setActiveGame(null)} />
      </div>
    );
  }

  if (activeGame === 'fillblank') {
    return (
      <div className="h-full">
        <FillBlankGame questions={fillBlankQuestions}
          onComplete={(score, correct, _total) => handleComplete(score, correct * 20)}
          onExit={() => setActiveGame(null)} />
      </div>
    );
  }

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-5">
      <motion.div variants={item} className="text-center">
        <motion.div className="w-16 h-16 rounded-2xl mx-auto mb-3 flex items-center justify-center"
          style={{ backgroundColor: '#CE82FF', boxShadow: '0 4px 0 #B563F5' }}
          animate={{ y: [0, -6, 0] }} transition={{ repeat: Infinity, duration: 2 }}>
          <Gamepad2 className="w-8 h-8 text-white" />
        </motion.div>
        <h1 className="font-display text-2xl font-bold" style={{ color: 'var(--text)' }}>Game Arena</h1>
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>7 game modes. Play, learn, earn XP!</p>
      </motion.div>

      <motion.div variants={item} className="grid grid-cols-3 gap-3">
        <div className="d-card p-3 text-center">
          <Zap className="w-6 h-6 mx-auto mb-1" style={{ color: '#FFC800' }} />
          <p className="font-display text-lg font-bold" style={{ color: 'var(--text)' }}>{profile?.xp ?? 0}</p>
          <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>Your XP</p>
        </div>
        <div className="d-card p-3 text-center">
          <Trophy className="w-6 h-6 mx-auto mb-1" style={{ color: '#FF9600' }} />
          <p className="font-display text-lg font-bold" style={{ color: 'var(--text)' }}>Lv.{getLevelFromXP(profile?.xp ?? 0).level}</p>
          <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>Level</p>
        </div>
        <div className="d-card p-3 text-center">
          <Flame className="w-6 h-6 mx-auto mb-1" style={{ color: '#FF4B4B' }} />
          <p className="font-display text-lg font-bold" style={{ color: 'var(--text)' }}>{profile?.current_streak ?? 0}</p>
          <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>Streak</p>
        </div>
      </motion.div>

      <motion.div variants={item}>
        <h2 className="font-display text-lg font-bold mb-3" style={{ color: 'var(--text)' }}>Quiz Topic</h2>
        <div className="flex flex-wrap gap-2 mb-4">
          {quizTopics.map(t => (
            <button key={t.key} onClick={() => setQuizTopic(t.key)}
              className="px-3 py-1.5 rounded-xl text-xs font-bold border-2 transition-all"
              style={{
                borderColor: quizTopic === t.key ? '#58CC02' : 'var(--border)',
                backgroundColor: quizTopic === t.key ? '#58CC02' : 'var(--white)',
                color: quizTopic === t.key ? 'white' : 'var(--text-light)',
              }}>
              {t.label}
            </button>
          ))}
        </div>
      </motion.div>

      <motion.div variants={item}>
        <h2 className="font-display text-lg font-bold mb-3" style={{ color: 'var(--text)' }}>Choose Game Mode</h2>
        <div className="grid grid-cols-1 gap-2.5">
          {gameCards.map((game) => (
            <motion.button key={game.id} variants={item} whileTap={{ scale: 0.98 }} onClick={() => setActiveGame(game.id)}
              className="d-card w-full p-3.5 flex items-center gap-3.5 text-left transition-all"
              style={{ borderLeftWidth: '4px', borderLeftColor: game.color }}>
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm" style={{ backgroundColor: game.bg }}>
                <game.icon className="w-6 h-6" style={{ color: game.color }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm" style={{ color: 'var(--text)' }}>{game.title}</p>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{game.desc}</p>
              </div>
              <Star className="w-5 h-5 flex-shrink-0" style={{ color: 'var(--border)' }} />
            </motion.button>
          ))}
        </div>
      </motion.div>

      <div className="h-4" />
    </motion.div>
  );
}
