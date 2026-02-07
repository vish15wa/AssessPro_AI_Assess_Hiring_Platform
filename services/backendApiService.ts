/**
 * Backend API service for assessment/job operations.
 * Replace direct Gemini calls with backend endpoints.
 */

export interface CreateJobRequest {
  title: string;
  description: string;
  durationMinutes: number;
  difficulty: string;
  questionCount?: number;
  threshold?: number;
}

export interface Question {
  id: string;
  type: string;
  text: string;
  options?: Record<string, string>;  // Changed to match backend: {A: "...", B: "...", C: "...", D: "..."}
  correctAnswer?: string;
  marks: number;
  difficulty: string;
  rubric?: string;
  testCases?: Array<{ input: string; expectedOutput: string }>;
}

const API_BASE = '/api';

/**
 * Generate assessment questions for a job via backend API.
 * The backend handles AI-powered question generation.
 */
export const generateQuestionsViaBackend = async (jobData: {
  title: string;
  description: string;
  durationMinutes: number;
  difficulty: string;
  questionCount?: number;
}): Promise<Question[]> => {
  try {
    const response = await fetch(`${API_BASE}/jobs/generate-questions/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        job_title: jobData.title,
        job_description: jobData.description,
        duration_minutes: jobData.durationMinutes,
        difficulty_level: jobData.difficulty,
        question_count: jobData.questionCount || 10,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Failed to generate questions');
    }

    const questions = await response.json();
    console.log('[DEBUG] Backend returned questions:', questions);
    
    // Ensure questions have proper structure
    const formattedQuestions = questions.map((q: any) => ({
      id: q.id || Math.random().toString(36).substr(2, 9),
      type: (q.type || 'mcq').toString().toUpperCase(),
      text: q.question_text || q.text || '',
      options: q.options || {},  // Backend returns {A, B, C, D}
      correctAnswer: (q.correct_answer || q.correctAnswer || q.answer || 'A')?.toString().toUpperCase(),
      marks: q.marks || 1,
      difficulty: q.difficulty || jobData.difficulty,
      rubric: q.rubric,
      testCases: q.test_cases || q.testCases,
    }));
    
    console.log('[DEBUG] Formatted questions:', formattedQuestions);
    return formattedQuestions;
  } catch (error) {
    console.error('Error calling backend for question generation:', error);
    throw error;
  }
};

/**
 * Create a job via the backend API.
 */
export const createJobViaBackend = async (jobData: CreateJobRequest): Promise<any> => {
  try {
    const response = await fetch(`${API_BASE}/jobs/create/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: jobData.title,
        job_description: jobData.description,
        duration_minutes: jobData.durationMinutes,
        difficulty_level: jobData.difficulty,
        pass_threshold: jobData.threshold || 30,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Failed to create job');
    }

    return await response.json();
  } catch (error) {
    console.error('Error calling backend to create job:', error);
    throw error;
  }
};

export const fetchJobsFromBackend = async (): Promise<any[]> => {
  const res = await fetch(`${API_BASE}/jobs/`);
  if (!res.ok) throw new Error('Failed to fetch jobs');
  return await res.json();
};

/**
 * Evaluate a subjective answer via backend.
 */
export const evaluateAnswerViaBackend = async (
  questionId: string,
  answer: string,
  rubric: string
): Promise<{ score: number; feedback: string }> => {
  try {
    const response = await fetch(`${API_BASE}/candidates/evaluate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        question_id: questionId,
        candidate_answer: answer,
        rubric: rubric,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to evaluate answer');
    }

    return await response.json();
  } catch (error) {
    console.error('Error evaluating answer:', error);
    throw error;
  }
};

/**
 * Register a candidate for a job assessment
 */
export const registerCandidate = async (candidateData: {
  jobId: number;
  name: string;
  email: string;
  resumeText?: string;
}): Promise<any> => {
  try {
    const response = await fetch(`${API_BASE}/candidates/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        job_id: candidateData.jobId,
        name: candidateData.name,
        email: candidateData.email,
        resume_text: candidateData.resumeText,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Failed to register candidate');
    }

    return await response.json();
  } catch (error) {
    console.error('Error registering candidate:', error);
    throw error;
  }
};

/**
 * Get questions for a specific job
 */
export const getJobQuestions = async (jobId: number): Promise<Question[]> => {
  try {
    const response = await fetch(`${API_BASE}/jobs/${jobId}/questions`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch questions');
    }

    const questions = await response.json();
    
    // Format questions to match frontend expectations
    const formattedQuestions = questions.map((q: any) => ({
      id: String(q.id),
      type: (q.question_type || 'mcq').toString().toUpperCase(),
      text: q.question_text || q.text || '',
      options: q.options || {},
      correctAnswer: (q.correct_answer || q.correctAnswer || 'A')?.toString().toUpperCase(),
      marks: q.weight || 1,
      difficulty: q.difficulty || 'medium',
      rubric: q.rubric,
      testCases: q.test_cases || q.testCases,
      skill: q.skill,
      timeLimitSeconds: q.time_limit_seconds || 300,
      section: q.section || 'technical',
    }));

    return formattedQuestions;
  } catch (error) {
    console.error('Error fetching questions:', error);
    throw error;
  }
};

/**
 * Submit test answers to backend for evaluation
 */
export interface TestAnswer {
  question_id: number;
  answer_text: string;
  time_taken_seconds?: number;
}

export const submitTestAnswers = async (
  candidateId: number,
  answers: TestAnswer[]
): Promise<any> => {
  try {
    const response = await fetch(`${API_BASE}/candidates/submit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        candidate_id: candidateId,
        answers: answers,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Failed to submit test');
    }

    return await response.json();
  } catch (error) {
    console.error('Error submitting test:', error);
    throw error;
  }
};

/**
 * Get leaderboard for a job
 */
export const getLeaderboard = async (jobId: number): Promise<any[]> => {
  try {
    const response = await fetch(`${API_BASE}/candidates/job/${jobId}/leaderboard`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch leaderboard');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    throw error;
  }
};

/**
 * Get candidate analytics
 */
export const getCandidateAnalytics = async (candidateId: number): Promise<any> => {
  try {
    const response = await fetch(`${API_BASE}/candidates/${candidateId}/analytics`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch analytics');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching analytics:', error);
    throw error;
  }
};

/**
 * Get job analytics
 */
export const getJobAnalytics = async (jobId: number): Promise<any> => {
  try {
    const response = await fetch(`${API_BASE}/jobs/${jobId}/analytics`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch job analytics');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching job analytics:', error);
    throw error;
  }
};
