import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, ArrowRight, RotateCcw, Trophy } from 'lucide-react';
import { useState, useEffect } from 'react';
import { getQuizById } from '@/data/quizzes';
import { useGame } from '@/context/GameContext';

export default function QuizPage() {
  const { quizId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const quiz = getQuizById(quizId || '');
  const courseId = searchParams.get('courseId') || '';
  const { completeQuiz } = useGame();

  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(quiz?.timeLimit || null);

  useEffect(() => {
    if (!timeLeft || showResult) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev === null || prev <= 1) {
          clearInterval(timer);
          handleFinish(answers);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft, showResult, answers]);

  if (!quiz) {
    return <div className="p-8 text-center" style={{ color: 'var(--text-muted)' }}>Quiz not found.</div>;
  }

  const question = quiz.questions[currentQ];
  const progress = ((currentQ + 1) / quiz.questions.length) * 100;

  const handleSelect = (index: number) => {
    if (submitted) return;
    setSelected(index);
  };

  const handleSubmit = () => {
    if (selected === null) return;
    setSubmitted(true);
    const newAnswers = [...answers, selected];
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQ < quiz.questions.length - 1) {
      setCurrentQ(prev => prev + 1);
      setSelected(null);
      setSubmitted(false);
    } else {
      handleFinish(answers);
    }
  };

  const handleFinish = (finalAnswers: number[]) => {
    let correct = 0;
    finalAnswers.forEach((ans, i) => {
      if (ans === quiz.questions[i].correctAnswer) correct++;
    });
    const pct = Math.round((correct / quiz.questions.length) * 100);
    setScore(pct);
    setShowResult(true);
    completeQuiz(parseInt(courseId) || 0, quiz.id, pct);
  };

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;

  if (showResult) {
    const passed = score >= quiz.passingScore;
    return (
      <div className="p-6 lg:p-8 max-w-2xl mx-auto">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="d-card p-8 text-center">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', bounce: 0.5 }}
            className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #58CC02, #89E219)' }}>
            <Trophy className="w-10 h-10 text-white" />
          </motion.div>
          <h2 className="font-display text-2xl font-bold mb-2" style={{ color: 'var(--text)' }}>{passed ? 'Quiz Complete!' : 'Quiz Finished'}</h2>
          <div className="font-display text-5xl font-black mb-2" style={{ color: '#58CC02' }}>{score}%</div>
          <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>
            {passed ? 'Great job! You passed the quiz.' : 'Keep practicing! You\'ll get there.'}
          </p>
          <div className="grid grid-cols-3 gap-4 mb-6 max-w-sm mx-auto">
            <div className="rounded-xl p-3" style={{ backgroundColor: '#F0FFE5' }}>
              <p className="font-display text-lg font-bold" style={{ color: '#58CC02' }}>{Math.round(score / 100 * quiz.questions.length)}</p>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Correct</p>
            </div>
            <div className="rounded-xl p-3" style={{ backgroundColor: '#FFE8E8' }}>
              <p className="font-display text-lg font-bold" style={{ color: '#FF4B4B' }}>{quiz.questions.length - Math.round(score / 100 * quiz.questions.length)}</p>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Wrong</p>
            </div>
            <div className="rounded-xl p-3" style={{ backgroundColor: '#FFF8E0' }}>
              <p className="font-display text-lg font-bold" style={{ color: '#FF9600' }}>+{score >= 100 ? quiz.xpReward * 2 : Math.round(quiz.xpReward * (score / 100))}</p>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>XP Earned</p>
            </div>
          </div>
          <div className="flex items-center justify-center gap-3">
            <button onClick={() => navigate(`/app/courses`)} className="d-btn d-btn-md d-btn-ghost">
              Back to Courses
            </button>
            <button onClick={() => { setCurrentQ(0); setSelected(null); setAnswers([]); setShowResult(false); setSubmitted(false); setScore(0); setTimeLeft(quiz.timeLimit ?? null); }}
              className="d-btn d-btn-md d-btn-green">
              <RotateCcw className="w-4 h-4" /> Retake
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 max-w-3xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h1 className="font-display text-xl font-bold" style={{ color: 'var(--text)' }}>{quiz.title}</h1>
          {timeLeft !== null && (
            <div className="text-sm font-mono font-bold" style={{ color: timeLeft < 60 ? '#FF4B4B' : 'var(--text-muted)' }}>
              {formatTime(timeLeft)}
            </div>
          )}
        </div>
        <div className="d-progress h-2">
          <motion.div className="d-progress-fill" style={{ width: `${progress}%` }} />
        </div>
        <p className="text-xs mt-2" style={{ color: 'var(--text-muted)' }}>Question {currentQ + 1} of {quiz.questions.length}</p>
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={currentQ} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
          className="d-card p-6">
          <p className="text-lg font-medium mb-6" style={{ color: 'var(--text)' }}>{question.question}</p>
          <div className="space-y-3">
            {question.options?.map((option, i) => {
              const isSelected = selected === i;
              const isCorrect = submitted && i === question.correctAnswer;
              const isWrong = submitted && isSelected && i !== question.correctAnswer;
              return (
                <button key={i} onClick={() => handleSelect(i)} disabled={submitted}
                  className="w-full flex items-center gap-3 p-4 rounded-2xl border-2 text-left transition-all"
                  style={{
                    borderColor: isCorrect ? '#58CC0260' : isWrong ? '#FF4B4B60' : isSelected ? '#1CB0F660' : 'var(--border)',
                    backgroundColor: isCorrect ? '#F0FFE5' : isWrong ? '#FFE8E8' : isSelected ? '#E5F6FF' : 'var(--white)',
                  }}>
                  <div className="w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 text-xs font-bold"
                    style={{
                      borderColor: isCorrect ? '#58CC02' : isWrong ? '#FF4B4B' : isSelected ? '#1CB0F6' : 'var(--border)',
                      color: isCorrect ? '#58CC02' : isWrong ? '#FF4B4B' : isSelected ? '#1CB0F6' : 'var(--text-muted)',
                    }}>
                    {isCorrect ? <CheckCircle className="w-4 h-4" /> : isWrong ? <XCircle className="w-4 h-4" /> : String.fromCharCode(65 + i)}
                  </div>
                  <span className="text-sm" style={{ color: isCorrect ? '#58CC02' : isWrong ? '#FF4B4B' : 'var(--text)' }}>{option}</span>
                </button>
              );
            })}
          </div>

          {submitted && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-4 rounded-2xl" style={{ backgroundColor: '#E5F6FF', border: '2px solid #B8E8FD' }}>
              <p className="text-sm" style={{ color: '#1CB0F6' }}>{question.explanation}</p>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>

      <div className="flex justify-end mt-6">
        {!submitted ? (
          <button onClick={handleSubmit} disabled={selected === null}
            className="d-btn d-btn-md d-btn-green disabled:opacity-30">
            Submit Answer
          </button>
        ) : (
          <button onClick={handleNext} className="d-btn d-btn-md d-btn-blue flex items-center gap-2">
            {currentQ < quiz.questions.length - 1 ? 'Next Question' : 'See Results'}
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
