
import { GoogleGenAI, Type } from "@google/genai";
import { Job, Question, QuestionType, Difficulty } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateAssessmentQuestions = async (job: Partial<Job>): Promise<Question[]> => {
  const prompt = `
    Act as an expert hiring manager. Generate exactly ${job.questionCount || 10} assessment questions for the role: ${job.title}.
    Job Description: ${job.description}
    Difficulty: ${job.difficulty}

    Instructions:
    1. Generate a mix of MCQ, SUBJECTIVE, and CODING (only if technical).
    2. MCQs MUST have exactly 4 distinct options in the 'options' array.
    3. MCQs are worth 1 mark.
    4. SUBJECTIVE questions are worth 3 marks and MUST include a detailed evaluation 'rubric'.
    5. CODING questions are worth 5 marks and MUST include 'testCases' (input/expectedOutput).
    6. Ensure the output is valid JSON matching the schema.
    7. Do NOT include coding questions if the role is non-technical (e.g., singer, manager).
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            type: { type: Type.STRING, enum: ['MCQ', 'SUBJECTIVE', 'CODING'] },
            text: { type: Type.STRING },
            options: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Required for MCQ. Exactly 4 items." },
            correctAnswer: { type: Type.STRING, description: "Required for MCQ." },
            marks: { type: Type.NUMBER },
            difficulty: { type: Type.STRING },
            rubric: { type: Type.STRING, description: "Required for SUBJECTIVE." },
            testCases: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  input: { type: Type.STRING },
                  expectedOutput: { type: Type.STRING }
                }
              }
            }
          },
          required: ['id', 'type', 'text', 'marks', 'difficulty']
        }
      }
    }
  });

  return JSON.parse(response.text || '[]');
};

export const evaluateSubjectiveAnswer = async (question: string, answer: string, rubric: string) => {
  const prompt = `
    Evaluate this candidate's answer based on the rubric.
    Question: ${question}
    Answer: ${answer}
    Rubric: ${rubric}
    
    Return a score (0 to 3) and feedback.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          score: { type: Type.NUMBER },
          feedback: { type: Type.STRING }
        },
        required: ['score', 'feedback']
      }
    }
  });

  return JSON.parse(response.text || '{"score": 0, "feedback": "No evaluation available"}');
};
