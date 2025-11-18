import { getScraperManager } from '@/lib/scrapers';
import { getLiveScoreStore } from '@/lib/storage/LiveScoreStore';

export class ScoreUpdateService {
  private intervalId: NodeJS.Timeout | null = null;
  private isRunning: boolean = false;
  private updateIntervalMs: number = 60000; // 1 minute
  private lastUpdateTime: Date | null = null;
  private errorCount: number = 0;

  constructor(intervalMinutes: number = 1) {
    this.updateIntervalMs = intervalMinutes * 60 * 1000;
  }

  public start() {
    if (this.isRunning) {
      console.log('Score update service is already running');
      return;
    }

    console.log(`Starting score update service with ${this.updateIntervalMs / 1000}s interval`);
    this.isRunning = true;

    // Run immediately on start
    this.updateScores();

    // Then run at intervals
    this.intervalId = setInterval(() => {
      this.updateScores();
    }, this.updateIntervalMs);
  }

  public stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.isRunning = false;
    console.log('Score update service stopped');
  }

  public async updateScores(): Promise<void> {
    console.log(`[${new Date().toISOString()}] Updating scores...`);

    try {
      const scraperManager = getScraperManager();
      const store = getLiveScoreStore();

      const { matches, results } = await scraperManager.scrapeAll();

      const sources = scraperManager.getAvailableSources().map(source => {
        const result = results.find(r => r.source === source.name);
        return {
          ...source,
          lastScrapeTime: result?.timestamp,
          lastError: result?.error,
        };
      });

      store.setMatches(matches, sources);

      this.lastUpdateTime = new Date();
      this.errorCount = 0;

      console.log(`✓ Updated ${matches.length} matches from ${results.length} sources`);
      console.log(`  Live: ${matches.filter(m => m.status === 'live').length}`);
      console.log(`  Finished: ${matches.filter(m => m.status === 'finished').length}`);
      console.log(`  Scheduled: ${matches.filter(m => m.status === 'scheduled').length}`);

    } catch (error) {
      this.errorCount++;
      console.error('Error updating scores:', error);

      // If too many consecutive errors, stop the service
      if (this.errorCount >= 10) {
        console.error('Too many consecutive errors, stopping service');
        this.stop();
      }
    }
  }

  public getStatus() {
    return {
      isRunning: this.isRunning,
      intervalMs: this.updateIntervalMs,
      lastUpdateTime: this.lastUpdateTime?.toISOString(),
      errorCount: this.errorCount,
    };
  }

  public setInterval(minutes: number) {
    this.updateIntervalMs = minutes * 60 * 1000;
    if (this.isRunning) {
      this.stop();
      this.start();
    }
  }
}

// Singleton instance
let serviceInstance: ScoreUpdateService | null = null;

export function getScoreUpdateService(): ScoreUpdateService {
  if (!serviceInstance) {
    serviceInstance = new ScoreUpdateService(1); // Default 1 minute
  }
  return serviceInstance;
}
