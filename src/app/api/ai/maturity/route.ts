import { NextRequest, NextResponse } from 'next/server';
import { analyzeCropMaturity } from '@/lib/services/ai-service';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { imageBase64, cropName } = body;

    if (!imageBase64) {
      return NextResponse.json({ error: 'Image data is required' }, { status: 400 });
    }

    const result = await analyzeCropMaturity(imageBase64, cropName || 'Tomato');
    return NextResponse.json({ success: true, data: result });
  } catch (error: any) {
    console.error('API /api/ai/maturity error:', error);
    return NextResponse.json({ error: 'Failed to analyze crop maturity', details: error.message }, { status: 500 });
  }
}
