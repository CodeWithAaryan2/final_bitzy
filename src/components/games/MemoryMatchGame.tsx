import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Timer, Zap, Trophy, RotateCcw, ArrowRight, Flame, Star, Brain } from 'lucide-react';

interface CardPair {
  id: string;
  term: string;
  definition: string;
}

interface MemoryMatchGameProps {
  cards: CardPair[];
  onComplete: (score: number, matches: number, timeBonus: number) => void;
  onExit: () => void;
}

type CardState = {
  pairId: string;
  content: string;
  type: 'term' | 'definition';
  flipped: boolean;
  matched: boolean;
  index: number;
};

export default function MemoryMatchGame({ cards, onComplete, onExit }: MemoryMatchGameProps) {
  const [deck, setDeck] = useState<CardState[]>([]);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [score, setScore] = useState(0);
  const [matches, setMatches] = useState(0);
  const [moves, setMoves] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [timeLeft, setTimeLeft] = useState(90);
  const [phase, setPhase] = useState<'ready' | 'playing' | 'gameover'>('ready');
  const [shakeCard, setShakeCard] = useState<number | null>(null);

  // Initialize deck
  const initDeck = useCallback(() => {
    const selected = cards.slice(0, 8); // Max 8 pairs for manageable game
    const newDeck: CardState[] = [];
    selected.forEach((card, i) => {
      newDeck.push({ pairId: card.id, content: card.term, type: 'term', flipped: false, matched: false, index: i * 2 });
      newDeck.push({ pairId: card.id, content: card.definition, type: 'definition', flipped: false, matched: false, index: i * 2 + 1 });
    });
    // Shuffle
    for (let i = newDeck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newDeck[i], newDeck[j]] = [newDeck[j], newDeck[i]];
    }
    // Re-assign indices after shuffle
    newDeck.forEach((card, i) => { card.index = i; });
    setDeck(newDeck);
  }, [cards]);

  useEffect(() => {
    initDeck();
  }, [initDeck]);

  // Timer
  useEffect(() => {
    if (phase !== 'playing') return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setPhase('gameover');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [phase]);

  const handleCardClick = (index: number) => {
    if (phase !== 'playing') return;
    const card = deck[index];
    if (card.flipped || card.matched || flipped.length >= 2) return;

    const newFlipped = [...flipped, index];
    setFlipped(newFlipped);
    setDeck(prev => prev.map((c, i) => i === index ? { ...c, flipped: true } : c));

    if (newFlipped.length === 2) {
      setMoves(prev => prev + 1);
      const [first, second] = newFlipped;
      const card1 = deck[first];
      const card2 = deck[second];

      if (card1.pairId === card2.pairId) {
        // Match!
        const timeBonus = Math.floor(timeLeft / 10);
        const streakBonus = streak * 15;
        const points = 100 + timeBonus + streakBonus;
        setScore(prev => prev + points);
        setMatches(prev => prev + 1);
        const newStreak = streak + 1;
        setStreak(newStreak);
        setBestStreak(prev => Math.max(prev, newStreak));

        setTimeout(() => {
          setDeck(prev => prev.map((c, i) =>
            (i === first || i === second) ? { ...c, matched: true } : c
          ));
          setFlipped([]);
          if (matches + 1 >= deck.length / 2) {
            setPhase('gameover');
          }
        }, 500);
      } else {
        // No match
        setStreak(0);
        setShakeCard(second);
        setTimeout(() => setShakeCard(null), 500);
        setTimeout(() => {
          setDeck(prev => prev.map((c, i) =>
            (i === first || i === second) ? { ...c, flipped: false } : c
          ));
          setFlipped([]);
        }, 1000);
      }
    }
  };

  const handleStart = () => {
    setPhase('playing');
    setTimeLeft(90);
  };

  const handleRestart = () => {
    setScore(0);
    setMatches(0);
    setMoves(0);
    setStreak(0);
    setBestStreak(0);
    setFlipped([]);
    setTimeLeft(90);
    setPhase('ready');
    initDeck();
  };

  const handleFinish = () => {
    const timeBonus = timeLeft * 2;
    onComplete(score + timeBonus, matches, timeBonus);
  };

  const totalPairs = deck.length / 2;
  const progress = totalPairs > 0 ? (matches / totalPairs) * 100 : 0;

  // Ready screen
  if (phase === 'ready') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] px-4">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-center">
          <div className="w-20 h-20 rounded-2xl bg-[#CE82FF] flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Brain className="w-10 h-10 text-white" />
          </div>
          <h2 className="font-display text-2xl font-bold g-title mb-1">Memory Match</h2>
          <p className="text-sm g-muted mb-4">Match coding terms with their definitions!</p>

          <div className="b-card p-4 mb-4 max-w-xs mx-auto text-left">
            <div className="flex items-center gap-2 mb-2">
              <Brain className="w-4 h-4 text-[#CE82FF]" />
              <span className="text-xs font-bold g-body">How to Play</span>
            </div>
            <ul className="text-xs g-body space-y-1">
              <li>- Flip cards to reveal terms and definitions</li>
              <li>- Match each term with its correct definition</li>
              <li>- Faster matches = more points</li>
              <li>- Build streaks for bonus points!</li>
            </ul>
          </div>

          <button onClick={handleStart} className="btn-3d px-8 py-3 text-base font-bold" style={{ backgroundColor: '#CE82FF', color: 'white', boxShadow: '0 4px 0 0 #A855C7' }}>
            <Brain className="w-5 h-5 inline mr-2" /> Start Matching
          </button>
        </motion.div>
      </div>
    );
  }

  // Game over screen
  if (phase === 'gameover') {
    const allMatched = matches >= totalPairs;
    const timeBonus = timeLeft * 2;
    const finalScore = score + timeBonus;

    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] px-4">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-center">
          <div className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg" style={{ backgroundColor: allMatched ? '#58CC02' : '#FF9600' }}>
            <Trophy className="w-10 h-10 text-white" />
          </div>
          <h2 className="font-display text-2xl font-bold g-title mb-1">
            {allMatched ? 'Perfect Memory!' : 'Time\'s Up!'}
          </h2>
          <p className="text-sm g-muted mb-4">
            {matches} of {totalPairs} matches in {moves} moves
          </p>

          <div className="b-card p-4 mb-4 max-w-xs mx-auto grid grid-cols-2 gap-3 text-center">
            <div><p className="font-display text-2xl font-bold text-[#CE82FF]">{finalScore}</p><p className="text-[10px] g-muted">Score</p></div>
            <div><p className="font-display text-2xl font-bold text-[#58CC02]">{matches}/{totalPairs}</p><p className="text-[10px] g-muted">Matches</p></div>
            <div><p className="font-display text-2xl font-bold text-[#FF9600]">{bestStreak}</p><p className="text-[10px] g-muted">Best Streak</p></div>
            <div><p className="font-display text-2xl font-bold text-[#1CB0F6]">{moves}</p><p className="text-[10px] g-muted">Moves</p></div>
          </div>

          <div className="flex gap-3 justify-center">
            <button onClick={handleRestart} className="btn-3d btn-3d-blue px-6 py-3 text-sm flex items-center gap-2"><RotateCcw className="w-4 h-4" /> Play Again</button>
            <button onClick={handleFinish} className="btn-3d btn-3d-green px-6 py-3 text-sm flex items-center gap-2">Continue <ArrowRight className="w-4 h-4" /></button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex-shrink-0 mb-3">
        <div className="flex items-center justify-between mb-2">
          <button onClick={onExit} className="text-xs g-muted font-medium">Exit</button>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1"><Zap className="w-4 h-4 text-[#FFC800]" /><span className="text-sm font-bold text-[#FFC800]">{score}</span></div>
            {streak > 1 && <div className="flex items-center gap-1 px-2 py-0.5 bg-[#FF9600]/8 rounded-full border border-[#FF9600]/25"><Flame className="w-3 h-3 text-[#FF9600]" /><span className="text-[10px] font-bold text-[#FF9600]">{streak}x</span></div>}
            <div className={`flex items-center gap-1 ${timeLeft <= 15 ? 'text-red-500' : 'g-muted'}`}><Timer className="w-4 h-4" /><span className="text-sm font-bold">{timeLeft}s</span></div>
          </div>
        </div>
        <div className="h-2 g-track rounded-full overflow-hidden">
          <motion.div className="h-full bg-[#CE82FF] rounded-full" animate={{ width: `${progress}%` }} />
        </div>
      </div>

      {/* Game Grid */}
      <div className="flex-1 grid grid-cols-4 gap-2">
        {deck.map((card) => (
          <motion.button
            key={card.index}
            whileTap={!card.flipped && !card.matched ? { scale: 0.95 } : {}}
            onClick={() => handleCardClick(card.index)}
            className={`relative rounded-2xl transition-all duration-300 ${
              card.matched ? 'opacity-60' : ''
            } ${shakeCard === card.index ? 'animate-shake' : ''}`}
            style={{ perspective: '1000px' }}
          >
            <motion.div
              className={`w-full h-full rounded-2xl flex items-center justify-center p-2 border-2 ${
               card.matched
  ? 'bg-green-100 dark:bg-green-900 border-green-300'
  : card.flipped
  ? 'bg-[var(--surface)] border-[#CE82FF]/40'
  : 'bg-[#CE82FF] border-[#A855C7]'
              }`}
              style={{ boxShadow: card.flipped || card.matched ? '0 2px 0 0 rgba(0,0,0,0.04)' : '0 4px 0 0 #A855C7' }}
              animate={{ rotateY: card.flipped || card.matched ? 0 : 180 }}
              transition={{ duration: 0.3 }}
            >
              {card.flipped || card.matched ? (
                <div className="text-center">
                  <p className="text-[9px] font-bold g-muted uppercase mb-0.5">{card.type}</p>
                  <p className="text-[10px] font-medium g-body leading-tight line-clamp-3">{card.content}</p>
                </div>
              ) : (
                <Star className="w-6 h-6 text-white" />
              )}
            </motion.div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
