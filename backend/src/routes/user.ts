import { Router } from 'express';
import { asyncHandler } from '../middleware/errorHandler';
import { z } from 'zod';
import { prisma } from '../services/database';
import multer from 'multer';
import sharp from 'sharp';
import path from 'path';
import fs from 'fs';

export const userRoutes = Router();

// Configure multer for photo uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  },
});

// Validation schemas
const profileSetupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  age: z.number().int().min(18, 'Must be at least 18 years old'),
  gender: z.enum(['male', 'female']),
});

const profileUpdateSchema = z.object({
  name: z.string().min(2).optional(),
  bio: z.string().max(500).optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),
});

// POST /api/user/setup - Setup user profile (initial onboarding)
userRoutes.post('/setup', upload.single('photo'), asyncHandler(async (req, res) => {
  try {
    // Parse form data (both JSON fields and photo)
    const formData = JSON.parse(req.body.profileData);
    const validatedData = profileSetupSchema.parse(formData);
    
    // TODO: Get user ID from auth middleware/JWT token
    // For now, get from request body (temporary)
    const userId = req.body.userId;
    
    if (!userId) {
      return res.status(400).json({
        success: false,
        error: 'User ID required',
      });
    }
    
    let profilePhotoUrl: string | null = null;
    let relativePhotoUrl: string | null = null;
    let photoId: string | null = null;
    
    // Process photo if provided
    if (req.file) {
      // Create unique filename
      const timestamp = Date.now();
      const filename = `${userId}-${timestamp}.jpg`;
      const filepath = path.join('uploads', 'profile-photos', filename);
      
      // Ensure directory exists
      const dir = path.dirname(filepath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      
      // Process and save image
      const processedImage = await sharp(req.file.buffer)
        .resize(400, 400, { 
          fit: 'cover',
          position: 'centre'
        })
        .jpeg({ quality: 90 })
        .toBuffer();

      // Create thumbnail
      const thumbnail = await sharp(req.file.buffer)
        .resize(200, 200, { 
          fit: 'cover',
          position: 'centre'
        })
        .jpeg({ quality: 80 })
        .toBuffer();
        
      fs.writeFileSync(filepath, processedImage);
      
      // Save thumbnail
      const thumbnailFilename = `${userId}-${timestamp}-thumb.jpg`;
      const thumbnailPath = path.join('uploads', 'profile-photos', 'thumbs', thumbnailFilename);
      const thumbnailDir = path.dirname(thumbnailPath);
      if (!fs.existsSync(thumbnailDir)) {
        fs.mkdirSync(thumbnailDir, { recursive: true });
      }
      fs.writeFileSync(thumbnailPath, thumbnail);
      
      // Get the base URL for the current environment
      // Use Railway URL if available, otherwise fall back to production URL, then localhost
      const baseUrl = process.env.RAILWAY_PUBLIC_DOMAIN 
        ? `https://${process.env.RAILWAY_PUBLIC_DOMAIN}`
        : process.env.API_BASE_URL
        ? `https://${process.env.API_BASE_URL}`
        : process.env.NODE_ENV === 'production'
        ? 'https://berkeley-goggles-production.up.railway.app'
        : 'http://localhost:3001';

      // Store relative path in database, but prepare full URL for response
      relativePhotoUrl = `/uploads/profile-photos/${filename}`;
      const relativeThumbnailUrl = `/uploads/profile-photos/thumbs/${thumbnailFilename}`;
      profilePhotoUrl = `${baseUrl}${relativePhotoUrl}`;
      const thumbnailUrl = `${baseUrl}${relativeThumbnailUrl}`;

      // Create Photo record in database for algorithm training
      const photo = await prisma.photo.create({
        data: {
          userId,
          url: relativePhotoUrl!,
          thumbnailUrl: relativeThumbnailUrl,
          status: 'approved', // Profile photos are automatically approved
          originalFilename: req.file.originalname || 'profile-setup.jpg',
          fileSize: processedImage.length,
          width: 400,
          height: 400,
          format: 'jpeg',
        },
      });

      // Create initial PhotoRanking record for this photo
      await prisma.photoRanking.create({
        data: {
          photoId: photo.id,
          userId,
          currentPercentile: 50.0, // Start at middle percentile
          totalComparisons: 0,
          wins: 0,
          losses: 0,
          bradleyTerryScore: 0.5, // Start at neutral score
          confidence: 0.0,
        },
      });

      photoId = photo.id;
    }
    
    // Update user in database (store relative path)
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        name: validatedData.name,
        age: validatedData.age,
        gender: validatedData.gender,
        profileComplete: true,
        profilePhotoUrl: photoId ? relativePhotoUrl : null,
        lastActive: new Date(),
      },
    });
    
    // Return user data without password, with full URLs for photo
    const { password: _, ...userWithoutPassword } = updatedUser;
    const userWithFullUrls = {
      ...userWithoutPassword,
      profilePhotoUrl: photoId ? profilePhotoUrl : null, // Full URL for frontend
    };
    
    res.json({ 
      success: true, 
      message: 'Profile setup completed successfully',
      user: userWithFullUrls,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: error.errors,
      });
    }
    throw error;
  }
}));

// GET /api/user/profile
userRoutes.get('/profile', asyncHandler(async (req, res) => {
  // TODO: Get user ID from auth middleware
  const mockUserId = 'user_123';
  
  // TODO: Query database for user profile
  res.json({ 
    success: true,
    user: {
      id: mockUserId,
      name: 'Demo User',
      email: 'demo@berkeleygoggles.app',
      profileComplete: true,
      createdAt: new Date('2024-01-01'),
      lastActive: new Date(),
      profile: {
        age: 25,
        gender: 'male',
        bio: 'Demo user profile',
        photos: [],
      },
      stats: {
        totalVotes: 0,
        comparisonsGiven: 0,
        streak: 0,
        weeklyChange: 0,
        achievements: [],
      }
    },
    timestamp: new Date().toISOString()
  });
}));

// PUT /api/user/profile
userRoutes.put('/profile', asyncHandler(async (req, res) => {
  try {
    const validatedData = profileUpdateSchema.parse(req.body);
    
    // TODO: Get user ID from auth middleware/JWT token
    // For now, get from request body (temporary)
    const userId = req.body.userId;
    
    if (!userId) {
      return res.status(400).json({
        success: false,
        error: 'User ID required',
      });
    }
    
    // Update user profile in database
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        ...validatedData,
        lastActive: new Date(),
      },
    });
    
    // Return user data without password
    const { password: _, ...userWithoutPassword } = updatedUser;
    
    res.json({ 
      success: true, 
      message: 'Profile updated successfully',
      user: userWithoutPassword,
      updatedFields: Object.keys(validatedData),
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: error.errors,
      });
    }
    throw error;
  }
}));

// POST /api/user/photo - Update profile photo only
userRoutes.post('/photo', upload.single('photo'), asyncHandler(async (req, res) => {
  try {
    // TODO: Get user ID from auth middleware/JWT token
    // For now, get from request body (temporary)
    const userId = req.body.userId;
    
    if (!userId) {
      return res.status(400).json({
        success: false,
        error: 'User ID required',
      });
    }
    
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'No photo file provided',
      });
    }
    
    // Create unique filename
    const timestamp = Date.now();
    const filename = `${userId}-${timestamp}.jpg`;
    const filepath = path.join('uploads', 'profile-photos', filename);
    
    // Ensure directory exists
    const dir = path.dirname(filepath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    // Process and save image
    const processedImage = await sharp(req.file.buffer)
      .resize(400, 400, { 
        fit: 'cover',
        position: 'centre'
      })
      .jpeg({ quality: 90 })
      .toBuffer();
      
    // Create thumbnail
    const thumbnail = await sharp(req.file.buffer)
      .resize(200, 200, { 
        fit: 'cover',
        position: 'centre'
      })
      .jpeg({ quality: 80 })
      .toBuffer();
      
    fs.writeFileSync(filepath, processedImage);
    
    // Save thumbnail
    const thumbnailFilename = `${userId}-${timestamp}-thumb.jpg`;
    const thumbnailPath = path.join('uploads', 'profile-photos', 'thumbs', thumbnailFilename);
    const thumbnailDir = path.dirname(thumbnailPath);
    if (!fs.existsSync(thumbnailDir)) {
      fs.mkdirSync(thumbnailDir, { recursive: true });
    }
    fs.writeFileSync(thumbnailPath, thumbnail);
    
    // Get the base URL for the current environment
    // Use Railway URL if available, otherwise fall back to production URL, then localhost
    const baseUrl = process.env.RAILWAY_PUBLIC_DOMAIN 
      ? `https://${process.env.RAILWAY_PUBLIC_DOMAIN}`
      : process.env.API_BASE_URL
      ? `https://${process.env.API_BASE_URL}`
      : process.env.NODE_ENV === 'production'
      ? 'https://berkeley-goggles-production.up.railway.app'
      : 'http://localhost:3001';

    const profilePhotoUrl = `${baseUrl}/uploads/profile-photos/${filename}`;
    const thumbnailUrl = `${baseUrl}/uploads/profile-photos/thumbs/${thumbnailFilename}`;
    
    // Store relative paths in database (baseUrl will be added at response time)
    const relativePhotoUrl = `/uploads/profile-photos/${filename}`;
    const relativeThumbnailUrl = `/uploads/profile-photos/thumbs/${thumbnailFilename}`;
    
    // Create Photo record in database for algorithm training
    const photo = await prisma.photo.create({
      data: {
        userId,
        url: relativePhotoUrl,
        thumbnailUrl: relativeThumbnailUrl,
        status: 'approved', // Profile photos are automatically approved
        originalFilename: req.file.originalname || 'camera-capture.jpg',
        fileSize: processedImage.length,
        width: 400,
        height: 400,
        format: 'jpeg',
      },
    });

    // Create initial PhotoRanking record for this photo
    await prisma.photoRanking.create({
      data: {
        photoId: photo.id,
        userId,
        currentPercentile: 50.0, // Start at middle percentile
        totalComparisons: 0,
        wins: 0,
        losses: 0,
        bradleyTerryScore: 0.5, // Start at neutral score
        confidence: 0.0,
      },
    });
    
    // Update user's profile photo URL (store relative path in database)
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        profilePhotoUrl: relativePhotoUrl,
        lastActive: new Date(),
      },
    });
    
    // Return user data without password, with full URLs for photo
    const { password: _, ...userWithoutPassword } = updatedUser;
    const userWithFullUrls = {
      ...userWithoutPassword,
      profilePhotoUrl: profilePhotoUrl, // Full URL for frontend
    };
    
    res.json({ 
      success: true, 
      message: 'Profile photo updated successfully',
      user: userWithFullUrls,
      photo: {
        id: photo.id,
        url: profilePhotoUrl,
        thumbnailUrl,
        status: photo.status,
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Photo update error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update profile photo',
    });
  }
}));

// GET /api/user/photo/:filename - Serve profile photos with proper CORS
userRoutes.get('/photo/:filename', asyncHandler(async (req, res) => {
  try {
    const { filename } = req.params;
    
    // Validate filename to prevent directory traversal
    if (!filename || filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
      return res.status(400).json({
        success: false,
        error: 'Invalid filename',
      });
    }
    
    const filepath = path.join('uploads', 'profile-photos', filename);
    
    // Check if file exists
    if (!fs.existsSync(filepath)) {
      return res.status(404).json({
        success: false,
        error: 'Image not found',
      });
    }
    
    // Set proper headers for image serving with CORS
    res.setHeader('Content-Type', 'image/jpeg');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Cache-Control', 'public, max-age=31536000'); // Cache for 1 year
    
    // Stream the file
    const fileStream = fs.createReadStream(filepath);
    fileStream.pipe(res);
    
  } catch (error) {
    console.error('Photo serving error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to serve photo',
    });
  }
}));

// GET /api/user/stats
userRoutes.get('/stats', asyncHandler(async (req, res) => {
  // TODO: Get user ID from auth middleware
  const mockUserId = 'user_123';
  
  // TODO: Calculate real stats from database
  res.json({ 
    success: true,
    stats: {
      totalVotes: 0,
      comparisonsGiven: 0,
      streak: 0,
      weeklyChange: 0,
      averageRating: null,
      percentile: null,
      achievements: [],
      recentActivity: [],
    },
    timestamp: new Date().toISOString()
  });
}));