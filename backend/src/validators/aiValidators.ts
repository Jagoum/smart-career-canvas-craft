import { z } from 'zod';

// For POST /api/resume/generate
export const generateResumeContentSchema = z.object({
  jobTitle: z.string().min(1, "Job title is required").max(100, "Job title too long"),
  skills: z.array(z.string().min(1).max(50)).min(1, "At least one skill is required"),
  experienceSummary: z.string().min(10, "Experience summary is too short").max(2000, "Experience summary too long"),
  outputFormat: z.enum(['json', 'text']).optional().default('json'),
});

// For POST /api/cover-letter/generate
export const generateCoverLetterContentSchema = z.object({
  jobDescription: z.string().min(20, "Job description is too short").max(5000, "Job description too long"),
  // userResumeData can be a string (e.g., plain text resume) or a JSON object
  userResumeData: z.union([
    z.string().min(20, "Resume data is too short").max(10000, "Resume data (text) too long"),
    z.object({}).passthrough().describe("Structured resume data as JSON object.")
  ]).describe("User's resume data, either as a string or a JSON object."),
});

// For POST /api/resume/review
export const reviewResumeContentSchema = z.object({
  resumeText: z.string().min(50, "Resume text is too short for review").max(15000, "Resume text too long").optional(),
  resumeJSON: z.object({}).passthrough().describe("Structured resume data as JSON object.").optional(),
}).refine(data => data.resumeText || data.resumeJSON, {
  message: "Either resumeText or resumeJSON must be provided for review.",
  path: ["resumeText", "resumeJSON"], // Path to highlight both fields if error occurs
});
