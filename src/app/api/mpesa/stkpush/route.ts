import { NextRequest, NextResponse } from 'next/server';
import { stkPush } from '@/lib/mpesa';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { phone, amount, orderId } = body;

    if (!phone || !amount || !orderId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const result = await stkPush({ phone, amount, orderId });
    return NextResponse.json(result, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'STK push failed' }, { status: 500 });
  }
}
