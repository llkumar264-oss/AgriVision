import { NextRequest, NextResponse } from 'next/server';
import { askAgriAssistant } from '@/lib/services/ai-service';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { query, farmContext, conversationHistory } = body;

    if (!query) {
      return NextResponse.json({ error: 'Query prompt is required' }, { status: 400 });
    }

    const defaultContext = farmContext || {
      farmName: 'Rajasthan Green Fields',
      farmerName: 'Rajesh Kumar',
      crops: [
        { name: 'Wheat', healthScore: 94, growthStage: 'Harvesting' },
        { name: 'Basmati Rice', healthScore: 91, growthStage: 'Fruiting' },
        { name: 'Mustard', healthScore: 89, growthStage: 'Harvesting' },
        { name: 'Tomato', healthScore: 74, activeCondition: 'Early Blight', growthStage: 'Fruiting' },
        { name: 'Potato', healthScore: 92, growthStage: 'Vegetative' },
        { name: 'Onion', healthScore: 88, growthStage: 'Flowering' },
      ],
      weather: { temp: 31, humidity: 78, condition: 'Humid & Overcast' },
      activeAdvisories: ['Tomato Early Blight progression (22% coverage)'],
    };

    const reply = await askAgriAssistant(query, defaultContext, conversationHistory || []);
    return NextResponse.json({ success: true, message: reply });
  } catch (error: any) {
    console.error('API /api/ai/chat error:', error);
    return NextResponse.json({ error: 'Failed to process AI query', details: error.message }, { status: 500 });
  }
}

