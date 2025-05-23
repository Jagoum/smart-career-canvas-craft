import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError } from 'zod';

export const validateBody = (schema: AnyZodObject) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          message: 'Validation failed',
          errors: error.errors.map(e => ({
            path: e.path.join('.'),
            message: e.message,
            code: e.code,
          })),
        });
      }
      // Handle other unexpected errors during validation
      console.error('Unexpected error during validation:', error);
      return res.status(500).json({ message: 'Internal server error during validation' });
    }
  };
