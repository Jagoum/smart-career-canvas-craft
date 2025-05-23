// Define a more specific type for the 'config' JSONB structure
export interface AIModelConfig {
  model_name?: string; // e.g., 'gpt-3.5-turbo', 'claude-2', 'gpt-4'
  temperature?: number; // 0.0 - 2.0 (OpenAI's range for some models)
  max_tokens?: number;
  top_p?: number;
  frequency_penalty?: number; // -2.0 to 2.0
  presence_penalty?: number;  // -2.0 to 2.0
  // Add other model-specific parameters as needed
  // For example, stop sequences:
  // stop?: string | string[]; 
}

export interface AIPersonality {
  id: string; // UUID, primary key
  name: string; // text, e.g., "Friendly Helper", "Formal Advisor"
  description?: string; // text, optional
  system_prompt: string; // text, the base prompt for the AI model
  config: AIModelConfig; // Use the more specific type
  created_at: Date | string; // ISO 8601 string format when type is string
  updated_at: Date | string; // ISO 8601 string format when type is string
}
