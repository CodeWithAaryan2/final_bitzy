import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, Star, CheckCircle2, BookOpen } from 'lucide-react';
import { useGame } from '@/context/GameContext';
import { courses, getCourseNumericId } from '@/data/courses';
import { useState } from 'react';

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.08 } } };
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

interface PathNodeProps {
  status: 'locked' | 'current' | 'completed' | 'bonus';
  index: number;
  course: typeof courses[0];
  onClick: () => void;
}

function PathNode({ status, index, course, onClick }: PathNodeProps) {
  const isLeft = index % 2 === 0;

  const nodeConfig = {
    locked: {
      bg: 'var(--surface)',
      border: 'var(--border)',
      icon: <Lock className="w-5 h-5" style={{ color: 'var(--text-muted)' }} />,
      shadow: '0 4px 0 var(--border)',
      label: 'Locked',
      textColor: 'var(--text-muted)',
    },
    current: {
      bg: 'var(--white)',
      border: course.color,
      icon: <Star className="w-5 h-5" style={{ color: course.color }} />,
      shadow: `0 4px 0 ${course.color}80`,
      label: 'Start',
      textColor: 'var(--text)',
    },
    completed: {
      bg: course.color,
      border: course.color,
      icon: <CheckCircle2 className="w-5 h-5 text-white" />,
      shadow: `0 4px 0 ${course.color}`,
      label: 'Done',
      textColor: 'var(--white)',
    },
    bonus: {
      bg: '#CE82FF',
      border: '#CE82FF',
      icon: <Star className="w-5 h-5 text-white" />,
      shadow: '0 4px 0 #B563F5',
      label: 'Bonus',
      textColor: 'var(--white)',
    },
  };

  const config = nodeConfig[status];

  return (
    <motion.div variants={item} className={`flex items-center ${isLeft ? 'flex-row' : 'flex-row-reverse'} gap-4`}>
      <div className="flex-1 h-1 rounded-full relative" style={{ backgroundColor: 'var(--border)' }}>
        {status !== 'locked' && (
          <motion.div className="absolute inset-y-0 left-0 rounded-full" style={{ backgroundColor: course.color }}
            initial={{ width: 0 }} animate={{ width: '100%' }} transition={{ duration: 0.5, delay: index * 0.1 }} />
        )}
      </div>

      <motion.button whileHover={status !== 'locked' ? { scale: 1.08 } : {}} whileTap={status !== 'locked' ? { scale: 0.92 } : {}}
        onClick={status !== 'locked' ? onClick : undefined}
        className="relative w-16 h-16 rounded-2xl flex items-center justify-center border-2"
        style={{ backgroundColor: config.bg, borderColor: config.border, boxShadow: config.shadow, opacity: status === 'locked' ? 0.6 : 1 }}>
        {config.icon}
        {status === 'current' && (
          <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center" style={{ backgroundColor: '#FF4B4B' }}>
            <span className="text-[8px] font-bold text-white">!</span>
          </div>
        )}
      </motion.button>

      <div className={`flex-1 ${isLeft ? 'text-left' : 'text-right'}`}>
        <p className="text-sm font-bold" style={{ color: config.textColor }}>
          {status === 'bonus' ? 'Bonus Lesson' : `Lesson ${index + 1}`}
        </p>
        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{status === 'locked' ? 'Complete previous' : config.label}</p>
      </div>
    </motion.div>
  );
}

export default function CoursesPage() {
  const navigate = useNavigate();
  const { getCourseProgress } = useGame();
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-4">
      <motion.div variants={item}>
        <h1 className="font-display text-2xl font-bold">Learning Path</h1>
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Follow your coding adventure</p>
      </motion.div>

      <motion.div variants={item} className="flex gap-2 overflow-x-auto pb-1">
        {courses.map((course) => {
          const progress = getCourseProgress(getCourseNumericId(course.id)) || { completed_lessons: [], completed_quizzes: [], overall_progress: 0 };
          const isActive = selectedCourse === course.slug;
          return (
            <motion.button key={course.id} whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedCourse(isActive ? null : course.slug)}
              className="flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-2xl border-2 transition-all"
              style={{
                borderColor: isActive ? '#58CC02' : 'var(--border)',
                backgroundColor: isActive ? '#F0FFE5' : 'var(--white)',
              }}>
              <div className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-sm font-bold" style={{ backgroundColor: course.color }}>
                {course.title[0]}
              </div>
              <div className="text-left">
                <p className="text-xs font-bold whitespace-nowrap" style={{ color: 'var(--text)' }}>{course.title}</p>
                <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{(progress as any)?.overall_progress || 0}%</p>
              </div>
            </motion.button>
          );
        })}
      </motion.div>

      {courses.map((course) => {
        if (selectedCourse && selectedCourse !== course.slug) return null;
        const progress = getCourseProgress(getCourseNumericId(course.id)) || { completed_lessons: [], completed_quizzes: [], overall_progress: 0 };
        const completedCount = (progress as any)?.completed_lessons?.length || 0;
        const totalLessons = course.totalLessons;

        return (
          <motion.div key={course.id} variants={item} className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold" style={{ backgroundColor: course.color }}>
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-display text-lg font-bold" style={{ color: 'var(--text)' }}>{course.title}</h2>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{completedCount}/{totalLessons} lessons completed</p>
              </div>
            </div>

            <div className="relative pl-8 pr-4 space-y-6 py-4">
              {Array.from({ length: Math.min(6, totalLessons) }).map((_, i) => {
                let status: 'locked' | 'current' | 'completed' | 'bonus' = 'locked';
                if (i < completedCount) status = 'completed';
                else if (i === completedCount) status = 'current';
                else if (i === 3) status = 'bonus';

                return (
                  <PathNode key={i} index={i} status={status} course={course}
                    onClick={() => navigate(`/app/courses/${course.slug}`)} />
                );
              })}
            </div>
          </motion.div>
        );
      })}

      <div className="h-4" />
    </motion.div>
  );
}
