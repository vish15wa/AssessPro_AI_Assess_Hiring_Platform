
import React, { useState, useEffect, useRef } from 'react';
import { User, Job, Question, QuestionType, AssessmentResult, Application } from '../types';
import { MockDb } from '../services/mockDb';
import { evaluateSubjectiveAnswer } from '../services/geminiService';

interface AssessmentProps {
  user: User | null;
  jobId: string;
  onNavigate: (page: string, params?: any) => void;
}

const Assessment: React.FC<AssessmentProps> = ({ user, jobId, onNavigate }) => {
  const [job, setJob] = useState<Job | null>(null);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [codingLanguage, setCodingLanguage] = useState('javascript');
  const timerRef = useRef<any>(null);

  useEffect(() => {
    const jobData = MockDb.getJobById(jobId);
    if (jobData) {
      setJob(jobData);
      setTimeLeft((jobData.durationMinutes || 60) * 60);
    }
  }, [jobId]);

  useEffect(() => {
    if (timeLeft > 0 && !isSubmitting) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            handleSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [timeLeft, isSubmitting]);

  const handleSubmit = async () => {
    if (!job || !user) return;
    setIsSubmitting(true);
    
    let mcqScore = 0;
    let subjectiveScore = 0;
    let codingScore = 0;
    const evaluationNotes: Record<string, string> = {};

    for (const q of job.questions) {
      const ans = answers[q.id];
      if (!ans) continue;

      if (q.type === QuestionType.MCQ) {
        if (ans === q.correctAnswer) mcqScore += 1;
      } else if (q.type === QuestionType.SUBJECTIVE) {
        const res = await evaluateSubjectiveAnswer(q.text, ans, q.rubric || 'Accuracy and relevance.');
        subjectiveScore += res.score;
        evaluationNotes[q.id] = res.feedback;
      } else if (q.type === QuestionType.CODING) {
        codingScore += 5; // Placeholder for logic
        evaluationNotes[q.id] = "Manual review required for full credit.";
      }
    }

    const total = mcqScore + subjectiveScore + codingScore;
    const timeTaken = job.durationMinutes - Math.floor(timeLeft / 60);
    const attemptCount = Object.keys(answers).length;
    
    let suspicious = false;
    let suspiciousReason = "";
    if (attemptCount / job.questions.length > 0.8 && total / (job.questions.length) < 0.15) {
      suspicious = true;
      suspiciousReason = "Guess work detected: High attempt rate with very low accuracy (less than 15%).";
    }

    const result: AssessmentResult = {
      applicationId: '',
      jobId,
      studentId: user.id,
      scores: { mcq: mcqScore, subjective: subjectiveScore, coding: codingScore, total },
      answers,
      evaluationNotes,
      suspiciousFlag: suspicious,
      suspiciousReason,
      timeTakenMinutes: timeTaken,
      status: total >= job.threshold ? 'QUALIFIED' : 'DISQUALIFIED',
      submittedAt: new Date().toISOString()
    };

    const apps = MockDb.getApplications();
    const app = apps.find(a => a.jobId === jobId && a.studentId === user.id);
    if (app) {
      app.status = 'COMPLETED';
      app.result = { ...result, applicationId: app.id };
      MockDb.saveApplication(app);
    }

    setTimeout(() => onNavigate('dashboard'), 3000);
  };

  const currentQuestion = job?.questions[currentIdx];
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  if (!job) return <div className="p-20 text-center text-black">Loading assessment...</div>;
  if (isSubmitting) {
    return (
      <div className="fixed inset-0 bg-white z-50 flex flex-col items-center justify-center">
        <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-6"></div>
        <h2 className="text-2xl font-bold text-black">Submitting...</h2>
        <p className="text-slate-500 mt-2">AI is analyzing your performance and generating your profile report.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex justify-between items-center mb-8">
          <div>
            <h1 className="text-xl font-bold text-black">{job.title}</h1>
            <p className="text-sm text-slate-500">Question {currentIdx + 1} of {job.questions.length}</p>
          </div>
          <div className="flex items-center space-x-8">
            <div className="text-center">
              <p className="text-[10px] uppercase font-black text-slate-400">Time</p>
              <p className={`text-2xl font-mono font-bold ${timeLeft < 300 ? 'text-red-600' : 'text-black'}`}>{formatTime(timeLeft)}</p>
            </div>
            <button onClick={handleSubmit} className="bg-red-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-red-700">Finish Test</button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 sticky top-24">
              <h3 className="font-bold text-black mb-4">Jump to</h3>
              <div className="grid grid-cols-4 gap-2">
                {job.questions.map((q, idx) => (
                  <button
                    key={q.id}
                    onClick={() => setCurrentIdx(idx)}
                    className={`w-10 h-10 rounded-lg font-bold text-sm transition-all ${
                      currentIdx === idx ? 'bg-indigo-600 text-white scale-110' : 
                      answers[q.id] ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-400'
                    }`}
                  >
                    {idx + 1}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-3">
            <div className="bg-white p-10 rounded-3xl shadow-sm border border-slate-200 min-h-[500px] flex flex-col">
              <div className="mb-6 flex justify-between items-start">
                <span className="bg-indigo-50 text-indigo-600 text-xs font-black px-3 py-1 rounded-full uppercase tracking-widest">
                  {currentQuestion?.type}
                </span>
                <span className="text-slate-400 font-bold text-xs">{currentQuestion?.marks} Marks</span>
              </div>

              <h2 className="text-2xl font-bold text-black mb-10 leading-relaxed">{currentQuestion?.text}</h2>

              <div className="flex-grow">
                {currentQuestion?.type === QuestionType.MCQ && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {currentQuestion.options?.map((opt, i) => (
                      <button
                        key={i}
                        onClick={() => setAnswers({...answers, [currentQuestion.id]: opt})}
                        className={`text-left p-6 rounded-2xl border-2 transition-all flex items-center group ${
                          answers[currentQuestion.id] === opt 
                          ? 'border-indigo-600 bg-indigo-50 text-indigo-700' 
                          : 'border-slate-100 hover:border-indigo-200 bg-white text-black'
                        }`}
                      >
                        <span className={`w-10 h-10 rounded-full flex items-center justify-center mr-4 text-xs font-bold ${
                          answers[currentQuestion.id] === opt ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-400'
                        }`}>
                          {String.fromCharCode(65 + i)}
                        </span>
                        {opt}
                      </button>
                    ))}
                  </div>
                )}

                {currentQuestion?.type === QuestionType.SUBJECTIVE && (
                  <textarea
                    className="w-full h-64 p-6 rounded-2xl border-2 border-slate-100 bg-white text-black focus:border-indigo-500 outline-none text-lg"
                    placeholder="Type your explanation..."
                    value={answers[currentQuestion.id] || ''}
                    onChange={e => setAnswers({...answers, [currentQuestion.id]: e.target.value})}
                  />
                )}

                {currentQuestion?.type === QuestionType.CODING && (
                  <div className="flex flex-col h-full space-y-4">
                    <div className="flex justify-between items-center">
                      <select 
                        className="bg-white border border-slate-200 px-4 py-2 rounded-lg text-sm font-bold text-black outline-none"
                        value={codingLanguage}
                        onChange={e => setCodingLanguage(e.target.value)}
                      >
                        <option value="javascript">JavaScript</option>
                        <option value="python">Python</option>
                        <option value="cpp">C++</option>
                      </select>
                      <button 
                        className="bg-slate-800 text-white px-5 py-2 rounded-lg text-sm font-bold flex items-center hover:bg-black"
                        onClick={() => alert("Tests running...")}
                      >
                        <i className="fas fa-play mr-2 text-green-400"></i> Run & Test
                      </button>
                    </div>
                    <textarea
                      className="w-full flex-grow p-6 rounded-2xl bg-white border-2 border-slate-100 text-black font-mono text-base outline-none focus:ring-2 focus:ring-indigo-500"
                      spellCheck={false}
                      placeholder={`// Write your solution here...`}
                      value={answers[currentQuestion.id] || ''}
                      onChange={e => setAnswers({...answers, [currentQuestion.id]: e.target.value})}
                    />
                  </div>
                )}
              </div>

              <div className="mt-12 flex justify-between">
                <button
                  disabled={currentIdx === 0}
                  onClick={() => setCurrentIdx(prev => prev - 1)}
                  className="px-8 py-3 rounded-xl border-2 border-slate-100 bg-white text-black font-bold disabled:opacity-30"
                >
                  <i className="fas fa-chevron-left mr-2"></i> Previous
                </button>
                <button
                  onClick={() => currentIdx === job.questions.length - 1 ? handleSubmit() : setCurrentIdx(prev => prev + 1)}
                  className="px-10 py-3 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-100"
                >
                  {currentIdx === job.questions.length - 1 ? 'Submit Test' : 'Next Question'} <i className="fas fa-chevron-right ml-2"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Assessment;
