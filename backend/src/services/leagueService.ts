import { League, LeagueProgression, LeagueStats } from '../../../shared/types/ranking';

export class LeagueService {
  private static readonly LEAGUES: League[] = [
    // Cooked tier (0-468.75)
    { id: 'cooked-1', name: 'Cooked 1', tier: 1, category: 'cooked', minElo: 0, maxElo: 156.25, color: '#7F1D1D', description: 'Starting your journey' },
    { id: 'cooked-2', name: 'Cooked 2', tier: 2, category: 'cooked', minElo: 156.25, maxElo: 312.5, color: '#991B1B', description: 'Building fundamentals' },
    { id: 'cooked-3', name: 'Cooked 3', tier: 3, category: 'cooked', minElo: 312.5, maxElo: 468.75, color: '#B91C1C', description: 'Finding your style' },
    
    // Chopped tier (468.75-937.5)
    { id: 'chopped-1', name: 'Chopped 1', tier: 1, category: 'chopped', minElo: 468.75, maxElo: 625, color: '#C2410C', description: 'Getting competitive' },
    { id: 'chopped-2', name: 'Chopped 2', tier: 2, category: 'chopped', minElo: 625, maxElo: 781.25, color: '#EA580C', description: 'Rising through ranks' },
    { id: 'chopped-3', name: 'Chopped 3', tier: 3, category: 'chopped', minElo: 781.25, maxElo: 937.5, color: '#F97316', description: 'Proving your worth' },
    
    // Chuzz tier (937.5-1406.25)
    { id: 'chuzz-1', name: 'Chuzz 1', tier: 1, category: 'chuzz', minElo: 937.5, maxElo: 1093.75, color: '#A16207', description: 'Above average' },
    { id: 'chuzz-2', name: 'Chuzz 2', tier: 2, category: 'chuzz', minElo: 1093.75, maxElo: 1250, color: '#CA8A04', description: 'Standing out' },
    { id: 'chuzz-3', name: 'Chuzz 3', tier: 3, category: 'chuzz', minElo: 1250, maxElo: 1406.25, color: '#EAB308', description: 'Making waves' },
    
    // Mid tier (1406.25-1875)
    { id: 'mid-1', name: 'Mid 1', tier: 1, category: 'mid', minElo: 1406.25, maxElo: 1562.5, color: '#16A34A', description: 'Solid performance' },
    { id: 'mid-2', name: 'Mid 2', tier: 2, category: 'mid', minElo: 1562.5, maxElo: 1718.75, color: '#22C55E', description: 'Consistently strong' },
    { id: 'mid-3', name: 'Mid 3', tier: 3, category: 'mid', minElo: 1718.75, maxElo: 1875, color: '#4ADE80', description: 'Approaching excellence' },
    
    // Huzz tier (1875-2343.75)
    { id: 'huzz-1', name: 'Huzz 1', tier: 1, category: 'huzz', minElo: 1875, maxElo: 2031.25, color: '#0EA5E9', description: 'Elite territory' },
    { id: 'huzz-2', name: 'Huzz 2', tier: 2, category: 'huzz', minElo: 2031.25, maxElo: 2187.5, color: '#3B82F6', description: 'Top tier competitor' },
    { id: 'huzz-3', name: 'Huzz 3', tier: 3, category: 'huzz', minElo: 2187.5, maxElo: 2343.75, color: '#6366F1', description: 'Nearing legendary status' },
    
    // Ultimate tier (2500+)
    { id: 'ultimate-champion', name: 'Ultimate Champion', tier: 1, category: 'ultimate', minElo: 2500, maxElo: Infinity, color: '#9333EA', description: 'The pinnacle of achievement' },
  ];

  /**
   * Get league by elo rating
   */
  public static getLeagueByElo(elo: number): League {
    // Handle edge case: if elo is between 2343.75 and 2500, put them in Huzz 3
    if (elo >= 2343.75 && elo < 2500) {
      return this.LEAGUES.find(l => l.id === 'huzz-3')!;
    }

    // Find the appropriate league
    const league = this.LEAGUES.find(l => elo >= l.minElo && elo < l.maxElo);
    
    // Default to lowest league if somehow no match
    return league || this.LEAGUES[0];
  }

  /**
   * Get all leagues in order
   */
  public static getAllLeagues(): League[] {
    return [...this.LEAGUES];
  }

  /**
   * Get league progression information for a given elo
   */
  public static getLeagueProgression(elo: number): LeagueProgression {
    const currentLeague = this.getLeagueByElo(elo);
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
    } else if (currentLeague.id === 'huzz-3') {
      // Special case: Huzz 3 to Ultimate Champion requires 2500 elo
      const eloInCurrentLeague = elo - currentLeague.minElo;
      const totalEloRange = 2500 - currentLeague.minElo;
      progressToNext = Math.min((eloInCurrentLeague / totalEloRange) * 100, 100);
      eloToNextLeague = Math.max(0, 2500 - elo);
    } else {
      // Normal progression
      const eloInCurrentLeague = elo - currentLeague.minElo;
      const totalEloRange = currentLeague.maxElo - currentLeague.minElo;
      progressToNext = Math.min((eloInCurrentLeague / totalEloRange) * 100, 100);
      eloToNextLeague = Math.max(0, currentLeague.maxElo - elo);
    }

    const eloFromPreviousLeague = previousLeague ? elo - previousLeague.maxElo : elo;

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
   * Calculate league statistics (this would typically query the database)
   * For now, returns a placeholder implementation
   */
  public static async calculateLeagueStats(league: League, prisma: any): Promise<LeagueStats> {
    // This would query the database for actual statistics
    // For now, returning a basic structure
    const playerCount = await prisma.photoRanking.count({
      where: {
        bradleyTerryScore: {
          gte: league.minElo,
          lt: league.maxElo === Infinity ? undefined : league.maxElo,
        },
        totalComparisons: { gt: 0 }, // Only count players with comparisons
      },
    });

    // Get average elo in this league
    const avgResult = await prisma.photoRanking.aggregate({
      where: {
        bradleyTerryScore: {
          gte: league.minElo,
          lt: league.maxElo === Infinity ? undefined : league.maxElo,
        },
        totalComparisons: { gt: 0 },
      },
      _avg: {
        bradleyTerryScore: true,
      },
    });

    // Get top player in league
    const topPlayer = await prisma.photoRanking.findFirst({
      where: {
        bradleyTerryScore: {
          gte: league.minElo,
          lt: league.maxElo === Infinity ? undefined : league.maxElo,
        },
        totalComparisons: { gt: 0 },
      },
      orderBy: {
        bradleyTerryScore: 'desc',
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
      averageElo: Math.round((avgResult._avg.bradleyTerryScore || league.minElo) * 10) / 10,
      topPlayer: topPlayer ? {
        userId: topPlayer.photo.userId,
        elo: Math.round(topPlayer.bradleyTerryScore * 10) / 10,
        rank: 1, // Would need to calculate actual rank
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