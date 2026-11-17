import { NextRequest, NextResponse } from 'next/server';
import { stkPushQuery } from '@/lib/mpesa';

export async function GET(request: NextRequest) {
  const checkoutRequestId = request.nextUrl.searchParams.get('checkoutRequestId');
  if (!checkoutRequestId) {
    return NextResponse.json({ error: 'Missing checkoutRequestId' }, { status: 400 });
  }

  try {
    const result = await stkPushQuery(checkoutRequestId);
    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Query failed' }, { status: 500 });
  }
}
