import { NextResponse } from 'next/server';
import { getScoreUpdateService } from '@/lib/services/ScoreUpdateService';
import { getLiveScoreStore } from '@/lib/storage/LiveScoreStore';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const service = getScoreUpdateService();
    const store = getLiveScoreStore();

    const serviceStatus = service.getStatus();
    const stats = store.getStats();

    return NextResponse.json({
      success: true,
      service: serviceStatus,
      stats,
    });
  } catch (error) {
    console.error('Error fetching service status:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch service status',
      },
      { status: 500 }
    );
  }
}
