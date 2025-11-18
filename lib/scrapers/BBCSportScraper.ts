import { BaseScraper } from './BaseScraper';
import { Match, ScrapingResult } from '@/types';

export class BBCSportScraper extends BaseScraper {
  constructor() {
    super('BBC Sport', 'https://www.bbc.com/sport/cricket/scores-fixtures');
  }

  async scrape(): Promise<ScrapingResult> {
    try {
      const html = await this.fetchHtml(this.baseUrl);
      const $ = this.parseHtml(html);
      const matches: Match[] = [];

      // BBC Sport structure
      $('.sp-c-fixture').each((index, element) => {
        try {
          const $match = $(element);

          const homeTeam = $match.find('.sp-c-fixture__team--home .sp-c-fixture__team-name').text().trim();
          const awayTeam = $match.find('.sp-c-fixture__team--away .sp-c-fixture__team-name').text().trim();

          const homeScore = parseInt($match.find('.sp-c-fixture__team--home .sp-c-fixture__number--home').text().trim()) || 0;
          const awayScore = parseInt($match.find('.sp-c-fixture__team--away .sp-c-fixture__number--away').text().trim()) || 0;

          const statusText = $match.find('.sp-c-fixture__status-wrapper').text().trim();
          let status: Match['status'] = 'scheduled';
          let minute: number | undefined;

          if (statusText.includes('FT') || statusText.includes('Full-time')) {
            status = 'finished';
          } else if (statusText.match(/\d+'/)) {
            status = 'live';
            const minuteMatch = statusText.match(/(\d+)'/);
            minute = minuteMatch ? parseInt(minuteMatch[1]) : undefined;
          } else if (statusText.toLowerCase().includes('live')) {
            status = 'live';
          }

          if (homeTeam && awayTeam) {
            matches.push({
              id: this.generateMatchId(homeTeam, awayTeam, new Date().toISOString()),
              homeTeam: { name: homeTeam, score: homeScore },
              awayTeam: { name: awayTeam, score: awayScore },
              status,
              startTime: new Date().toISOString(),
              league: 'Cricket',
              minute,
              lastUpdated: new Date().toISOString(),
            });
          }
        } catch (err) {
          console.error('Error parsing BBC match:', err);
        }
      });

      return this.createResult(matches);
    } catch (error) {
      console.error('BBC Sport scraping error:', error);
      return this.createResult([], (error as Error).message);
    }
  }
}
