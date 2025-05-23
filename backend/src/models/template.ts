export interface Template {
  id: string; // UUID, primary key
  name: string; // text, e.g., "Modern Professional"
  description?: string; // text, optional
  thumbnail_url?: string; // text, optional, URL to a preview image
  // Consider defining a more specific type for the 'structure' JSONB
  // For example:
  // interface TemplateLayout {
  //   font_family?: string;
  //   font_size_body?: number;
  //   font_size_heading?: number;
  //   color_primary?: string;
  //   color_secondary?: string;
  //   section_order?: string[]; // e.g., ['personal_details', 'summary', 'experience', 'education']
  //   // ... other styling or structural properties
  // }
  // structure: TemplateLayout;
  structure: any; // JSONB, definition of the template structure or styling
  created_at: Date | string; // timestamp
  updated_at: Date | string; // timestamp
}
