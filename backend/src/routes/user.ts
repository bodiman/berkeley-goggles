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
  // Gender is now optional in schema because AI will detect it
  gender: z.enum(['male', 'female']).optional(),
  profilePhotoUrl: z.string().optional(), // R2 URL if already uploaded
});

const profileUpdateSchema = z.object({
  name: z.string().min(2).optional(),
  age: z.number().int().min(18).max(99).optional(),
  gender: z.enum(['male', 'female']).optional(),
  bio: z.string().max(25).optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),
});

// POST /api/user/detect-gender - Simulated AI gender detection
userRoutes.post('/detect-gender', upload.single('photo'), asyncHandler(async (req, res) => {
  if (!req.file && !req.body.photoUrl) {
    return res.status(400).json({ success: false, error: 'Photo is required' });
  }

  // Simulate AI processing time
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Simulated AI Logic: 
  // In a real app, you would pass the buffer to a model like OpenAI or AWS Rekognition.
  // For now, we'll use a random assignment to demonstrate the locking feature.
  const genders: ('male' | 'female')[] = ['male', 'female'];
  const detectedGender = genders[Math.floor(Math.random() * genders.length)];

  res.json({
    success: true,
    detectedGender,
    confidence: 0.98,
    message: `AI detected ${detectedGender.toUpperCase()} with 98% confidence.`
  });
}));

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
    
    // Process photo if provided as file upload (Legacy/Webcam fallback)
    if (req.file) {
      // ... existing file upload logic ...
      const timestamp = Date.now();
      const filename = `${userId}-${timestamp}.jpg`;
      const filepath = path.join('uploads', 'profile-photos', filename);
      
      const dir = path.dirname(filepath);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      
      const processedImage = await sharp(req.file.buffer)
        .resize(400, 400, { fit: 'cover', position: 'centre' })
        .jpeg({ quality: 90 }).toBuffer();

      const thumbnail = await sharp(req.file.buffer)
        .resize(200, 200, { fit: 'cover', position: 'centre' })
        .jpeg({ quality: 80 }).toBuffer();
        
      fs.writeFileSync(filepath, processedImage);
      
      const thumbnailFilename = `${userId}-${timestamp}-thumb.jpg`;
      const thumbnailPath = path.join('uploads', 'profile-photos', 'thumbs', thumbnailFilename);
      const thumbnailDir = path.dirname(thumbnailPath);
      if (!fs.existsSync(thumbnailDir)) fs.mkdirSync(thumbnailDir, { recursive: true });
      fs.writeFileSync(thumbnailPath, thumbnail);
      
      const baseUrl = process.env.RAILWAY_PUBLIC_DOMAIN 
        ? `https://${process.env.RAILWAY_PUBLIC_DOMAIN}`
        : process.env.API_BASE_URL
        ? `https://${process.env.API_BASE_URL}`
        : process.env.NODE_ENV === 'production'
        ? 'https://berkeley-goggles-production.up.railway.app'
        : 'http://localhost:3001';

      relativePhotoUrl = `/uploads/profile-photos/${filename}`;
      const relativeThumbnailUrl = `/uploads/profile-photos/thumbs/${thumbnailFilename}`;
      profilePhotoUrl = `${baseUrl}${relativePhotoUrl}`;

      const photo = await prisma.photo.create({
        data: {
          userId,
          url: relativePhotoUrl!,
          thumbnailUrl: relativeThumbnailUrl,
          status: 'approved',
          originalFilename: req.file.originalname || 'profile-setup.jpg',
          fileSize: processedImage.length,
          width: 400, height: 400, format: 'jpeg',
        },
      });

      await prisma.photoRanking.create({
        data: {
          photoId: photo.id,
          userId,
          currentPercentile: 50.0,
          totalComparisons: 0,
          wins: 0, losses: 0, bradleyTerryScore: 0.5, confidence: 0.0,
        },
      });

      photoId = photo.id;
    } else if (validatedData.profilePhotoUrl) {
      // New flow: Use R2 URL directly (from AI Gender Detection step)
      profilePhotoUrl = validatedData.profilePhotoUrl;
      relativePhotoUrl = validatedData.profilePhotoUrl; // For R2, these are the same

      // Create Photo record in database
      const photo = await prisma.photo.create({
        data: {
          userId,
          url: profilePhotoUrl,
          thumbnailUrl: profilePhotoUrl, // Simplified for R2
          status: 'approved',
          originalFilename: 'r2-upload.jpg',
          fileSize: 0,
          width: 400, height: 400, format: 'jpeg',
        },
      });

      // Create initial PhotoRanking record
      await prisma.photoRanking.create({
        data: {
          photoId: photo.id,
          userId,
          currentPercentile: 50.0,
          totalComparisons: 0,
          wins: 0, losses: 0, bradleyTerryScore: 0.5, confidence: 0.0,
        },
      });

      photoId = photo.id;
    }
    
    // Validate profile completion requirements
    const isProfileComplete = Boolean(
      validatedData.name &&
      validatedData.age &&
      validatedData.gender
    );
    
    // Update user in database (store relative path)
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        name: validatedData.name,
        age: validatedData.age,
        gender: validatedData.gender,
        profileComplete: isProfileComplete,
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
  try {
    // TODO: Get user ID from auth middleware
    const userId = req.query.userId as string;
    
    if (!userId) {
      return res.status(400).json({
        success: false,
        error: 'User ID required',
      });
    }
    
    // Query database for user profile with all fields including height/weight
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
      });
    }
    
    // Return user data without password
    const { password: _, ...userWithoutPassword } = user;
    
    res.json({ 
      success: true,
      user: userWithoutPassword,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Get user profile error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get user profile',
    });
  }
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
    
    // Check if R2 URL is provided (new flow) or file upload (legacy flow)
    const r2PhotoUrl = req.body.r2PhotoUrl;
    const r2ThumbnailUrl = req.body.r2ThumbnailUrl;
    
    if (r2PhotoUrl) {
      // New flow: Use R2 URLs directly
      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: {
          profilePhotoUrl: r2PhotoUrl,
          lastActive: new Date(),
        },
      });
      
      // Create Photo record in database for algorithm training
      const photo = await prisma.photo.create({
        data: {
          userId,
          url: r2PhotoUrl,
          thumbnailUrl: r2ThumbnailUrl || r2PhotoUrl,
          status: 'approved',
          originalFilename: 'r2-upload.jpg',
          fileSize: 0, // Unknown for R2 uploads
          width: 400, // Assumed
          height: 400, // Assumed
          format: 'jpeg',
        },
      });

      // Create initial PhotoRanking record
      await prisma.photoRanking.create({
        data: {
          photoId: photo.id,
          userId,
          currentPercentile: 50.0,
          totalComparisons: 0,
          wins: 0,
          losses: 0,
          bradleyTerryScore: 0.5,
          confidence: 0.0,
        },
      });
      
      // Return user data with R2 URL
      const { password: _, ...userWithoutPassword } = updatedUser;
      
      return res.json({ 
        success: true, 
        message: 'Profile photo updated successfully',
        user: userWithoutPassword,
        photo: {
          id: photo.id,
          url: r2PhotoUrl,
          thumbnailUrl: r2ThumbnailUrl || r2PhotoUrl,
          status: photo.status,
        },
        timestamp: new Date().toISOString()
      });
    }
    
    // Legacy flow: File upload
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'No photo file or R2 URL provided',
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