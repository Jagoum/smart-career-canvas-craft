import { z } from 'zod';

// Zod schema for ResumeContactDetails
const resumeContactDetailsSchema = z.object({
  name: z.string().max(100).optional(),
  email: z.string().email("Invalid email format").max(100).optional(),
  phone: z.string().max(30).optional(), // Simple string for phone, could be more complex
  linkedin: z.string().url("Invalid LinkedIn URL").max(255).optional(),
  github: z.string().url("Invalid GitHub URL").max(255).optional(),
  website: z.string().url("Invalid website URL").max(255).optional(),
  address: z.string().max(255).optional(),
}).strict("Unexpected fields in contact details.").optional();

// Zod schema for ResumeExperienceEntry
const resumeExperienceEntrySchema = z.object({
  job_title: z.string().max(100).optional(),
  company_name: z.string().max(100).optional(),
  location: z.string().max(100).optional(),
  start_date: z.string().max(20).optional(), // Consider date validation if specific format needed
  end_date: z.string().max(20).optional(),   // Or "Present"
  responsibilities: z.array(z.string().max(500)).optional(),
  achievements: z.array(z.string().max(500)).optional(),
  description: z.string().max(2000).optional(),
}).strict("Unexpected fields in experience entry.").optional();

// Zod schema for ResumeEducationEntry
const resumeEducationEntrySchema = z.object({
  degree: z.string().max(100).optional(),
  institution: z.string().max(100).optional(),
  location: z.string().max(100).optional(),
  graduation_date: z.string().max(20).optional(),
  gpa: z.union([z.number().min(0).max(5), z.string().max(10)]).optional(), // GPA as number or string
  courses: z.array(z.string().max(100)).optional(),
  honors: z.array(z.string().max(100)).optional(),
}).strict("Unexpected fields in education entry.").optional();

// Zod schema for ResumeSkillsSection
const resumeSkillsSectionSchema = z.object({
  category: z.string().max(50).optional(),
  skills_list: z.array(z.string().max(50)).optional(),
}).strict("Unexpected fields in skills section.").optional();

// More flexible skills structure validation
const flexibleSkillsSchema = z.union([
  z.array(resumeSkillsSectionSchema), // Array of categorized skills
  z.record(z.string().max(50), z.array(z.string().max(50))), // Object with category keys
  z.array(z.string().max(50)) // Simple array of skills
]).optional();


// Zod schema for ResumeProjectEntry
const resumeProjectEntrySchema = z.object({
  project_name: z.string().max(100).optional(),
  description: z.string().max(2000).optional(),
  technologies_used: z.array(z.string().max(50)).optional(),
  url: z.string().url("Invalid project URL").max(255).optional(),
  role: z.string().max(100).optional(),
}).strict("Unexpected fields in project entry.").optional();

// Zod schema for ResumeAwardsEntry
const resumeAwardsEntrySchema = z.object({
  award_name: z.string().max(100).optional(),
  date_received: z.string().max(20).optional(),
  awarding_body: z.string().max(100).optional(),
  summary: z.string().max(500).optional(),
}).strict("Unexpected fields in awards entry.").optional();

// Zod schema for ResumeCustomSection items
const resumeCustomSectionItemSchema = z.object({
    heading: z.string().max(100).optional(),
    subheading: z.string().max(100).optional(),
    date_range: z.string().max(50).optional(),
    details: z.union([z.string().max(2000), z.array(z.string().max(500))]).optional(),
}).strict("Unexpected fields in custom section item.").optional();

// Zod schema for ResumeCustomSection
const resumeCustomSectionSchema = z.object({
  title: z.string().min(1, "Custom section title is required").max(100),
  items: z.array(resumeCustomSectionItemSchema).optional(),
  content: z.string().max(5000).optional(), // For free-form text
}).strict("Unexpected fields in custom section.").optional();


// Zod schema for ResumeContent (main content structure)
const resumeContentSchema = z.object({
  personal_details: resumeContactDetailsSchema,
  summary: z.string().max(5000).optional(),
  experience: z.array(resumeExperienceEntrySchema).optional(),
  education: z.array(resumeEducationEntrySchema).optional(),
  skills: flexibleSkillsSchema,
  projects: z.array(resumeProjectEntrySchema).optional(),
  awards: z.array(resumeAwardsEntrySchema).optional(),
  custom_sections: z.array(resumeCustomSectionSchema).optional(),
  meta: z.object({
    ai_generated: z.boolean().optional(),
    last_reviewed_by_ai: z.string().datetime({ message: "Invalid date format for last AI review" }).optional(),
    version: z.number().int().optional(),
  }).strict("Unexpected fields in meta object.").optional(),
}).strict("Unexpected fields in resume content.").optional(); // Make the whole content optional or ensure it's always present

// Updated schema for saving a resume
export const saveResumeSchema = z.object({
  title: z.string().min(1, "Title is required").max(255, "Title must be 255 characters or less"),
  content: resumeContentSchema.refine(val => val !== undefined && Object.keys(val).length > 0, {
    message: "Resume content cannot be empty or undefined.", 
  }), // Content must be provided and not empty
  template_id: z.string().uuid("Invalid template ID format").optional().nullable(),
});

// Schema for req.params for getResumeById (remains the same)
export const getResumeByIdParamsSchema = z.object({
    id: z.string().uuid("Invalid resume ID format in URL parameter"),
});
