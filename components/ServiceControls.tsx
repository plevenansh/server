'use client';

import { useState } from 'react';

interface ServiceStatus {
  isRunning: boolean;
  intervalMs: number;
  lastUpdateTime?: string;
  errorCount: number;
}

interface ServiceControlsProps {
  onUpdate: () => void;
}

export default function ServiceControls({ onUpdate }: ServiceControlsProps) {
  const [status, setStatus] = useState<ServiceStatus | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchStatus = async () => {
    try {
      const response = await fetch('/api/service/status');
      const data = await response.json();
      if (data.success) {
        setStatus(data.service);
      }
    } catch (error) {
      console.error('Error fetching status:', error);
    }
  };

  const startService = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/service/start', { method: 'POST' });
      const data = await response.json();
      if (data.success) {
        await fetchStatus();
        onUpdate();
      }
    } catch (error) {
      console.error('Error starting service:', error);
    } finally {
      setLoading(false);
    }
  };

  const stopService = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/service/stop', { method: 'POST' });
      const data = await response.json();
      if (data.success) {
        await fetchStatus();
      }
    } catch (error) {
      console.error('Error stopping service:', error);
    } finally {
      setLoading(false);
    }
  };

  const manualUpdate = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/scores/update', { method: 'POST' });
      const data = await response.json();
      if (data.success) {
        onUpdate();
      }
    } catch (error) {
      console.error('Error updating scores:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold mb-4">Service Controls</h2>

      <div className="space-y-4">
        {status && (
          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <span
                className={`w-3 h-3 rounded-full ${
                  status.isRunning ? 'bg-green-500 animate-pulse' : 'bg-red-500'
                }`}
              />
              <span className="font-semibold">
                Status: {status.isRunning ? 'Running' : 'Stopped'}
              </span>
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
              <p>Update Interval: {status.intervalMs / 1000}s</p>
              {status.lastUpdateTime && (
                <p>Last Update: {new Date(status.lastUpdateTime).toLocaleString()}</p>
              )}
              {status.errorCount > 0 && (
                <p className="text-red-500">Errors: {status.errorCount}</p>
              )}
            </div>
          </div>
        )}

        <div className="flex gap-2 flex-wrap">
          <button
            onClick={startService}
            disabled={loading || status?.isRunning}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Start Auto-Update
          </button>

          <button
            onClick={stopService}
            disabled={loading || !status?.isRunning}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Stop Auto-Update
          </button>

          <button
            onClick={manualUpdate}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Fetching...' : 'Fetch Live Scores Now'}
          </button>

          <button
            onClick={fetchStatus}
            disabled={loading}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Refresh Status
          </button>
        </div>

        <div className="text-xs text-gray-500 dark:text-gray-400 mt-4">
          <p>💡 Use &quot;Fetch Live Scores Now&quot; for on-demand updates</p>
          <p>💡 Auto-update runs every minute when enabled</p>
        </div>
      </div>
    </div>
  );
}
