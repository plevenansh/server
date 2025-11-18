'use client';

interface Stats {
  total: number;
  live: number;
  finished: number;
  scheduled: number;
  byLeague: Record<string, number>;
  lastUpdated: string;
}

interface StatsPanelProps {
  stats: Stats | null;
}

export default function StatsPanel({ stats }: StatsPanelProps) {
  if (!stats) {
    return null;
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold mb-4">Statistics</h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
            {stats.total}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-300 mt-1">
            Total Matches
          </div>
        </div>

        <div className="text-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
          <div className="text-3xl font-bold text-red-600 dark:text-red-400">
            {stats.live}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-300 mt-1">
            Live Now
          </div>
        </div>

        <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div className="text-3xl font-bold text-gray-600 dark:text-gray-300">
            {stats.finished}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-300 mt-1">
            Finished
          </div>
        </div>

        <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
          <div className="text-3xl font-bold text-green-600 dark:text-green-400">
            {stats.scheduled}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-300 mt-1">
            Upcoming
          </div>
        </div>
      </div>

      {Object.keys(stats.byLeague).length > 0 && (
        <div>
          <h3 className="font-semibold mb-3">By League</h3>
          <div className="space-y-2">
            {Object.entries(stats.byLeague)
              .sort(([, a], [, b]) => b - a)
              .map(([league, count]) => (
                <div
                  key={league}
                  className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-700 rounded"
                >
                  <span className="text-sm">{league}</span>
                  <span className="font-semibold">{count}</span>
                </div>
              ))}
          </div>
        </div>
      )}

      <div className="mt-4 text-xs text-gray-500 dark:text-gray-400">
        Last updated: {new Date(stats.lastUpdated).toLocaleString()}
      </div>
    </div>
  );
}
