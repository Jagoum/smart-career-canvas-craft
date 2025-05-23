import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const apiKey = process.env.OPENAI_API_KEY;

if (!apiKey) {
  console.error('OPENAI_API_KEY is not set in environment variables.');
  // Depending on policy, you might throw an error to stop the app from starting,
  // or allow it to run with AI features disabled (though throwing is safer for dev).
  throw new Error('OpenAI API key is missing. AI features will be disabled.');
}

const openai = new OpenAI({
  apiKey: apiKey,
});

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
  try {
    console.log(`Sending request to OpenAI with model: ${model}, temp: ${temperature}, maxTokens: ${maxTokens}`);
    console.log(`System Prompt: ${systemPrompt.substring(0,100)}...`); // Log beginning of prompt
    console.log(`User Prompt: ${userPrompt.substring(0,100)}...`);


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
// (e.g., embeddings, fine-tuning, etc.)
export default openai;
