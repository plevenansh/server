import { BaseScraper } from './BaseScraper';
import { Match, ScrapingResult } from '@/types';

export class ESPNScraper extends BaseScraper {
  constructor() {
    super('ESPN', 'https://www.espn.com/soccer/scoreboard');
  }

  async scrape(): Promise<ScrapingResult> {
    try {
      const html = await this.fetchHtml(this.baseUrl);
      const $ = this.parseHtml(html);
      const matches: Match[] = [];

      // ESPN structure - parse match containers
      $('.ScoreCell').each((index, element) => {
        try {
          const $match = $(element);

          // Extract team names
          const teams = $match.find('.ScoreCell__TeamName').map((i, el) => $(el).text().trim()).get();
          const scores = $match.find('.ScoreCell__Score').map((i, el) => $(el).text().trim()).get();

          if (teams.length >= 2) {
            const homeTeam = teams[0] || 'Unknown';
            const awayTeam = teams[1] || 'Unknown';
            const homeScore = parseInt(scores[0]) || 0;
            const awayScore = parseInt(scores[1]) || 0;

            // Extract match status
            const statusText = $match.find('.ScoreCell__NetworkItem').text().trim();
            let status: Match['status'] = 'scheduled';
            let minute: number | undefined;

            if (statusText.includes('FT') || statusText.includes('Final')) {
              status = 'finished';
            } else if (statusText.match(/\d+'/)) {
              status = 'live';
              const minuteMatch = statusText.match(/(\d+)'/);
              minute = minuteMatch ? parseInt(minuteMatch[1]) : undefined;
            } else if (statusText.match(/\d+:\d+/)) {
              status = 'scheduled';
            }

            const league = $match.closest('.Scoreboard').find('.ScoreboardScoreCell__League').text().trim() || 'Soccer';

            matches.push({
              id: this.generateMatchId(homeTeam, awayTeam, new Date().toISOString()),
              homeTeam: { name: homeTeam, score: homeScore },
              awayTeam: { name: awayTeam, score: awayScore },
              status,
              startTime: new Date().toISOString(),
              league,
              minute,
              lastUpdated: new Date().toISOString(),
            });
          }
        } catch (err) {
          console.error('Error parsing individual match:', err);
        }
      });

      return this.createResult(matches);
    } catch (error) {
      console.error('ESPN scraping error:', error);
      return this.createResult([], (error as Error).message);
    }
  }
}
