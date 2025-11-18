import { BaseScraper } from './BaseScraper';
import { Match, ScrapingResult } from '@/types';

/**
 * Mock scraper for testing and demonstration
 * Generates realistic-looking live match data
 */
export class MockScraper extends BaseScraper {
  private matchCounter = 0;

  constructor() {
    super('Mock Data', 'mock://localhost');
  }

  async scrape(): Promise<ScrapingResult> {
    try {
      const matches: Match[] = this.generateMockMatches();
      return this.createResult(matches);
    } catch (error) {
      return this.createResult([], (error as Error).message);
    }
  }

  private generateMockMatches(): Match[] {
    const teams = [
      'Manchester United', 'Liverpool', 'Chelsea', 'Arsenal', 'Manchester City',
      'Tottenham', 'Real Madrid', 'Barcelona', 'Bayern Munich', 'Juventus',
      'PSG', 'AC Milan', 'Inter Milan', 'Borussia Dortmund', 'Atletico Madrid',
    ];

    const leagues = [
      'Premier League', 'La Liga', 'Bundesliga', 'Serie A', 'Ligue 1', 'Champions League'
    ];

    const statuses: Match['status'][] = ['live', 'live', 'live', 'finished', 'scheduled'];

    const matches: Match[] = [];
    const numMatches = 8 + Math.floor(Math.random() * 5); // 8-12 matches

    for (let i = 0; i < numMatches; i++) {
      const homeTeamIndex = Math.floor(Math.random() * teams.length);
      let awayTeamIndex = Math.floor(Math.random() * teams.length);

      // Ensure home and away teams are different
      while (awayTeamIndex === homeTeamIndex) {
        awayTeamIndex = Math.floor(Math.random() * teams.length);
      }

      const homeTeam = teams[homeTeamIndex];
      const awayTeam = teams[awayTeamIndex];
      const status = statuses[Math.floor(Math.random() * statuses.length)];

      let homeScore = 0;
      let awayScore = 0;
      let minute: number | undefined;

      if (status === 'live') {
        minute = 15 + Math.floor(Math.random() * 75); // 15-90 minutes
        homeScore = Math.floor(Math.random() * 4);
        awayScore = Math.floor(Math.random() * 4);
      } else if (status === 'finished') {
        homeScore = Math.floor(Math.random() * 5);
        awayScore = Math.floor(Math.random() * 5);
      }

      const startTime = new Date();
      if (status === 'scheduled') {
        startTime.setHours(startTime.getHours() + 1 + Math.floor(Math.random() * 6));
      } else if (status === 'live') {
        startTime.setMinutes(startTime.getMinutes() - (minute || 0));
      } else {
        startTime.setHours(startTime.getHours() - 2);
      }

      matches.push({
        id: this.generateMatchId(homeTeam, awayTeam, startTime.toISOString()),
        homeTeam: { name: homeTeam, score: homeScore },
        awayTeam: { name: awayTeam, score: awayScore },
        status,
        startTime: startTime.toISOString(),
        league: leagues[Math.floor(Math.random() * leagues.length)],
        minute,
        lastUpdated: new Date().toISOString(),
      });
    }

    // Sort by start time
    return matches.sort((a, b) =>
      new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
    );
  }
}
