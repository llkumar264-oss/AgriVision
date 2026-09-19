import { NextRequest, NextResponse } from 'next/server';
import { askAgriAssistant } from '@/lib/services/ai-service';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { query, farmContext } = body;

    if (!query) {
      return NextResponse.json({ error: 'Query prompt is required' }, { status: 400 });
    }

    const defaultContext = farmContext || {
      farmName: 'Rajasthan Green Fields',
      crops: [
        { name: 'Tomato', healthScore: 74, activeCondition: 'Early Blight' },
        { name: 'Potato', healthScore: 92 },
        { name: 'Onion', healthScore: 88 },
      ],
      weather: { temp: 31, humidity: 78, condition: 'Humid & Overcast' },
      activeAdvisories: ['Tomato Early Blight progressing (29% coverage)'],
    };

    const reply = await askAgriAssistant(query, defaultContext);
    return NextResponse.json({ success: true, message: reply });
  } catch (error: any) {
    console.error('API /api/ai/chat error:', error);
    return NextResponse.json({ error: 'Failed to process AI query', details: error.message }, { status: 500 });
  }
}
