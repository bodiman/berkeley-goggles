import { Router } from 'express';
import { asyncHandler } from '../middleware/errorHandler';
import multer from 'multer';
import sharp from 'sharp';
import { prisma } from '../services/database';
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

    // Process the image with Sharp
    const processedImage = await sharp(req.file.buffer)
      .resize(800, 800, { 
        fit: 'cover',
        position: 'centre'
      })
      .jpeg({ quality: 85 })
      .toBuffer();

    // Generate thumbnail
    const thumbnail = await sharp(req.file.buffer)
      .resize(200, 200, { 
        fit: 'cover',
        position: 'centre'
      })
      .jpeg({ quality: 80 })
      .toBuffer();

    // TODO: Save to file storage and database
    const mockPhotoId = 'photo_' + Date.now();
    const mockUrl = `https://api.elocheck.app/photos/${mockPhotoId}.jpg`;
    const mockThumbnailUrl = `https://api.elocheck.app/photos/thumbnails/${mockPhotoId}.jpg`;

    res.json({ 
      success: true, 
      message: 'Photo uploaded successfully',
      photo: {
        id: mockPhotoId,
        url: mockUrl,
        thumbnailUrl: mockThumbnailUrl,
        status: 'pending',
        uploadedAt: new Date(),
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Photo upload error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to process photo upload',
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

    // Process webcam photo
    const processedImage = await sharp(req.file.buffer)
      .resize(640, 640, { 
        fit: 'cover',
        position: 'centre'
      })
      .jpeg({ quality: 90 })
      .toBuffer();

    const mockPhotoId = 'photo_' + Date.now();
    const mockUrl = `data:image/jpeg;base64,${processedImage.toString('base64')}`;

    res.json({ 
      success: true, 
      message: 'Webcam photo processed successfully',
      photo: {
        id: mockPhotoId,
        url: mockUrl,
        processedAt: new Date(),
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Webcam photo processing error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to process webcam photo',
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
  
  // TODO: Implement photo deletion with permission checks
  res.json({ 
    success: true, 
    message: `Photo ${id} deleted successfully`,
    timestamp: new Date().toISOString()
  });
}));

// GET /api/photos/:id
photoRoutes.get('/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  // TODO: Get photo from database with permission checks
  const mockPhoto = {
    id,
    url: `https://api.elocheck.app/photos/${id}.jpg`,
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

