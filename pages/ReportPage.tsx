
import React, { useState, useEffect } from 'react';
import { User, Application, Job, UserRole, QuestionType } from '../types';
import { MockDb } from '../services/mockDb';

interface ReportPageProps {
  user: User | null;
  appId: string;
  onNavigate: (page: string) => void;
}

const ReportPage: React.FC<ReportPageProps> = ({ user, appId, onNavigate }) => {
  const [app, setApp] = useState<Application | null>(null);
  const [job, setJob] = useState<Job | null>(null);

  useEffect(() => {
    const application = MockDb.getApplications().find(a => a.id === appId);
    if (application) {
      setApp(application);
      setJob(MockDb.getJobById(application.jobId) || null);
    }
  }, [appId]);

  if (!app || !job) return <div className="p-20 text-center text-black">Loading report...</div>;

  const result = app.result;
  if (!result) return <div className="p-20 text-center text-black">No evaluation data found.</div>;

  const totalMax = job.questions.reduce((acc, q) => {
    if (q.type === QuestionType.MCQ) return acc + 1;
    if (q.type === QuestionType.SUBJECTIVE) return acc + 3;
    if (q.type === QuestionType.CODING) return acc + 5;
    return acc;
  }, 0);

  return (
    <div className="max-w-5xl mx-auto py-12 px-4 print:bg-white print:p-0">
      <div className="mb-8 flex justify-between items-center print:hidden">
        <button onClick={() => onNavigate('dashboard')} className="font-bold text-slate-400 hover:text-black">
          <i className="fas fa-arrow-left mr-2"></i> Back
        </button>
        <button onClick={() => window.print()} className="bg-indigo-600 text-white px-6 py-2 rounded-xl font-bold">
          <i className="fas fa-file-pdf mr-2"></i> Save PDF
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
        <div className="bg-slate-900 p-10 text-white flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-black mb-2">Detailed Skill Report</h1>
            <p className="text-slate-400 font-mono text-sm tracking-widest uppercase">{job.title}</p>
          </div>
          <div className="text-right">
            <h2 className="text-2xl font-bold">{app.studentName}</h2>
            <p className="text-indigo-400 font-bold">{result.status}</p>
          </div>
        </div>

        <div className="p-10 space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
              <p className="text-[10px] uppercase font-black text-slate-400 mb-2">Total Score</p>
              <p className="text-4xl font-black text-black">{result.scores.total} <span className="text-sm font-normal text-slate-400">/ {totalMax}</span></p>
            </div>
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
              <p className="text-[10px] uppercase font-black text-slate-400 mb-2">Time Invested</p>
              <p className="text-4xl font-black text-black">{result.timeTakenMinutes} <span className="text-sm font-normal text-slate-400">mins</span></p>
            </div>
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
              <p className="text-[10px] uppercase font-black text-slate-400 mb-2">Skill Accuracy</p>
              <p className="text-4xl font-black text-indigo-600">{Math.round((result.scores.total/totalMax)*100)}%</p>
            </div>
          </div>

          {result.suspiciousFlag && (
            <div className="bg-red-50 border-2 border-red-200 p-6 rounded-2xl flex items-start space-x-4">
              <i className="fas fa-exclamation-triangle text-red-600 text-2xl mt-1"></i>
              <div>
                <h4 className="text-red-800 font-black uppercase text-xs tracking-widest mb-1">Security Alert</h4>
                <p className="text-red-700 font-bold">{result.suspiciousReason}</p>
              </div>
            </div>
          )}

          <section>
            <h3 className="text-xl font-bold text-black mb-8">Assessment Breakdown</h3>
            <div className="space-y-6">
              {job.questions.map((q, idx) => {
                const ans = result.answers[q.id];
                const isCorrect = q.type === QuestionType.MCQ ? ans === q.correctAnswer : true;
                
                return (
                  <div key={q.id} className="p-6 rounded-2xl border border-slate-100 bg-white">
                    <div className="flex justify-between mb-4">
                      <h4 className="font-bold text-black">Q{idx+1}. {q.text}</h4>
                      <span className="text-xs font-bold text-slate-400">{q.marks} Pts</span>
                    </div>

                    <div className="space-y-4">
                      <div className={`p-4 rounded-xl text-sm ${isCorrect ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
                        <p className="font-black uppercase text-[10px] mb-1 opacity-60">Candidate Answer</p>
                        <p className="font-bold">{ans || 'No response recorded'}</p>
                      </div>

                      {!isCorrect && q.type === QuestionType.MCQ && (
                        <div className="p-4 rounded-xl bg-slate-50 text-sm text-slate-600">
                          <p className="font-black uppercase text-[10px] mb-1 opacity-60">Correct Answer</p>
                          <p className="font-bold">{q.correctAnswer}</p>
                        </div>
                      )}

                      {q.type === QuestionType.SUBJECTIVE && (
                        <div className="p-4 rounded-xl bg-indigo-50 text-sm text-indigo-800 border border-indigo-100">
                          <p className="font-black uppercase text-[10px] mb-1 opacity-60">Evaluation Rubric & AI Feedback</p>
                          <p className="mb-2 italic">Rubric: {q.rubric}</p>
                          <p className="font-bold">AI Notes: {result.evaluationNotes[q.id]}</p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {user?.role === UserRole.RECRUITER && (
            <div className="p-8 bg-slate-900 rounded-3xl text-white">
              <h4 className="text-lg font-bold mb-4 flex items-center">
                <i className="fas fa-robot mr-3 text-indigo-400"></i> AI Talent Summary
              </h4>
              <p className="text-slate-400 leading-relaxed">
                Based on our intelligent skill mapping, {app.studentName} has scored {result.scores.total} points. 
                They performed best in {result.scores.coding > result.scores.mcq ? 'Coding' : 'Theory'}. 
                Recommendation: {result.status === 'QUALIFIED' ? 'Proceed to personal interview.' : 'Role mismatch detected.'}
              </p>
              <div className="mt-8">
                <a href={app.resumeUrl} target="_blank" rel="noreferrer" className="text-indigo-400 font-bold hover:underline">
                  <i className="fas fa-file-pdf mr-2"></i> Review Candidate Resume
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportPage;
