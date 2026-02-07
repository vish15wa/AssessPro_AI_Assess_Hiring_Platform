
export enum UserRole {
  STUDENT = 'STUDENT',
  RECRUITER = 'RECRUITER',
  ADMIN = 'ADMIN'
}

export interface User {
  id: string;
  username: string;
  email: string;
  password?: string;
  role: UserRole;
  fullName: string;
  contactNumber: string;
  dob: string;
  createdAt: string;
  resumeUrl?: string;
  resumeText?: string;
}

export enum Difficulty {
  EASY = 'Easy',
  MEDIUM = 'Medium',
  HARD = 'Hard'
}

export enum QuestionType {
  MCQ = 'MCQ',
  SUBJECTIVE = 'SUBJECTIVE',
  CODING = 'CODING'
}

export interface TestCase {
  input: string;
  expectedOutput: string;
}

export interface Question {
  id: string;
  type: QuestionType;
  text: string;
  options?: string[];
  correctAnswer?: string;
  marks: number;
  difficulty: Difficulty;
  rubric?: string;
  testCases?: TestCase[];
}

export interface Job {
  id: string;
  title: string;
  description: string;
  requirements: string[];
  recruiterId: string;
  recruiterName: string;
  deadline: string;
  durationMinutes: number;
  questionCount: number;
  difficulty: Difficulty;
  threshold: number;
  createdAt: string;
  questions: Question[];
}

export interface AssessmentResult {
  applicationId: string;
  jobId: string;
  studentId: string;
  scores: {
    mcq: number;
    subjective: number;
    coding: number;
    total: number;
  };
  answers: Record<string, any>;
  evaluationNotes: Record<string, string>;
  suspiciousFlag: boolean;
  suspiciousReason?: string;
  timeTakenMinutes: number;
  status: 'PENDING' | 'QUALIFIED' | 'DISQUALIFIED';
  aiAggregation?: string;
  submittedAt: string;
}

export interface Application {
  id: string;
  jobId: string;
  studentId: string;
  studentName: string;
  status: 'APPLIED' | 'COMPLETED' | 'QUALIFIED' | 'DISQUALIFIED';
  resumeUrl: string;
  result?: AssessmentResult;
}
