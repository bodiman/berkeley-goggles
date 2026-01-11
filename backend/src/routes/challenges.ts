import { Router } from 'express';
import { asyncHandler } from '../middleware/errorHandler';
import { prisma } from '../services/database';
import { z } from 'zod';

export const challengesRoutes = Router();

const createChallengeSchema = z.object({
  challengerId: z.string(),
  challengedId: z.string(),
});

// POST /api/challenges - Send a challenge to a friend
challengesRoutes.post('/', asyncHandler(async (req, res) => {
  const { challengerId, challengedId } = createChallengeSchema.parse(req.body);

  if (challengerId === challengedId) {
    return res.status(400).json({ success: false, error: 'Cannot challenge yourself' });
  }

  // Check if they are friends
  const friendship = await prisma.friendship.findFirst({
    where: {
      OR: [
        { userId: challengerId, friendId: challengedId, status: 'accepted' },
        { userId: challengedId, friendId: challengerId, status: 'accepted' }
      ]
    }
  });

  if (!friendship) {
    return res.status(400).json({ success: false, error: 'You can only challenge friends' });
  }

  // Check for existing pending/active challenge between these users
  const existingChallenge = await prisma.challenge.findFirst({
    where: {
      OR: [
        { challengerId, challengedId, status: { in: ['pending', 'active'] } },
        { challengerId: challengedId, challengedId: challengerId, status: { in: ['pending', 'active'] } }
      ]
    }
  });

  if (existingChallenge) {
    return res.status(400).json({ success: false, error: 'A challenge already exists between you two' });
  }

  // Create the challenge
  const challenge = await prisma.challenge.create({
    data: {
      challengerId,
      challengedId,
      status: 'pending',
    },
    include: {
      challenger: {
        select: { id: true, name: true, profilePhotoUrl: true }
      },
      challenged: {
        select: { id: true, name: true, profilePhotoUrl: true }
      }
    }
  });

  res.json({ success: true, challenge });
}));

// POST /api/challenges/accept/:id - Accept a challenge
challengesRoutes.post('/accept/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { userId } = req.body;

  const challenge = await prisma.challenge.findUnique({
    where: { id }
  });

  if (!challenge) {
    return res.status(404).json({ success: false, error: 'Challenge not found' });
  }

  if (challenge.challengedId !== userId) {
    return res.status(403).json({ success: false, error: 'Only the challenged user can accept' });
  }

  if (challenge.status !== 'pending') {
    return res.status(400).json({ success: false, error: 'Challenge is not pending' });
  }

  const updatedChallenge = await prisma.challenge.update({
    where: { id },
    data: {
      status: 'active',
      acceptedAt: new Date(),
    },
    include: {
      challenger: {
        select: { id: true, name: true, profilePhotoUrl: true }
      },
      challenged: {
        select: { id: true, name: true, profilePhotoUrl: true }
      }
    }
  });

  res.json({ success: true, challenge: updatedChallenge });
}));

// POST /api/challenges/decline/:id - Decline a challenge
challengesRoutes.post('/decline/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { userId } = req.body;

  const challenge = await prisma.challenge.findUnique({
    where: { id }
  });

  if (!challenge) {
    return res.status(404).json({ success: false, error: 'Challenge not found' });
  }

  if (challenge.challengedId !== userId) {
    return res.status(403).json({ success: false, error: 'Only the challenged user can decline' });
  }

  if (challenge.status !== 'pending') {
    return res.status(400).json({ success: false, error: 'Challenge is not pending' });
  }

  const updatedChallenge = await prisma.challenge.update({
    where: { id },
    data: { status: 'declined' }
  });

  res.json({ success: true, challenge: updatedChallenge });
}));

// GET /api/challenges/pending/:userId - Get pending challenges for a user
challengesRoutes.get('/pending/:userId', asyncHandler(async (req, res) => {
  const { userId } = req.params;

  // Get challenges where user is the one being challenged (incoming)
  const incoming = await prisma.challenge.findMany({
    where: {
      challengedId: userId,
      status: 'pending'
    },
    include: {
      challenger: {
        select: { id: true, name: true, profilePhotoUrl: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  // Get challenges where user initiated (outgoing)
  const outgoing = await prisma.challenge.findMany({
    where: {
      challengerId: userId,
      status: 'pending'
    },
    include: {
      challenged: {
        select: { id: true, name: true, profilePhotoUrl: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  // Get active challenges where user is a participant
  const active = await prisma.challenge.findMany({
    where: {
      status: 'active',
      OR: [
        { challengerId: userId },
        { challengedId: userId }
      ]
    },
    include: {
      challenger: {
        select: { id: true, name: true, profilePhotoUrl: true }
      },
      challenged: {
        select: { id: true, name: true, profilePhotoUrl: true }
      },
      votes: {
        include: {
          voter: {
            select: { id: true, name: true, profilePhotoUrl: true }
          },
          chosenUser: {
            select: { id: true, name: true }
          }
        },
        orderBy: { createdAt: 'desc' }
      }
    },
    orderBy: { acceptedAt: 'desc' }
  });

  res.json({ success: true, incoming, outgoing, active });
}));

// GET /api/challenges/active - Get a random active challenge for comparison queue
challengesRoutes.get('/active', asyncHandler(async (req, res) => {
  const { excludeUserId } = req.query;

  // Get a random active challenge that doesn't involve the current user
  // and that the user hasn't voted on yet
  const activeChallenges = await prisma.challenge.findMany({
    where: {
      status: 'active',
      AND: [
        { challengerId: { not: excludeUserId as string } },
        { challengedId: { not: excludeUserId as string } },
        {
          votes: {
            none: {
              voterId: excludeUserId as string
            }
          }
        }
      ]
    },
    include: {
      challenger: {
        select: { id: true, name: true, profilePhotoUrl: true }
      },
      challenged: {
        select: { id: true, name: true, profilePhotoUrl: true }
      }
    }
  });

  if (activeChallenges.length === 0) {
    return res.json({ success: true, challenge: null });
  }

  // Pick a random one
  const randomChallenge = activeChallenges[Math.floor(Math.random() * activeChallenges.length)];

  res.json({ success: true, challenge: randomChallenge });
}));

const voteSchema = z.object({
  challengeId: z.string(),
  voterId: z.string(),
  chosenUserId: z.string(),
});

// POST /api/challenges/vote - Submit a vote on a challenge
challengesRoutes.post('/vote', asyncHandler(async (req, res) => {
  const { challengeId, voterId, chosenUserId } = voteSchema.parse(req.body);

  const challenge = await prisma.challenge.findUnique({
    where: { id: challengeId }
  });

  if (!challenge) {
    return res.status(404).json({ success: false, error: 'Challenge not found' });
  }

  if (challenge.status !== 'active') {
    return res.status(400).json({ success: false, error: 'Challenge is not active' });
  }

  // Can't vote on your own challenge
  if (voterId === challenge.challengerId || voterId === challenge.challengedId) {
    return res.status(400).json({ success: false, error: 'Cannot vote on your own challenge' });
  }

  // Validate chosenUserId is one of the participants
  if (chosenUserId !== challenge.challengerId && chosenUserId !== challenge.challengedId) {
    return res.status(400).json({ success: false, error: 'Invalid chosen user' });
  }

  // Check if already voted
  const existingVote = await prisma.challengeVote.findUnique({
    where: {
      challengeId_voterId: { challengeId, voterId }
    }
  });

  if (existingVote) {
    return res.status(400).json({ success: false, error: 'Already voted on this challenge' });
  }

  // Create the vote and update counts
  const isForChallenger = chosenUserId === challenge.challengerId;

  const [vote, updatedChallenge] = await prisma.$transaction([
    prisma.challengeVote.create({
      data: {
        challengeId,
        voterId,
        chosenUserId,
      }
    }),
    prisma.challenge.update({
      where: { id: challengeId },
      data: {
        challengerVotes: isForChallenger ? { increment: 1 } : undefined,
        challengedVotes: !isForChallenger ? { increment: 1 } : undefined,
      }
    })
  ]);

  // Check if challenge is complete
  const totalVotes = updatedChallenge.challengerVotes + updatedChallenge.challengedVotes;

  if (totalVotes >= updatedChallenge.votesRequired) {
    // Determine winner
    const winnerId = updatedChallenge.challengerVotes > updatedChallenge.challengedVotes
      ? updatedChallenge.challengerId
      : updatedChallenge.challengedVotes > updatedChallenge.challengerVotes
        ? updatedChallenge.challengedId
        : null; // Tie

    await prisma.challenge.update({
      where: { id: challengeId },
      data: {
        status: 'completed',
        completedAt: new Date(),
        winnerId,
      }
    });

    console.log(`Challenge ${challengeId} completed! Winner: ${winnerId || 'TIE'} (${updatedChallenge.challengerVotes}-${updatedChallenge.challengedVotes})`);
  }

  res.json({ success: true, vote, totalVotes });
}));

// GET /api/challenges/:id/details - Get challenge details with all votes
challengesRoutes.get('/:id/details', asyncHandler(async (req, res) => {
  const { id } = req.params;

  const challenge = await prisma.challenge.findUnique({
    where: { id },
    include: {
      challenger: {
        select: { id: true, name: true, profilePhotoUrl: true }
      },
      challenged: {
        select: { id: true, name: true, profilePhotoUrl: true }
      },
      votes: {
        include: {
          voter: {
            select: { id: true, name: true, profilePhotoUrl: true }
          }
        },
        orderBy: { createdAt: 'asc' }
      }
    }
  });

  if (!challenge) {
    return res.status(404).json({ success: false, error: 'Challenge not found' });
  }

  res.json({ success: true, challenge });
}));

// GET /api/challenges/history/:userId - Get completed challenges for battle log
challengesRoutes.get('/history/:userId', asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const limit = parseInt(req.query.limit as string) || 20;

  const challenges = await prisma.challenge.findMany({
    where: {
      status: 'completed',
      OR: [
        { challengerId: userId },
        { challengedId: userId }
      ]
    },
    include: {
      challenger: {
        select: { id: true, name: true, profilePhotoUrl: true }
      },
      challenged: {
        select: { id: true, name: true, profilePhotoUrl: true }
      }
    },
    orderBy: { completedAt: 'desc' },
    take: limit
  });

  // Format for battle log display
  const formattedChallenges = challenges.map(c => {
    const isChallenger = c.challengerId === userId;
    const opponent = isChallenger ? c.challenged : c.challenger;
    const userVotes = isChallenger ? c.challengerVotes : c.challengedVotes;
    const opponentVotes = isChallenger ? c.challengedVotes : c.challengerVotes;
    const won = c.winnerId === userId;
    const isTie = c.winnerId === null;

    return {
      id: c.id,
      type: 'challenge',
      opponent,
      userVotes,
      opponentVotes,
      won,
      isTie,
      completedAt: c.completedAt,
    };
  });

  res.json({ success: true, challenges: formattedChallenges });
}));
