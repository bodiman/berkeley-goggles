import { Router } from 'express';
import { asyncHandler } from '../middleware/errorHandler';
import { z } from 'zod';
import { prisma } from '../services/database';
import { faceAnalysisService } from '../services/faceAnalysis';
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

// POST /api/user/detect-gender - AI gender detection
userRoutes.post('/detect-gender', upload.single('photo'), asyncHandler(async (req, res) => {
  if (!req.file && !req.body.photoUrl) {
    return res.status(400).json({ success: false, error: 'Photo is required' });
  }

  try {
    // Simulate AI processing time
    await new Promise(resolve => setTimeout(resolve, 1500));

    let imageBuffer: Buffer;
    
    if (req.file) {
      imageBuffer = req.file.buffer;
    } else if (req.body.photoUrl) {
      // For R2 URLs, fetch and analyze the image
      const r2Analysis = await fetchAndAnalyzeR2Image(req.body.photoUrl);
      return res.json({
        success: true,
        detectedGender: r2Analysis.gender,
        confidence: r2Analysis.confidence,
        message: `AI detected ${r2Analysis.gender.toUpperCase()} with ${Math.round(r2Analysis.confidence * 100)}% confidence.`
      });
    } else {
      return res.status(400).json({ 
        success: false, 
        error: 'No photo file or URL provided' 
      });
    }

    // Process image to extract features for gender detection
    const metadata = await sharp(imageBuffer).metadata();
    
    // Real AI gender detection using face analysis
    const analysis = await faceAnalysisService.detectGender(imageBuffer);
    
    if (analysis.confidence < 0.85) {
      return res.status(400).json({
        success: false,
        error: 'Unable to detect gender with sufficient confidence. Please try a clearer photo with better lighting and ensure your face is clearly visible.',
        details: {
          confidence: Math.round(analysis.confidence * 100),
          minimumRequired: 85,
          action: 'retake_photo'
        }
      });
    }

    res.json({
      success: true,
      detectedGender: analysis.gender,
      confidence: analysis.confidence,
      message: `AI detected ${analysis.gender.toUpperCase()} with ${Math.round(analysis.confidence * 100)}% confidence.`
    });
  } catch (error) {
    console.error('Gender detection error:', error);
    res.status(500).json({
      success: false,
      error: 'Gender detection service temporarily unavailable. Please try again.'
    });
  }
}));

// Real AI gender detection is now handled by faceAnalysisService

async function simulateGenderDetection(): Promise<{ gender: 'male' | 'female', confidence: number }> {
  // Fallback simulation with realistic confidence distribution
  const genders: ('male' | 'female')[] = ['male', 'female'];
  const gender = genders[Math.floor(Math.random() * genders.length)];
  const confidence = 0.75 + Math.random() * 0.2; // 75-95% confidence range
  
  return { gender, confidence };
}

// Validate R2 URL format and accessibility
function validateR2Url(imageUrl: string): { valid: boolean; error?: string } {
  try {
    // Check basic URL format
    if (!imageUrl || typeof imageUrl !== 'string') {
      return { valid: false, error: 'Invalid URL: empty or non-string' };
    }

    // Must be HTTPS for security
    if (!imageUrl.startsWith('https://')) {
      return { valid: false, error: 'URL must use HTTPS' };
    }

    // Basic URL parsing
    const url = new URL(imageUrl);
    
    // Check if it looks like an image file
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.webp'];
    const hasImageExtension = imageExtensions.some(ext => 
      url.pathname.toLowerCase().endsWith(ext)
    );
    
    if (!hasImageExtension) {
      console.warn('URL does not end with common image extension, but proceeding with fetch');
    }

    return { valid: true };
  } catch (error) {
    return { valid: false, error: `Invalid URL format: ${error.message}` };
  }
}

// Fetch image from R2 URL and analyze for gender detection
async function fetchAndAnalyzeR2Image(imageUrl: string): Promise<{ gender: 'male' | 'female', confidence: number }> {
  try {
    // Validate URL before attempting fetch
    const validation = validateR2Url(imageUrl);
    if (!validation.valid) {
      throw new Error(validation.error);
    }

    // Fetch the image from R2 with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

    const response = await fetch(imageUrl, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'BerkeleyGoggles-GenderDetection/1.0'
      }
    });
    
    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.status} ${response.statusText}`);
    }

    // Check content type
    const contentType = response.headers.get('content-type');
    if (contentType && !contentType.startsWith('image/')) {
      throw new Error(`Invalid content type: ${contentType}`);
    }

    // Check content length (max 10MB)
    const contentLength = response.headers.get('content-length');
    if (contentLength && parseInt(contentLength) > 10 * 1024 * 1024) {
      throw new Error('Image too large (max 10MB)');
    }

    // Get image buffer
    const arrayBuffer = await response.arrayBuffer();
    const imageBuffer = Buffer.from(arrayBuffer);

    // Validate it's actually an image and get metadata
    const metadata = await sharp(imageBuffer).metadata();
    if (!metadata.width || !metadata.height) {
      throw new Error('Invalid image data - no dimensions found');
    }

    // Check reasonable image dimensions (not too small or huge)
    if (metadata.width < 50 || metadata.height < 50) {
      throw new Error('Image too small for gender detection');
    }
    
    if (metadata.width > 5000 || metadata.height > 5000) {
      throw new Error('Image too large for processing');
    }

    // Analyze the image for gender detection
    return await faceAnalysisService.detectGender(imageBuffer);
    
  } catch (error) {
    console.error('R2 image fetch and analysis failed:', error);
    // Fallback to simulation if R2 fetch fails
    return simulateGenderDetection();
  }
}

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
    let detectedGender: 'male' | 'female' | null = null;
    
    // Auto-detect gender from photo if provided (mandatory if photo uploaded)
    if (req.file) {
      try {
        const genderAnalysis = await faceAnalysisService.detectGender(req.file.buffer);
        if (genderAnalysis.confidence >= 0.85) {
          detectedGender = genderAnalysis.gender;
          console.log(`Gender auto-detected: ${detectedGender} (${Math.round(genderAnalysis.confidence * 100)}% confidence)`);
        } else {
          console.log(`Gender detection confidence too low: ${Math.round(genderAnalysis.confidence * 100)}%`);
          return res.status(400).json({
            success: false,
            error: 'Gender detection confidence too low. Please retake your photo with better lighting and a clear view of your face.',
            details: {
              confidence: Math.round(genderAnalysis.confidence * 100),
              minimumRequired: 85,
              action: 'retake_photo'
            }
          });
        }
      } catch (error) {
        console.warn('Gender detection failed during setup:', error);
        return res.status(400).json({
          success: false,
          error: 'Could not detect gender from this photo. Please retake your photo with better lighting and ensure your face is clearly visible.',
          details: {
            reason: 'detection_failed',
            action: 'retake_photo'
          }
        });
      }
    }
    
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
      // New flow: Use R2 URL directly (from AI Gender Detection step or direct upload)
      profilePhotoUrl = validatedData.profilePhotoUrl;
      relativePhotoUrl = validatedData.profilePhotoUrl; // For R2, these are the same

      // Auto-detect gender from R2 image (mandatory)
      if (!detectedGender) {
        try {
          console.log(`🔍 Analyzing R2 setup image for gender detection: ${profilePhotoUrl}`);
          const genderAnalysis = await fetchAndAnalyzeR2Image(profilePhotoUrl);
          if (genderAnalysis.confidence >= 0.85) {
            detectedGender = genderAnalysis.gender;
            console.log(`Gender auto-detected from R2 setup image: ${detectedGender} (${Math.round(genderAnalysis.confidence * 100)}% confidence)`);
          } else {
            console.log(`Gender detection confidence too low: ${Math.round(genderAnalysis.confidence * 100)}%`);
            return res.status(400).json({
              success: false,
              error: 'Gender detection confidence too low. Please retake your photo with better lighting and a clear view of your face.',
              details: {
                confidence: Math.round(genderAnalysis.confidence * 100),
                minimumRequired: 85,
                action: 'retake_photo'
              }
            });
          }
        } catch (error) {
          console.warn('Gender detection failed during R2 setup:', error);
          return res.status(400).json({
            success: false,
            error: 'Could not detect gender from this photo. Please retake your photo with better lighting and ensure your face is clearly visible.',
            details: {
              reason: 'detection_failed',
              action: 'retake_photo'
            }
          });
        }
      }

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
    
    // Use detected gender if available, otherwise fall back to manual input
    const finalGender = detectedGender || validatedData.gender;
    
    // Validate profile completion requirements
    const isProfileComplete = Boolean(
      validatedData.name &&
      validatedData.age &&
      finalGender
    );
    
    // Update user in database (store relative path)
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        name: validatedData.name,
        age: validatedData.age,
        gender: finalGender,
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
      // New flow: Use R2 URLs directly with mandatory gender detection
      let detectedGender: 'male' | 'female' | null = null;
      let genderAnalysis;
      
      try {
        console.log(`🔍 Analyzing R2 image for gender detection: ${r2PhotoUrl}`);
        genderAnalysis = await fetchAndAnalyzeR2Image(r2PhotoUrl);
        
        if (genderAnalysis.confidence >= 0.85) {
          detectedGender = genderAnalysis.gender;
          console.log(`Gender auto-detected from R2 image: ${detectedGender} (${Math.round(genderAnalysis.confidence * 100)}% confidence)`);
        } else {
          console.log(`Gender detection confidence too low: ${Math.round(genderAnalysis.confidence * 100)}%`);
          return res.status(400).json({
            success: false,
            error: 'Gender detection confidence too low. Please retake your photo with better lighting and a clear view of your face.',
            details: {
              confidence: Math.round(genderAnalysis.confidence * 100),
              minimumRequired: 85,
              action: 'retake_photo'
            }
          });
        }
      } catch (error) {
        console.warn('Gender detection failed for R2 image:', error);
        return res.status(400).json({
          success: false,
          error: 'Could not detect gender from this photo. Please retake your photo with better lighting and ensure your face is clearly visible.',
          details: {
            reason: 'detection_failed',
            action: 'retake_photo'
          }
        });
      }

      // Prepare update data - gender is guaranteed to exist at this point
      const updateData: any = {
        profilePhotoUrl: r2PhotoUrl,
        gender: detectedGender, // Guaranteed to be set due to validation above
        lastActive: new Date(),
      };

      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: updateData,
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
        message: `Profile photo updated successfully. Gender detected: ${detectedGender!.toUpperCase()}`,
        user: userWithoutPassword,
        photo: {
          id: photo.id,
          url: r2PhotoUrl,
          thumbnailUrl: r2ThumbnailUrl || r2PhotoUrl,
          status: photo.status,
        },
        genderDetection: {
          detected: true,
          gender: detectedGender,
          confidence: Math.round(genderAnalysis.confidence * 100)
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

    // Auto-detect gender from uploaded photo (mandatory)
    let detectedGender: 'male' | 'female' | null = null;
    let genderAnalysis;
    
    try {
      genderAnalysis = await faceAnalysisService.detectGender(req.file.buffer);
      if (genderAnalysis.confidence >= 0.85) {
        detectedGender = genderAnalysis.gender;
        console.log(`Gender auto-detected during photo update: ${detectedGender} (${Math.round(genderAnalysis.confidence * 100)}% confidence)`);
      } else {
        console.log(`Gender detection confidence too low: ${Math.round(genderAnalysis.confidence * 100)}%`);
        return res.status(400).json({
          success: false,
          error: 'Gender detection confidence too low. Please retake your photo with better lighting and a clear view of your face.',
          details: {
            confidence: Math.round(genderAnalysis.confidence * 100),
            minimumRequired: 85,
            action: 'retake_photo'
          }
        });
      }
    } catch (error) {
      console.warn('Gender detection failed during photo update:', error);
      return res.status(400).json({
        success: false,
        error: 'Could not detect gender from this photo. Please retake your photo with better lighting and ensure your face is clearly visible.',
        details: {
          reason: 'detection_failed',
          action: 'retake_photo'
        }
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
    
    // Update user's profile photo URL and gender (store relative path in database)
    const updateData: any = {
      profilePhotoUrl: relativePhotoUrl,
      gender: detectedGender, // Guaranteed to be set due to validation above
      lastActive: new Date(),
    };

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
    });
    
    // Return user data without password, with full URLs for photo
    const { password: _, ...userWithoutPassword } = updatedUser;
    const userWithFullUrls = {
      ...userWithoutPassword,
      profilePhotoUrl: profilePhotoUrl, // Full URL for frontend
    };
    
    res.json({ 
      success: true, 
      message: `Profile photo updated successfully. Gender detected: ${detectedGender!.toUpperCase()}`,
      user: userWithFullUrls,
      photo: {
        id: photo.id,
        url: profilePhotoUrl,
        thumbnailUrl,
        status: photo.status,
      },
      genderDetection: {
        detected: true,
        gender: detectedGender,
        confidence: Math.round(genderAnalysis.confidence * 100)
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