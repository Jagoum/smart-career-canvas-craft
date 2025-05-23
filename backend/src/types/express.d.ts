// backend/src/types/express.d.ts
import { JwtPayload } from 'jsonwebtoken';

declare global {
  namespace Express {
    export interface Request {
      user?: { sub: string; [key: string]: any }; // sub is standard for user ID in JWT
    }
  }
}
export {}; // Make this a module
