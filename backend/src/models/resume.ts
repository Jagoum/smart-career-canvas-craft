// Consider defining a more specific type for the 'content' JSONB structure
// For example:
// interface ResumeContactDetails {
//   name?: string;
//   email?: string;
//   phone?: string;
//   linkedin?: string;
//   github?: string;
//   website?: string;
//   address?: string;
// }

// interface ResumeExperience {
//   job_title?: string;
//   company_name?: string;
//   location?: string;
//   start_date?: string; // Or Date
//   end_date?: string;   // Or Date, or 'Present'
//   responsibilities?: string[];
//   achievements?: string[];
// }

// interface ResumeEducation {
//   degree?: string;
//   institution?: string;
//   location?: string;
//   graduation_date?: string; // Or Date
//   gpa?: number;
//   courses?: string[];
// }

// interface ResumeSkills {
//   technical?: string[];
//   soft?: string[];
//   languages?: string[];
// }

// interface ResumeProjects {
//   project_name?: string;
//   description?: string;
//   technologies_used?: string[];
//   url?: string;
// }

// export interface ResumeContent {
//   personal_details?: ResumeContactDetails;
//   summary?: string;
//   experience?: ResumeExperience[];
//   education?: ResumeEducation[];
//   skills?: ResumeSkills;
//   projects?: ResumeProjects[];
//   // Add other sections as needed: awards, publications, references etc.
// }

export interface Resume {
  id: string; // UUID, primary key
  user_id: string; // UUID, foreign key to users.id or profiles.id
  title: string; // text, e.g., "Software Engineer Resume"
  content: any; // JSONB or JSON, to store structured resume data
  // For a more typed approach, replace 'any' with 'ResumeContent' (defined above)
  // content: ResumeContent;
  template_id?: string; // UUID, optional, foreign key to templates.id
  created_at: Date | string; // timestamp
  updated_at: Date | string; // timestamp
}
