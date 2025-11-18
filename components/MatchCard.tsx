'use client';

import { Match } from '@/types';
import { formatDistanceToNow } from 'date-fns';

interface MatchCardProps {
  match: Match;
}

export default function MatchCard({ match }: MatchCardProps) {
  const getStatusBadge = () => {
    switch (match.status) {
      case 'live':
        return (
          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-500 text-white animate-pulse">
            LIVE {match.minute ? `${match.minute}'` : ''}
          </span>
        );
      case 'finished':
        return (
          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-gray-500 text-white">
            FT
          </span>
        );
      case 'scheduled':
        return (
          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-500 text-white">
            Scheduled
          </span>
        );
      case 'postponed':
        return (
          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-500 text-white">
            Postponed
          </span>
        );
    }
  };

  const formatTime = () => {
    try {
      const matchDate = new Date(match.startTime);
      if (match.status === 'scheduled') {
        return formatDistanceToNow(matchDate, { addSuffix: true });
      }
      return matchDate.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return '';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-center mb-3">
        <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
          {match.league}
        </span>
        {getStatusBadge()}
      </div>

      <div className="space-y-2">
        {/* Home Team */}
        <div className="flex justify-between items-center">
          <span className="font-semibold text-lg">{match.homeTeam.name}</span>
          <span className="text-2xl font-bold text-gray-900 dark:text-white">
            {match.status !== 'scheduled' ? match.homeTeam.score : '-'}
          </span>
        </div>

        {/* Away Team */}
        <div className="flex justify-between items-center">
          <span className="font-semibold text-lg">{match.awayTeam.name}</span>
          <span className="text-2xl font-bold text-gray-900 dark:text-white">
            {match.status !== 'scheduled' ? match.awayTeam.score : '-'}
          </span>
        </div>
      </div>

      {match.venue && (
        <div className="mt-3 text-xs text-gray-500 dark:text-gray-400">
          📍 {match.venue}
        </div>
      )}

      <div className="mt-3 text-xs text-gray-500 dark:text-gray-400">
        ⏰ {formatTime()}
      </div>
    </div>
  );
}
