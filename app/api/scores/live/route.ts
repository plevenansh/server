import { NextResponse } from 'next/server';
import { getLiveScoreStore } from '@/lib/storage/LiveScoreStore';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const store = getLiveScoreStore();
    const liveMatches = store.getLiveMatches();
    const data = store.getAllData();

    return NextResponse.json({
      success: true,
      matches: liveMatches,
      lastUpdated: data.lastUpdated,
      totalLiveMatches: liveMatches.length,
    });
  } catch (error) {
    console.error('Error fetching live scores:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch live scores',
      },
      { status: 500 }
    );
  }
}
