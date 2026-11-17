import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const stkCallback = body.Body?.stkCallback || body;
    const checkoutRequestId = stkCallback.CheckoutRequestID;
    const resultCode = stkCallback.ResultCode;
    const resultDesc = stkCallback.ResultDesc;
    const metadata = stkCallback.CallbackMetadata?.Item || [];

    const find = (name: string) => metadata.find((m: any) => m.Name === name)?.Value;

    const mpesaReceipt = find('MpesaReceiptNumber');
    const amount = find('Amount');
    const phoneNumber = find('PhoneNumber');

    if (checkoutRequestId) {
      await getSupabaseAdmin()
        .from('payment_transactions')
        .upsert({
          checkout_request_id: checkoutRequestId,
          mpesa_receipt_number: mpesaReceipt || null,
          amount: amount ?? null,
          phone_number: phoneNumber || null,
          status: resultCode === 0 ? 'success' : 'failed',
          result_code: String(resultCode ?? null),
          result_desc: resultDesc || null,
          updated_at: new Date().toISOString(),
        }, { onConflict: 'checkout_request_id' });

      // Link receipt to order if we can match it via a pending order; keep simple.
    }

    return NextResponse.json({ ResultCode: 0, ResultDesc: 'Accepted' });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
