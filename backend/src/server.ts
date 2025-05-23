import express, { Application, Request, Response } from 'express';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit'; // Import rate-limit
import cors from 'cors'; // Import cors

dotenv.config(); // Load environment variables from .env file

import userRoutes from './routes/userRoutes'; // Import user routes
import templateRoutes from './routes/templateRoutes'; // Import template routes
import resumeRoutes from './routes/resumeRoutes'; // Import resume routes
import coverLetterRoutes from './routes/coverLetterRoutes'; // Import cover letter routes

const app: Application = express();
const port = process.env.PORT || 3001; // Default to 3001 if PORT not set

// --- Security Middlewares ---

// 1. CORS Configuration
const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
app.use(cors({
  origin: frontendUrl,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// 2. Rate Limiting
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: 'Too many requests from this IP, please try again after 15 minutes.',
});
app.use(globalLimiter); // Apply to all requests

// Consider applying more specific limiters to AI routes if needed
// Example:
// const aiLimiter = rateLimit({
//   windowMs: 60 * 60 * 1000, // 1 hour
//   max: 20, // Limit each IP to 20 AI requests per hour
//   message: "Too many AI requests from this IP, please try again later."
// });
// app.use('/api/resume/generate', aiLimiter);
// app.use('/api/resume/review', aiLimiter);
// app.use('/api/cover-letter/generate', aiLimiter);


// --- Core Middlewares ---
app.use(express.json()); // Middleware to parse JSON bodies


// --- Routes ---

// Root/Health check route
app.get('/', (req: Request, res: Response) => {
  res.send('Backend server is healthy and running!');
});

// API routes
app.use('/api/profile', userRoutes); // Mount user profile routes (GET /api/profile)
app.use('/api/templates', templateRoutes); // Mount template routes (GET /api/templates)
app.use('/api/resume', resumeRoutes); // Mount resume management routes (includes /generate, /review)
app.use('/api/cover-letter', coverLetterRoutes); // Mount cover letter routes (includes /generate)

// Global error handler (optional, but good practice)
// app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
//   console.error(err.stack);
//   res.status(500).send('Something broke!');
// });

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
