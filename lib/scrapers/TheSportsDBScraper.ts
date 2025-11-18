import { BaseScraper } from './BaseScraper';
import { Match, ScrapingResult } from '@/types';

/**
 * TheSportsDB API Scraper - Uses free API for reliable data
 * API: https://www.thesportsdb.com/
 */
export class TheSportsDBScraper extends BaseScraper {
  private apiKey: string;

  constructor() {
    super('TheSportsDB', 'https://www.thesportsdb.com/api/v1/json');
    // Free API key for testing (limited to 30 requests per minute)
    this.apiKey = '3'; // Public test key
  }

  async scrape(): Promise<ScrapingResult> {
    try {
      const matches: Match[] = [];

      // Get live scores for major soccer leagues
      const leagueIds = [
        '4328', // English Premier League
        '4335', // Spanish La Liga
        '4331', // German Bundesliga
        '4332', // Italian Serie A
        '4334', // French Ligue 1
      ];

      for (const leagueId of leagueIds) {
        try {
          const liveEvents = await this.fetchLiveEvents(leagueId);
          matches.push(...liveEvents);
        } catch (err) {
          console.error(`Error fetching league ${leagueId}:`, err);
        }
      }

      return this.createResult(matches);
    } catch (error) {
      console.error('TheSportsDB scraping error:', error);
      return this.createResult([], (error as Error).message);
    }
  }

  private async fetchLiveEvents(leagueId: string): Promise<Match[]> {
    const url = `${this.baseUrl}/${this.apiKey}/eventsseason.php?id=${leagueId}&s=2024-2025`;
    const matches: Match[] = [];

    try {
      const response = await this.axiosInstance.get(url);
      const events = response.data?.events || [];

      const now = new Date();
      const todayStr = now.toISOString().split('T')[0];

      // Filter for today's matches
      const todayEvents = events.filter((event: any) => {
        return event.dateEvent === todayStr;
      });

      for (const event of todayEvents) {
        const homeTeam = event.strHomeTeam || 'Unknown';
        const awayTeam = event.strAwayTeam || 'Unknown';
        const homeScore = parseInt(event.intHomeScore) || 0;
        const awayScore = parseInt(event.intAwayScore) || 0;

        let status: Match['status'] = 'scheduled';
        if (event.strStatus === 'Match Finished' || event.strStatus === 'FT') {
          status = 'finished';
        } else if (event.strStatus === 'Live' || event.strProgress) {
          status = 'live';
        }

        matches.push({
          id: event.idEvent || this.generateMatchId(homeTeam, awayTeam, event.dateEvent),
          homeTeam: { name: homeTeam, score: homeScore },
          awayTeam: { name: awayTeam, score: awayScore },
          status,
          startTime: `${event.dateEvent}T${event.strTime || '00:00:00'}`,
          league: event.strLeague || 'Soccer',
          venue: event.strVenue,
          lastUpdated: new Date().toISOString(),
        });
      }
    } catch (err) {
      console.error(`Error fetching events for league ${leagueId}:`, err);
    }

    return matches;
  }
}
