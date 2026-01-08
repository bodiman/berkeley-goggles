import { Router, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { OAuth2Client } from 'google-auth-library';
import { asyncHandler } from '../middleware/errorHandler';
import { prisma } from '../services/database';

export const authRoutes = Router();

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-key';
const JWT_EXPIRES_IN = '7d';

// Google OAuth client
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Validation schemas
const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string()
    .email('Invalid email address')
    .refine(email => email.endsWith('@berkeley.edu'), {
      message: 'Registration requires a @berkeley.edu email address',
    }),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

const googleAuthSchema = z.object({
  idToken: z.string().min(1, 'Google ID token is required'),
});

// POST /api/auth/register
authRoutes.post('/register', asyncHandler(async (req: Request, res: Response) => {
  const validatedData = registerSchema.parse(req.body);
  
  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email: validatedData.email },
  });
  
  if (existingUser) {
    return res.status(400).json({
      success: false,
      error: 'User with this email already exists',
    });
  }
  
  // Hash password
  const hashedPassword = await bcrypt.hash(validatedData.password, 12);
  
  // Create user
  const user = await prisma.user.create({
    data: {
      name: validatedData.name,
      email: validatedData.email,
      password: hashedPassword,
      profileComplete: false,
    },
  });
  
  // Generate JWT token
  const token = jwt.sign(
    { userId: user.id, email: user.email },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
  
  // Return user data without password
  const { password: _, ...userWithoutPassword } = user;
  
  res.status(201).json({
    success: true,
    user: userWithoutPassword,
    token,
  });
}));

// POST /api/auth/login
authRoutes.post('/login', asyncHandler(async (req: Request, res: Response) => {
  const validatedData = loginSchema.parse(req.body);
  
  // Find user by email
  const user = await prisma.user.findUnique({
    where: { email: validatedData.email },
  });
  
  if (!user) {
    return res.status(401).json({
      success: false,
      error: 'Invalid email or password',
    });
  }
  
  // Verify password
  const isPasswordValid = await bcrypt.compare(validatedData.password, user.password);
  
  if (!isPasswordValid) {
    return res.status(401).json({
      success: false,
      error: 'Invalid email or password',
    });
  }
  
  // Update last active
  await prisma.user.update({
    where: { id: user.id },
    data: { lastActive: new Date() },
  });
  
  // Generate JWT token
  const token = jwt.sign(
    { userId: user.id, email: user.email },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
  
  // Return user data without password
  const { password: _, ...userWithoutPassword } = user;
  
  res.json({
    success: true,
    user: userWithoutPassword,
    token,
  });
}));

// POST /api/auth/logout
authRoutes.post('/logout', asyncHandler(async (req: Request, res: Response) => {
  // For JWT-based auth, logout is typically handled client-side
  // by removing the token from storage
  res.json({ 
    success: true, 
    message: 'Logged out successfully',
  });
}));

// POST /api/auth/google
authRoutes.post('/google', asyncHandler(async (req: Request, res: Response) => {
  const validatedData = googleAuthSchema.parse(req.body);
  
  try {
    // Verify the Google ID token
    const ticket = await googleClient.verifyIdToken({
      idToken: validatedData.idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    
    const payload = ticket.getPayload();
    if (!payload || !payload.email || !payload.name) {
      return res.status(400).json({
        success: false,
        error: 'Invalid Google token payload',
      });
    }

    // Ensure email is from berkeley.edu
    if (!payload.email.endsWith('@berkeley.edu')) {
      return res.status(403).json({
        success: false,
        error: 'Only @berkeley.edu email addresses are allowed',
      });
    }
    
    // Check if user already exists
    let user = await prisma.user.findUnique({
      where: { email: payload.email },
    });
    
    if (!user) {
      // Create new user from Google profile
      user = await prisma.user.create({
        data: {
          name: payload.name,
          email: payload.email,
          profileComplete: false,
          // No password for OAuth users
          password: '',
        },
      });
    }
    
    // Update last active
    await prisma.user.update({
      where: { id: user.id },
      data: { lastActive: new Date() },
    });
    
    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );
    
    // Return user data without password
    const { password: _, ...userWithoutPassword } = user;
    
    res.json({
      success: true,
      user: userWithoutPassword,
      token,
    });
  } catch (error) {
    console.error('Google OAuth verification failed:', error);
    return res.status(400).json({
      success: false,
      error: 'Invalid Google token',
    });
  }
}));

// PUT /api/auth/refresh-token
authRoutes.put('/refresh-token', asyncHandler(async (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'No token provided',
    });
  }
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; email: string };
    
    // Verify user still exists
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });
    
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'User not found',
      });
    }
    
    // Generate new token
    const newToken = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );
    
    res.json({
      success: true,
      token: newToken,
    });
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: 'Invalid token',
    });
  }
}));