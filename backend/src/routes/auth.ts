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
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  inviteToken: z.string().optional(), // One-time use invite token
});

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

const googleAuthSchema = z.object({
  idToken: z.string().min(1, 'Google ID token is required'),
  inviteToken: z.string().optional(), // One-time use invite token
});

// POST /api/auth/register
authRoutes.post('/register', asyncHandler(async (req: Request, res: Response) => {
  const validatedData = registerSchema.parse(req.body);

  // Validate invite token if provided
  let inviteRecord = null;
  let referrer = null;
  if (validatedData.inviteToken) {
    inviteRecord = await prisma.inviteToken.findUnique({
      where: { token: validatedData.inviteToken },
      include: {
        creator: {
          select: { id: true, name: true, profilePhotoUrl: true }
        }
      }
    });

    if (!inviteRecord) {
      return res.status(400).json({
        success: false,
        error: 'Invalid invite link',
      });
    }

    if (inviteRecord.usedById) {
      return res.status(400).json({
        success: false,
        error: 'This invite link has already been used',
      });
    }

    if (inviteRecord.expiresAt && inviteRecord.expiresAt < new Date()) {
      return res.status(400).json({
        success: false,
        error: 'This invite link has expired',
      });
    }

    referrer = inviteRecord.creator;
  }

  // If no valid invite token, require Berkeley email
  if (!referrer && !validatedData.email.endsWith('@berkeley.edu')) {
    return res.status(403).json({
      success: false,
      error: 'Registration requires a @berkeley.edu email address, or use an invite link',
    });
  }

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

  // If there's a valid invite, mark it as used and create friendship
  if (inviteRecord && referrer) {
    // Mark invite token as used
    await prisma.inviteToken.update({
      where: { id: inviteRecord.id },
      data: { usedById: user.id, usedAt: new Date() }
    });

    // Create accepted friendship (referrer initiated by sharing the link)
    await prisma.friendship.create({
      data: {
        userId: referrer.id,  // Referrer is the initiator
        friendId: user.id,    // New user is the receiver
        status: 'accepted',   // Skip pending for invite links
      },
    });
    console.log(`Created friendship: ${referrer.name} -> ${user.name} (via invite token)`);
  }

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
    referrer, // Include referrer info so frontend can show "You're now friends with X"
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

    // Validate invite token if provided
    let inviteRecord = null;
    let referrer = null;
    if (validatedData.inviteToken) {
      inviteRecord = await prisma.inviteToken.findUnique({
        where: { token: validatedData.inviteToken },
        include: {
          creator: {
            select: { id: true, name: true, profilePhotoUrl: true }
          }
        }
      });

      if (!inviteRecord) {
        return res.status(400).json({
          success: false,
          error: 'Invalid invite link',
        });
      }

      if (inviteRecord.usedById) {
        return res.status(400).json({
          success: false,
          error: 'This invite link has already been used',
        });
      }

      if (inviteRecord.expiresAt && inviteRecord.expiresAt < new Date()) {
        return res.status(400).json({
          success: false,
          error: 'This invite link has expired',
        });
      }

      referrer = inviteRecord.creator;
    }

    // If no valid invite token, require Berkeley email
    if (!referrer && !payload.email.endsWith('@berkeley.edu')) {
      return res.status(403).json({
        success: false,
        error: 'Only @berkeley.edu email addresses are allowed, or use an invite link',
      });
    }

    // Check if user already exists
    let user = await prisma.user.findUnique({
      where: { email: payload.email },
    });

    let isNewUser = false;
    if (!user) {
      isNewUser = true;
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

    // If there's a valid invite and this is a new user, mark it as used and create friendship
    if (inviteRecord && referrer && isNewUser) {
      // Mark invite token as used
      await prisma.inviteToken.update({
        where: { id: inviteRecord.id },
        data: { usedById: user.id, usedAt: new Date() }
      });

      // Check if friendship already exists (shouldn't for new user, but be safe)
      const existingFriendship = await prisma.friendship.findFirst({
        where: {
          OR: [
            { userId: user.id, friendId: referrer.id },
            { userId: referrer.id, friendId: user.id }
          ]
        }
      });

      if (!existingFriendship) {
        await prisma.friendship.create({
          data: {
            userId: referrer.id,
            friendId: user.id,
            status: 'accepted',
          },
        });
        console.log(`Created friendship: ${referrer.name} -> ${user.name} (via Google invite token)`);
      }
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
      referrer,
      isNewUser,
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