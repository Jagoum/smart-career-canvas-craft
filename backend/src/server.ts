import express, { Application, Request, Response, NextFunction } from 'express'; // Added NextFunction
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit'; // Import rate-limit
import cors from 'cors'; // Import cors
import http from 'http'; // For graceful shutdown

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
const aiLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 20, // Limit each IP to 20 AI requests per hour
  message: "Too many AI-powered requests from this IP, please try again after an hour."
});


// --- Core Middlewares ---
app.use(express.json()); // Middleware to parse JSON bodies


// --- Routes ---

// Root/Health check route
app.get('/', (req: Request, res: Response) => {
  res.send('Backend server is healthy and running!');
});

// API routes
app.use('/api/profile', userRoutes); 
app.use('/api/templates', templateRoutes); 

// Apply AI rate limiter to AI-specific routes
app.use('/api/resume/generate', aiLimiter);
app.use('/api/resume/review', aiLimiter);
app.use('/api/cover-letter/generate', aiLimiter);

app.use('/api/resume', resumeRoutes); 
app.use('/api/cover-letter', coverLetterRoutes); 

// Global error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error("Global Error Handler Caught:", err.stack);
  // Avoid sending stack trace to client in production
  if (process.env.NODE_ENV === 'production') {
    res.status(500).json({ message: 'Something broke on the server!' });
  } else {
    res.status(500).json({ message: 'Something broke!', error: err.message, stack: err.stack });
  }
});

const server = app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

// Graceful Shutdown
const gracefulShutdown = (signal: string) => {
  console.log(`\n${signal} signal received. Shutting down gracefully...`);
  server.close(() => {
    console.log('HTTP server closed.');
    // Add any other cleanup tasks here (e.g., database connections)
    process.exit(0);
  });

  // Force close server after 10 seconds if it hasn't closed yet
  setTimeout(() => {
    console.error('Could not close connections in time, forcefully shutting down');
    process.exit(1);
  }, 10000); // 10 seconds
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
