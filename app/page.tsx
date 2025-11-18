'use client';

import { useEffect, useState, useCallback } from 'react';
import MatchCard from '@/components/MatchCard';
import ServiceControls from '@/components/ServiceControls';
import StatsPanel from '@/components/StatsPanel';
import { Match } from '@/types';

interface ScoresData {
  matches: Match[];
  lastUpdated: string;
  totalMatches: number;
}

interface Stats {
  total: number;
  live: number;
  finished: number;
  scheduled: number;
  byLeague: Record<string, number>;
  lastUpdated: string;
}

export default function Home() {
  const [scoresData, setScoresData] = useState<ScoresData | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [filter, setFilter] = useState<'all' | 'live' | 'finished' | 'scheduled'>('all');
  const [loading, setLoading] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);

  const fetchScores = useCallback(async () => {
    try {
      const endpoint = filter === 'all' ? '/api/scores' : `/api/scores?status=${filter}`;
      const response = await fetch(endpoint);
      const data = await response.json();

      if (data.success) {
        setScoresData({
          matches: data.matches,
          lastUpdated: data.lastUpdated,
          totalMatches: data.totalMatches,
        });
      }
    } catch (error) {
      console.error('Error fetching scores:', error);
    } finally {
      setLoading(false);
    }
  }, [filter]);

  const fetchStats = useCallback(async () => {
    try {
      const response = await fetch('/api/scores/stats');
      const data = await response.json();

      if (data.success) {
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  }, []);

  const refreshData = useCallback(() => {
    fetchScores();
    fetchStats();
  }, [fetchScores, fetchStats]);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      refreshData();
    }, 30000); // Refresh UI every 30 seconds

    return () => clearInterval(interval);
  }, [autoRefresh, refreshData]);

  const filteredMatches = scoresData?.matches || [];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            ⚽ Live Score Scraper
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Real-time football scores from multiple sources
          </p>
        </div>

        {/* Service Controls */}
        <div className="mb-8">
          <ServiceControls onUpdate={refreshData} />
        </div>

        {/* Stats Panel */}
        <div className="mb-8">
          <StatsPanel stats={stats} />
        </div>

        {/* Filter Tabs */}
        <div className="mb-6 bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
          <div className="flex gap-2 flex-wrap">
            {['all', 'live', 'finished', 'scheduled'].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status as any)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === status
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
                {stats && status !== 'all' && (
                  <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-white/20">
                    {stats[status as keyof Stats] as number}
                  </span>
                )}
              </button>
            ))}

            <button
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={`ml-auto px-4 py-2 rounded-lg font-medium transition-colors ${
                autoRefresh
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              {autoRefresh ? '🔄 Auto-refresh ON' : '⏸️ Auto-refresh OFF'}
            </button>
          </div>
        </div>

        {/* Last Updated */}
        {scoresData && (
          <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
            Last updated: {new Date(scoresData.lastUpdated).toLocaleString()}
          </div>
        )}

        {/* Matches Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading matches...</p>
          </div>
        ) : filteredMatches.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-12 text-center">
            <p className="text-xl text-gray-600 dark:text-gray-400">
              No matches found
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
              Click &quot;Fetch Live Scores Now&quot; to load the latest matches
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMatches.map((match) => (
              <MatchCard key={match.id} match={match} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
