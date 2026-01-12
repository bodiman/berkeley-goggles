import { Router } from 'express';
import { asyncHandler } from '../middleware/errorHandler';
import { prisma } from '../services/database';
import { z } from 'zod';

export const matchMessagesRoutes = Router();

const sendMessageSchema = z.object({
  matchId: z.string(),
  senderId: z.string(),
  content: z.string().min(1).max(1000),
});

// POST /api/match-messages - Send a message in a match conversation
matchMessagesRoutes.post('/', asyncHandler(async (req, res) => {
  const { matchId, senderId, content } = sendMessageSchema.parse(req.body);

  // Verify the match exists and the sender is part of it
  const match = await prisma.match.findUnique({
    where: { id: matchId },
    select: { initiatorId: true, matchedId: true }
  });

  if (!match) {
    return res.status(404).json({ success: false, error: 'Match not found' });
  }

  if (match.initiatorId !== senderId && match.matchedId !== senderId) {
    return res.status(403).json({ success: false, error: 'You are not part of this match' });
  }

  const message = await prisma.matchMessage.create({
    data: {
      matchId,
      senderId,
      content,
    },
    include: {
      sender: {
        select: { id: true, name: true, profilePhotoUrl: true }
      }
    }
  });

  res.json({ success: true, message });
}));

// GET /api/match-messages/:matchId - Get messages for a match
matchMessagesRoutes.get('/:matchId', asyncHandler(async (req, res) => {
  const { matchId } = req.params;
  const { userId } = req.query;
  const limit = parseInt(req.query.limit as string) || 50;
  const before = req.query.before as string;

  if (!userId) {
    return res.status(400).json({ success: false, error: 'userId is required' });
  }

  // Verify the user is part of this match
  const match = await prisma.match.findUnique({
    where: { id: matchId },
    select: { initiatorId: true, matchedId: true }
  });

  if (!match) {
    return res.status(404).json({ success: false, error: 'Match not found' });
  }

  if (match.initiatorId !== userId && match.matchedId !== userId) {
    return res.status(403).json({ success: false, error: 'You are not part of this match' });
  }

  const whereClause: any = { matchId };

  if (before) {
    whereClause.createdAt = { lt: new Date(before) };
  }

  const messages = await prisma.matchMessage.findMany({
    where: whereClause,
    include: {
      sender: {
        select: { id: true, name: true, profilePhotoUrl: true }
      }
    },
    orderBy: { createdAt: 'desc' },
    take: limit,
  });

  // Return in chronological order
  res.json({ success: true, messages: messages.reverse() });
}));

// PUT /api/match-messages/read/:matchId - Mark messages from match partner as read
matchMessagesRoutes.put('/read/:matchId', asyncHandler(async (req, res) => {
  const { matchId } = req.params;
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ success: false, error: 'userId is required' });
  }

  // Verify the user is part of this match
  const match = await prisma.match.findUnique({
    where: { id: matchId },
    select: { initiatorId: true, matchedId: true }
  });

  if (!match) {
    return res.status(404).json({ success: false, error: 'Match not found' });
  }

  if (match.initiatorId !== userId && match.matchedId !== userId) {
    return res.status(403).json({ success: false, error: 'You are not part of this match' });
  }

  // Mark messages from the other person as read
  await prisma.matchMessage.updateMany({
    where: {
      matchId,
      senderId: { not: userId },
      isRead: false,
    },
    data: { isRead: true }
  });

  res.json({ success: true });
}));

// GET /api/match-messages/unread/:userId - Get unread message count for matches
matchMessagesRoutes.get('/unread/:userId', asyncHandler(async (req, res) => {
  const { userId } = req.params;

  // Get all matches where user is either initiator or matched
  const matches = await prisma.match.findMany({
    where: {
      OR: [
        { initiatorId: userId },
        { matchedId: userId }
      ]
    },
    select: { id: true }
  });

  const matchIds = matches.map(m => m.id);

  // Count unread messages sent by others in these matches
  const unreadCount = await prisma.matchMessage.count({
    where: {
      matchId: { in: matchIds },
      senderId: { not: userId },
      isRead: false,
    }
  });

  // Get unread counts per match
  const unreadByMatch = await prisma.matchMessage.groupBy({
    by: ['matchId'],
    where: {
      matchId: { in: matchIds },
      senderId: { not: userId },
      isRead: false,
    },
    _count: {
      id: true,
    }
  });

  const unreadByMatchMap: Record<string, number> = {};
  for (const item of unreadByMatch) {
    unreadByMatchMap[item.matchId] = item._count.id;
  }

  res.json({ success: true, unreadCount, unreadByMatch: unreadByMatchMap });
}));

// GET /api/match-messages/conversations/:userId - Get list of match conversations with last message
matchMessagesRoutes.get('/conversations/:userId', asyncHandler(async (req, res) => {
  const { userId } = req.params;

  // Get all matches for the user
  const matches = await prisma.match.findMany({
    where: {
      OR: [
        { initiatorId: userId },
        { matchedId: userId }
      ]
    },
    include: {
      initiator: {
        select: { id: true, name: true, profilePhotoUrl: true, age: true }
      },
      matched: {
        select: { id: true, name: true, profilePhotoUrl: true, age: true }
      }
    }
  });

  // Get last message and unread count for each match
  const conversations = await Promise.all(
    matches.map(async (match) => {
      const partner = match.initiatorId === userId ? match.matched : match.initiator;

      // Get last message
      const lastMessage = await prisma.matchMessage.findFirst({
        where: { matchId: match.id },
        orderBy: { createdAt: 'desc' },
      });

      // Get unread count
      const unreadCount = await prisma.matchMessage.count({
        where: {
          matchId: match.id,
          senderId: { not: userId },
          isRead: false,
        }
      });

      return {
        match: {
          id: match.id,
          status: match.status,
          createdAt: match.createdAt,
        },
        partner,
        lastMessage,
        unreadCount,
      };
    })
  );

  // Sort by last message time (most recent first)
  conversations.sort((a, b) => {
    if (!a.lastMessage && !b.lastMessage) return 0;
    if (!a.lastMessage) return 1;
    if (!b.lastMessage) return -1;
    return new Date(b.lastMessage.createdAt).getTime() - new Date(a.lastMessage.createdAt).getTime();
  });

  res.json({ success: true, conversations });
}));
