export interface Team {
  name: string;
  score: number;
  logo?: string;
}

export interface Match {
  id: string;
  homeTeam: Team;
  awayTeam: Team;
  status: 'live' | 'finished' | 'scheduled' | 'postponed';
  startTime: string;
  league: string;
  minute?: number;
  venue?: string;
  lastUpdated: string;
}

export interface League {
  name: string;
  country: string;
  logo?: string;
}

export interface ScrapingSource {
  name: string;
  url: string;
  active: boolean;
  lastScrapeTime?: string;
  lastError?: string;
}

export interface ScrapingResult {
  success: boolean;
  matches: Match[];
  source: string;
  timestamp: string;
  error?: string;
}

export interface LiveScoreData {
  matches: Match[];
  lastUpdated: string;
  sources: ScrapingSource[];
  totalMatches: number;
}
