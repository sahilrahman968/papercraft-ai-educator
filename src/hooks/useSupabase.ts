
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/context/AuthContext';

export const useSchools = () => {
  const [schools, setSchools] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchSchools = async () => {
      try {
        const { data, error } = await supabase
          .from('schools')
          .select('*')
          .order('name');

        if (error) throw error;
        setSchools(data || []);
      } catch (error: any) {
        toast({
          title: 'Error fetching schools',
          description: error.message,
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchSchools();
  }, [toast]);

  return { schools, loading };
};

export const useQuestions = (filters: {
  subject?: string;
  difficulty?: string;
  type?: string;
  visibility?: 'public' | 'private';
  chapter?: string;
  topic?: string;
} = {}) => {
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { currentUser } = useAuth();

  useEffect(() => {
    if (!currentUser) {
      setLoading(false);
      return;
    }

    const fetchQuestions = async () => {
      try {
        let query = supabase
          .from('questions')
          .select(`
            *,
            users(name)
          `);

        // Apply filters
        if (filters.subject) {
          // Get tag IDs for the subject
          const { data: subjectTags } = await supabase
            .from('question_tags')
            .select('id')
            .eq('type', 'subject')
            .eq('value', filters.subject);

          if (subjectTags && subjectTags.length > 0) {
            const subjectTagIds = subjectTags.map(tag => tag.id);
            query = query.contains('tags', subjectTagIds);
          }
        }

        if (filters.difficulty) {
          // Get tag IDs for the difficulty
          const { data: difficultyTags } = await supabase
            .from('question_tags')
            .select('id')
            .eq('type', 'difficulty')
            .eq('value', filters.difficulty);

          if (difficultyTags && difficultyTags.length > 0) {
            const difficultyTagIds = difficultyTags.map(tag => tag.id);
            query = query.contains('tags', difficultyTagIds);
          }
        }

        if (filters.type) {
          query = query.eq('question_type', filters.type);
        }

        if (filters.visibility) {
          query = query.eq('visibility', filters.visibility);
        }

        // Get school-specific and public questions
        const { data, error } = await query.order('created_at', { ascending: false });

        if (error) throw error;

        // Apply client-side filtering for chapter and topic
        let filteredData = data || [];

        if (filters.chapter || filters.topic) {
          // Get all question tags
          const { data: allTags } = await supabase
            .from('question_tags')
            .select('*');

          if (allTags) {
            const tagMap = new Map(allTags.map(tag => [tag.id, tag]));
            
            filteredData = filteredData.filter(question => {
              if (!question.tags) return false;
              
              const questionTags = question.tags.map((tagId: string) => tagMap.get(tagId));
              
              const hasChapter = !filters.chapter || questionTags.some(tag => 
                tag && tag.type === 'chapter' && tag.value.toLowerCase().includes(filters.chapter!.toLowerCase())
              );
              
              const hasTopic = !filters.topic || questionTags.some(tag => 
                tag && tag.type === 'topic' && tag.value.toLowerCase().includes(filters.topic!.toLowerCase())
              );
              
              return hasChapter && hasTopic;
            });
          }
        }

        setQuestions(filteredData);
      } catch (error: any) {
        toast({
          title: 'Error fetching questions',
          description: error.message,
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [filters, toast, currentUser]);

  return { questions, loading };
};

export const useQuestionPapers = (filters: {
  subject?: string;
  class?: string;
  visibility?: 'public' | 'private';
} = {}) => {
  const [papers, setPapers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { currentUser } = useAuth();

  useEffect(() => {
    if (!currentUser) {
      setLoading(false);
      return;
    }

    const fetchPapers = async () => {
      try {
        let query = supabase
          .from('question_papers')
          .select(`
            *,
            users(name)
          `);

        if (filters.subject) {
          query = query.eq('subject', filters.subject);
        }

        if (filters.class) {
          query = query.eq('class', filters.class);
        }

        if (filters.visibility) {
          query = query.eq('visibility', filters.visibility);
        }

        const { data, error } = await query.order('created_at', { ascending: false });

        if (error) throw error;
        setPapers(data || []);
      } catch (error: any) {
        toast({
          title: 'Error fetching question papers',
          description: error.message,
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPapers();
  }, [filters, toast, currentUser]);

  return { papers, loading };
};

export const useQuestionPaper = (paperId: string | undefined) => {
  const [paper, setPaper] = useState<any | null>(null);
  const [sections, setSections] = useState<any[]>([]);
  const [questions, setQuestions] = useState<any[]>([]);
  const [collaborators, setCollaborators] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (!paperId) {
      setLoading(false);
      return;
    }

    const fetchPaperDetails = async () => {
      try {
        // Fetch paper
        const { data: paperData, error: paperError } = await supabase
          .from('question_papers')
          .select(`
            *,
            users(id, name, email)
          `)
          .eq('id', paperId)
          .single();

        if (paperError) throw paperError;
        setPaper(paperData);

        // Fetch sections if not sectionless
        if (!paperData.is_sectionless) {
          const { data: sectionsData, error: sectionsError } = await supabase
            .from('paper_sections')
            .select('*')
            .eq('paper_id', paperId)
            .order('display_order');

          if (sectionsError) throw sectionsError;
          setSections(sectionsData || []);
        }

        // Fetch questions
        const { data: questionsData, error: questionsError } = await supabase
          .from('paper_questions')
          .select(`
            *,
            questions(*)
          `)
          .eq('paper_id', paperId)
          .order('display_order');

        if (questionsError) throw questionsError;
        setQuestions(questionsData || []);

        // Fetch collaborators
        const { data: collaboratorsData, error: collaboratorsError } = await supabase
          .from('paper_collaborators')
          .select(`
            *,
            users(id, name, email)
          `)
          .eq('paper_id', paperId);

        if (collaboratorsError) throw collaboratorsError;
        setCollaborators(collaboratorsData || []);
      } catch (error: any) {
        toast({
          title: 'Error fetching paper details',
          description: error.message,
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPaperDetails();
  }, [paperId, toast]);

  return { paper, sections, questions, collaborators, loading };
};

// Function to add a question to the database
export const addQuestion = async (questionData: any) => {
  try {
    const { data, error } = await supabase
      .from('questions')
      .insert(questionData)
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error: any) {
    return { data: null, error };
  }
};

// Function to create a question paper
export const createQuestionPaper = async (paperData: any) => {
  try {
    const { data, error } = await supabase
      .from('question_papers')
      .insert(paperData)
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error: any) {
    return { data: null, error };
  }
};

// Function to add a section to a paper
export const addSectionToPaper = async (sectionData: any) => {
  try {
    const { data, error } = await supabase
      .from('paper_sections')
      .insert(sectionData)
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error: any) {
    return { data: null, error };
  }
};

// Function to add a question to a paper
export const addQuestionToPaper = async (questionData: any) => {
  try {
    const { data, error } = await supabase
      .from('paper_questions')
      .insert(questionData)
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error: any) {
    return { data: null, error };
  }
};
