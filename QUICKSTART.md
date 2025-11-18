# 🚀 Quick Start Guide

Get up and running with the Live Score Scraper in 3 simple steps!

## Step 1: Install Dependencies

```bash
npm install
```

## Step 2: Start the Development Server

```bash
npm run dev
```

The application will start at [http://localhost:3000](http://localhost:3000)

## Step 3: Fetch Your First Scores

1. Open your browser to [http://localhost:3000](http://localhost:3000)
2. Click the **"Fetch Live Scores Now"** button
3. Watch live matches appear on the dashboard!

## Optional: Enable Auto-Updates

Click **"Start Auto-Update"** to automatically refresh scores every minute.

## 🎯 Features at a Glance

### Service Controls
- **Start Auto-Update**: Runs every minute automatically
- **Stop Auto-Update**: Pause automatic updates
- **Fetch Live Scores Now**: Manual on-demand update (perfect for testing!)
- **Refresh Status**: Check service health

### View Filters
- **All**: See all matches
- **Live**: Only live matches
- **Finished**: Completed matches
- **Scheduled**: Upcoming matches

### Statistics Dashboard
- Total matches count
- Live matches count
- Finished matches count
- Scheduled matches count
- Breakdown by league

## 🔧 Common Commands

```bash
# Development
npm run dev          # Start dev server with hot reload
npm run build        # Build for production
npm start            # Start production server

# Quality Checks
npm run type-check   # Check TypeScript types
npm run lint         # Run ESLint
```

## 📱 Mobile Friendly

The UI is fully responsive and works great on:
- Desktop browsers
- Tablets
- Mobile phones

## 🎨 Dark Mode

The application automatically adapts to your system's dark/light theme preference.

## 🔌 API Testing

Test the API directly:

```bash
# Get all matches
curl http://localhost:3000/api/scores

# Get live matches only
curl http://localhost:3000/api/scores/live

# Get statistics
curl http://localhost:3000/api/scores/stats

# Trigger manual update
curl -X POST http://localhost:3000/api/scores/update

# Check service status
curl http://localhost:3000/api/service/status

# Start auto-update service
curl -X POST http://localhost:3000/api/service/start

# Stop auto-update service
curl -X POST http://localhost:3000/api/service/stop
```

## 💡 Tips

1. **First Time?** Start by clicking "Fetch Live Scores Now" to see mock data
2. **Testing?** Use the mock scraper for consistent test data
3. **Production?** Enable TheSportsDB scraper for real live scores
4. **Auto-refresh?** The UI auto-refreshes every 30 seconds when enabled

## 🐛 Troubleshooting

### Port already in use?
```bash
# Change port in package.json or use:
PORT=3001 npm run dev
```

### No matches showing?
1. Click "Fetch Live Scores Now"
2. Check browser console for errors
3. Verify service is running

### Want real data?
Edit `lib/scrapers/ScraperManager.ts` and enable more data sources!

## 📚 Learn More

See [README.md](README.md) for complete documentation.

---

Happy score tracking! ⚽🎉
