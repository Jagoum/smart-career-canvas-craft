export const sanitizeSimpleInput = (input: string): string => {
  // Basic sanitization: remove characters that might easily break out of intended prompt structure
  // This is not a comprehensive XSS or SQL injection sanitizer.
  // Focus on characters that might interfere with prompt interpretation by the LLM.
  return input.replace(/[`{{}}]/g, ''); // Remove backticks and curly braces
};

export const sanitizeSimpleArray = (inputs: string[]): string[] => {
  return inputs.map(sanitizeSimpleInput);
};
