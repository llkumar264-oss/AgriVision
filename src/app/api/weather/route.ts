import { NextRequest, NextResponse } from 'next/server';
import { fetchFarmWeather } from '@/lib/services/weather-service';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const lat = parseFloat(searchParams.get('lat') || '26.8206');
    const lon = parseFloat(searchParams.get('lon') || '75.8055');
    const city = searchParams.get('city') || 'Jaipur';

    const weather = await fetchFarmWeather(lat, lon, city);
    return NextResponse.json({ success: true, data: weather });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to fetch weather data' }, { status: 500 });
  }
}
