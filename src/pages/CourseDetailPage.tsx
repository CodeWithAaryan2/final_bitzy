import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, Layers, ChevronRight, CheckCircle, Play, Zap } from 'lucide-react';
import { getCourseBySlug, getCourseNumericId } from '@/data/courses';
import { useGame } from '@/context/GameContext';

export default function CourseDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const course = getCourseBySlug(slug || '');
  const { gameState, hasCompletedLesson } = useGame();

  if (!course) {
    return (
      <div className="p-8 text-center">
        <p style={{ color: 'var(--text-muted)' }}>Course not found.</p>
      </div>
    );
  }

  const cp = gameState.courseProgress.find(p => String(p.course_id) === String(getCourseNumericId(course.id)));
  const totalLessons = course.modules.reduce((sum, m) => sum + m.lessons.length, 0);
  const completedCount = cp?.completed_lessons?.length || 0;
  const overallProgress = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="h-32 rounded-3xl mb-6 relative overflow-hidden" style={{ background: `linear-gradient(135deg, ${course.color}40, ${course.color}15)` }}>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-6xl font-black" style={{ color: `${course.color}40` }}>{course.title[0]}</span>
          </div>
          <div className="absolute bottom-4 left-6">
            <span className="px-2 py-0.5 rounded-full text-xs font-bold" style={{ backgroundColor: 'rgba(0,0,0,0.3)', color: 'white' }}>{course.difficulty}</span>
          </div>
        </div>
        <h1 className="font-display text-2xl font-bold mb-2" style={{ color: 'var(--text)' }}>{course.title}</h1>
        <p className="text-sm mb-4" style={{ color: 'var(--text-muted)' }}>{course.longDescription}</p>
        <div className="flex items-center gap-4 text-xs flex-wrap" style={{ color: 'var(--text-muted)' }}>
          <span className="flex items-center gap-1"><BookOpen className="w-3.5 h-3.5" /> {totalLessons} lessons</span>
          <span className="flex items-center gap-1"><Layers className="w-3.5 h-3.5" /> {course.modules.length} modules</span>
          <span className="flex items-center gap-1"><Zap className="w-3.5 h-3.5" style={{ color: '#FFC800' }} /> {course.xpReward} XP</span>
          <span>Progress: {overallProgress}%</span>
        </div>
        <div className="d-progress mt-3 max-w-md h-2.5">
          <div className="d-progress-fill" style={{ width: `${overallProgress}%`, backgroundColor: course.color }} />
        </div>
        {overallProgress === 100 && (
          <div className="mt-4 flex items-center gap-3 p-4 rounded-2xl" style={{ background: 'linear-gradient(135deg, #58CC0220, #58CC0208)', border: '2px solid #58CC0240' }}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#58CC02' }}>
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="font-bold" style={{ color: '#58CC02' }}>Course Completed! 🎉</p>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>All {totalLessons} lessons done · {course.xpReward} XP earned</p>
            </div>
          </div>
        )}
      </motion.div>

      <div className="space-y-6">
        {(course.modules || []).map((module, mi) => (
          <motion.div key={module.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: mi * 0.1 }}
            className="d-card overflow-hidden p-0">
            <div className="p-5 border-b" style={{ borderColor: 'var(--border)' }}>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center text-sm font-bold" style={{ backgroundColor: course.color + '18', color: course.color }}>{mi + 1}</div>
                <div>
                  <h3 className="font-bold" style={{ color: 'var(--text)' }}>{module.title}</h3>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{module.description}</p>
                </div>
                {module.isBossModule && (
                  <span className="ml-auto px-2 py-0.5 rounded-full text-xs font-bold" style={{ backgroundColor: '#FFE8E8', color: '#FF4B4B' }}>Boss</span>
                )}
              </div>
            </div>
            <div>
              {(module.lessons || []).map((lesson) => {
                const isCompleted = hasCompletedLesson(getCourseNumericId(course.id), lesson.id);
                return (
                  <button key={lesson.id}
                    onClick={() => navigate(`/app/courses/${course.slug}/${module.id}/${lesson.slug}`)}
                    className="w-full flex items-center gap-4 p-4 text-left transition-all hover:bg-[var(--surface)]"
                    style={{ borderBottom: `1px solid var(--border)`, opacity: isCompleted ? 0.85 : 1 }}>
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: isCompleted ? '#F0FFE5' : 'var(--surface)' }}>
                      {isCompleted ? (
                        <CheckCircle className="w-4 h-4" style={{ color: '#58CC02' }} />
                      ) : (
                        <Play className="w-3.5 h-3.5" style={{ color: 'var(--text-muted)' }} />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium ${isCompleted ? 'line-through' : ''}`} style={{ color: isCompleted ? '#58CC02' : 'var(--text)' }}>{lesson.title}</p>
                      <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{lesson.duration || '10 min'} &middot; {lesson.xpReward} XP</p>
                    </div>
                    <ChevronRight className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--text-muted)' }} />
                  </button>
                );
              })}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
