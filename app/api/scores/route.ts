import { NextRequest, NextResponse } from 'next/server';
import { getLiveScoreStore } from '@/lib/storage/LiveScoreStore';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const store = getLiveScoreStore();
    const { searchParams } = new URL(request.url);

    const status = searchParams.get('status');
    const league = searchParams.get('league');

    let matches;

    if (status) {
      matches = store.getMatchesByStatus(status as any);
    } else if (league) {
      matches = store.getMatchesByLeague(league);
    } else {
      matches = store.getMatches();
    }

    const data = store.getAllData();

    return NextResponse.json({
      success: true,
      matches,
      lastUpdated: data.lastUpdated,
      sources: data.sources,
      totalMatches: matches.length,
    });
  } catch (error) {
    console.error('Error fetching scores:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch scores',
      },
      { status: 500 }
    );
  }
}
