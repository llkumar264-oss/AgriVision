import { NextRequest, NextResponse } from 'next/server';
import { analyzeCropImage } from '@/lib/services/ai-service';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { imageBase64, cropName } = body;

    if (!imageBase64) {
      return NextResponse.json({ error: 'Image data is required' }, { status: 400 });
    }

    const result = await analyzeCropImage(imageBase64, cropName || 'Tomato');
    return NextResponse.json({ success: true, data: result });
  } catch (error: any) {
    console.error('API /api/ai/analyze error:', error);
    return NextResponse.json({ error: 'Failed to analyze crop image', details: error.message }, { status: 500 });
  }
}
