import { BaseScraper } from './BaseScraper';
import { ESPNScraper } from './ESPNScraper';
import { BBCSportScraper } from './BBCSportScraper';
import { TheSportsDBScraper } from './TheSportsDBScraper';
import { MockScraper } from './MockScraper';
import { Match, ScrapingSource, ScrapingResult } from '@/types';

export class ScraperManager {
  private scrapers: Map<string, BaseScraper>;
  private activeSources: Set<string>;

  constructor() {
    this.scrapers = new Map();
    this.activeSources = new Set();
    this.initializeScrapers();
  }

  private initializeScrapers() {
    // Initialize all available scrapers
    this.scrapers.set('mock', new MockScraper());
    this.scrapers.set('thesportsdb', new TheSportsDBScraper());
    this.scrapers.set('espn', new ESPNScraper());
    this.scrapers.set('bbcsport', new BBCSportScraper());

    // Use only real data sources (no mock data)
    this.activeSources.add('thesportsdb');
    this.activeSources.add('espn');
    this.activeSources.add('bbcsport');
  }

  public setActiveSources(sources: string[]) {
    this.activeSources.clear();
    sources.forEach(source => {
      if (this.scrapers.has(source)) {
        this.activeSources.add(source);
      }
    });
  }

  public getAvailableSources(): ScrapingSource[] {
    const sources: ScrapingSource[] = [];
    this.scrapers.forEach((scraper, key) => {
      sources.push({
        name: key,
        url: (scraper as any).baseUrl || '',
        active: this.activeSources.has(key),
      });
    });
    return sources;
  }

  public async scrapeAll(): Promise<{
    matches: Match[];
    results: ScrapingResult[];
  }> {
    const promises: Promise<ScrapingResult>[] = [];

    // Run all active scrapers in parallel
    this.activeSources.forEach(sourceName => {
      const scraper = this.scrapers.get(sourceName);
      if (scraper) {
        promises.push(scraper.scrape());
      }
    });

    const results = await Promise.allSettled(promises);

    const scrapingResults: ScrapingResult[] = [];
    const allMatches: Match[] = [];
    const matchMap = new Map<string, Match>();

    results.forEach((result) => {
      if (result.status === 'fulfilled') {
        scrapingResults.push(result.value);

        // Deduplicate matches by ID, keeping the most recent data
        result.value.matches.forEach((match) => {
          const existing = matchMap.get(match.id);
          if (!existing || new Date(match.lastUpdated) > new Date(existing.lastUpdated)) {
            matchMap.set(match.id, match);
          }
        });
      } else {
        console.error('Scraping failed:', result.reason);
      }
    });

    // Convert map to array
    matchMap.forEach(match => allMatches.push(match));

    // Sort matches: live first, then by start time
    allMatches.sort((a, b) => {
      if (a.status === 'live' && b.status !== 'live') return -1;
      if (a.status !== 'live' && b.status === 'live') return 1;
      return new Date(a.startTime).getTime() - new Date(b.startTime).getTime();
    });

    return {
      matches: allMatches,
      results: scrapingResults,
    };
  }

  public async scrapeSource(sourceName: string): Promise<ScrapingResult> {
    const scraper = this.scrapers.get(sourceName);
    if (!scraper) {
      return {
        success: false,
        matches: [],
        source: sourceName,
        timestamp: new Date().toISOString(),
        error: 'Source not found',
      };
    }

    return scraper.scrape();
  }
}

// Singleton instance
let scraperManagerInstance: ScraperManager | null = null;

export function getScraperManager(): ScraperManager {
  if (!scraperManagerInstance) {
    scraperManagerInstance = new ScraperManager();
  }
  return scraperManagerInstance;
}
