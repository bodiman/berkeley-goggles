import { Router } from 'express';
import { asyncHandler } from '../middleware/errorHandler';
import multer from 'multer';
import sharp from 'sharp';
import { prisma } from '../services/database';
import { r2Service, isR2Configured } from '../services/r2';
import path from 'path';
import fs from 'fs';

export const photoRoutes = Router();

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

// POST /api/photos - Photo upload
photoRoutes.post('/', upload.single('photo'), asyncHandler(async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'No photo file provided',
      });
    }

    // Check if R2 is configured
    if (!isR2Configured()) {
      console.warn('R2 not configured, using fallback mock response');
      
      // Fallback to original mock behavior
      const processedImage = await sharp(req.file.buffer)
        .resize(800, 800, { 
          fit: 'cover',
          position: 'centre'
        })
        .jpeg({ quality: 85 })
        .toBuffer();

      const mockPhotoId = 'photo_' + Date.now();
      const mockUrl = `https://api.berkeleygoggles.app/photos/${mockPhotoId}.jpg`;
      const mockThumbnailUrl = `https://api.berkeleygoggles.app/photos/thumbnails/${mockPhotoId}.jpg`;

      return res.json({ 
        success: true, 
        message: 'Photo uploaded successfully (mock)',
        photo: {
          id: mockPhotoId,
          url: mockUrl,
          thumbnailUrl: mockThumbnailUrl,
          status: 'pending',
          uploadedAt: new Date(),
        },
        timestamp: new Date().toISOString()
      });
    }

    // Upload to R2
    const uploadResult = await r2Service.uploadImage(req.file.buffer, 'photos', {
      quality: 85,
      width: 800,
      height: 800,
      generateThumbnail: true,
      thumbnailSize: 200,
    });

    res.json({ 
      success: true, 
      message: 'Photo uploaded successfully to R2',
      photo: {
        id: uploadResult.id,
        url: uploadResult.url,
        thumbnailUrl: uploadResult.thumbnailUrl,
        status: 'uploaded',
        uploadedAt: new Date(),
        size: uploadResult.size,
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Photo upload error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to process photo upload',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}));

// POST /api/photos/webcam - Webcam capture upload
photoRoutes.post('/webcam', upload.single('photo'), asyncHandler(async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'No photo provided',
      });
    }

    const { userId } = req.body;

    // Check if R2 is configured
    if (!isR2Configured()) {
      console.warn('R2 not configured, using fallback mock response');
      
      // Fallback to original mock behavior
      const processedImage = await sharp(req.file.buffer)
        .resize(640, 640, { 
          fit: 'cover',
          position: 'centre'
        })
        .jpeg({ quality: 90 })
        .toBuffer();

      const mockPhotoId = 'photo_' + Date.now();
      const mockUrl = `data:image/jpeg;base64,${processedImage.toString('base64')}`;

      return res.json({ 
        success: true, 
        message: 'Webcam photo processed successfully (mock)',
        photo: {
          id: mockPhotoId,
          url: mockUrl,
          processedAt: new Date(),
        },
        timestamp: new Date().toISOString()
      });
    }

    // Upload to R2 as user photo
    const uploadResult = await r2Service.uploadUserPhoto(req.file.buffer, userId || 'anonymous');

    res.json({ 
      success: true, 
      message: 'Webcam photo uploaded successfully to R2',
      photo: {
        id: uploadResult.id,
        url: uploadResult.url,
        thumbnailUrl: uploadResult.thumbnailUrl,
        processedAt: new Date(),
        size: uploadResult.size,
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Webcam photo processing error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to process webcam photo',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}));

// POST /api/photos/presigned - Generate presigned URL for frontend upload
photoRoutes.post('/presigned', asyncHandler(async (req, res) => {
  try {
    // Check if R2 is configured
    if (!isR2Configured()) {
      return res.status(501).json({
        success: false,
        error: 'R2 storage not configured',
        message: 'Presigned URLs require Cloudflare R2 configuration',
      });
    }

    const { prefix = 'uploads', expiresIn = 300 } = req.body;

    // Generate presigned upload data
    const presignedData = await r2Service.generatePresignedUpload(prefix, expiresIn);

    res.json({ 
      success: true, 
      message: 'Presigned upload URL generated successfully',
      upload: presignedData,
      expiresAt: new Date(Date.now() + expiresIn * 1000).toISOString(),
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Presigned URL generation error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate presigned URL',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}));

// GET /api/photos/pairs - Get photo pairs for comparison
photoRoutes.get('/pairs', asyncHandler(async (req, res) => {
  // Mock photo pairs for the comparison game
  const mockPairs = [
    {
      leftPhoto: {
        id: 'photo_1',
        url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop&crop=face',
        userId: 'user_1',
      },
      rightPhoto: {
        id: 'photo_2',
        url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=600&fit=crop&crop=face',
        userId: 'user_2',
      },
      sessionId: 'session_' + Date.now(),
    }
  ];

  res.json({ 
    success: true, 
    pairs: mockPairs,
    timestamp: new Date().toISOString()
  });
}));

// DELETE /api/photos/:id
photoRoutes.delete('/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { url } = req.body; // Optional: URL to extract key from
  
  try {
    // Check if R2 is configured
    if (!isR2Configured()) {
      return res.json({ 
        success: true, 
        message: `Photo ${id} deletion skipped (R2 not configured)`,
        timestamp: new Date().toISOString()
      });
    }

    // If URL is provided, extract the key from it
    let key: string | null = null;
    if (url) {
      key = r2Service.extractKeyFromUrl(url);
    }

    let deletionResult = false;
    if (key) {
      deletionResult = await r2Service.deleteImage(key);
      
      // Also try to delete thumbnail if it exists
      const thumbnailKey = key.replace('/images/', '/images/thumbnails/');
      if (thumbnailKey !== key) {
        await r2Service.deleteImage(thumbnailKey);
      }
    }

    res.json({ 
      success: true, 
      message: `Photo ${id} deleted successfully${deletionResult ? ' from R2' : ''}`,
      deleted: deletionResult,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Photo deletion error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete photo',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}));

// GET /api/photos/:id
photoRoutes.get('/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  // TODO: Get photo from database with permission checks
  const mockPhoto = {
    id,
    url: `https://api.berkeleygoggles.app/photos/${id}.jpg`,
    status: 'approved',
    ranking: {
      currentPercentile: 65.5,
      totalComparisons: 150,
      wins: 98,
      losses: 52,
      confidence: 0.85,
    },
    uploadedAt: new Date(),
  };

  res.json({ 
    success: true,
    photo: mockPhoto,
    timestamp: new Date().toISOString()
  });
}));

