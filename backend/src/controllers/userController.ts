import { Response } from 'express';
import { supabase } from '../config/supabaseClient'; // Ensure this path is correct
import { UserProfile } from '../models'; // Assuming UserProfile is exported from models/index.ts

// The global type augmentation in src/types/express.d.ts handles 'req.user'
// No need to import AuthenticatedRequest if using global augmentation

export const getProfile = async (req: Express.Request, res: Response) => {
  if (!req.user || !req.user.sub) {
    // This case should ideally be handled by authMiddleware,
    // but as a safeguard:
    return res.status(401).json({ message: 'Unauthorized: User not authenticated.' });
  }

  const userId = req.user.sub;

  try {
    const { data, error, status } = await supabase
      .from('profiles') // Make sure 'profiles' is your actual table name
      .select('*') // Select all columns or specify needed ones: 'id, full_name, avatar_url'
      .eq('id', userId)
      .single(); // Expects a single row or null

    if (error && status !== 406) { // 406 is returned by PostgREST if 'single' finds no rows
      console.error('Error fetching profile:', error);
      return res.status(500).json({ message: 'Error fetching user profile.', error: error.message });
    }

    if (!data) {
      return res.status(404).json({ message: 'User profile not found.' });
    }

    // Cast to UserProfile if necessary, or ensure 'data' matches the interface
    const userProfile: UserProfile = data;
    return res.status(200).json(userProfile);

  } catch (err) {
    console.error('Unexpected error in getProfile:', err);
    // It's good practice to check the type of err if you want to provide more specific messages
    // For now, a generic server error.
    return res.status(500).json({ message: 'An unexpected error occurred.' });
  }
};
