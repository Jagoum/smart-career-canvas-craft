// Defines the structure for various sections within a resume's content.
// This content is typically stored as JSONB in the database.

export interface ResumeContactDetails {
  name?: string;
  email?: string;
  phone?: string;
  linkedin?: string;
  github?: string;
  website?: string;
  address?: string; // Could be a string or a structured address object
}

export interface ResumeExperienceEntry {
  job_title?: string;
  company_name?: string;
  location?: string; // e.g., "City, State" or "Remote"
  start_date?: string; // Consider using ISO 8601 format (YYYY-MM-DD) or just YYYY-MM
  end_date?: string;   // Same as start_date, or "Present"
  responsibilities?: string[]; // List of job duties or accomplishments
  achievements?: string[];     // Specific achievements, if separated
  // Or a single 'description' field using markdown or rich text might be an alternative
  // description?: string; 
}

export interface ResumeEducationEntry {
  degree?: string; // e.g., "B.S. in Computer Science"
  institution?: string;
  location?: string;
  graduation_date?: string; // YYYY-MM or YYYY
  gpa?: number | string; // e.g., 3.8 or "3.8/4.0"
  courses?: string[]; // Relevant coursework
  honors?: string[]; // e.g., "Dean's List", "Summa Cum Laude"
}

export interface ResumeSkillsSection {
  category?: string; // e.g., "Programming Languages", "Tools", "Soft Skills"
  skills_list?: string[];
}

// More flexible skills structure if not categorized:
// skills?: string[]; 
// or 
// skills?: { [category: string]: string[] }; // e.g., { "Technical": ["JS", "Python"], "Soft": ["Communication"] }


export interface ResumeProjectEntry {
  project_name?: string;
  description?: string;
  technologies_used?: string[];
  url?: string; // Link to live project or repository
  role?: string; // If part of a team project
}

// Optional additional sections
export interface ResumeAwardsEntry {
  award_name?: string;
  date_received?: string;
  awarding_body?: string;
  summary?: string;
}

export interface ResumeCustomSection {
  title: string; // User-defined title for the section
  items?: {
    heading?: string;
    subheading?: string;
    date_range?: string;
    details?: string | string[];
  }[];
  // Or a simpler structure:
  // content?: string; // Free-form text or markdown
}

// The main ResumeContent interface that aggregates all sections
export interface ResumeContent {
  personal_details?: ResumeContactDetails;
  summary?: string; // Professional summary or objective
  experience?: ResumeExperienceEntry[];
  education?: ResumeEducationEntry[];
  skills?: ResumeSkillsSection[] | { [category: string]: string[] } | string[]; // Allow for various skill structures
  projects?: ResumeProjectEntry[];
  awards?: ResumeAwardsEntry[];
  // Allows for user-defined sections in a structured way or as free text
  custom_sections?: ResumeCustomSection[]; 
  // Add other sections as needed: publications, references (typically "Available upon request")
  meta?: { // For storing metadata about the resume content itself
    ai_generated?: boolean;
    last_reviewed_by_ai?: Date | string; // ISO 8601 string format when type is string
    version?: number; // Version of the content structure
  };
}

export interface Resume {
  id: string; // UUID, primary key
  user_id: string; // UUID, foreign key to users.id or profiles.id
  title: string; // text, e.g., "Software Engineer Resume"
  content: ResumeContent; // Use the more specific type for JSONB structured data
  template_id?: string; // UUID, optional, foreign key to templates.id
  created_at: Date | string; // ISO 8601 string format when type is string
  updated_at: Date | string; // ISO 8601 string format when type is string
}
