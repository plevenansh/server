import axios, { AxiosInstance } from 'axios';
import * as cheerio from 'cheerio';
import { Match, ScrapingResult } from '@/types';

export abstract class BaseScraper {
  protected name: string;
  protected baseUrl: string;
  protected axiosInstance: AxiosInstance;

  constructor(name: string, baseUrl: string) {
    this.name = name;
    this.baseUrl = baseUrl;
    this.axiosInstance = axios.create({
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
      },
    });
  }

  abstract scrape(): Promise<ScrapingResult>;

  protected async fetchHtml(url: string): Promise<string> {
    try {
      const response = await this.axiosInstance.get(url);
      return response.data;
    } catch (error) {
      console.error(`Error fetching ${url}:`, error);
      throw error;
    }
  }

  protected parseHtml(html: string) {
    return cheerio.load(html);
  }

  protected generateMatchId(homeTeam: string, awayTeam: string, startTime: string): string {
    return `${homeTeam}-${awayTeam}-${startTime}`.replace(/\s+/g, '-').toLowerCase();
  }

  protected createResult(matches: Match[], error?: string): ScrapingResult {
    return {
      success: !error,
      matches,
      source: this.name,
      timestamp: new Date().toISOString(),
      error,
    };
  }
}
