import { Request, Response } from 'express';
import { supabase } from '../config/supabaseClient';
import { Template } from '../models'; // Assuming Template is exported from models/index.ts

export const getTemplates = async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabase
      .from('templates') // Make sure 'templates' is your actual table name
      .select('*'); // Select all columns or specify as needed

    if (error) {
      console.error('Error fetching templates:', error);
      return res.status(500).json({ message: 'Error fetching templates.', error: error.message });
    }

    if (!data) {
      // This case might not be strictly necessary if Supabase returns an empty array [] for no data
      // but it's a good safeguard if it could return null for "no table" or similar issues.
      return res.status(404).json({ message: 'No templates found.' });
    }

    // Cast to Template[] if necessary, or ensure 'data' matches the interface
    const templates: Template[] = data;
    return res.status(200).json(templates);

  } catch (err) {
    console.error('Unexpected error in getTemplates:', err);
    return res.status(500).json({ message: 'An unexpected error occurred while fetching templates.' });
  }
};
