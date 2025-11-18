import { Match, LiveScoreData, ScrapingSource } from '@/types';

/**
 * In-memory storage for live scores
 * For production, consider using Redis or a database
 */
class LiveScoreStore {
  private matches: Match[] = [];
  private lastUpdated: string = new Date().toISOString();
  private sources: ScrapingSource[] = [];
  private updateHistory: { timestamp: string; matchCount: number }[] = [];

  public setMatches(matches: Match[], sources: ScrapingSource[]) {
    this.matches = matches;
    this.lastUpdated = new Date().toISOString();
    this.sources = sources;

    // Keep history of last 100 updates
    this.updateHistory.push({
      timestamp: this.lastUpdated,
      matchCount: matches.length,
    });

    if (this.updateHistory.length > 100) {
      this.updateHistory.shift();
    }
  }

  public getMatches(): Match[] {
    return this.matches;
  }

  public getMatchById(id: string): Match | undefined {
    return this.matches.find(match => match.id === id);
  }

  public getLiveMatches(): Match[] {
    return this.matches.filter(match => match.status === 'live');
  }

  public getMatchesByLeague(league: string): Match[] {
    return this.matches.filter(match =>
      match.league.toLowerCase().includes(league.toLowerCase())
    );
  }

  public getMatchesByStatus(status: Match['status']): Match[] {
    return this.matches.filter(match => match.status === status);
  }

  public getAllData(): LiveScoreData {
    return {
      matches: this.matches,
      lastUpdated: this.lastUpdated,
      sources: this.sources,
      totalMatches: this.matches.length,
    };
  }

  public getStats() {
    const liveCount = this.matches.filter(m => m.status === 'live').length;
    const finishedCount = this.matches.filter(m => m.status === 'finished').length;
    const scheduledCount = this.matches.filter(m => m.status === 'scheduled').length;

    const leagueCounts = this.matches.reduce((acc, match) => {
      acc[match.league] = (acc[match.league] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      total: this.matches.length,
      live: liveCount,
      finished: finishedCount,
      scheduled: scheduledCount,
      byLeague: leagueCounts,
      lastUpdated: this.lastUpdated,
      updateHistory: this.updateHistory.slice(-10), // Last 10 updates
    };
  }

  public clear() {
    this.matches = [];
    this.lastUpdated = new Date().toISOString();
    this.sources = [];
  }
}

// Singleton instance
let storeInstance: LiveScoreStore | null = null;

export function getLiveScoreStore(): LiveScoreStore {
  if (!storeInstance) {
    storeInstance = new LiveScoreStore();
  }
  return storeInstance;
}
