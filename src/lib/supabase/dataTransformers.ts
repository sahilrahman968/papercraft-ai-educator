
import { Question, QuestionPaper, Section } from '@/types';

// Convert application question format to database format
export const convertQuestionToDbFormat = (question: Question, userId: string, schoolId: string) => {
  return {
    created_by: userId,
    school_id: schoolId,
    question_text: question.text,
    question_type: question.type,
    options: question.options && question.type === 'MCQ' ? 
      { options: question.options.map(opt => ({ text: opt, is_correct: false })) } : 
      null,
    answer: question.answer || null,
    marks: question.marks,
    is_ai_generated: question.hasOwnProperty('isAiGenerated') ? question.isAiGenerated : false,
    visibility: 'private', // Default to private
    approval_status: 'pending',
    tags: [], // Would need to be populated based on difficulty, bloom level, etc.
    image_url: question.imageUrl || null
  };
};

// Convert database question format to application format
export const convertDbQuestionToAppFormat = (dbQuestion: any): Question => {
  return {
    id: dbQuestion.id,
    text: dbQuestion.question_text,
    type: dbQuestion.question_type,
    board: 'CBSE', // This would come from tags or other fields
    class: '10', // This would come from tags
    subject: 'Mathematics', // This would come from tags
    chapter: '', // This would come from tags
    topic: '', // This would come from tags
    difficulty: 'Medium', // This would come from tags
    marks: dbQuestion.marks,
    bloomLevel: 'Understand', // This would come from tags
    answer: dbQuestion.answer || undefined,
    options: dbQuestion.options?.options?.map(opt => opt.text) || undefined,
    hasImage: !!dbQuestion.image_url,
    imageUrl: dbQuestion.image_url || undefined
  };
};

// Convert application paper format to database format
export const convertPaperToDbFormat = (paper: QuestionPaper, userId: string, schoolId: string) => {
  return {
    created_by: userId,
    school_id: schoolId,
    title: paper.title,
    class: paper.class,
    subject: paper.subject,
    total_marks: paper.totalMarks,
    duration: paper.duration,
    visibility: 'private', // Default to private
    approval_status: 'pending',
    header_template: paper.schoolHeader || null,
    custom_instructions: paper.instructions || [],
    is_sectionless: paper.isSectionless || false
  };
};

// Convert database paper format to application format
export const convertDbPaperToAppFormat = (dbPaper: any): QuestionPaper => {
  return {
    id: dbPaper.id,
    title: dbPaper.title,
    board: dbPaper.users?.schools?.board || 'CBSE',
    class: dbPaper.class,
    subject: dbPaper.subject,
    createdBy: dbPaper.created_by,
    createdAt: new Date(dbPaper.created_at),
    totalMarks: dbPaper.total_marks,
    duration: dbPaper.duration,
    sections: [], // Would be populated separately
    questions: [], // Would be populated separately
    collaborators: [], // Would be populated separately
    isApproved: dbPaper.approval_status === 'approved',
    schoolHeader: dbPaper.header_template || undefined,
    instructions: dbPaper.custom_instructions || [],
    isSectionless: dbPaper.is_sectionless
  };
};

// Convert database section to application format
export const convertDbSectionToAppFormat = (dbSection: any): Section => {
  return {
    id: dbSection.id,
    title: dbSection.title,
    description: dbSection.description || undefined,
    questions: [] // Would be populated separately
  };
};

// Helper function to extract tags
export const extractTagValue = (dbQuestion: any, tagType: string, tagMap: Map<string, any>) => {
  if (!dbQuestion.tags) return null;
  
  for (const tagId of dbQuestion.tags) {
    const tag = tagMap.get(tagId);
    if (tag && tag.type === tagType) {
      return tag.value;
    }
  }
  
  return null;
};
