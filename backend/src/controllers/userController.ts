import { Request, Response } from 'express'; // Import Request
import { supabase } from '../config/supabaseClient'; // Ensure this path is correct
import { UserProfile } from '../models'; // Assuming UserProfile is exported from models/index.ts

// The global type augmentation in src/types/express.d.ts handles 'req.user'

export const getProfile = async (req: Request, res: Response) => {
  if (!req.user || !req.user.sub) {
    return res.status(401).json({
      success: false,
      error: {
        code: 'UNAUTHORIZED',
        message: 'User not authenticated.',
      },
    });
  }

  const userId = req.user.sub;

  try {
    const { data, error, status } = await supabase
      .from('profiles')
      .select('id, full_name, avatar_url, created_at, updated_at') // Example of specific column selection
      .eq('id', userId)
      .single();

    if (error && status !== 406) { // 406 is PostgREST for "No rows found" with .single()
      console.error('Supabase error fetching profile:', error);
      return res.status(status || 500).json({ // Use status from Supabase error if available
        success: false,
        error: {
          code: 'SUPABASE_ERROR',
          message: error.message || 'Error fetching user profile from database.',
          details: error,
        },
      });
    }

    if (!data) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'User profile not found.',
        },
      });
    }

    // Data successfully fetched
    return res.status(200).json({
      success: true,
      data: data as UserProfile, // Ensure data matches UserProfile structure
    });

  } catch (err) {
    console.error('Unexpected error in getProfile:', err);
    const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
    return res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'An unexpected error occurred while fetching the profile.',
        details: process.env.NODE_ENV === 'development' ? errorMessage : undefined,
      },
    });
  }
};
