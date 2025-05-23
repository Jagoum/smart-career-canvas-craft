import { Request, Response } from 'express';
import { generateTextCompletion, AICompletionParams } from '../services/aiService';
import { sanitizeSimpleInput, sanitizeSimpleArray } from '../utils/promptUtils';
// Assuming resumeContentSchema is part of saveResumeSchema or a standalone export
// from resumeValidators.ts. If it's nested, adjust import.
// For this example, let's assume resumeContentSchema is a top-level export for clarity.
// We created a detailed resumeContentSchema inside resumeValidators.ts, but it was not exported directly.
// Let's assume it is now exported for use here.
// If not, we would need to re-define or import it appropriately.
// For the purpose of this change, we will need to ensure resumeContentSchema is available.
// Let's assume it's part of saveResumeSchema.content for now.
import { saveResumeSchema } from '../validators/resumeValidators'; // This contains resumeContentSchema within it.
                                                                 // We need to extract it or have it exported separately.
                                                                 // For now, this import is a placeholder for where the schema lives.
                                                                 // Actual use will need direct access to 'resumeContentSchema'.

// Placeholder: Actual resumeContentSchema would be imported from resumeValidators.ts
// For this diff, we'll reference saveResumeSchema.shape.content (assuming Zod object structure)
// This might need adjustment based on how resumeContentSchema is actually defined and exported.

// 1. Resume Generation
export const generateResumeContent = async (req: Request, res: Response) => {
  if (!req.user || !req.user.sub) {
    // Using standardized error format
    return res.status(401).json({ 
      success: false, 
      error: { 
        code: 'UNAUTHORIZED', 
        message: 'User not authenticated.' 
      } 
    });
  }

  // Assuming Zod validation has already run via middleware
  const { jobTitle: rawJobTitle, skills: rawSkills, experienceSummary: rawExperienceSummary, outputFormat = 'json' } = req.body;

  // Sanitize inputs
  const jobTitle = sanitizeSimpleInput(rawJobTitle);
  const skills = sanitizeSimpleArray(rawSkills);
  const experienceSummary = sanitizeSimpleInput(rawExperienceSummary);

  const systemPrompt = `You are an expert resume writing assistant. Generate professional resume content based on the user's input. Output in ${outputFormat.toLowerCase() === 'json' ? 'JSON format with sections like "summary", "experience" (as an array of objects with "job_title", "company", "dates", "responsibilities"), "education" (as an array of objects with "degree", "institution", "graduation_date"), "skills" (categorized if possible e.g. technical, soft)' : 'a well-structured text format'}.`;
  const userPrompt = `Based on the following details:
Job Title: ${jobTitle}
Key Skills: ${skills.join(', ')} 
Experience Summary: ${experienceSummary}
Generate a professional resume.`;

  try {
    // Note: systemPrompt is generally safe as it's dev-controlled. User-controlled parts are sanitized.
    const aiParams: AICompletionParams = { systemPrompt, userPrompt, temperature: 0.5, maxTokens: 2000 };
    const generatedContent = await generateTextCompletion(aiParams);

    if (!generatedContent) {
      return res.status(500).json({ 
        success: false, 
        error: { 
          code: 'AI_NO_CONTENT', 
          message: 'AI service returned no content.' 
        } 
      });
    }

    if (outputFormat.toLowerCase() === 'json') {
      let jsonContent;
      try {
        jsonContent = JSON.parse(generatedContent);
      } catch (parseError) {
        console.error('AI response: Failed to parse as JSON.', parseError);
        return res.status(500).json({ 
          success: false, 
          error: { 
            code: 'AI_JSON_PARSE_ERROR', 
            message: 'AI service generated invalid JSON.' 
          } 
        });
      }

      // Assuming resumeContentSchema is directly available for validation.
      // In resumeValidators.ts, resumeContentSchema is not exported directly.
      // We need to use saveResumeSchema.shape.content to access the Zod schema for content.
      const resumeContentSchemaForValidation = saveResumeSchema.shape.content;
      const validationResult = resumeContentSchemaForValidation.safeParse(jsonContent);

      if (!validationResult.success) {
        console.error('AI response: JSON structure validation failed.', validationResult.error);
        return res.status(500).json({ 
          success: false, 
          error: { 
            code: 'AI_JSON_VALIDATION_ERROR', 
            message: 'AI service generated JSON with an unexpected structure.',
            details: validationResult.error.flatten().fieldErrors 
          } 
        });
      }
      // If validation passes, validationResult.data is the typed and validated content
      return res.status(200).json({ success: true, data: validationResult.data });
    } else {
      // For text format
      return res.status(200).json({ success: true, data: generatedContent }); // Standardized success response
    }

  } catch (error: any) {
    console.error('Error in generateResumeContent:', error);
    return res.status(500).json({ 
      success: false, 
      error: { 
        code: 'AI_SERVICE_ERROR', 
        message: error.message || 'Failed to generate resume content due to an AI service error.' 
      } 
    });
  }
};

// 2. Cover Letter Generation
export const generateCoverLetterContent = async (req: Request, res: Response) => {
  if (!req.user || !req.user.sub) {
    return res.status(401).json({ 
      success: false, 
      error: { 
        code: 'UNAUTHORIZED', 
        message: 'User not authenticated.' 
      } 
    });
  }

  const { jobDescription: rawJobDescription, userResumeData: rawUserResumeData } = req.body;

  // Sanitize inputs
  const jobDescription = sanitizeSimpleInput(rawJobDescription);
  let userResumeData;
  if (typeof rawUserResumeData === 'string') {
    userResumeData = sanitizeSimpleInput(rawUserResumeData);
  } else {
    // If it's an object, we might need a deeper sanitization strategy if its structure is complex
    // For now, stringify and sanitize the stringified version for inclusion in prompt.
    // This is a basic approach; complex objects might need recursive sanitization.
    userResumeData = sanitizeSimpleInput(JSON.stringify(rawUserResumeData, null, 2));
  }


  const systemPrompt = "You are an expert cover letter writing assistant. Generate a tailored and professional cover letter based on the provided job description and user's resume context. The tone should be professional and enthusiastic.";
  const userPrompt = `Generate a cover letter for the following job description:\n"${jobDescription}"\n\nUse the following resume information for context:\n"${userResumeData}"`;

  try {
    const aiParams: AICompletionParams = { systemPrompt, userPrompt, temperature: 0.7, maxTokens: 1000 };
    const generatedContent = await generateTextCompletion(aiParams);

    if (!generatedContent) {
      return res.status(500).json({ 
        success: false, 
        error: { 
          code: 'AI_NO_CONTENT', 
          message: 'AI service returned no content for cover letter.' 
        } 
      });
    }
    // Standardized success response for text content
    return res.status(200).json({ success: true, data: generatedContent }); 

  } catch (error: any) {
    console.error('Error in generateCoverLetterContent:', error);
    return res.status(500).json({ 
      success: false, 
      error: { 
        code: 'AI_SERVICE_ERROR', 
        message: error.message || 'Failed to generate cover letter due to an AI service error.' 
      } 
    });
  }
};

// 3. Resume Review
export const reviewResumeContent = async (req: Request, res: Response) => {
  if (!req.user || !req.user.sub) {
    return res.status(401).json({ 
      success: false, 
      error: { 
        code: 'UNAUTHORIZED', 
        message: 'User not authenticated.' 
      } 
    });
  }

  const { resumeText: rawResumeText, resumeJSON: rawResumeJSON } = req.body;

  let resumeDataToReview;
  if (rawResumeText) {
    resumeDataToReview = sanitizeSimpleInput(rawResumeText);
  } else if (rawResumeJSON) {
    // Similar to cover letter, stringify and sanitize. Consider deeper sanitization for complex objects.
    resumeDataToReview = sanitizeSimpleInput(JSON.stringify(rawResumeJSON, null, 2));
  } else {
    // This case should be caught by Zod validation, but as a safeguard:
    return res.status(400).json({ 
      success: false, 
      error: { 
        code: 'VALIDATION_ERROR', 
        message: 'Missing resume data: provide either resumeText or resumeJSON.' 
      } 
    });
  }

  if (resumeDataToReview.trim() === "") {
    return res.status(400).json({ 
      success: false, 
      error: { 
        code: 'VALIDATION_ERROR', 
        message: 'Resume content is empty after sanitization or was initially empty.' 
      } 
    });
  }

  const systemPrompt = "You are an expert resume reviewer. Provide constructive feedback on the following resume, focusing on clarity, grammar, impact, ATS compatibility, and overall structure. Format your feedback clearly, perhaps using sections or bullet points for different aspects of the review.";
  const userPrompt = `Please review the following resume:\n\n"${resumeDataToReview}"`;

  try {
    const aiParams: AICompletionParams = { systemPrompt, userPrompt, temperature: 0.6, maxTokens: 1500 };
    const generatedContent = await generateTextCompletion(aiParams);

    if (!generatedContent) {
      return res.status(500).json({ 
        success: false, 
        error: { 
          code: 'AI_NO_CONTENT', 
          message: 'AI service returned no content for resume review.' 
        } 
      });
    }
    // Standardized success response for text content
    return res.status(200).json({ success: true, data: generatedContent });

  } catch (error: any) {
    console.error('Error in reviewResumeContent:', error);
    return res.status(500).json({ 
      success: false, 
      error: { 
        code: 'AI_SERVICE_ERROR', 
        message: error.message || 'Failed to review resume due to an AI service error.' 
      } 
    });
  }
};
