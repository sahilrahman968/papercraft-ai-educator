
-- *** SCHOOLS TABLE ***
CREATE TABLE schools (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  location TEXT,
  board TEXT NOT NULL,
  pdf_password TEXT,
  approval_type TEXT NOT NULL CHECK (approval_type IN ('admin', 'teacher')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- *** USERS TABLE ***
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  school_id UUID REFERENCES schools(id) NOT NULL,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'teacher')),
  subjects TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- *** QUESTION TAGS TABLE ***
CREATE TABLE question_tags (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type TEXT NOT NULL CHECK (type IN ('difficulty', 'topic', 'chapter', 'bloom', 'class', 'subject')),
  value TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(type, value)
);

-- *** QUESTIONS TABLE ***
CREATE TABLE questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_by UUID REFERENCES users(id) NOT NULL,
  school_id UUID REFERENCES schools(id) NOT NULL,
  question_text TEXT NOT NULL,
  question_type TEXT NOT NULL CHECK (question_type IN ('MCQ', 'Short Answer', 'Long Answer', 'Fill in the Blank', 'Match the Following', 'Assertion and Reason')),
  options JSONB DEFAULT NULL, -- for mcq: [{text, is_correct}]
  answer TEXT,
  marks INTEGER NOT NULL DEFAULT 1,
  is_ai_generated BOOLEAN DEFAULT FALSE,
  visibility TEXT NOT NULL CHECK (visibility IN ('private', 'public')),
  approval_status TEXT NOT NULL CHECK (approval_status IN ('pending', 'approved', 'rejected')),
  tags UUID[] DEFAULT '{}', -- FK to question_tags.id
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- *** QUESTION PAPERS TABLE ***
CREATE TABLE question_papers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_by UUID REFERENCES users(id) NOT NULL,
  school_id UUID REFERENCES schools(id) NOT NULL,
  title TEXT NOT NULL,
  class TEXT NOT NULL,
  subject TEXT NOT NULL,
  total_marks INTEGER NOT NULL DEFAULT 0,
  duration INTEGER NOT NULL DEFAULT 180, -- in minutes
  visibility TEXT NOT NULL CHECK (visibility IN ('private', 'public')),
  approval_status TEXT NOT NULL CHECK (approval_status IN ('pending', 'approved', 'rejected')),
  header_template TEXT,
  custom_instructions TEXT[],
  is_sectionless BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- *** PAPER SECTIONS TABLE ***
CREATE TABLE paper_sections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  paper_id UUID REFERENCES question_papers(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  display_order INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- *** PAPER QUESTIONS TABLE ***
CREATE TABLE paper_questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  paper_id UUID REFERENCES question_papers(id) ON DELETE CASCADE NOT NULL,
  section_id UUID REFERENCES paper_sections(id) ON DELETE CASCADE,
  question_id UUID REFERENCES questions(id) NOT NULL,
  display_order INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  -- Check that section_id is NULL only when the paper is sectionless
  CONSTRAINT valid_section_check CHECK (
    (section_id IS NULL AND EXISTS (
      SELECT 1 FROM question_papers WHERE id = paper_id AND is_sectionless = TRUE
    )) OR 
    (section_id IS NOT NULL AND EXISTS (
      SELECT 1 FROM question_papers WHERE id = paper_id AND is_sectionless = FALSE
    ))
  )
);

-- *** PAPER COLLABORATORS TABLE ***
CREATE TABLE paper_collaborators (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  paper_id UUID REFERENCES question_papers(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES users(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(paper_id, user_id)
);

-- *** POPULATE INITIAL QUESTION TAGS ***
-- Difficulty levels
INSERT INTO question_tags (type, value) VALUES
  ('difficulty', 'Easy'),
  ('difficulty', 'Medium'),
  ('difficulty', 'Hard');

-- Bloom's taxonomy levels
INSERT INTO question_tags (type, value) VALUES
  ('bloom', 'Remember'),
  ('bloom', 'Understand'),
  ('bloom', 'Apply'),
  ('bloom', 'Analyze'),
  ('bloom', 'Evaluate'),
  ('bloom', 'Create');

-- Common classes
INSERT INTO question_tags (type, value) VALUES
  ('class', '8'),
  ('class', '9'),
  ('class', '10'),
  ('class', '11'),
  ('class', '12');

-- Common subjects
INSERT INTO question_tags (type, value) VALUES
  ('subject', 'Mathematics'),
  ('subject', 'Physics'),
  ('subject', 'Chemistry'),
  ('subject', 'Biology'),
  ('subject', 'English'),
  ('subject', 'History'),
  ('subject', 'Geography');

-- *** ROW LEVEL SECURITY POLICIES ***

-- Enable RLS on all tables
ALTER TABLE schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE question_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE question_papers ENABLE ROW LEVEL SECURITY;
ALTER TABLE paper_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE paper_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE paper_collaborators ENABLE ROW LEVEL SECURITY;

-- Schools policies
CREATE POLICY "Admins can see all schools" ON schools
  FOR SELECT TO authenticated
  USING (auth.uid() IN (SELECT id FROM users WHERE role = 'admin'));

CREATE POLICY "Users can see their own school" ON schools
  FOR SELECT TO authenticated
  USING (id IN (SELECT school_id FROM users WHERE id = auth.uid()));

-- Users policies
CREATE POLICY "Admins can see all users in their school" ON users
  FOR SELECT TO authenticated
  USING (
    (role = 'admin' AND school_id IN (SELECT school_id FROM users WHERE id = auth.uid())) OR
    id = auth.uid()
  );

CREATE POLICY "Users can see their own profile" ON users
  FOR SELECT TO authenticated
  USING (id = auth.uid());

-- Question tags are public read-only
CREATE POLICY "Question tags are readable by all authenticated users" ON question_tags
  FOR SELECT TO authenticated
  USING (true);

-- Questions policies
CREATE POLICY "Users can see questions from their school" ON questions
  FOR SELECT TO authenticated
  USING (
    school_id IN (SELECT school_id FROM users WHERE id = auth.uid()) OR
    (visibility = 'public' AND approval_status = 'approved')
  );

CREATE POLICY "Users can insert their own questions" ON questions
  FOR INSERT TO authenticated
  WITH CHECK (created_by = auth.uid());

CREATE POLICY "Users can update their own questions" ON questions
  FOR UPDATE TO authenticated
  USING (created_by = auth.uid())
  WITH CHECK (created_by = auth.uid());

-- Question papers policies
CREATE POLICY "Users can see papers from their school" ON question_papers
  FOR SELECT TO authenticated
  USING (
    school_id IN (SELECT school_id FROM users WHERE id = auth.uid()) OR
    (visibility = 'public' AND approval_status = 'approved') OR
    auth.uid() IN (SELECT user_id FROM paper_collaborators WHERE paper_id = id)
  );

CREATE POLICY "Users can insert their own papers" ON question_papers
  FOR INSERT TO authenticated
  WITH CHECK (created_by = auth.uid());

CREATE POLICY "Users can update their own papers" ON question_papers
  FOR UPDATE TO authenticated
  USING (created_by = auth.uid())
  WITH CHECK (created_by = auth.uid());

-- Paper sections policies
CREATE POLICY "Users can see paper sections if they can see the paper" ON paper_sections
  FOR SELECT TO authenticated
  USING (
    paper_id IN (
      SELECT id FROM question_papers WHERE 
        school_id IN (SELECT school_id FROM users WHERE id = auth.uid()) OR
        (visibility = 'public' AND approval_status = 'approved') OR
        id IN (SELECT paper_id FROM paper_collaborators WHERE user_id = auth.uid())
    )
  );

CREATE POLICY "Users can modify paper sections for their papers" ON paper_sections
  FOR ALL TO authenticated
  USING (
    paper_id IN (
      SELECT id FROM question_papers WHERE created_by = auth.uid()
    )
  );

-- Paper questions policies
CREATE POLICY "Users can see paper questions if they can see the paper" ON paper_questions
  FOR SELECT TO authenticated
  USING (
    paper_id IN (
      SELECT id FROM question_papers WHERE 
        school_id IN (SELECT school_id FROM users WHERE id = auth.uid()) OR
        (visibility = 'public' AND approval_status = 'approved') OR
        id IN (SELECT paper_id FROM paper_collaborators WHERE user_id = auth.uid())
    )
  );

CREATE POLICY "Users can modify paper questions for their papers" ON paper_questions
  FOR ALL TO authenticated
  USING (
    paper_id IN (
      SELECT id FROM question_papers WHERE created_by = auth.uid()
    )
  );

-- Paper collaborators policies
CREATE POLICY "Users can see collaborators for papers they can access" ON paper_collaborators
  FOR SELECT TO authenticated
  USING (
    paper_id IN (
      SELECT id FROM question_papers WHERE 
        school_id IN (SELECT school_id FROM users WHERE id = auth.uid()) OR
        (visibility = 'public' AND approval_status = 'approved') OR
        id IN (SELECT paper_id FROM paper_collaborators WHERE user_id = auth.uid())
    )
  );

CREATE POLICY "Paper creators can manage collaborators" ON paper_collaborators
  FOR ALL TO authenticated
  USING (
    paper_id IN (
      SELECT id FROM question_papers WHERE created_by = auth.uid()
    )
  );

-- Create function to update total marks of a question paper
CREATE OR REPLACE FUNCTION update_question_paper_total_marks()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE question_papers
  SET total_marks = (
    SELECT COALESCE(SUM(q.marks), 0)
    FROM paper_questions pq
    JOIN questions q ON pq.question_id = q.id
    WHERE pq.paper_id = NEW.paper_id
  )
  WHERE id = NEW.paper_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update marks when questions are added/removed
CREATE TRIGGER update_paper_marks_on_question_change
AFTER INSERT OR UPDATE OR DELETE ON paper_questions
FOR EACH ROW
EXECUTE FUNCTION update_question_paper_total_marks();

-- Create storage buckets
-- Note: This part needs to be done through the Supabase dashboard or API
-- Create buckets for:
-- 1. question_images
-- 2. school_logos
