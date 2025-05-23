import { Response, NextFunction, Request } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config(); // Ensure environment variables are loaded

// The global type augmentation in src/types/express.d.ts handles 'req.user'.
// No need for a local AuthenticatedRequest interface here.

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized: No token provided or incorrect format.' });
  }

  const token = authHeader.split(' ')[1];
  const jwtSecret = process.env.SUPABASE_JWT_SECRET;

  if (!jwtSecret) {
    console.error('SUPABASE_JWT_SECRET is not set in environment variables.');
    // It's important to not leak sensitive error details to the client in production.
    // For now, returning a generic message.
    return res.status(500).json({ message: 'Server configuration error. Please check server logs.' });
  }

  try {
    // The type of 'decoded' will be inferred by jwt.verify.
    // If using the global Express.Request type, req.user should match its definition.
    const decoded = jwt.verify(token, jwtSecret, { algorithms: ['HS256'] });

    // Ensure the decoded payload has a 'sub' property, consistent with our global type.
    if (typeof decoded === 'object' && decoded !== null && 'sub' in decoded) {
      // Now TypeScript knows req.user can be assigned this shape if the global type is compatible.
      req.user = decoded as { sub: string; [key: string]: any; };
    } else {
      // Handle cases where token is valid but doesn't contain 'sub' as expected.
      // This might be an issue with token generation or an unexpected token type.
      console.error('Token decoded successfully but is missing the "sub" property.');
      return res.status(401).json({ message: 'Unauthorized: Invalid token payload structure.' });
    }
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ message: 'Unauthorized: Token expired.' });
    }
    if (error instanceof jwt.JsonWebTokenError) {
      // This covers invalid signature, malformed token, etc.
      return res.status(401).json({ message: 'Unauthorized: Invalid token.' });
    }
    // Generic fallback for other errors during verification
    console.error('Error verifying token:', error);
    return res.status(401).json({ message: 'Unauthorized.' });
  }
};

export default authMiddleware;
