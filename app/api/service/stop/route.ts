import { NextResponse } from 'next/server';
import { getScoreUpdateService } from '@/lib/services/ScoreUpdateService';

export const dynamic = 'force-dynamic';

export async function POST() {
  try {
    const service = getScoreUpdateService();
    service.stop();

    return NextResponse.json({
      success: true,
      message: 'Score update service stopped',
      status: service.getStatus(),
    });
  } catch (error) {
    console.error('Error stopping service:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to stop service',
      },
      { status: 500 }
    );
  }
}
