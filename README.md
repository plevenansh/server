# ⚽ Live Score Scraper

A comprehensive, real-time live score scraping server built with **Next.js 14**, **TypeScript**, and modern web scraping techniques. This application fetches live football scores from multiple sources and provides a beautiful, responsive UI to display match data.

## 🌟 Features

### Core Functionality
- **Real-time Score Scraping**: Fetches live scores from multiple sources every minute
- **Multiple Data Sources**:
  - Mock data generator (for testing)
  - TheSportsDB API (free tier)
  - ESPN scraper
  - BBC Sport scraper
- **Intelligent Deduplication**: Automatically removes duplicate matches across sources
- **Status Tracking**: Live, Finished, Scheduled, and Postponed match states
- **League Organization**: Automatically categorizes matches by league/competition

### User Interface
- **Modern, Responsive Design**: Built with Tailwind CSS
- **Real-time Updates**: Auto-refresh every 30 seconds
- **Filter System**: View all matches or filter by status (live, finished, scheduled)
- **Statistics Dashboard**: View match counts by status and league
- **Service Controls**: Start/stop auto-updates or trigger manual fetches
- **Dark Mode Support**: Automatic dark/light theme based on system preferences

### Deployment Features
- **Continuous Running Mode**: Perfect for live servers with setInterval-based updates
- **On-Demand Fetching**: Manual "Fetch Live Scores Now" button for serverless deployments
- **No Cron Jobs Required**: Uses native JavaScript intervals for simplicity

## 📁 Project Structure

```
server/
├── app/
│   ├── api/
│   │   ├── scores/
│   │   │   ├── route.ts          # Get all matches
│   │   │   ├── live/route.ts     # Get live matches only
│   │   │   ├── stats/route.ts    # Get statistics
│   │   │   └── update/route.ts   # Manual update trigger
│   │   └── service/
│   │       ├── status/route.ts   # Service status
│   │       ├── start/route.ts    # Start auto-update
│   │       └── stop/route.ts     # Stop auto-update
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx                  # Main dashboard
├── components/
│   ├── MatchCard.tsx             # Individual match display
│   ├── ServiceControls.tsx       # Control panel
│   └── StatsPanel.tsx            # Statistics display
├── lib/
│   ├── scrapers/
│   │   ├── BaseScraper.ts        # Base scraper class
│   │   ├── ESPNScraper.ts        # ESPN implementation
│   │   ├── BBCSportScraper.ts    # BBC Sport implementation
│   │   ├── TheSportsDBScraper.ts # API-based scraper
│   │   ├── MockScraper.ts        # Mock data generator
│   │   ├── ScraperManager.ts     # Coordinates all scrapers
│   │   └── index.ts
│   ├── services/
│   │   └── ScoreUpdateService.ts # Background update service
│   └── storage/
│       └── LiveScoreStore.ts     # In-memory data store
├── types/
│   └── index.ts                  # TypeScript interfaces
├── package.json
├── tsconfig.json
├── next.config.js
├── tailwind.config.ts
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm/yarn
- Git

### Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd server
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Run the development server**:
   ```bash
   npm run dev
   ```

4. **Open your browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

## 💻 Usage

### Starting the Application

1. **Start the dev server**:
   ```bash
   npm run dev
   ```

2. **Click "Fetch Live Scores Now"** to load initial data

3. **Optionally, click "Start Auto-Update"** to enable automatic updates every minute

### API Endpoints

#### Get All Matches
```bash
GET /api/scores
GET /api/scores?status=live
GET /api/scores?league=Premier%20League
```

#### Get Live Matches Only
```bash
GET /api/scores/live
```

#### Get Statistics
```bash
GET /api/scores/stats
```

#### Manual Update
```bash
POST /api/scores/update
```

#### Service Control
```bash
GET  /api/service/status
POST /api/service/start
POST /api/service/stop
```

### Response Examples

**GET /api/scores**:
```json
{
  "success": true,
  "matches": [
    {
      "id": "manchester-united-liverpool-2024-01-20",
      "homeTeam": {
        "name": "Manchester United",
        "score": 2
      },
      "awayTeam": {
        "name": "Liverpool",
        "score": 1
      },
      "status": "live",
      "startTime": "2024-01-20T15:00:00.000Z",
      "league": "Premier League",
      "minute": 67,
      "lastUpdated": "2024-01-20T16:07:00.000Z"
    }
  ],
  "lastUpdated": "2024-01-20T16:07:00.000Z",
  "totalMatches": 12
}
```

## 🔧 Configuration

### Update Interval

To change the update interval, modify the `ScoreUpdateService` constructor in `/lib/services/ScoreUpdateService.ts`:

```typescript
// Default: 1 minute
new ScoreUpdateService(1);

// Change to 2 minutes
new ScoreUpdateService(2);
```

### Active Data Sources

By default, the system uses Mock and TheSportsDB scrapers. To change sources, modify `ScraperManager.ts`:

```typescript
// In initializeScrapers()
this.activeSources.add('mock');
this.activeSources.add('thesportsdb');
// this.activeSources.add('espn');      // Uncomment to enable
// this.activeSources.add('bbcsport');  // Uncomment to enable
```

### Add New Scrapers

1. Create a new scraper class extending `BaseScraper`
2. Implement the `scrape()` method
3. Register it in `ScraperManager.ts`

```typescript
// lib/scrapers/MyCustomScraper.ts
import { BaseScraper } from './BaseScraper';
import { Match, ScrapingResult } from '@/types';

export class MyCustomScraper extends BaseScraper {
  constructor() {
    super('My Custom Source', 'https://example.com/scores');
  }

  async scrape(): Promise<ScrapingResult> {
    // Implement scraping logic
    const matches: Match[] = [];
    // ... scraping code ...
    return this.createResult(matches);
  }
}
```

## 📦 Deployment

### Production Build
```bash
npm run build
npm start
```

### Environment Variables
Create a `.env.local` file for production:
```env
NODE_ENV=production
PORT=3000
```

### Deployment Platforms

#### Vercel (Recommended for Next.js)
```bash
npm install -g vercel
vercel
```

#### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

#### Traditional Server
For a traditional server that keeps running:
1. The auto-update service will run continuously
2. Updates happen every minute automatically
3. Perfect for VPS, dedicated servers, or always-on instances

#### Serverless Deployment
For serverless platforms (Vercel, Netlify, etc.):
1. Use the "Fetch Live Scores Now" button for on-demand updates
2. API routes work perfectly with serverless functions
3. Consider using a separate cron service to trigger `/api/scores/update`

## 🛡️ Important Notes

### Web Scraping Considerations
- **Respect Terms of Service**: Web scraping may violate some websites' ToS
- **Rate Limiting**: Implement delays between requests to avoid being blocked
- **Use Official APIs**: When available, prefer official APIs over scraping
- **User Agent**: The scrapers use a standard browser user agent
- **Legal Compliance**: Ensure your use case complies with local laws

### Recommended Approach
1. **Start with Mock Data**: Test your application with the MockScraper
2. **Use Free APIs**: TheSportsDB provides reliable data with a free tier
3. **Add Web Scrapers**: Only if necessary and after reviewing ToS
4. **Implement Fallbacks**: The system already handles failed scrapers gracefully

## 🔍 Monitoring

The application includes built-in monitoring:
- Service status display
- Error counting with automatic shutdown after 10 consecutive errors
- Update history tracking
- Source-specific error reporting

## 🤝 Contributing

Contributions are welcome! To add new data sources:
1. Create a new scraper extending `BaseScraper`
2. Add proper error handling
3. Test thoroughly
4. Submit a pull request

## 📝 License

MIT License - feel free to use this project for personal or commercial purposes.

## 🐛 Troubleshooting

### No matches showing?
1. Click "Fetch Live Scores Now" to trigger an update
2. Check the browser console for errors
3. Verify the service status in the control panel

### Scrapers failing?
1. Some websites may block automated requests
2. Use the Mock or TheSportsDB scrapers for reliable data
3. Check network connectivity

### Auto-update not working?
1. Click "Start Auto-Update" in the service controls
2. Verify the service is running in the status panel
3. Check browser console for errors

## 📞 Support

For issues, questions, or contributions, please open an issue on the GitHub repository.

---

Built with ❤️ using Next.js, TypeScript, and modern web technologies.
