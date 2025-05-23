export interface UserProfile {
  id: string; // UUID, typically matches auth.users.id
  created_at: Date | string; // ISO 8601 string format when type is string
  updated_at: Date | string; // ISO 8601 string format when type is string
  full_name?: string;
  avatar_url?: string;
  // Add any other profile-specific information here
  // For example:
  // username?: string;
  // website?: string;
  // bio?: string;
}
