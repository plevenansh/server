import { NextResponse } from 'next/server';
import { getScoreUpdateService } from '@/lib/services/ScoreUpdateService';

export const dynamic = 'force-dynamic';

export async function POST() {
  try {
    const service = getScoreUpdateService();

    console.log('Manual score update triggered');
    await service.updateScores();

    return NextResponse.json({
      success: true,
      message: 'Scores updated successfully',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error updating scores:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update scores',
      },
      { status: 500 }
    );
  }
}
