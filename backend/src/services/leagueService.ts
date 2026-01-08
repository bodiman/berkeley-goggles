import { League, LeagueProgression, LeagueStats } from '@shared/types/ranking';

export class LeagueService {
  private static readonly LEAGUES: League[] = [
    // Cooked tier (0-480)
    { id: 'cooked-1', name: 'Cooked 1', tier: 1, category: 'cooked', minElo: 0, maxElo: 240, color: '#7F1D1D', description: 'Starting your journey' },
    { id: 'cooked-2', name: 'Cooked 2', tier: 2, category: 'cooked', minElo: 240, maxElo: 480, color: '#B91C1C', description: 'Finding your style' },
    
    // Chopped tier (480-960)
    { id: 'chopped-1', name: 'Chopped 1', tier: 1, category: 'chopped', minElo: 480, maxElo: 720, color: '#C2410C', description: 'Getting competitive' },
    { id: 'chopped-2', name: 'Chopped 2', tier: 2, category: 'chopped', minElo: 720, maxElo: 960, color: '#F97316', description: 'Proving your worth' },
    
    // Chuzz tier (960-1440)
    { id: 'chuzz-1', name: 'Chuzz 1', tier: 1, category: 'chuzz', minElo: 960, maxElo: 1200, color: '#A16207', description: 'Above average' },
    { id: 'chuzz-2', name: 'Chuzz 2', tier: 2, category: 'chuzz', minElo: 1200, maxElo: 1440, color: '#EAB308', description: 'Making waves' },
    
    // Mid tier (1440-1920)
    { id: 'mid-1', name: 'Mid 1', tier: 1, category: 'mid', minElo: 1440, maxElo: 1680, color: '#16A34A', description: 'Solid performance' },
    { id: 'mid-2', name: 'Mid 2', tier: 2, category: 'mid', minElo: 1680, maxElo: 1920, color: '#4ADE80', description: 'Approaching excellence' },
    
    // Huzz tier (1920-2400)
    { id: 'huzz-1', name: 'Huzz 1', tier: 1, category: 'huzz', minElo: 1920, maxElo: 2160, color: '#0EA5E9', description: 'Elite territory' },
    { id: 'huzz-2', name: 'Huzz 2', tier: 2, category: 'huzz', minElo: 2160, maxElo: 2400, color: '#6366F1', description: 'Nearing legendary status' },
    
    // Ultimate tier (2400+)
    { id: 'ultimate-champion', name: 'Ultimate Champion', tier: 1, category: 'ultimate', minElo: 2400, maxElo: Infinity, color: '#9333EA', description: 'The pinnacle of achievement' },
  ];

  /**
   * Get league by trophy score
   */
  public static getLeagueByTrophy(trophyScore: number): League {
    // Find the appropriate league
    const league = this.LEAGUES.find(l => trophyScore >= l.minElo && trophyScore < l.maxElo);
    
    // Default to lowest league if somehow no match
    return league || this.LEAGUES[0];
  }

  /**
   * @deprecated Use getLeagueByTrophy instead
   * Get league by elo rating (kept for backward compatibility)
   */
  public static getLeagueByElo(elo: number): League {
    return this.getLeagueByTrophy(elo);
  }

  /**
   * Get all leagues in order
   */
  public static getAllLeagues(): League[] {
    return [...this.LEAGUES];
  }

  /**
   * Get league progression information for a given trophy score
   */
  public static getLeagueProgression(trophyScore: number): LeagueProgression {
    const currentLeague = this.getLeagueByTrophy(trophyScore);
    const allLeagues = this.getAllLeagues();
    const currentIndex = allLeagues.findIndex(l => l.id === currentLeague.id);
    
    const nextLeague = currentIndex < allLeagues.length - 1 ? allLeagues[currentIndex + 1] : undefined;
    const previousLeague = currentIndex > 0 ? allLeagues[currentIndex - 1] : undefined;

    // Calculate progress within current league
    let progressToNext = 0;
    let eloToNextLeague: number | undefined;
    
    if (currentLeague.id === 'ultimate-champion') {
      // Ultimate Champion has no next league
      progressToNext = 100;
    } else {
      // Normal progression using trophy ranges
      const trophyInCurrentLeague = trophyScore - currentLeague.minElo;
      const totalTrophyRange = currentLeague.maxElo - currentLeague.minElo;
      progressToNext = Math.min((trophyInCurrentLeague / totalTrophyRange) * 100, 100);
      eloToNextLeague = Math.max(0, currentLeague.maxElo - trophyScore);
    }

    const eloFromPreviousLeague = previousLeague ? trophyScore - previousLeague.maxElo : trophyScore;

    return {
      currentLeague,
      nextLeague,
      previousLeague,
      progressToNext: Math.round(progressToNext * 10) / 10,
      eloToNextLeague: eloToNextLeague ? Math.round(eloToNextLeague * 10) / 10 : undefined,
      eloFromPreviousLeague: Math.round(eloFromPreviousLeague * 10) / 10,
    };
  }

  /**
   * Get league by ID
   */
  public static getLeagueById(id: string): League | undefined {
    return this.LEAGUES.find(l => l.id === id);
  }

  /**
   * Get leagues by category
   */
  public static getLeaguesByCategory(category: League['category']): League[] {
    return this.LEAGUES.filter(l => l.category === category);
  }

  /**
   * Calculate league statistics based on trophy scores
   */
  public static async calculateLeagueStats(league: League, prisma: any): Promise<LeagueStats> {
    // Count players in this trophy range
    const playerCount = await prisma.photoRanking.count({
      where: {
        trophyScore: {
          gte: league.minElo,
          lt: league.maxElo === Infinity ? undefined : league.maxElo,
        },
        totalComparisons: { gt: 0 }, // Only count players with comparisons
      },
    });

    // Get average trophy score in this league
    const avgResult = await prisma.photoRanking.aggregate({
      where: {
        trophyScore: {
          gte: league.minElo,
          lt: league.maxElo === Infinity ? undefined : league.maxElo,
        },
        totalComparisons: { gt: 0 },
      },
      _avg: {
        trophyScore: true,
      },
    });

    // Get top player in league (highest trophy score)
    const topPlayer = await prisma.photoRanking.findFirst({
      where: {
        trophyScore: {
          gte: league.minElo,
          lt: league.maxElo === Infinity ? undefined : league.maxElo,
        },
        totalComparisons: { gt: 0 },
      },
      orderBy: {
        trophyScore: 'desc',
      },
      include: {
        photo: {
          include: {
            user: true,
          },
        },
      },
    });

    return {
      league,
      playerCount,
      averageElo: Math.round((avgResult._avg.trophyScore || league.minElo) * 10) / 10,
      topPlayer: topPlayer ? {
        userId: topPlayer.photo.userId,
        elo: Math.round(topPlayer.trophyScore * 10) / 10,
        rank: 1, // Would need to calculate actual rank within league
      } : undefined,
    };
  }

  /**
   * Get all league statistics
   */
  public static async getAllLeagueStats(prisma: any): Promise<LeagueStats[]> {
    const allStats = await Promise.all(
      this.LEAGUES.map(league => this.calculateLeagueStats(league, prisma))
    );
    return allStats;
  }
}

// Export singleton instance
export const leagueService = LeagueService;