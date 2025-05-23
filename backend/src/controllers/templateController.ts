import { Request, Response } from 'express';
import { supabase } from '../config/supabaseClient';
import { Template } from '../models';

export const getTemplates = async (req: Request, res: Response) => {
  // Validate and parse query parameters for pagination
  const page = parseInt(req.query.page as string, 10) || 1;
  const limit = parseInt(req.query.limit as string, 10) || 10;

  if (page < 1) return res.status(400).json({ message: 'Page number must be 1 or greater.' });
  if (limit < 1 || limit > 100) return res.status(400).json({ message: 'Limit must be between 1 and 100.' });

  const rangeStart = (page - 1) * limit;
  const rangeEnd = page * limit - 1;

  try {
    // Fetch a paginated list of templates and the total count for pagination metadata
    const { data, error, count } = await supabase
      .from('templates')
      .select('id, name, description, thumbnail_url, structure', { count: 'exact' }) // Include structure
      .range(rangeStart, rangeEnd);

    if (error) {
      console.error('Error fetching templates:', error);
      return res.status(500).json({ message: 'Error fetching templates.', error: error.message });
    }

    if (!data) {
      // Supabase returns an empty array if no data, so !data might not be the best check.
      // Check data.length if you want to return 404 for an empty list specifically.
      // However, an empty list is a valid response for a collection GET.
      return res.status(200).json({
        message: 'No templates found or page out of bounds.',
        data: [],
        pagination: {
          currentPage: page,
          totalPages: 0,
          totalItems: 0,
          itemsPerPage: limit,
        }
      });
    }
    
    const totalItems = count || 0;
    const totalPages = Math.ceil(totalItems / limit);

    return res.status(200).json({
      message: 'Templates fetched successfully.',
      data: data as Template[], // Cast to Template[]
      pagination: {
        currentPage: page,
        totalPages: totalPages,
        totalItems: totalItems,
        itemsPerPage: limit,
      }
    });

  } catch (err) {
    console.error('Unexpected error in getTemplates:', err);
    // Check if err is an instance of Error for safer message access
    const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred.';
    return res.status(500).json({ message: 'An unexpected error occurred while fetching templates.', error: errorMessage });
  }
};
