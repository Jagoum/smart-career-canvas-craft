// Defines the structure for template layout and styling options
export interface TemplateLayout {
  font_family?: string;
  font_size_body?: number; // e.g., 10, 11, 12 (in points)
  font_size_heading?: number; // e.g., 14, 16, 18
  color_primary?: string; // Hex code or color name for primary text/accents
  color_secondary?: string; // Hex code or color name for secondary text/accents
  background_color?: string; // Hex code or color name for page background
  
  // Spacing and Margins (consider units like 'pt', 'mm', 'in')
  margin_top?: string;
  margin_bottom?: string;
  margin_left?: string;
  margin_right?: string;
  line_spacing?: number; // e.g., 1.0, 1.15, 1.5

  // Section specific styling (example)
  section_title_font_size?: number;
  section_title_font_weight?: 'normal' | 'bold';
  
  // Order of sections in the resume
  section_order?: ('personal_details' | 'summary' | 'experience' | 'education' | 'skills' | 'projects' | string)[]; 
  // Add other styling or structural properties as needed
  custom_css?: string; // For advanced users to inject raw CSS
}

export interface Template {
  id: string; // UUID, primary key
  name: string; // text, e.g., "Modern Professional"
  description?: string; // text, optional
  thumbnail_url?: string; // text, optional, URL to a preview image
  structure: TemplateLayout; // Use the more specific type
  created_at: Date | string; // ISO 8601 string format when type is string
  updated_at: Date | string; // ISO 8601 string format when type is string
}
