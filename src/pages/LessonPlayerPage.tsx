import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, ArrowLeft, ArrowRight, Zap, HelpCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { getLessonBySlug, getAdjacentLesson, getCourseBySlug, getCourseNumericId } from '@/data/courses';
import { getQuizByLessonId } from '@/data/quizzes';
import { useGame } from '@/context/GameContext';
import { useAuth } from '@/context/AuthContext';

export default function LessonPlayerPage() {
  const { courseSlug, lessonSlug } = useParams();
  const navigate = useNavigate();
  const { completeLesson, hasCompletedLesson, spendEnergy } = useGame();
  const { refreshProfile } = useAuth();
  const [completed, setCompleted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // BUG FIX #2: Reset completed state when navigating to a different lesson
  useEffect(() => {
    setCompleted(false);
    setSubmitting(false);
  }, [lessonSlug]);

  const result = getLessonBySlug(courseSlug || '', lessonSlug || '');
  const course = getCourseBySlug(courseSlug || '');
  const quiz = result ? getQuizByLessonId(result.lesson.id) : null;

  if (!result || !course) {
    return (
      <div className="text-center py-12">
        <p style={{ color: 'var(--text-muted)' }}>Lesson not found.</p>
      </div>
    );
  }

  const { lesson, module } = result;
  const isCompleted = hasCompletedLesson(getCourseNumericId(course.id), lesson.id);
  const prevLesson = getAdjacentLesson(courseSlug || '', lessonSlug || '', 'prev');
  const nextLesson = getAdjacentLesson(courseSlug || '', lessonSlug || '', 'next');

  const handleComplete = async () => {
    if (isCompleted || completed || submitting) return;
    setSubmitting(true);
    console.log('[Lesson] Starting completion for', course.id, lesson.id);

    try {
      // Energy is cosmetic — never blocks completion
      await spendEnergy(lesson.energyCost || 1);

      const totalLessons = course.modules.reduce((sum, m) => sum + m.lessons.length, 0);
      const numericCourseId = getCourseNumericId(course.id);
      console.log('[Lesson] Calling completeLesson with courseId=', numericCourseId, 'lessonId=', lesson.id, 'total=', totalLessons);

      await completeLesson(numericCourseId, lesson.id, totalLessons);
      await refreshProfile();

      console.log('[Lesson] Completion finished');
      setCompleted(true);
    } catch (e) {
      console.error('[Lesson] handleComplete error:', e);
      // Still mark as completed locally so the UI doesn't get stuck
      setCompleted(true);
    } finally {
      setSubmitting(false);
    }
  };

  const handleTakeQuiz = () => {
    if (quiz) {
      navigate(`/app/quiz/${quiz.id}?courseId=${getCourseNumericId(course.id)}`);
    }
  };

  const goToLesson = (target: { lesson: { slug?: string }; module: { id: string } } | undefined) => {
    if (!target) return;
    navigate(`/app/courses/${courseSlug}/${target.module.id}/${target.lesson.slug}`);
  };

  const renderContent = (content: string) => {
    const parts = content.split(/(```[\s\S]*?```)/g);
    return parts.map((part, i) => {
      if (part.startsWith('```')) {
        const match = part.match(/```(\w+)?\n([\s\S]*?)```/);
        if (match) {
          const [, lang, code] = match;
          return (
            <div key={i} className="my-4 rounded-2xl overflow-hidden border-2" style={{ borderColor: 'var(--border)' }}>
              {lang && (
                <div className="px-4 py-2 text-xs font-bold flex items-center gap-2" style={{ backgroundColor: 'var(--surface)', color: 'var(--text-muted)' }}>
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-400/60" />
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-400/60" />
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-400/60" />
                  </div>
                  {lang}
                </div>
              )}
              <pre className="p-4 overflow-x-auto" style={{ backgroundColor: '#0d0d12' }}>
                <code className="text-sm font-mono" style={{ color: '#a5b4fc' }}>{code.trim()}</code>
              </pre>
            </div>
          );
        }
      }
      return (
        <div key={i} className="max-w-none">
          {part.split('\n').map((line, li) => {
            if (line.startsWith('## ')) return <h2 key={li} className="font-display text-lg font-bold mt-6 mb-3" style={{ color: 'var(--text)' }}>{line.slice(3)}</h2>;
            if (line.startsWith('### ')) return <h3 key={li} className="font-bold mt-4 mb-2" style={{ color: 'var(--text)' }}>{line.slice(4)}</h3>;
            if (line.startsWith('- ')) return <li key={li} className="ml-4 text-sm" style={{ color: 'var(--text-light)' }}>{line.slice(2)}</li>;
            if (line.startsWith('**') && line.endsWith('**')) return <p key={li} className="text-sm font-bold my-2" style={{ color: 'var(--text)' }}>{line.slice(2, -2)}</p>;
            if (line.startsWith('1. ') || line.startsWith('2. ') || line.startsWith('3. ')) return <li key={li} className="ml-4 text-sm list-decimal" style={{ color: 'var(--text-light)' }}>{line.slice(3)}</li>;
            if (line.trim() === '') return <div key={li} className="h-2" />;
            if (line.startsWith('`') && line.endsWith('`')) {
              return <p key={li} className="text-sm my-1"><code className="px-2 py-0.5 rounded-lg text-xs font-mono" style={{ backgroundColor: 'var(--surface)', color: '#58CC02' }}>{line.slice(1, -1)}</code></p>;
            }
            return <p key={li} className="text-sm leading-relaxed my-1" style={{ color: 'var(--text-light)' }}>{line}</p>;
          })}
        </div>
      );
    });
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="sticky top-0 z-20 border-b-2 py-3 mb-6 -mx-4 lg:-mx-8 px-4 lg:px-8" style={{ backgroundColor: 'var(--bg)', borderColor: 'var(--border)' }}>
        <div className="flex items-center justify-between">
          <button onClick={() => navigate(`/app/courses/${courseSlug}`)} className="flex items-center gap-2 text-sm font-bold transition-colors" style={{ color: 'var(--text-muted)' }}>
            <ArrowLeft className="w-4 h-4" />
            <span className="truncate max-w-[150px]">{course.title}</span>
          </button>
          <div className="flex items-center gap-2">
            {isCompleted || completed ? (
              <span className="flex items-center gap-1 text-xs font-bold" style={{ color: '#58CC02' }}>
                <CheckCircle className="w-3.5 h-3.5" /> Completed
              </span>
            ) : (
              <span className="flex items-center gap-1 text-xs font-bold" style={{ color: 'var(--text-muted)' }}>
                <Zap className="w-3.5 h-3.5" /> {lesson.energyCost || 1} energy
              </span>
            )}
          </div>
        </div>
      </div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="mb-6">
          <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>{module.title}</span>
          <h1 className="font-display text-2xl font-bold mt-1" style={{ color: 'var(--text)' }}>{lesson.title}</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>{lesson.description}</p>
        </div>

        <div className="d-card p-5 mb-6">
          {renderContent(lesson.content || `# ${lesson.title}\n\n${lesson.description}\n\nRead through the material and complete the exercises.`)}
        </div>

        {(lesson.codeExamples || []).map((example, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + i * 0.1 }} className="d-card p-5 mb-4">
            <p className="text-xs font-bold mb-3" style={{ color: 'var(--text-muted)' }}>{example.explanation}</p>
            <div className="rounded-2xl overflow-hidden border-2" style={{ borderColor: 'var(--border)' }}>
              <div className="px-4 py-2 text-xs font-bold flex items-center gap-2" style={{ backgroundColor: 'var(--surface)', color: 'var(--text-muted)' }}>
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-400/60" />
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-400/60" />
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400/60" />
                </div>
                {example.language}
              </div>
              <pre className="p-4 overflow-x-auto" style={{ backgroundColor: '#0d0d12' }}>
                <code className="text-sm font-mono whitespace-pre" style={{ color: '#a5b4fc' }}>{example.code}</code>
              </pre>
            </div>
          </motion.div>
        ))}

        {/* BUG FIX: Proper action buttons */}
        <div className="flex items-center justify-between pt-4 border-t-2" style={{ borderColor: 'var(--border)' }}>
          <button
            onClick={() => goToLesson(prevLesson)}
            disabled={!prevLesson}
            className="d-btn d-btn-sm d-btn-ghost disabled:opacity-30"
          >
            <ArrowLeft className="w-4 h-4" /> Previous
          </button>

          <div className="flex items-center gap-3">
            {/* Show Mark Complete if not completed */}
            {!isCompleted && !completed && (
              <button onClick={handleComplete} disabled={submitting}
                className="d-btn d-btn-md d-btn-green disabled:opacity-50">
                {submitting ? 'Completing...' : <><CheckCircle className="w-4 h-4" /> Mark Complete</>}
              </button>
            )}
            {/* Show Completed badge */}
            {(isCompleted || completed) && (
              <span className="flex items-center gap-1 text-sm font-bold px-3 py-2 rounded-xl" style={{ backgroundColor: '#F0FFE5', color: '#58CC02' }}>
                <CheckCircle className="w-4 h-4" /> Done!
              </span>
            )}
            {/* Show Quiz button if completed and quiz exists */}
            {(isCompleted || completed) && quiz && (
              <button onClick={handleTakeQuiz} className="d-btn d-btn-md d-btn-orange">
                <HelpCircle className="w-4 h-4" /> Take Quiz
              </button>
            )}
          </div>

          <button
            onClick={() => goToLesson(nextLesson)}
            disabled={!nextLesson}
            className="d-btn d-btn-sm d-btn-ghost disabled:opacity-30"
          >
            Next <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    </div>
  );
}
