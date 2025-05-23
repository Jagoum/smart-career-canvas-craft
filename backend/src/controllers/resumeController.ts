import { Request, Response } from 'express'; // Import Request
import { supabase } from '../config/supabaseClient';
import { Resume } from '../models'; // Assuming Resume is exported from models/index.ts
// AuthenticatedRequest will be available globally via src/types/express.d.ts

export const saveResume = async (req: Request, res: Response) => {
  if (!req.user || !req.user.sub) {
    return res.status(401).json({ message: 'Unauthorized: User not authenticated.' });
  }
  const userId = req.user.sub;

  const { title, content, template_id } = req.body as Partial<Resume>;

  // Basic Input Validation
  if (!title || title.trim() === '') {
    return res.status(400).json({ message: 'Title is required.' });
  }
  if (!content) { // Content can be a complex object, so just checking for presence
    return res.status(400).json({ message: 'Content is required.' });
  }

  try {
    const newResume: Partial<Resume> = {
      user_id: userId,
      title,
      content,
      template_id, // This can be null/undefined if not provided
    };

    const { data, error, status } = await supabase
      .from('resumes')
      .insert(newResume)
      .select() // Return the created record
      .single(); // Expect a single created record

    if (error) {
      console.error('Error saving resume:', error);
      if (error.code === '23503' && error.details?.includes('template_id')) { // Foreign key violation for template_id
        return res.status(400).json({ message: 'Invalid template_id provided.', error: error.message });
      }
      return res.status(500).json({ message: 'Error saving resume.', error: error.message });
    }

    if (!data) {
        // This case should ideally not happen if insert was successful without error
        return res.status(500).json({ message: 'Resume created but data not returned.' });
    }
    
    return res.status(201).json(data as Resume);

  } catch (err) {
    console.error('Unexpected error in saveResume:', err);
    // Check if err is an instance of Error to safely access err.message
    const message = err instanceof Error ? err.message : 'An unexpected error occurred.';
    return res.status(500).json({ message });
  }
};

export const getResumeById = async (req: Request, res: Response) => {
  if (!req.user || !req.user.sub) {
    return res.status(401).json({ message: 'Unauthorized: User not authenticated.' });
  }
  const userId = req.user.sub;
  const { id: resumeId } = req.params;

  if (!resumeId) {
    return res.status(400).json({ message: 'Resume ID is required in URL parameters.' });
  }

  try {
    const { data, error, status } = await supabase
      .from('resumes')
      .select('*')
      .eq('id', resumeId)
      .eq('user_id', userId) // Crucial check: user can only fetch their own resumes
      .single();

    if (error && status !== 406) { // 406 is PostgREST code for "Not a single item returned"
      console.error('Error fetching resume by ID:', error);
      return res.status(500).json({ message: 'Error fetching resume.', error: error.message });
    }

    if (!data) {
      // This covers both "not found" and "not authorized" (to prevent leaking info)
      return res.status(404).json({ message: 'Resume not found or you do not have permission to view it.' });
    }

    return res.status(200).json(data as Resume);

  } catch (err) {
    console.error('Unexpected error in getResumeById:', err);
    const message = err instanceof Error ? err.message : 'An unexpected error occurred.';
    return res.status(500).json({ message });
  }
};
