
import { Board, Difficulty, GenerateParams, Question, QuestionPaper, QuestionType, Section } from '@/types';
import { generateMockQuestions } from './mockData';

// This is a placeholder for actual OpenAI integration
// In a real implementation, this would call the OpenAI API

const aiGenerationPrompt = (params: GenerateParams) => `
Generate a comprehensive question paper for a ${params.class} ${params.subject} ${params.board} examination.

Question Paper Requirements:
- Board: ${params.board}
- Class: ${params.class}
- Subject: ${params.subject}
- Chapters: ${params.chapters.join(', ')}
- Topics (if specified): ${params.topics ? params.topics.join(', ') : 'All relevant topics'}
- Difficulty Distribution: ${params.difficultyDistribution.easy}% Easy, ${params.difficultyDistribution.medium}% Medium, ${params.difficultyDistribution.hard}% Hard
- Total Marks: ${params.totalMarks}
- Duration: ${params.duration} minutes

Please create a structured question paper with:
1. Multiple-choice questions
2. Short answer questions
3. Long answer questions
4. Include a mix of questions targeting different cognitive levels (Remember, Understand, Apply, Analyze, Evaluate, Create)
5. Organize into appropriate sections based on ${params.board} examination pattern
6. Provide clear marking scheme for each question
7. Include appropriate diagrams/illustrations where applicable

For each question, provide:
- The question text
- Question type (MCQ, Short Answer, Long Answer, etc.)
- Difficulty level
- Marks allocated
- Bloom's taxonomy level
- Expected answer or solution (for MCQs, include all options)
`;

// Mock implementation using our mock data generator
export async function generateQuestionPaper(params: GenerateParams): Promise<QuestionPaper> {
  console.log('AI Generation Prompt would be:', aiGenerationPrompt(params));
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Generate mock questions that match the criteria
  const mockQuestions = generateMockQuestions(30).filter(q => 
    q.board === params.board && 
    q.class === params.class && 
    q.subject === params.subject &&
    (params.chapters.length === 0 || params.chapters.includes(q.chapter)) &&
    (!params.topics || params.topics.length === 0 || params.topics.includes(q.topic))
  );
  
  // Not enough questions in our mock data? Generate some more specific ones
  if (mockQuestions.length < 20) {
    // Add board/class/subject-specific questions to the pool
    const additionalQuestions = generateCustomQuestions(params, 20 - mockQuestions.length);
    mockQuestions.push(...additionalQuestions);
  }
  
  // Sort questions by difficulty to handle distribution
  const easyQuestions = mockQuestions.filter(q => q.difficulty === 'Easy');
  const mediumQuestions = mockQuestions.filter(q => q.difficulty === 'Medium');
  const hardQuestions = mockQuestions.filter(q => q.difficulty === 'Hard');
  
  // Calculate how many questions of each difficulty we need
  const totalQuestionsNeeded = Math.min(20, mockQuestions.length);
  const easyCount = Math.floor(totalQuestionsNeeded * params.difficultyDistribution.easy / 100);
  const mediumCount = Math.floor(totalQuestionsNeeded * params.difficultyDistribution.medium / 100);
  const hardCount = Math.floor(totalQuestionsNeeded * params.difficultyDistribution.hard / 100);
  
  // Adjust if we don't have exact counts
  const remaining = totalQuestionsNeeded - (easyCount + mediumCount + hardCount);
  
  // Get the questions we'll use
  const selectedEasyQuestions = easyQuestions.slice(0, easyCount + (remaining > 0 ? 1 : 0));
  const selectedMediumQuestions = mediumQuestions.slice(0, mediumCount + (remaining > 1 ? 1 : 0));
  const selectedHardQuestions = hardQuestions.slice(0, hardCount + (remaining > 2 ? remaining - 2 : 0));
  
  const allSelectedQuestions = [
    ...selectedEasyQuestions,
    ...selectedMediumQuestions,
    ...selectedHardQuestions
  ];
  
  // Organize into sections
  const sections: Section[] = [
    {
      id: 's-1',
      title: 'Section A: Multiple Choice and Very Short Answer Questions',
      description: 'Answer all questions. Each question carries 1 mark.',
      questions: allSelectedQuestions.filter(q => q.type === 'MCQ' || q.type === 'Fill in the Blank').slice(0, 10)
    },
    {
      id: 's-2',
      title: 'Section B: Short Answer Questions',
      description: 'Answer any 5 questions. Each question carries 3 marks.',
      questions: allSelectedQuestions.filter(q => q.type === 'Short Answer').slice(0, 7)
    },
    {
      id: 's-3',
      title: 'Section C: Long Answer Questions',
      description: 'Answer any 3 questions. Each question carries 5 marks.',
      questions: allSelectedQuestions.filter(q => q.type === 'Long Answer').slice(0, 5)
    }
  ];
  
  // Calculate total marks
  const totalMarks = sections.reduce(
    (sum, section) => sum + section.questions.reduce((qSum, q) => qSum + q.marks, 0), 
    0
  );
  
  return {
    id: `qp-ai-${Date.now()}`,
    title: `${params.class} ${params.subject} ${params.board} Examination`,
    board: params.board,
    class: params.class,
    subject: params.subject,
    createdBy: 'AI Assistant',
    createdAt: new Date(),
    totalMarks: totalMarks || params.totalMarks, // Fallback to requested marks if calculation is zero
    duration: params.duration,
    sections,
    instructions: [
      'Answer all questions as per the instructions in each section.',
      'Marks are indicated against each question.',
      'Draw diagrams where necessary.',
      'Write legibly for full marks.'
    ]
  };
}

// Generate a specific question based on criteria
export async function generateSingleQuestion(
  subject: string,
  chapter: string,
  topic: string,
  difficulty: Difficulty,
  type: QuestionType,
  marks: number
): Promise<Question> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // For now, just return a mock question that matches the criteria
  const mockQuestions = generateMockQuestions(20);
  let matchingQuestion = mockQuestions.find(q => 
    q.subject === subject && 
    q.chapter === chapter &&
    q.topic === topic &&
    q.difficulty === difficulty &&
    q.type === type
  );
  
  if (!matchingQuestion) {
    // Create a custom question if no match found
    matchingQuestion = generateCustomQuestions({
      board: 'CBSE',
      class: '10',
      subject,
      chapters: [chapter],
      topics: [topic],
      difficultyDistribution: { 
        easy: difficulty === 'Easy' ? 100 : 0,
        medium: difficulty === 'Medium' ? 100 : 0,
        hard: difficulty === 'Hard' ? 100 : 0
      },
      totalMarks: marks,
      duration: 0
    }, 1)[0];
  }
  
  return {
    ...matchingQuestion,
    id: `q-ai-${Date.now()}`,
    marks: marks,
  };
}

// Helper to generate custom questions based on params
function generateCustomQuestions(params: GenerateParams, count: number): Question[] {
  const questions: Question[] = [];
  const types: QuestionType[] = ['MCQ', 'Short Answer', 'Long Answer', 'Fill in the Blank', 'Match the Following'];
  const bloomLevels = ['Remember', 'Understand', 'Apply', 'Analyze', 'Evaluate', 'Create'];
  
  for (let i = 0; i < count; i++) {
    const difficulty: Difficulty = Math.random() < params.difficultyDistribution.easy / 100 
      ? 'Easy' 
      : Math.random() < params.difficultyDistribution.medium / 100 
        ? 'Medium' 
        : 'Hard';
    
    const type = types[Math.floor(Math.random() * types.length)] as QuestionType;
    const chapter = params.chapters.length > 0 
      ? params.chapters[Math.floor(Math.random() * params.chapters.length)]
      : 'General';
    
    const topic = params.topics && params.topics.length > 0
      ? params.topics[Math.floor(Math.random() * params.topics.length)]
      : 'General Topic';
    
    const marks = difficulty === 'Easy' ? 1 : difficulty === 'Medium' ? 3 : 5;
    const bloomLevel = bloomLevels[Math.floor(Math.random() * bloomLevels.length)] as any;
    
    const question: Question = {
      id: `q-custom-${i}`,
      text: `[AI Generated] ${difficulty} ${type} question about ${topic} in ${chapter} for ${params.class} ${params.subject}.`,
      type,
      board: params.board,
      class: params.class,
      subject: params.subject,
      chapter,
      topic,
      difficulty,
      marks,
      bloomLevel,
      answer: `Sample answer for the ${difficulty} ${type} question about ${topic}.`,
    };
    
    if (type === 'MCQ') {
      question.options = [
        `Correct answer for ${topic}`,
        `Incorrect option 1 for ${topic}`,
        `Incorrect option 2 for ${topic}`,
        `Incorrect option 3 for ${topic}`
      ];
    }
    
    questions.push(question);
  }
  
  return questions;
}
