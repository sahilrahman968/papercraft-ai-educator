
import { Board, Difficulty, Question, QuestionPaper, QuestionType, BloomLevel, Section } from '@/types';

// Constant Data for Mock Generation
const SUBJECTS = ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'History', 'Geography'];
const CLASSES = ['8', '9', '10', '11', '12'];
const BOARDS: Board[] = ['CBSE', 'ICSE', 'State'];
const QUESTION_TYPES: QuestionType[] = ['MCQ', 'Short Answer', 'Long Answer', 'Fill in the Blank', 'Match the Following', 'Assertion and Reason'];
const DIFFICULTY_LEVELS: Difficulty[] = ['Easy', 'Medium', 'Hard'];
const BLOOM_LEVELS: BloomLevel[] = ['Remember', 'Understand', 'Apply', 'Analyze', 'Evaluate', 'Create'];

// Chapters and topics by subject
const CHAPTERS_BY_SUBJECT: Record<string, string[]> = {
  'Mathematics': ['Algebra', 'Geometry', 'Trigonometry', 'Calculus', 'Statistics'],
  'Physics': ['Mechanics', 'Electricity', 'Magnetism', 'Optics', 'Thermodynamics'],
  'Chemistry': ['Organic Chemistry', 'Inorganic Chemistry', 'Physical Chemistry', 'Biochemistry'],
  'Biology': ['Cell Biology', 'Genetics', 'Ecology', 'Physiology', 'Evolution'],
  'English': ['Grammar', 'Literature', 'Writing', 'Reading Comprehension'],
  'History': ['Ancient History', 'Medieval History', 'Modern History', 'World Wars'],
  'Geography': ['Physical Geography', 'Human Geography', 'Climatology', 'Oceanography']
};

const TOPICS_BY_CHAPTER: Record<string, string[]> = {
  'Algebra': ['Equations', 'Polynomials', 'Matrices', 'Determinants'],
  'Geometry': ['Triangles', 'Circles', 'Coordinate Geometry', 'Vectors'],
  'Trigonometry': ['Angles', 'Sine & Cosine', 'Identities', 'Applications'],
  'Calculus': ['Limits', 'Derivatives', 'Integrals', 'Differential Equations'],
  'Statistics': ['Mean', 'Median', 'Mode', 'Standard Deviation', 'Probability'],
  'Mechanics': ['Newton\'s Laws', 'Kinematics', 'Dynamics', 'Work & Energy'],
  'Electricity': ['Current', 'Voltage', 'Resistance', 'Circuits'],
  'Magnetism': ['Fields', 'Forces', 'Induction', 'Flux'],
  'Optics': ['Reflection', 'Refraction', 'Lenses', 'Wave Optics'],
  'Thermodynamics': ['Heat', 'Energy', 'Entropy', 'Laws of Thermodynamics'],
  'Organic Chemistry': ['Hydrocarbons', 'Functional Groups', 'Reactions', 'Stereochemistry'],
  'Inorganic Chemistry': ['Periodic Table', 'Elements', 'Compounds', 'Coordination Chemistry'],
  'Physical Chemistry': ['Equilibrium', 'Thermochemistry', 'Electrochemistry', 'Chemical Kinetics'],
  'Biochemistry': ['Proteins', 'Carbohydrates', 'Lipids', 'Nucleic Acids'],
  'Cell Biology': ['Cell Structure', 'Cell Division', 'Cell Organelles', 'Cell Membranes'],
  'Genetics': ['Inheritance', 'DNA', 'RNA', 'Mutations'],
  'Ecology': ['Ecosystems', 'Food Chains', 'Biomes', 'Ecological Balance'],
  'Physiology': ['Digestion', 'Respiration', 'Circulation', 'Excretion'],
  'Evolution': ['Natural Selection', 'Adaptation', 'Speciation', 'Evolutionary Theories'],
  'Grammar': ['Parts of Speech', 'Tenses', 'Clauses', 'Syntax'],
  'Literature': ['Poetry', 'Drama', 'Fiction', 'Non-fiction'],
  'Writing': ['Essays', 'Letters', 'Reports', 'Creative Writing'],
  'Reading Comprehension': ['Main Ideas', 'Inference', 'Vocabulary', 'Author\'s Purpose'],
  'Ancient History': ['Early Civilizations', 'Classical Period', 'Ancient Empires'],
  'Medieval History': ['Middle Ages', 'Renaissance', 'Feudalism'],
  'Modern History': ['Industrial Revolution', 'Colonialism', 'Nationalism'],
  'World Wars': ['World War I', 'World War II', 'Cold War'],
  'Physical Geography': ['Landforms', 'Rivers', 'Mountains', 'Climate'],
  'Human Geography': ['Population', 'Settlements', 'Economic Activities'],
  'Climatology': ['Weather Patterns', 'Climate Zones', 'Climate Change'],
  'Oceanography': ['Ocean Currents', 'Marine Life', 'Coastal Features']
};

// Sample question text generator
function generateQuestionText(subject: string, chapter: string, topic: string, difficulty: Difficulty, questionType: QuestionType): string {
  const difficultyPrefix = difficulty === 'Hard' ? 'Critically analyze' : difficulty === 'Medium' ? 'Explain' : 'Describe';
  
  let questionStarters: Record<QuestionType, string[]> = {
    'MCQ': [
      'Which of the following best describes',
      'Choose the correct option about',
      'Select the most appropriate answer regarding',
      'What is the correct statement about'
    ],
    'Short Answer': [
      `Briefly ${difficultyPrefix}`,
      `In short, ${difficultyPrefix}`,
      `Write a short note on`,
      `Give a concise explanation of`
    ],
    'Long Answer': [
      `${difficultyPrefix} in detail`,
      `Elaborate on`,
      `Discuss thoroughly`,
      `Provide a comprehensive overview of`
    ],
    'Fill in the Blank': [
      `_______ is the process involved in`,
      `The _______ is responsible for`,
      `In ${topic}, _______ refers to`,
      `${chapter} involves the concept of _______`
    ],
    'Match the Following': [
      `Match the following ${topic} terms with their definitions:`,
      `Match the concepts in Column A with their applications in Column B:`,
      `Connect the following terms with their corresponding examples:`,
      `Link each ${topic} concept with its relevant principle:`
    ],
    'Assertion and Reason': [
      `Assertion: ${topic} is a fundamental concept in ${chapter}.\nReason: It forms the basis of understanding ${subject}.`,
      `Assertion: The principles of ${topic} are widely applied.\nReason: ${chapter} relies heavily on these principles.`,
      `Assertion: ${topic} can be observed in various scenarios.\nReason: This is due to the universal nature of ${chapter}.`,
      `Assertion: ${chapter} is essential to understand ${topic}.\nReason: ${subject} concepts build upon this relationship.`
    ]
  };

  const starters = questionStarters[questionType];
  const starter = starters[Math.floor(Math.random() * starters.length)];
  
  return `${starter} ${topic} in ${chapter}.`;
}

// Generate options for MCQs
function generateMCQOptions(topic: string): string[] {
  return [
    `Correct answer about ${topic}`,
    `Incorrect concept related to ${topic}`,
    `Partially true statement about ${topic}`,
    `Common misconception about ${topic}`
  ];
}

// Generate answer based on question type
function generateAnswer(question: string, questionType: QuestionType, topic: string): string {
  switch (questionType) {
    case 'MCQ':
      return 'A'; // First option is always correct in our mock
    case 'Short Answer':
      return `This is a brief explanation of ${topic}.`;
    case 'Long Answer':
      return `This is a detailed explanation of ${topic}, covering its key aspects, applications, and significance.`;
    case 'Fill in the Blank':
      // Find the blank and fill it
      return question.replace('_______', topic);
    case 'Match the Following':
      return 'A-3, B-1, C-4, D-2';
    case 'Assertion and Reason':
      return 'Both assertion and reason are correct, and reason is the correct explanation for assertion.';
    default:
      return 'Answer not available.';
  }
}

// Random element selection from array
function getRandomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

// Random integer in range
function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Generate mock question data
export function generateMockQuestions(count = 50): Question[] {
  const questions: Question[] = [];
  
  for (let i = 0; i < count; i++) {
    const subject = getRandomElement(SUBJECTS);
    const chapters = CHAPTERS_BY_SUBJECT[subject];
    const chapter = getRandomElement(chapters);
    const topics = TOPICS_BY_CHAPTER[chapter] || ['General'];
    const topic = getRandomElement(topics);
    const questionType = getRandomElement(QUESTION_TYPES);
    const difficulty = getRandomElement(DIFFICULTY_LEVELS);
    const bloomLevel = getRandomElement(BLOOM_LEVELS);
    
    const text = generateQuestionText(subject, chapter, topic, difficulty, questionType);
    const marks = difficulty === 'Hard' ? getRandomInt(3, 5) : difficulty === 'Medium' ? getRandomInt(2, 3) : getRandomInt(1, 2);
    
    const hasImage = Math.random() > 0.8; // 20% chance to have an image
    
    const question: Question = {
      id: `q-${i + 1}`,
      text,
      type: questionType,
      board: getRandomElement(BOARDS),
      class: getRandomElement(CLASSES),
      subject,
      chapter,
      topic,
      difficulty,
      marks,
      bloomLevel,
      answer: generateAnswer(text, questionType, topic),
      hasImage,
      imageUrl: hasImage ? 'https://placehold.co/600x400' : undefined,
    };
    
    if (questionType === 'MCQ') {
      question.options = generateMCQOptions(topic);
    }
    
    questions.push(question);
  }
  
  return questions;
}

// Generate mock sections
function generateMockSections(subject: string, questionPool: Question[]): Section[] {
  // Filter questions by subject
  const subjectQuestions = questionPool.filter(q => q.subject === subject);
  
  // Define section structures
  const sectionTypes = [
    { title: 'Section A: Very Short Answer', questionTypes: ['MCQ', 'Fill in the Blank'], qCount: getRandomInt(5, 10) },
    { title: 'Section B: Short Answer', questionTypes: ['Short Answer'], qCount: getRandomInt(5, 8) },
    { title: 'Section C: Long Answer', questionTypes: ['Long Answer'], qCount: getRandomInt(3, 5) }
  ];
  
  // Generate sections
  return sectionTypes.map((sType, index) => {
    // Filter questions of the right type
    const availableQuestions = subjectQuestions.filter(q => sType.questionTypes.includes(q.type));
    
    // Select random questions up to the count (or all if not enough)
    const sectionQuestions = availableQuestions.length <= sType.qCount 
      ? [...availableQuestions]
      : availableQuestions.sort(() => 0.5 - Math.random()).slice(0, sType.qCount);
    
    return {
      id: `s-${index + 1}`,
      title: sType.title,
      description: `Answer all the questions in this section. Each question carries marks as indicated.`,
      questions: sectionQuestions
    };
  });
}

// Generate mock question papers
export function generateMockQuestionPapers(count = 5): QuestionPaper[] {
  const questionPool = generateMockQuestions(100);
  const papers: QuestionPaper[] = [];
  
  for (let i = 0; i < count; i++) {
    const subject = getRandomElement(SUBJECTS);
    const board = getRandomElement(BOARDS);
    const classLevel = getRandomElement(CLASSES);
    
    const sections = generateMockSections(subject, questionPool);
    
    // Calculate total marks
    const totalMarks = sections.reduce(
      (sum, section) => sum + section.questions.reduce((qSum, q) => qSum + q.marks, 0), 
      0
    );
    
    papers.push({
      id: `qp-${i + 1}`,
      title: `${classLevel} ${subject} ${board} Examination`,
      board,
      class: classLevel,
      subject,
      createdBy: 'user1',
      createdAt: new Date(Date.now() - getRandomInt(1, 30) * 24 * 60 * 60 * 1000), // Random date in the last month
      totalMarks,
      duration: totalMarks * 2, // 2 minutes per mark as a rule of thumb
      sections,
      isApproved: Math.random() > 0.3, // 70% are approved
      schoolHeader: 'Springfield High School',
      instructions: [
        'Answer all questions.',
        'Marks are indicated against each question.',
        'Draw diagrams where necessary.',
        'Write legibly for full marks.'
      ]
    });
  }
  
  return papers;
}
