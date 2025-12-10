/**
 * Corrected Bradley-Terry Rating System
 * 
 * This service implements the standard Bradley-Terry model for pairwise comparison data.
 * The Bradley-Terry model estimates the "strength" or "skill" of items based on comparison outcomes.
 * 
 * Mathematical Foundation:
 * For items i and j with ratings r_i and r_j, the probability that i beats j is:
 * P(i beats j) = r_i / (r_i + r_j)
 * 
 * Update Formula:
 * When item i beats item j:
 * r_i += α * (1 - P(i beats j))  // Winner gets boost based on upset probability
 * r_j += α * (0 - P(j beats i))  // Loser gets penalty
 * 
 * Where α is the learning rate (typically 0.1)
 */

export interface BradleyTerryRating {
  id: string;
  score: number;
  wins: number;
  losses: number;
  totalComparisons: number;
}

export interface BradleyTerryUpdate {
  winnerId: string;
  loserId: string;
  newWinnerScore: number;
  newLoserScore: number;
}

export interface BradleyTerryCalculationOptions {
  learningRate?: number;
  convergenceThreshold?: number;
  maxIterations?: number;
  minScore?: number;
  maxScore?: number;
  normalizeScores?: boolean;
}

export class BradleyTerryService {
  private readonly defaultOptions: Required<BradleyTerryCalculationOptions> = {
    learningRate: 0.1,
    convergenceThreshold: 1e-6,
    maxIterations: 1000,
    minScore: 0.01,  // Prevent scores from hitting exactly 0
    maxScore: 10.0,  // Reasonable upper bound
    normalizeScores: true,
  };

  /**
   * Calculate the probability that item A beats item B
   * This is the core Bradley-Terry probability formula
   */
  public calculateWinProbability(ratingA: number, ratingB: number): number {
    return ratingA / (ratingA + ratingB);
  }

  /**
   * Update ratings for a single comparison using the corrected Bradley-Terry formula
   */
  public updateRatings(
    winnerRating: number,
    loserRating: number,
    options: Partial<BradleyTerryCalculationOptions> = {}
  ): BradleyTerryUpdate {
    const opts = { ...this.defaultOptions, ...options };
    
    // Calculate probabilities using correct formula
    const winnerProb = this.calculateWinProbability(winnerRating, loserRating);
    const loserProb = this.calculateWinProbability(loserRating, winnerRating);
    
    // Standard additive Bradley-Terry updates
    const winnerScoreDelta = opts.learningRate * (1 - winnerProb); // Boost proportional to upset
    const loserScoreDelta = opts.learningRate * (0 - loserProb);   // Penalty proportional to expected win
    
    let newWinnerScore = winnerRating + winnerScoreDelta;
    let newLoserScore = loserRating + loserScoreDelta;
    
    // Apply bounds to prevent score explosion or collapse
    newWinnerScore = Math.min(Math.max(opts.minScore, newWinnerScore), opts.maxScore);
    newLoserScore = Math.min(Math.max(opts.minScore, newLoserScore), opts.maxScore);
    
    return {
      winnerId: '', // Will be set by caller
      loserId: '',  // Will be set by caller
      newWinnerScore,
      newLoserScore,
    };
  }

  /**
   * Batch calculate ratings from a series of comparisons
   * This is useful for recalculating all ratings from scratch
   */
  public calculateRatingsFromComparisons(
    comparisons: Array<{ winnerId: string; loserId: string }>,
    initialRatings: Map<string, number> = new Map(),
    options: Partial<BradleyTerryCalculationOptions> = {}
  ): Map<string, BradleyTerryRating> {
    const opts = { ...this.defaultOptions, ...options };
    const ratings = new Map<string, BradleyTerryRating>();
    
    // Initialize all items with default ratings
    const allItemIds = new Set<string>();
    for (const comp of comparisons) {
      allItemIds.add(comp.winnerId);
      allItemIds.add(comp.loserId);
    }
    
    for (const itemId of allItemIds) {
      const initialScore = initialRatings.get(itemId) || 1.0; // Standard initial rating
      ratings.set(itemId, {
        id: itemId,
        score: initialScore,
        wins: 0,
        losses: 0,
        totalComparisons: 0,
      });
    }
    
    // Process each comparison
    for (const comparison of comparisons) {
      const winnerRating = ratings.get(comparison.winnerId);
      const loserRating = ratings.get(comparison.loserId);
      
      if (!winnerRating || !loserRating) {
        console.error(`Missing rating for comparison: ${comparison.winnerId} vs ${comparison.loserId}`);
        continue;
      }
      
      // Update scores
      const update = this.updateRatings(winnerRating.score, loserRating.score, options);
      
      winnerRating.score = update.newWinnerScore;
      loserRating.score = update.newLoserScore;
      
      // Update comparison counts
      winnerRating.wins++;
      winnerRating.totalComparisons++;
      loserRating.losses++;
      loserRating.totalComparisons++;
    }
    
    // Optional: Normalize scores to prevent drift
    if (opts.normalizeScores) {
      this.normalizeRatings(ratings);
    }
    
    return ratings;
  }

  /**
   * High-level function to recalculate rankings from raw database comparisons
   * This is the main entry point for recalculating all rankings from scratch
   */
  public async calculateFreshRankingsFromDatabase(
    prisma: any,
    options: Partial<BradleyTerryCalculationOptions> = {}
  ): Promise<{
    photoRankings: Map<string, BradleyTerryRating>;
    sampleImageRankings: Map<string, BradleyTerryRating>;
    combinedRankings: Map<string, BradleyTerryRating>;
    stats: {
      totalComparisons: number;
      userPhotoComparisons: number;
      sampleImageComparisons: number;
      mixedComparisons: number;
      totalPhotos: number;
      totalSampleImages: number;
    };
  }> {
    console.log('🧮 Calculating fresh rankings using corrected Bradley-Terry algorithm...');
    
    // Fetch all comparisons with their types
    const allComparisons = await prisma.comparison.findMany({
      select: {
        winnerPhotoId: true,
        loserPhotoId: true,
        winnerSampleImageId: true,
        loserSampleImageId: true,
        comparisonType: true,
        timestamp: true,
      },
      orderBy: {
        timestamp: 'asc', // Process in chronological order
      },
    });

    console.log(`   Processing ${allComparisons.length} total comparisons...`);

    // Separate comparisons by type
    const userPhotoComparisons: Array<{ winnerId: string; loserId: string }> = [];
    const sampleImageComparisons: Array<{ winnerId: string; loserId: string }> = [];
    const mixedComparisons: Array<{ winnerId: string; loserId: string; winnerType: string; loserType: string }> = [];

    for (const comp of allComparisons) {
      if (comp.comparisonType === 'user_photos' && comp.winnerPhotoId && comp.loserPhotoId) {
        userPhotoComparisons.push({
          winnerId: comp.winnerPhotoId,
          loserId: comp.loserPhotoId,
        });
      } else if (comp.comparisonType === 'sample_images' && comp.winnerSampleImageId && comp.loserSampleImageId) {
        sampleImageComparisons.push({
          winnerId: comp.winnerSampleImageId,
          loserId: comp.loserSampleImageId,
        });
      } else if (comp.comparisonType === 'mixed') {
        const winnerId = comp.winnerPhotoId || comp.winnerSampleImageId;
        const loserId = comp.loserPhotoId || comp.loserSampleImageId;
        const winnerType = comp.winnerPhotoId ? 'user' : 'sample';
        const loserType = comp.loserPhotoId ? 'user' : 'sample';
        
        if (winnerId && loserId) {
          mixedComparisons.push({
            winnerId,
            loserId,
            winnerType,
            loserType,
          });
        }
      }
    }

    // Calculate individual ranking systems
    console.log(`   📊 User photos: ${userPhotoComparisons.length} comparisons`);
    const photoRankings = this.calculateRatingsFromComparisons(userPhotoComparisons, new Map(), options);

    console.log(`   🖼️  Sample images: ${sampleImageComparisons.length} comparisons`);
    const sampleImageRankings = this.calculateRatingsFromComparisons(sampleImageComparisons, new Map(), options);

    // For combined rankings, we need to process all comparisons together
    console.log(`   🔀 Mixed comparisons: ${mixedComparisons.length} comparisons`);
    const allCombinedComparisons: Array<{ winnerId: string; loserId: string }> = [];
    
    // Add user photo comparisons (prefixed to distinguish from sample IDs)
    userPhotoComparisons.forEach(comp => {
      allCombinedComparisons.push({
        winnerId: `photo_${comp.winnerId}`,
        loserId: `photo_${comp.loserId}`,
      });
    });

    // Add sample image comparisons (prefixed to distinguish from photo IDs)
    sampleImageComparisons.forEach(comp => {
      allCombinedComparisons.push({
        winnerId: `sample_${comp.winnerId}`,
        loserId: `sample_${comp.loserId}`,
      });
    });

    // Add mixed comparisons
    mixedComparisons.forEach(comp => {
      const winnerKey = comp.winnerType === 'user' ? `photo_${comp.winnerId}` : `sample_${comp.winnerId}`;
      const loserKey = comp.loserType === 'user' ? `photo_${comp.loserId}` : `sample_${comp.loserId}`;
      
      allCombinedComparisons.push({
        winnerId: winnerKey,
        loserId: loserKey,
      });
    });

    console.log(`   🎯 Combined system: ${allCombinedComparisons.length} total comparisons`);
    const combinedRankingsWithPrefix = this.calculateRatingsFromComparisons(allCombinedComparisons, new Map(), options);

    // Remove prefixes from combined rankings and separate by type
    const combinedRankings = new Map<string, BradleyTerryRating>();
    for (const [prefixedId, rating] of combinedRankingsWithPrefix) {
      let actualId: string;
      if (prefixedId.startsWith('photo_')) {
        actualId = prefixedId.substring(6); // Remove 'photo_' prefix
      } else if (prefixedId.startsWith('sample_')) {
        actualId = prefixedId.substring(7); // Remove 'sample_' prefix
      } else {
        actualId = prefixedId;
      }
      
      combinedRankings.set(actualId, {
        ...rating,
        id: actualId,
      });
    }

    const stats = {
      totalComparisons: allComparisons.length,
      userPhotoComparisons: userPhotoComparisons.length,
      sampleImageComparisons: sampleImageComparisons.length,
      mixedComparisons: mixedComparisons.length,
      totalPhotos: photoRankings.size,
      totalSampleImages: sampleImageRankings.size,
    };

    console.log('✅ Fresh rankings calculated successfully');
    console.log(`   Photos: ${stats.totalPhotos} ranked items`);
    console.log(`   Sample images: ${stats.totalSampleImages} ranked items`);
    console.log(`   Combined: ${combinedRankings.size} ranked items`);

    return {
      photoRankings,
      sampleImageRankings,
      combinedRankings,
      stats,
    };
  }

  /**
   * Normalize ratings to maintain stable score distribution
   * This prevents score inflation/deflation over time
   */
  private normalizeRatings(ratings: Map<string, BradleyTerryRating>): void {
    const scores = Array.from(ratings.values()).map(r => r.score);
    if (scores.length === 0) return;
    
    // Calculate current mean
    const currentMean = scores.reduce((sum, score) => sum + score, 0) / scores.length;
    const targetMean = 1.0; // Standard Bradley-Terry mean
    
    // Adjust all scores proportionally
    const scaleFactor = targetMean / currentMean;
    
    for (const rating of ratings.values()) {
      rating.score *= scaleFactor;
    }
  }

  /**
   * Calculate percentiles for a set of ratings
   */
  public calculatePercentiles(
    ratings: BradleyTerryRating[],
    minComparisons = 0
  ): Map<string, number> {
    // Filter ratings with sufficient comparisons
    const validRatings = ratings.filter(r => r.totalComparisons >= minComparisons);
    
    // Sort by score (descending - highest scores get highest percentiles)
    const sortedRatings = validRatings.sort((a, b) => b.score - a.score);
    
    const percentiles = new Map<string, number>();
    const totalItems = sortedRatings.length;
    
    if (totalItems === 0) return percentiles;
    
    // Calculate percentile for each item
    for (let i = 0; i < sortedRatings.length; i++) {
      const rank = i + 1; // 1-based rank (1st place = rank 1)
      const percentile = ((totalItems - rank + 1) / totalItems) * 100;
      percentiles.set(sortedRatings[i].id, Math.round(percentile * 10) / 10);
    }
    
    return percentiles;
  }

  /**
   * Calculate confidence score based on number of comparisons
   * More comparisons = higher confidence in the rating
   */
  public calculateConfidence(totalComparisons: number): number {
    // Logarithmic confidence scale: approaches 1.0 as comparisons increase
    // 0 comparisons = 0.0 confidence, 100 comparisons ≈ 1.0 confidence
    return Math.min(Math.log(totalComparisons + 1) / Math.log(101), 1.0);
  }

  /**
   * Validate rating calculations for mathematical consistency
   */
  public validateRatings(ratings: BradleyTerryRating[]): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];
    
    for (const rating of ratings) {
      // Check score bounds
      if (rating.score <= 0 || rating.score > this.defaultOptions.maxScore) {
        errors.push(`Invalid score for ${rating.id}: ${rating.score}`);
      }
      
      // Check comparison counts
      if (rating.wins + rating.losses !== rating.totalComparisons) {
        errors.push(`Invalid comparison counts for ${rating.id}: wins(${rating.wins}) + losses(${rating.losses}) ≠ total(${rating.totalComparisons})`);
      }
      
      // Check for negative values
      if (rating.wins < 0 || rating.losses < 0 || rating.totalComparisons < 0) {
        errors.push(`Negative values found for ${rating.id}`);
      }
    }
    
    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Calculate expected win rates based on current ratings
   * Useful for validating that the model makes sense
   */
  public calculateExpectedWinRates(ratings: BradleyTerryRating[]): Map<string, number> {
    const winRates = new Map<string, number>();
    
    for (const ratingA of ratings) {
      let expectedWins = 0;
      let totalExpectedComparisons = 0;
      
      for (const ratingB of ratings) {
        if (ratingA.id === ratingB.id) continue;
        
        const winProb = this.calculateWinProbability(ratingA.score, ratingB.score);
        expectedWins += winProb;
        totalExpectedComparisons += 1;
      }
      
      if (totalExpectedComparisons > 0) {
        winRates.set(ratingA.id, expectedWins / totalExpectedComparisons);
      }
    }
    
    return winRates;
  }

  /**
   * Calculate information gain for a potential comparison between two items
   * Higher values indicate more informative comparisons
   */
  public calculateInformationGain(
    scoreA: number, 
    scoreB: number, 
    comparisonsA: number, 
    comparisonsB: number
  ): number {
    // Calculate win probability for A vs B
    const winProbA = this.calculateWinProbability(scoreA, scoreB);
    
    // Uncertainty score: highest when win probability is closest to 50%
    // This measures how uncertain the outcome is
    const uncertainty = 1 - Math.abs(winProbA - 0.5) * 2; // Maps [0,1] to [1,0], peak at 0.5
    
    // Confidence penalty: lower confidence (fewer comparisons) = higher gain
    // Use harmonic mean of comparison counts to balance both items
    const minComparisons = 1; // Avoid division by zero
    const avgComparisons = 2 / (1 / Math.max(minComparisons, comparisonsA) + 1 / Math.max(minComparisons, comparisonsB));
    const confidencePenalty = 1 / Math.sqrt(avgComparisons + 1);
    
    // Combined information gain score
    return uncertainty * confidencePenalty;
  }

  /**
   * Calculate uncertainty score based on how close the win probability is to 50%
   * Returns value between 0 and 1, where 1 is maximum uncertainty (50% win prob)
   */
  public calculateUncertainty(scoreA: number, scoreB: number): number {
    const winProbA = this.calculateWinProbability(scoreA, scoreB);
    return 1 - Math.abs(winProbA - 0.5) * 2;
  }

  /**
   * Calculate confidence penalty based on number of comparisons
   * Returns higher values for items with fewer comparisons (less confident ratings)
   */
  public calculateConfidencePenalty(comparisonsA: number, comparisonsB: number): number {
    const minComparisons = 1;
    const avgComparisons = 2 / (1 / Math.max(minComparisons, comparisonsA) + 1 / Math.max(minComparisons, comparisonsB));
    return 1 / Math.sqrt(avgComparisons + 1);
  }
}

// Export singleton instance
export const bradleyTerryService = new BradleyTerryService();