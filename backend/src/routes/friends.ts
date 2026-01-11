import { Router } from 'express';
import { asyncHandler } from '../middleware/errorHandler';
import { prisma } from '../services/database';
import { z } from 'zod';

export const friendsRoutes = Router();

const matchContactsSchema = z.object({
  userId: z.string(),
  contacts: z.array(z.string().email()), // Only emails for now
});

// POST /api/friends/match-contacts
friendsRoutes.post('/match-contacts', asyncHandler(async (req, res) => {
  const { userId, contacts } = matchContactsSchema.parse(req.body);

  // Find users whose email is in the contacts list
  const matchedUsers = await prisma.user.findMany({
    where: {
      email: { in: contacts },
      id: { not: userId }, // Don't match self
    },
    select: {
      id: true,
      name: true,
      email: true,
      profilePhotoUrl: true,
    },
  });

  // Get current friendships to show status (pending, accepted, etc.)
  const existingFriendships = await prisma.friendship.findMany({
    where: {
      OR: [
        { userId: userId },
        { friendId: userId }
      ]
    }
  });

  const results = matchedUsers.map(match => {
    const friendship = existingFriendships.find(f => 
      (f.userId === userId && f.friendId === match.id) || 
      (f.userId === match.id && f.friendId === userId)
    );

    return {
      ...match,
      friendshipStatus: friendship ? friendship.status : 'none',
      isInitiator: friendship ? friendship.userId === userId : false,
    };
  });

  res.json({
    success: true,
    matches: results,
  });
}));

const friendRequestSchema = z.object({
  userId: z.string(),
  friendId: z.string(),
});

// POST /api/friends/request
friendsRoutes.post('/request', asyncHandler(async (req, res) => {
  const { userId, friendId } = friendRequestSchema.parse(req.body);

  if (userId === friendId) {
    return res.status(400).json({ success: false, error: 'Cannot friend yourself' });
  }

  const existing = await prisma.friendship.findFirst({
    where: {
      OR: [
        { userId, friendId },
        { userId: friendId, friendId: userId }
      ]
    }
  });

  if (existing) {
    return res.status(400).json({ success: false, error: 'Friendship already exists or pending' });
  }

  const friendship = await prisma.friendship.create({
    data: {
      userId,
      friendId,
      status: 'pending',
    },
  });

  res.json({ success: true, friendship });
}));

// POST /api/friends/accept
friendsRoutes.post('/accept', asyncHandler(async (req, res) => {
  const { userId, friendId } = friendRequestSchema.parse(req.body);

  const friendship = await prisma.friendship.update({
    where: {
      userId_friendId: { userId: friendId, friendId: userId } // friendId sent the request
    },
    data: {
      status: 'accepted',
    },
  });

  res.json({ success: true, friendship });
}));

// POST /api/friends/decline
friendsRoutes.post('/decline', asyncHandler(async (req, res) => {
  const { userId, friendId } = friendRequestSchema.parse(req.body);

  await prisma.friendship.delete({
    where: {
      userId_friendId: { userId: friendId, friendId: userId }
    }
  });

  res.json({ success: true });
}));

// GET /api/friends/list
friendsRoutes.get('/list', asyncHandler(async (req, res) => {
  const userId = req.query.userId as string;

  if (!userId) {
    return res.status(400).json({ success: false, error: 'User ID required' });
  }

  const friendships = await prisma.friendship.findMany({
    where: {
      OR: [
        { userId, status: 'accepted' },
        { friendId: userId, status: 'accepted' }
      ]
    },
    include: {
      user: {
        select: { 
          id: true, 
          name: true, 
          profilePhotoUrl: true, 
          age: true,
          rankings: {
            take: 1,
            orderBy: { lastUpdated: 'desc' },
            select: { trophyScore: true }
          }
        }
      },
      friend: {
        select: { 
          id: true, 
          name: true, 
          profilePhotoUrl: true, 
          age: true,
          rankings: {
            take: 1,
            orderBy: { lastUpdated: 'desc' },
            select: { trophyScore: true }
          }
        }
      }
    }
  });

  const friends = friendships.map(f => {
    const friendData = f.userId === userId ? f.friend : f.user;
    return {
      ...friendData,
      trophyScore: friendData.rankings[0]?.trophyScore || 0
    };
  });

  res.json({ success: true, friends });
}));

// GET /api/friends/pending
friendsRoutes.get('/pending', asyncHandler(async (req, res) => {
  const userId = req.query.userId as string;

  if (!userId) {
    return res.status(400).json({ success: false, error: 'User ID required' });
  }

  const pending = await prisma.friendship.findMany({
    where: {
      friendId: userId,
      status: 'pending',
    },
    include: {
      user: {
        select: { id: true, name: true, profilePhotoUrl: true }
      }
    }
  });

  res.json({ success: true, pending: pending.map(p => p.user) });
}));

const acceptInviteSchema = z.object({
  userId: z.string(),
  inviterId: z.string(),
});

// POST /api/friends/accept-invite
// Creates an accepted friendship from an invite link (skips pending state)
friendsRoutes.post('/accept-invite', asyncHandler(async (req, res) => {
  const { userId, inviterId } = acceptInviteSchema.parse(req.body);

  if (userId === inviterId) {
    return res.status(400).json({ success: false, error: 'Cannot friend yourself' });
  }

  // Check if inviter exists
  const inviter = await prisma.user.findUnique({
    where: { id: inviterId },
    select: { id: true, name: true, profilePhotoUrl: true }
  });

  if (!inviter) {
    return res.status(404).json({ success: false, error: 'Inviter not found' });
  }

  // Check if friendship already exists
  const existing = await prisma.friendship.findFirst({
    where: {
      OR: [
        { userId, friendId: inviterId },
        { userId: inviterId, friendId: userId }
      ]
    }
  });

  if (existing) {
    // If already friends or pending, just return success
    if (existing.status === 'accepted') {
      return res.json({ success: true, message: 'Already friends', inviter });
    }
    // If pending, accept it
    await prisma.friendship.update({
      where: { id: existing.id },
      data: { status: 'accepted' }
    });
    return res.json({ success: true, message: 'Friend request accepted', inviter });
  }

  // Create new accepted friendship (inviter initiated, since they sent the link)
  const friendship = await prisma.friendship.create({
    data: {
      userId: inviterId,  // Inviter is the initiator
      friendId: userId,   // Current user is the receiver
      status: 'accepted', // Skip pending state for invite links
    },
  });

  res.json({ success: true, friendship, inviter });
}));

