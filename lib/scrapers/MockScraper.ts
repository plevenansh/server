import { BaseScraper } from './BaseScraper';
import { Match, ScrapingResult } from '@/types';

/**
 * Mock scraper for testing and demonstration
 * Generates realistic-looking live cricket match data
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
      'India', 'Australia', 'England', 'Pakistan', 'South Africa',
      'New Zealand', 'West Indies', 'Sri Lanka', 'Bangladesh', 'Afghanistan',
      'Mumbai Indians', 'Chennai Super Kings', 'Royal Challengers Bangalore', 'Kolkata Knight Riders', 'Delhi Capitals',
    ];

    const leagues = [
      'ICC World Cup', 'T20 World Cup', 'IPL', 'The Ashes', 'Test Series', 'ODI Series', 'T20I Series', 'Big Bash League'
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
      let minute: number | undefined; // Will represent overs for cricket

      if (status === 'live') {
        minute = 5 + Math.floor(Math.random() * 45); // 5-50 overs
        // Cricket scores: runs between 50-300 for realistic matches
        homeScore = 50 + Math.floor(Math.random() * 250);
        awayScore = 30 + Math.floor(Math.random() * 200);
      } else if (status === 'finished') {
        homeScore = 100 + Math.floor(Math.random() * 300);
        awayScore = 100 + Math.floor(Math.random() * 300);
      }

      const startTime = new Date();
      if (status === 'scheduled') {
        startTime.setHours(startTime.getHours() + 1 + Math.floor(Math.random() * 6));
      } else if (status === 'live') {
        // Cricket matches are longer, set appropriate time
        startTime.setMinutes(startTime.getMinutes() - ((minute || 0) * 6));
      } else {
        startTime.setHours(startTime.getHours() - 4);
      }

      matches.push({
        id: this.generateMatchId(homeTeam, awayTeam, startTime.toISOString()),
        homeTeam: { name: homeTeam, score: homeScore },
        awayTeam: { name: awayTeam, score: awayScore },
        status,
        startTime: startTime.toISOString(),
        league: leagues[Math.floor(Math.random() * leagues.length)],
        minute, // Represents overs for cricket
        lastUpdated: new Date().toISOString(),
      });
    }

    // Sort by start time
    return matches.sort((a, b) =>
      new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
    );
  }
}
