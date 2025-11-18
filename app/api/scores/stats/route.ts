import { NextResponse } from 'next/server';
import { getLiveScoreStore } from '@/lib/storage/LiveScoreStore';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const store = getLiveScoreStore();
    const stats = store.getStats();

    return NextResponse.json({
      success: true,
      stats,
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch stats',
      },
      { status: 500 }
    );
  }
}
