// Load environment variables FIRST before any other imports
import dotenv from 'dotenv';

// First load .env as the base
dotenv.config();
console.log('After loading .env:', process.env.DATABASE_URL?.substring(0, 50) + '...');

// Then load environment-specific file to override
const nodeEnv = process.env.NODE_ENV || 'development';
console.log('NODE_ENV:', nodeEnv);

if (nodeEnv === 'development') {
  dotenv.config({ path: '.env.development', override: true });
  console.log('After loading .env.development:', process.env.DATABASE_URL?.substring(0, 50) + '...');
} else if (nodeEnv === 'production') {
  dotenv.config({ path: '.env.production', override: true });
}

// Now import everything else after environment is loaded
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
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
import { friendsRoutes } from './routes/friends';
import { challengesRoutes } from './routes/challenges';
import { messagesRoutes } from './routes/messages';
import { inviteRoutes } from './routes/invite';

const app = express();
const PORT = process.env.PORT || 3001;

// Trust proxy when in production (for Railway, Heroku, etc.)
if (process.env.NODE_ENV === 'production') {
  app.set('trust proxy', 1);
}

// Security middleware with OAuth-friendly configuration
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  crossOriginOpenerPolicy: { policy: "unsafe-none" }, // Allow OAuth popups
  crossOriginEmbedderPolicy: false, // Disable for OAuth compatibility
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", "https://accounts.google.com", "https://apis.google.com"],
      connectSrc: ["'self'", "https://accounts.google.com", "https://www.googleapis.com"],
      frameSrc: ["'self'", "https://accounts.google.com"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://accounts.google.com"],
      imgSrc: ["'self'", "data:", "https:"],
      fontSrc: ["'self'", "https:", "data:"],
    },
  },
}));
// CORS configuration with debugging
const allowedOrigins = process.env.NODE_ENV === 'production' 
  ? [
      process.env.FRONTEND_URL, 
      'https://elocheck.vercel.app',
      'https://berkeley-goggles-git-main-bodimans-projects.vercel.app',
      'https://www.berkeleygoggles.net'
    ].filter(Boolean) as string[]
  : ['http://localhost:3000', 'http://localhost:5173', 'http://localhost:5174', 'http://localhost:19006'];

logger.info('🔐 CORS allowed origins:', allowedOrigins);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl, postman)
    if (!origin) return callback(null, true);
    
    // Log the origin for debugging
    logger.info(`📡 CORS request from origin: ${origin}`);
    
    if (allowedOrigins.includes(origin)) {
      logger.info(`✅ CORS allowed for origin: ${origin}`);
      callback(null, true);
    } else {
      logger.warn(`❌ CORS blocked for origin: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
  exposedHeaders: ['Content-Length', 'X-Foo', 'X-Bar'],
  optionsSuccessStatus: 200, // Some legacy browsers choke on 204
}));

// Explicit preflight handler for complex requests
app.options('*', (req, res) => {
  logger.info(`✈️  OPTIONS preflight request from ${req.get('Origin')} for ${req.path}`);
  res.status(200).end();
});

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
  ? path.join(process.cwd(), 'sample_images')  // Use process.cwd() for Railway
  : path.join(process.cwd(), '../sample_images');

// Log the sample images path for debugging
logger.info(`📁 Serving sample images from: ${sampleImagesPath}`);

// Check if directory exists and log file count
import { promises as fs } from 'fs';
fs.access(sampleImagesPath)
  .then(async () => {
    try {
      const files = await fs.readdir(sampleImagesPath);
      const imageFiles = files.filter(f => f.toLowerCase().endsWith('.jpg'));
      logger.info(`📸 Found ${imageFiles.length} sample images in directory`);
    } catch (error) {
      logger.warn(`⚠️  Could not read sample images directory: ${error}`);
    }
  })
  .catch(() => {
    logger.error(`❌ Sample images directory not found at: ${sampleImagesPath}`);
  });
  
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
app.use('/api/friends', friendsRoutes);
app.use('/api/challenges', challengesRoutes);
app.use('/api/messages', messagesRoutes);
app.use('/api/invite', inviteRoutes);

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
      const dbType = process.env.DATABASE_URL?.startsWith('postgresql://') ? 'PostgreSQL' : 
                     process.env.DATABASE_URL?.startsWith('file:') ? 'SQLite' : 'Unknown';
      logger.info(`💾 Database: ${dbType}`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

export default app;