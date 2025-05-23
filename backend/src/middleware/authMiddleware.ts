import { Response, NextFunction, Request } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config(); // Ensure environment variables are loaded

// Define a custom Request type
export interface AuthenticatedRequest extends Request {
  user?: string | JwtPayload; // Or a more specific interface for your user payload
}

const authMiddleware = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
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
    const decoded = jwt.verify(token, jwtSecret);
    req.user = decoded; // Attach decoded user payload to request object
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
