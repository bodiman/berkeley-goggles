import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import path from 'path';
import { logger } from './utils/logger';
import { connectDatabase } from './services/database';
import { errorHandler } from './middleware/errorHandler';
import { notFoundHandler } from './middleware/notFoundHandler';
import { authRoutes } from './routes/auth';
import { userRoutes } from './routes/user';
import { photoRoutes } from './routes/photo';
import { comparisonRoutes } from './routes/comparison';
import { rankingRoutes } from './routes/ranking';
import { matchesRoutes } from './routes/matches';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Trust proxy when in production (for Railway, Heroku, etc.)
if (process.env.NODE_ENV === 'production') {
  app.set('trust proxy', 1);
}

// Security middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? [
        process.env.FRONTEND_URL, 
        'https://elocheck.vercel.app',
        'https://berkeley-goggles-git-main-bodimans-projects.vercel.app',
        'https://www.berkeleygoggles.net'
      ].filter(Boolean) as string[]
    : ['http://localhost:3000', 'http://localhost:5173', 'http://localhost:5174', 'http://localhost:19006'],
  credentials: true
}));

// Request logging middleware to monitor usage patterns
app.use((req, res, next) => {
  const start = Date.now();
  const ip = req.ip || req.connection.remoteAddress;
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    if (req.path.startsWith('/api/')) {
      console.log(`${new Date().toISOString()} - ${req.method} ${req.path} - ${res.statusCode} - ${duration}ms - IP: ${ip}`);
    }
  });
  
  next();
});

// Rate limiting - temporarily disabled
// TODO: Re-enable with proper configuration once usage patterns are understood
/*
if (process.env.NODE_ENV === 'production') {
  const limiter = rateLimit({
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '10000'), // Dramatically increased from 1000 to 10000
    message: 'Too many requests from this IP, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
      console.warn(`⚠️ Rate limit reached for IP: ${req.ip} at ${new Date().toISOString()}`);
      res.status(429).json({
        error: 'Too many requests from this IP, please try again later.',
        retryAfter: Math.round(parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000') / 1000)
      });
    },
  });
  app.use(limiter);
}
*/

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static file serving for sample images
// In production (Railway), serve from local sample_images directory
// In development, serve from parent directory
const sampleImagesPath = process.env.NODE_ENV === 'production' 
  ? path.join(__dirname, '../sample_images')
  : path.join(__dirname, '../../sample_images');
  
app.use('/sample-images', express.static(sampleImagesPath));

// User uploads disabled - using API endpoints for images instead
// app.use('/uploads', express.static('uploads'));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV 
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/photos', photoRoutes);
app.use('/api/comparisons', comparisonRoutes);
app.use('/api/rankings', rankingRoutes);
app.use('/api/matches', matchesRoutes);

// Error handling middleware
app.use(notFoundHandler);
app.use(errorHandler);

// Initialize database and start server
const startServer = async () => {
  try {
    // Connect to database
    await connectDatabase();
    
    // Start server
    app.listen(PORT, () => {
      logger.info(`🚀 Berkeley Goggles API server running on port ${PORT}`);
      logger.info(`📊 Environment: ${process.env.NODE_ENV}`);
      logger.info(`🔗 Health check: http://localhost:${PORT}/health`);
      logger.info(`💾 Database: SQLite (dev.db)`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

export default app;