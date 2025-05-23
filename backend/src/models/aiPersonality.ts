// Consider defining a more specific type for the 'config' JSONB structure
// For example:
// interface AIModelConfig {
//   model_name?: string; // e.g., 'gpt-3.5-turbo', 'claude-2'
//   temperature?: number; // 0.0 - 1.0 (or higher depending on model)
//   max_tokens?: number;
//   top_p?: number;
//   frequency_penalty?: number;
//   presence_penalty?: number;
//   // ... other model-specific parameters
// }

export interface AIPersonality {
  id: string; // UUID, primary key
  name: string; // text, e.g., "Friendly Helper", "Formal Advisor"
  description?: string; // text, optional
  system_prompt: string; // text, the base prompt for the AI model
  // config: AIModelConfig; // Use the more specific type if defined
  config: any; // JSONB, e.g., model parameters like temperature, max tokens
  created_at: Date | string; // timestamp
}
