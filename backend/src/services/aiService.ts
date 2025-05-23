import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const apiKey = process.env.OPENAI_API_KEY;
let openai: OpenAI | null = null;

if (!apiKey) {
  if (process.env.NODE_ENV === 'production') {
    console.warn('OPENAI_API_KEY is not set. AI features will be disabled in production.');
  } else {
    console.error('OPENAI_API_KEY is not set in environment variables. AI features will be disabled.');
    // Optional: throw error in non-production to make it more obvious during development
    // throw new Error('OpenAI API key is missing. AI features will be disabled.');
  }
} else {
  openai = new OpenAI({
    apiKey: apiKey,
  });
  console.log('OpenAI client initialized.');
}

export interface AICompletionParams {
  systemPrompt: string;
  userPrompt: string;
  model?: string;
  temperature?: number;
  maxTokens?: number;
  // Add other potential parameters like topP, frequencyPenalty, presencePenalty if needed
}

export const generateTextCompletion = async ({
  systemPrompt,
  userPrompt,
  model = 'gpt-3.5-turbo', // Default model
  temperature = 0.7,      // Default temperature
  maxTokens = 1500,       // Default max tokens for more comprehensive outputs
}: AICompletionParams): Promise<string | null> => {
  if (!openai) {
    console.error('OpenAI client is not initialized. Cannot generate text completion.');
    // Return a specific error message or null, depending on how controllers should handle this
    throw new Error('AI service is not available due to missing API key.'); 
    // Or return null; and let controller handle: return null;
  }

  try {
    // Modified logging to avoid exposing sensitive prompt data
    console.log(`Sending AI request to model: ${model} with temp: ${temperature}, maxTokens: ${maxTokens}. System and user prompts are set.`);

    const completion = await openai.chat.completions.create({
      model: model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: temperature,
      max_tokens: maxTokens,
      // top_p: topP, // Example of an additional parameter
    });

    const content = completion.choices[0]?.message?.content?.trim();
    
    if (content) {
      console.log(`Received content from OpenAI. Length: ${content.length}`);
    } else {
      console.warn('OpenAI returned no content for the completion.');
    }
    
    return content || null;

  } catch (error) {
    console.error('Error calling OpenAI API:');
    if (error instanceof OpenAI.APIError) {
      console.error(`Status: ${error.status}`);
      console.error(`Type: ${error.type}`);
      console.error(`Code: ${error.code}`);
      console.error(`Message: ${error.message}`);
      console.error(`Headers: ${JSON.stringify(error.headers)}`);
      // Rethrow a more specific error or a generic one for the controller
      throw new Error(`OpenAI API Error: ${error.message} (Status: ${error.status})`);
    } else {
      console.error('An unexpected error occurred:', error);
      throw new Error('An unexpected error occurred while communicating with OpenAI.');
    }
  }
};

// Exporting the client instance if it needs to be used directly for other types of operations
// (e.g., embeddings, fine-tuning, etc.). It might be null if API key is missing.
export default openai; 
