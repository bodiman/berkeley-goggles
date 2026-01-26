import { Router } from 'express';
import { asyncHandler } from '../middleware/errorHandler';
import { prisma } from '../services/database';

export const loveRoutes = Router();

// POST /api/love/questionnaire - Save questionnaire responses
loveRoutes.post('/questionnaire', asyncHandler(async (req, res) => {
  try {
    const { userId, answers, version = 1 } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: 'User ID required',
      });
    }

    if (!answers || typeof answers !== 'object') {
      return res.status(400).json({
        success: false,
        error: 'Answers object required',
      });
    }

    // Verify user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
      });
    }

    // Upsert questionnaire response
    const response = await prisma.loveQuestionnaireResponse.upsert({
      where: { userId },
      update: {
        answers,
        version,
        completedAt: new Date(),
      },
      create: {
        userId,
        answers,
        version,
      },
    });

    // Update user's love source if not already set
    if (!user.loveSource) {
      await prisma.user.update({
        where: { id: userId },
        data: { loveSource: 'love' },
      });
    }

    return res.json({
      success: true,
      questionnaire: response,
    });
  } catch (error) {
    console.error('Failed to save questionnaire:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to save questionnaire responses',
    });
  }
}));

// GET /api/love/questionnaire/:userId - Get existing questionnaire response
loveRoutes.get('/questionnaire/:userId', asyncHandler(async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: 'User ID required',
      });
    }

    const response = await prisma.loveQuestionnaireResponse.findUnique({
      where: { userId },
    });

    if (!response) {
      return res.json({
        success: true,
        questionnaire: null,
        completed: false,
      });
    }

    return res.json({
      success: true,
      questionnaire: response,
      completed: true,
    });
  } catch (error) {
    console.error('Failed to get questionnaire:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to get questionnaire responses',
    });
  }
}));

// GET /api/love/status/:userId - Get full onboarding status
loveRoutes.get('/status/:userId', asyncHandler(async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: 'User ID required',
      });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        loveSource: true,
        loveOnboardingComplete: true,
        loveComparisonsCompleted: true,
        loveQuestionnaireResponse: {
          select: {
            id: true,
            completedAt: true,
            version: true,
          },
        },
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
      });
    }

    return res.json({
      success: true,
      status: {
        userId: user.id,
        loveSource: user.loveSource,
        questionnaireCompleted: !!user.loveQuestionnaireResponse,
        comparisonsCompleted: user.loveComparisonsCompleted,
        comparisonsRequired: 25,
        onboardingComplete: user.loveOnboardingComplete,
        progress: Math.min(100, Math.round((user.loveComparisonsCompleted / 25) * 100)),
      },
    });
  } catch (error) {
    console.error('Failed to get love status:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to get onboarding status',
    });
  }
}));
