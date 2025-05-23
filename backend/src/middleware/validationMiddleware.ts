import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError } from 'zod';

interface ValidationSchemas {
  body?: AnyZodObject;
  query?: AnyZodObject;
  params?: AnyZodObject;
}

export const validate = (schemas: ValidationSchemas) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (schemas.body) {
        req.body = await schemas.body.parseAsync(req.body);
      }
      if (schemas.query) {
        req.query = await schemas.query.parseAsync(req.query);
      }
      if (schemas.params) {
        req.params = await schemas.params.parseAsync(req.params);
      }
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          success: false, // Standardized error response
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Input validation failed.',
            details: error.errors.map(e => ({
              path: e.path.join('.'),
              message: e.message,
              code: e.code,
            })),
          }
        });
      }
      // Handle other unexpected errors during validation
      console.error('Unexpected error during validation middleware:', error);
      return res.status(500).json({ 
        success: false,
        error: {
          code: 'INTERNAL_VALIDATION_ERROR',
          message: 'Internal server error during input validation.'
        }
      });
    }
  };
