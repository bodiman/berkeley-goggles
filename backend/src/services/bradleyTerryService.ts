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
    minScore: 200,  // Minimum elo rating
    maxScore: 2800,  // Maximum elo rating
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
      const initialScore = initialRatings.get(itemId) || 1000; // Standard initial rating (1000 elo)
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
    const targetMean = 1000; // Target elo mean
    
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

  // =====================================
  // Trophy System Methods (from ranking_system_concept.py)
  // =====================================

  /**
   * Calculate target trophy scores based on Bradley-Terry percentile rankings
   * Maps percentile → Normal(1500, 430) distribution
   * Based on target_trophies() function from ranking_system_concept.py (lines 59-63)
   */
  public calculateTargetTrophies(
    theta: number[], 
    targetMean: number = 1500, 
    targetStd: number = 430
  ): number[] {
    // Get ranks (0-based indices sorted by theta values)
    const sortedIndices = theta
      .map((value, index) => ({ value, index }))
      .sort((a, b) => a.value - b.value)
      .map(item => item.index);

    // Calculate percentile positions (0 to 1)
    const percentiles = new Array(theta.length);
    for (let i = 0; i < sortedIndices.length; i++) {
      const rank = i + 1; // 1-based rank
      const p = rank / (theta.length + 1); // Percentile position
      percentiles[sortedIndices[i]] = p;
    }

    // Map percentiles to Normal(targetMean, targetStd) using inverse normal CDF
    return percentiles.map(p => {
      // Simple approximation of inverse normal CDF (Box-Muller transformation variant)
      const z = this.inverseNormalCDF(p);
      return targetMean + targetStd * z;
    });
  }

  /**
   * Simple approximation of inverse normal CDF for percentile mapping
   * Used in calculateTargetTrophies to convert percentiles to normal distribution
   */
  private inverseNormalCDF(p: number): number {
    // Clamp p to avoid edge cases
    p = Math.max(0.0001, Math.min(0.9999, p));
    
    // Beasley-Springer-Moro approximation for inverse normal CDF
    const a0 = 2.50662823884;
    const a1 = -18.61500062529;
    const a2 = 41.39119773534;
    const a3 = -25.44106049637;
    const b1 = -8.47351093090;
    const b2 = 23.08336743743;
    const b3 = -21.06224101826;
    const b4 = 3.13082909833;
    const c0 = 0.3374754822726147;
    const c1 = 0.9761690190917186;
    const c2 = 0.1607979714918209;
    const c3 = 0.0276438810333863;
    const c4 = 0.0038405729373609;
    const c5 = 0.0003951896511919;
    const c6 = 0.0000321767881768;
    const c7 = 0.0000002888167364;
    const c8 = 0.0000003960315187;

    const u = p - 0.5;
    
    if (Math.abs(u) < 0.42) {
      // Central region
      const r = u * u;
      return u * (((a3 * r + a2) * r + a1) * r + a0) / 
             ((((b4 * r + b3) * r + b2) * r + b1) * r + 1);
    } else {
      // Tail regions
      const r = p < 0.5 ? p : 1 - p;
      const t = Math.sqrt(-Math.log(r));
      
      let x;
      if (t < 5) {
        x = c0 + t * (c1 + t * (c2 + t * (c3 + t * c4)));
      } else {
        x = c5 + t * (c6 + t * (c7 + t * c8));
      }
      
      return p < 0.5 ? -x : x;
    }
  }

  /**
   * Calculate trophy score update for a single player
   * Based on trophy_step() function from ranking_system_concept.py (lines 101-113)
   */
  public calculateTrophyStep(
    currentTrophy: number,
    targetTrophy: number,
    win: boolean,
    winGain: number = 35,
    lossPenalty: number = 25,
    fadeWidth: number = 300
  ): number {
    // Calculate gap between target and current trophy score
    const gap = targetTrophy - currentTrophy;
    
    // Scale factor based on distance from target (closer to target = smaller adjustments)
    const scale = Math.max(0, Math.min(1, gap / fadeWidth));
    
    // Apply scaled win/loss adjustments
    const adjustment = win 
      ? winGain * scale 
      : -lossPenalty * scale;
    
    const newTrophy = currentTrophy + adjustment;
    
    // Ensure trophy score never goes below 0 (line 113 in script)
    return Math.max(0, newTrophy);
  }

  /**
   * Update trophy scores for both players in a comparison
   * Implements the dual-layer system from the script
   */
  public updateTrophyScores(
    winnerTrophy: number,
    loserTrophy: number,
    winnerTarget: number,
    loserTarget: number,
    trophyConfig = {
      winGain: 35,
      lossPenalty: 25,
      fadeWidth: 300
    }
  ): { newWinnerTrophy: number; newLoserTrophy: number } {
    const newWinnerTrophy = this.calculateTrophyStep(
      winnerTrophy,
      winnerTarget,
      true, // winner
      trophyConfig.winGain,
      trophyConfig.lossPenalty,
      trophyConfig.fadeWidth
    );

    const newLoserTrophy = this.calculateTrophyStep(
      loserTrophy,
      loserTarget,
      false, // loser
      trophyConfig.winGain,
      trophyConfig.lossPenalty,
      trophyConfig.fadeWidth
    );

    return {
      newWinnerTrophy,
      newLoserTrophy
    };
  }

  /**
   * Get default trophy configuration constants from ranking_system_concept.py
   */
  public getDefaultTrophyConfig() {
    return {
      winGain: 35,        // WIN_GAIN
      lossPenalty: 25,    // LOSS_PENALTY
      targetMean: 1500,   // TARGET_MEAN
      targetStd: 430,     // TARGET_STD
      fadeWidth: 300,     // FADE_WIDTH
      learningRate: 0.05  // K_BT
    };
  }
}

// Export singleton instance
export const bradleyTerryService = new BradleyTerryService();