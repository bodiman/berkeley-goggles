import { Router } from 'express';
import { asyncHandler } from '../middleware/errorHandler';
import { prisma } from '../services/database';
import { z } from 'zod';

export const messagesRoutes = Router();

const sendMessageSchema = z.object({
  senderId: z.string(),
  receiverId: z.string(),
  content: z.string().min(1).max(1000),
});

// POST /api/messages - Send a message
messagesRoutes.post('/', asyncHandler(async (req, res) => {
  const { senderId, receiverId, content } = sendMessageSchema.parse(req.body);

  if (senderId === receiverId) {
    return res.status(400).json({ success: false, error: 'Cannot message yourself' });
  }

  // Check if they are friends
  const friendship = await prisma.friendship.findFirst({
    where: {
      OR: [
        { userId: senderId, friendId: receiverId, status: 'accepted' },
        { userId: receiverId, friendId: senderId, status: 'accepted' }
      ]
    }
  });

  if (!friendship) {
    return res.status(400).json({ success: false, error: 'You can only message friends' });
  }

  const message = await prisma.message.create({
    data: {
      senderId,
      receiverId,
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

// GET /api/messages/conversation/:friendId - Get conversation with a friend
messagesRoutes.get('/conversation/:friendId', asyncHandler(async (req, res) => {
  const { friendId } = req.params;
  const { userId } = req.query;
  const limit = parseInt(req.query.limit as string) || 50;
  const before = req.query.before as string;

  if (!userId) {
    return res.status(400).json({ success: false, error: 'userId is required' });
  }

  const whereClause: any = {
    OR: [
      { senderId: userId as string, receiverId: friendId },
      { senderId: friendId, receiverId: userId as string }
    ]
  };

  if (before) {
    whereClause.createdAt = { lt: new Date(before) };
  }

  const messages = await prisma.message.findMany({
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

// PUT /api/messages/read/:friendId - Mark messages from friend as read
messagesRoutes.put('/read/:friendId', asyncHandler(async (req, res) => {
  const { friendId } = req.params;
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ success: false, error: 'userId is required' });
  }

  await prisma.message.updateMany({
    where: {
      senderId: friendId,
      receiverId: userId,
      isRead: false,
    },
    data: { isRead: true }
  });

  res.json({ success: true });
}));

// GET /api/messages/unread/:userId - Get unread message count
messagesRoutes.get('/unread/:userId', asyncHandler(async (req, res) => {
  const { userId } = req.params;

  const unreadCount = await prisma.message.count({
    where: {
      receiverId: userId,
      isRead: false,
    }
  });

  // Get unread counts per sender (for showing badges on friend cards)
  const unreadBySender = await prisma.message.groupBy({
    by: ['senderId'],
    where: {
      receiverId: userId,
      isRead: false,
    },
    _count: {
      id: true,
    }
  });

  const unreadByFriend: Record<string, number> = {};
  for (const item of unreadBySender) {
    unreadByFriend[item.senderId] = item._count.id;
  }

  res.json({ success: true, unreadCount, unreadByFriend });
}));

// GET /api/messages/conversations/:userId - Get list of conversations with last message
messagesRoutes.get('/conversations/:userId', asyncHandler(async (req, res) => {
  const { userId } = req.params;

  // Get all friends
  const friendships = await prisma.friendship.findMany({
    where: {
      OR: [
        { userId, status: 'accepted' },
        { friendId: userId, status: 'accepted' }
      ]
    },
    include: {
      user: {
        select: { id: true, name: true, profilePhotoUrl: true }
      },
      friend: {
        select: { id: true, name: true, profilePhotoUrl: true }
      }
    }
  });

  // Get last message and unread count for each friend
  const conversations = await Promise.all(
    friendships.map(async (f) => {
      const friendData = f.userId === userId ? f.friend : f.user;

      // Get last message
      const lastMessage = await prisma.message.findFirst({
        where: {
          OR: [
            { senderId: userId, receiverId: friendData.id },
            { senderId: friendData.id, receiverId: userId }
          ]
        },
        orderBy: { createdAt: 'desc' },
      });

      // Get unread count
      const unreadCount = await prisma.message.count({
        where: {
          senderId: friendData.id,
          receiverId: userId,
          isRead: false,
        }
      });

      return {
        friend: friendData,
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
