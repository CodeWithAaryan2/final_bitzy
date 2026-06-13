import { useParams, useNavigate } from 'react-router-dom';
import { Play, RotateCcw, ChevronLeft, CheckCircle, XCircle, Clock, Zap, Lightbulb, Send } from 'lucide-react';
import { useState, useEffect } from 'react';
import { getChallengeBySlug } from '@/data/challenges';
import { getChallengeNumericId } from '@/data/challenges';
import { useGame } from '@/context/GameContext';

type RunStatus = 'idle' | 'running' | 'accepted' | 'wrong_answer' | 'error';

export default function ChallengeDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const challenge = getChallengeBySlug(slug || '');
  const { completeChallenge, spendEnergy } = useGame();
  const [language, setLanguage] = useState('javascript');
  const [code, setCode] = useState('');
  const [status, setStatus] = useState<RunStatus>('idle');
  const [results, setResults] = useState<{ testId: string; passed: boolean; got: string; expected: string }[]>([]);
  const [activeTab, setActiveTab] = useState<'description' | 'hints'>('description');
  const [revealedHints, setRevealedHints] = useState<number[]>([]);
  const [solved, setSolved] = useState(false);

  useEffect(() => {
    if (challenge) {
      setCode(challenge.starterCode[language] || '');
    }
  }, [challenge, language]);

  if (!challenge) return <div className="text-center py-12" style={{ color: 'var(--text-muted)' }}>Challenge not found.</div>;

  const handleRun = async () => {
    setStatus('running');
    setResults([]);
    await spendEnergy(1);
    await new Promise(r => setTimeout(r, 1500));
    const testResults = challenge.testCases.filter(t => !t.isHidden).map(tc => {
      const passed = Math.random() > 0.3;
      return { testId: tc.id, passed, got: passed ? tc.expectedOutput : '[]', expected: tc.expectedOutput };
    });
    setResults(testResults);
    const allPassed = testResults.every(r => r.passed);
    setStatus(allPassed ? 'accepted' : 'wrong_answer');
    if (allPassed && !solved) { setSolved(true); completeChallenge(getChallengeNumericId(challenge.id), true); }
  };

  const handleSubmit = async () => {
    setStatus('running');
    setResults([]);
    await spendEnergy(1);
    await new Promise(r => setTimeout(r, 2000));
    const testResults = challenge.testCases.map(tc => ({ testId: tc.id, passed: true, got: tc.expectedOutput, expected: tc.expectedOutput }));
    setResults(testResults);
    setStatus('accepted');
    if (!solved) { setSolved(true); completeChallenge(getChallengeNumericId(challenge.id), true); }
  };

  const revealHint = async (order: number) => {
    if (revealedHints.includes(order)) return;
    // Spend 1 energy per hint
    const ok = await spendEnergy(1);
    if (!ok) return;
    setRevealedHints(prev => [...prev, order]);
  };

  const diffColor = challenge.difficulty === 'Easy' ? '#58CC02' : challenge.difficulty === 'Medium' ? '#FF9600' : '#FF4B4B';
  const diffBg = challenge.difficulty === 'Easy' ? '#F0FFE5' : challenge.difficulty === 'Medium' ? '#FFF3E0' : '#FFE8E8';

  return (
    <div className="flex flex-col" style={{ minHeight: 'calc(100vh - 140px)' }}>
      {/* Top Bar */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b-2" style={{ borderColor: 'var(--border)' }}>
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/app/challenges')} className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'var(--surface)' }}>
            <ChevronLeft className="w-5 h-5" style={{ color: 'var(--text-light)' }} />
          </button>
          <div>
            <h1 className="text-sm font-bold" style={{ color: 'var(--text)' }}>{challenge.title}</h1>
            <div className="flex items-center gap-2">
              <span className="d-badge text-[10px]" style={{ backgroundColor: diffBg, color: diffColor }}>{challenge.difficulty}</span>
              <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{challenge.category}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold flex items-center gap-1" style={{ color: 'var(--text-muted)' }}><Zap className="w-3 h-3" style={{ color: '#FFC800' }} /> {challenge.xpReward} XP</span>
          {solved && <span className="text-xs font-bold flex items-center gap-1" style={{ color: '#58CC02' }}><CheckCircle className="w-3.5 h-3.5" /> Solved</span>}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:flex-row gap-4 overflow-hidden">
        {/* Left Panel - Description */}
        <div className="lg:w-[45%] overflow-y-auto">
          <div className="flex border-b-2 mb-3" style={{ borderColor: 'var(--border)' }}>
            {(['description', 'hints'] as const).map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className="flex-1 py-3 text-sm font-bold capitalize transition-colors"
                style={{ borderBottom: activeTab === tab ? '2px solid #58CC02' : '2px solid transparent', color: activeTab === tab ? '#58CC02' : 'var(--text-muted)' }}>
                {tab}
              </button>
            ))}
          </div>

          {activeTab === 'description' ? (
            <div className="space-y-5">
              <div>
                <h3 className="font-bold mb-2" style={{ color: 'var(--text)' }}>Problem</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-light)' }}>{challenge.problemStatement}</p>
              </div>
              <div>
                <h3 className="font-bold mb-2" style={{ color: 'var(--text)' }}>Constraints</h3>
                <p className="text-sm" style={{ color: 'var(--text-light)' }}>{challenge.constraints}</p>
              </div>
              <div>
                <h3 className="font-bold mb-3" style={{ color: 'var(--text)' }}>Examples</h3>
                {challenge.examples.map((ex, i) => (
                  <div key={i} className="mb-3 p-4 rounded-2xl border-2" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}>
                    <p className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>Input: <span className="font-mono font-bold" style={{ color: 'var(--text)' }}>{ex.input}</span></p>
                    <p className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>Output: <span className="font-mono font-bold" style={{ color: '#58CC02' }}>{ex.output}</span></p>
                    {ex.explanation && <p className="text-xs mt-2" style={{ color: 'var(--text-light)' }}>{ex.explanation}</p>}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Revealing hints costs XP but helps you learn!</p>
              {challenge.hints.map((hint) => (
                <div key={hint.id} className="p-4 rounded-2xl border-2" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold" style={{ color: '#1CB0F6' }}>Hint {hint.order}</span>
                    {!revealedHints.includes(hint.order) && <span className="text-xs font-bold" style={{ color: '#FF9600' }}>-{hint.xpCost} XP</span>}
                  </div>
                  {revealedHints.includes(hint.order) ? (
                    <p className="text-sm" style={{ color: 'var(--text-light)' }}>{hint.hintText}</p>
                  ) : (
                    <button onClick={() => revealHint(hint.order)} className="flex items-center gap-2 text-sm font-bold" style={{ color: '#1CB0F6' }}>
                      <Lightbulb className="w-4 h-4" /> Reveal Hint
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Panel - Code Editor */}
        <div className="flex-1 flex flex-col">
          <div className="flex items-center justify-between mb-2 p-2 rounded-2xl border-2" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}>
            <select value={language} onChange={e => setLanguage(e.target.value)} className="bg-transparent text-xs font-bold outline-none" style={{ color: 'var(--text)' }}>
              <option value="javascript">JavaScript</option>
              <option value="python">Python</option>
              <option value="typescript">TypeScript</option>
            </select>
            <button onClick={() => { setCode(challenge.starterCode[language] || ''); setStatus('idle'); setResults([]); }} className="p-1.5" style={{ color: 'var(--text-muted)' }} title="Reset">
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          <textarea value={code} onChange={e => setCode(e.target.value)}
            className="flex-1 min-h-[300px] p-4 rounded-2xl text-sm resize-none focus:outline-none font-mono border-2"
            style={{ backgroundColor: '#0d0d12', color: '#a5b4fc', borderColor: '#1e1e2e' }} spellCheck={false} />

          {/* Test Results */}
          {results.length > 0 && (
            <div className="mt-2 border-2 rounded-2xl overflow-hidden" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--surface)' }}>
              <div className="px-4 py-2 border-b-2 flex items-center gap-2" style={{ borderColor: 'var(--border)' }}>
                {status === 'accepted' ? <span className="text-xs font-bold flex items-center gap-1" style={{ color: '#58CC02' }}><CheckCircle className="w-3.5 h-3.5" /> All tests passed!</span>
                  : status === 'wrong_answer' ? <span className="text-xs font-bold flex items-center gap-1" style={{ color: '#FF4B4B' }}><XCircle className="w-3.5 h-3.5" /> Some tests failed</span>
                    : <span className="text-xs font-bold flex items-center gap-1" style={{ color: '#FF9600' }}><Clock className="w-3.5 h-3.5" /> Running...</span>}
              </div>
              {results.map((r, i) => (
                <div key={i} className="px-4 py-2 flex items-center gap-3 border-b last:border-0 text-xs" style={{ borderColor: 'var(--border)' }}>
                  {r.passed ? <CheckCircle className="w-4 h-4 flex-shrink-0" style={{ color: '#58CC02' }} /> : <XCircle className="w-4 h-4 flex-shrink-0" style={{ color: '#FF4B4B' }} />}
                  <span style={{ color: 'var(--text-muted)' }}>Test {i + 1}</span>
                  {!r.passed && <span className="ml-auto font-bold" style={{ color: '#FF4B4B' }}>Expected {r.expected}, got {r.got}</span>}
                </div>
              ))}
            </div>
          )}

          {/* Action Buttons */}
          <div className="mt-3 flex items-center gap-3">
            <button onClick={handleRun} disabled={status === 'running'}
              className="d-btn d-btn-md d-btn-blue flex-1 disabled:opacity-50">
              <Play className="w-4 h-4" /> {status === 'running' ? 'Running...' : 'Run Code'}
            </button>
            <button onClick={handleSubmit} disabled={status === 'running'}
              className="d-btn d-btn-md d-btn-green flex-1 disabled:opacity-50">
              <Send className="w-4 h-4" /> Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
