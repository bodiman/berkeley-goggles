import { Router } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { asyncHandler } from '../middleware/errorHandler';
import { prisma } from '../services/database';

export const authRoutes = Router();

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-key';
const JWT_EXPIRES_IN = '7d';

// Validation schemas
const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  agreedToTerms: z.boolean().refine(val => val === true, 'Must agree to terms'),
});

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

// POST /api/auth/register
authRoutes.post('/register', asyncHandler(async (req, res) => {
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
      agreedToTerms: validatedData.agreedToTerms,
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
authRoutes.post('/login', asyncHandler(async (req, res) => {
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
authRoutes.post('/logout', asyncHandler(async (req, res) => {
  // For JWT-based auth, logout is typically handled client-side
  // by removing the token from storage
  res.json({ 
    success: true, 
    message: 'Logged out successfully',
  });
}));

// PUT /api/auth/refresh-token
authRoutes.put('/refresh-token', asyncHandler(async (req, res) => {
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