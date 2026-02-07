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
