
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      schools: {
        Row: {
          id: string
          name: string
          location: string | null
          board: string
          pdf_password: string | null
          approval_type: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          location?: string | null
          board: string
          pdf_password?: string | null
          approval_type: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          location?: string | null
          board?: string
          pdf_password?: string | null
          approval_type?: string
          created_at?: string
        }
        Relationships: []
      }
      users: {
        Row: {
          id: string
          school_id: string
          name: string
          email: string
          role: string
          subjects: string[]
          created_at: string
        }
        Insert: {
          id: string
          school_id: string
          name: string
          email: string
          role: string
          subjects?: string[]
          created_at?: string
        }
        Update: {
          id?: string
          school_id?: string
          name?: string
          email?: string
          role?: string
          subjects?: string[]
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "users_id_fkey"
            columns: ["id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "users_school_id_fkey"
            columns: ["school_id"]
            referencedRelation: "schools"
            referencedColumns: ["id"]
          }
        ]
      }
      question_tags: {
        Row: {
          id: string
          type: string
          value: string
          created_at: string
        }
        Insert: {
          id?: string
          type: string
          value: string
          created_at?: string
        }
        Update: {
          id?: string
          type?: string
          value?: string
          created_at?: string
        }
        Relationships: []
      }
      questions: {
        Row: {
          id: string
          created_by: string
          school_id: string
          question_text: string
          question_type: string
          options: Json | null
          answer: string | null
          marks: number
          is_ai_generated: boolean | null
          visibility: string
          approval_status: string
          tags: string[] | null
          image_url: string | null
          created_at: string
        }
        Insert: {
          id?: string
          created_by: string
          school_id: string
          question_text: string
          question_type: string
          options?: Json | null
          answer?: string | null
          marks?: number
          is_ai_generated?: boolean | null
          visibility: string
          approval_status: string
          tags?: string[] | null
          image_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          created_by?: string
          school_id?: string
          question_text?: string
          question_type?: string
          options?: Json | null
          answer?: string | null
          marks?: number
          is_ai_generated?: boolean | null
          visibility?: string
          approval_status?: string
          tags?: string[] | null
          image_url?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "questions_created_by_fkey"
            columns: ["created_by"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "questions_school_id_fkey"
            columns: ["school_id"]
            referencedRelation: "schools"
            referencedColumns: ["id"]
          }
        ]
      }
      question_papers: {
        Row: {
          id: string
          created_by: string
          school_id: string
          title: string
          class: string
          subject: string
          total_marks: number
          duration: number
          visibility: string
          approval_status: string
          header_template: string | null
          custom_instructions: string[] | null
          is_sectionless: boolean
          created_at: string
        }
        Insert: {
          id?: string
          created_by: string
          school_id: string
          title: string
          class: string
          subject: string
          total_marks?: number
          duration?: number
          visibility: string
          approval_status: string
          header_template?: string | null
          custom_instructions?: string[] | null
          is_sectionless?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          created_by?: string
          school_id?: string
          title?: string
          class?: string
          subject?: string
          total_marks?: number
          duration?: number
          visibility?: string
          approval_status?: string
          header_template?: string | null
          custom_instructions?: string[] | null
          is_sectionless?: boolean
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "question_papers_created_by_fkey"
            columns: ["created_by"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "question_papers_school_id_fkey"
            columns: ["school_id"]
            referencedRelation: "schools"
            referencedColumns: ["id"]
          }
        ]
      }
      paper_sections: {
        Row: {
          id: string
          paper_id: string
          title: string
          description: string | null
          display_order: number
          created_at: string
        }
        Insert: {
          id?: string
          paper_id: string
          title: string
          description?: string | null
          display_order: number
          created_at?: string
        }
        Update: {
          id?: string
          paper_id?: string
          title?: string
          description?: string | null
          display_order?: number
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "paper_sections_paper_id_fkey"
            columns: ["paper_id"]
            referencedRelation: "question_papers"
            referencedColumns: ["id"]
          }
        ]
      }
      paper_questions: {
        Row: {
          id: string
          paper_id: string
          section_id: string | null
          question_id: string
          display_order: number
          created_at: string
        }
        Insert: {
          id?: string
          paper_id: string
          section_id?: string | null
          question_id: string
          display_order: number
          created_at?: string
        }
        Update: {
          id?: string
          paper_id?: string
          section_id?: string | null
          question_id?: string
          display_order?: number
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "paper_questions_paper_id_fkey"
            columns: ["paper_id"]
            referencedRelation: "question_papers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "paper_questions_question_id_fkey"
            columns: ["question_id"]
            referencedRelation: "questions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "paper_questions_section_id_fkey"
            columns: ["section_id"]
            referencedRelation: "paper_sections"
            referencedColumns: ["id"]
          }
        ]
      }
      paper_collaborators: {
        Row: {
          id: string
          paper_id: string
          user_id: string
          created_at: string
        }
        Insert: {
          id?: string
          paper_id: string
          user_id: string
          created_at?: string
        }
        Update: {
          id?: string
          paper_id?: string
          user_id?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "paper_collaborators_paper_id_fkey"
            columns: ["paper_id"]
            referencedRelation: "question_papers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "paper_collaborators_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
