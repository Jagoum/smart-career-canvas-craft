export interface CoverLetter {
  id: string; // UUID, primary key
  user_id: string; // UUID, foreign key to users.id or profiles.id
  resume_id?: string; // UUID, optional, if based on a specific resume
  job_description: string; // text, the job ad it's tailored for
  content: string | any; // text or JSONB, the generated cover letter (consider a more specific type for JSONB)
  created_at: Date | string; // timestamp
  updated_at: Date | string; // timestamp
}
