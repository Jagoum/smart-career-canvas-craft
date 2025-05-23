import { Response } from 'express';
import { generateTextCompletion, AICompletionParams } from '../services/aiService'; // Assuming AICompletionParams is exported
// AuthenticatedRequest will be available globally via src/types/express.d.ts

// 1. Resume Generation
export const generateResumeContent = async (req: Express.Request, res: Response) => {
  if (!req.user || !req.user.sub) {
    return res.status(401).json({ message: 'Unauthorized: User not authenticated.' });
  }

  const { jobTitle, skills, experienceSummary, outputFormat = 'json' } = req.body;

  // Basic Input Validation
  if (!jobTitle || !skills || !experienceSummary) {
    return res.status(400).json({ message: 'Missing required fields: jobTitle, skills, experienceSummary.' });
  }
  if (!Array.isArray(skills) || skills.some(s => typeof s !== 'string')) {
    return res.status(400).json({ message: 'Skills must be an array of strings.' });
  }

  const systemPrompt = `You are an expert resume writing assistant. Generate professional resume content based on the user's input. Output in ${outputFormat.toLowerCase() === 'json' ? 'JSON format with sections like "summary", "experience" (as an array of objects with "job_title", "company", "dates", "responsibilities"), "education" (as an array of objects with "degree", "institution", "graduation_date"), "skills" (categorized if possible e.g. technical, soft)' : 'a well-structured text format'}.`;
  const userPrompt = `Based on the following details:
Job Title: ${jobTitle}
Key Skills: ${skills.join(', ')}
Experience Summary: ${experienceSummary}
Generate a professional resume.`;

  try {
    const aiParams: AICompletionParams = { systemPrompt, userPrompt, temperature: 0.5, maxTokens: 2000 };
    const generatedContent = await generateTextCompletion(aiParams);

    if (!generatedContent) {
      return res.status(500).json({ message: 'AI service returned no content.' });
    }

    if (outputFormat.toLowerCase() === 'json') {
      try {
        const jsonContent = JSON.parse(generatedContent);
        return res.status(200).json(jsonContent);
      } catch (parseError) {
        console.error('Failed to parse AI response as JSON:', parseError);
        // Return as text if JSON parsing fails, with a note or specific handling.
        return res.status(200).json({ message: "AI generated content, but it was not valid JSON. Raw content included.", rawContent: generatedContent });
      }
    } else {
      return res.status(200).send(generatedContent);
    }

  } catch (error: any) {
    console.error('Error in generateResumeContent:', error);
    return res.status(500).json({ message: error.message || 'Failed to generate resume content due to an AI service error.' });
  }
};

// 2. Cover Letter Generation
export const generateCoverLetterContent = async (req: Express.Request, res: Response) => {
  if (!req.user || !req.user.sub) {
    return res.status(401).json({ message: 'Unauthorized: User not authenticated.' });
  }

  const { jobDescription, userResumeData } = req.body;

  if (!jobDescription || !userResumeData) {
    return res.status(400).json({ message: 'Missing required fields: jobDescription, userResumeData.' });
  }

  const systemPrompt = "You are an expert cover letter writing assistant. Generate a tailored and professional cover letter based on the provided job description and user's resume context. The tone should be professional and enthusiastic.";
  const userPrompt = `Generate a cover letter for the following job description:\n"${jobDescription}"\n\nUse the following resume information for context:\n"${typeof userResumeData === 'string' ? userResumeData : JSON.stringify(userResumeData, null, 2)}"`;

  try {
    const aiParams: AICompletionParams = { systemPrompt, userPrompt, temperature: 0.7, maxTokens: 1000 };
    const generatedContent = await generateTextCompletion(aiParams);

    if (!generatedContent) {
      return res.status(500).json({ message: 'AI service returned no content.' });
    }
    return res.status(200).send(generatedContent); // Cover letters are typically text

  } catch (error: any) {
    console.error('Error in generateCoverLetterContent:', error);
    return res.status(500).json({ message: error.message || 'Failed to generate cover letter due to an AI service error.' });
  }
};

// 3. Resume Review
export const reviewResumeContent = async (req: Express.Request, res: Response) => {
  if (!req.user || !req.user.sub) {
    return res.status(401).json({ message: 'Unauthorized: User not authenticated.' });
  }

  const { resumeText, resumeJSON } = req.body; // Expecting one of these

  if (!resumeText && !resumeJSON) {
    return res.status(400).json({ message: 'Missing resume data: provide either resumeText or resumeJSON.' });
  }

  const resumeDataToReview = resumeText || (resumeJSON ? JSON.stringify(resumeJSON, null, 2) : "");

  if (resumeDataToReview.trim() === "") {
    return res.status(400).json({ message: 'Resume content is empty.' });
  }

  const systemPrompt = "You are an expert resume reviewer. Provide constructive feedback on the following resume, focusing on clarity, grammar, impact, ATS compatibility, and overall structure. Format your feedback clearly, perhaps using sections or bullet points for different aspects of the review.";
  const userPrompt = `Please review the following resume:\n\n"${resumeDataToReview}"`;

  try {
    const aiParams: AICompletionParams = { systemPrompt, userPrompt, temperature: 0.6, maxTokens: 1500 };
    const generatedContent = await generateTextCompletion(aiParams);

    if (!generatedContent) {
      return res.status(500).json({ message: 'AI service returned no content for the review.' });
    }
    return res.status(200).send(generatedContent); // Review is typically text

  } catch (error: any) {
    console.error('Error in reviewResumeContent:', error);
    return res.status(500).json({ message: error.message || 'Failed to review resume due to an AI service error.' });
  }
};
