import { NextResponse } from 'next/server';
import { getScoreUpdateService } from '@/lib/services/ScoreUpdateService';

export const dynamic = 'force-dynamic';

export async function POST() {
  try {
    const service = getScoreUpdateService();
    service.start();

    return NextResponse.json({
      success: true,
      message: 'Score update service started',
      status: service.getStatus(),
    });
  } catch (error) {
    console.error('Error starting service:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to start service',
      },
      { status: 500 }
    );
  }
}
