import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  const userId = request.headers.get('x-user-id');
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { data, error } = await getSupabaseAdmin()
      .from('cart_items')
      .select('*, product:products(*)')
      .eq('user_id', userId);

    if (error) throw error;
    return NextResponse.json(data || []);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const userId = request.headers.get('x-user-id');
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { action, items } = body;

    if (action === 'sync') {
      // Replace all cart items
      await getSupabaseAdmin().from('cart_items').delete().eq('user_id', userId);
      if (items && items.length > 0) {
        const rows = items.map((item: any) => ({
          user_id: userId,
          product_id: item.product.id,
          quantity: item.quantity,
        }));
        const { error } = await getSupabaseAdmin().from('cart_items').insert(rows);
        if (error) throw error;
      }
      return NextResponse.json({ ok: true });
    }

    if (action === 'clear') {
      await getSupabaseAdmin().from('cart_items').delete().eq('user_id', userId);
      return NextResponse.json({ ok: true });
    }

    return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}