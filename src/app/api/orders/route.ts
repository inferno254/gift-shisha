import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';
import { stkPush } from '@/lib/mpesa';

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  const userId = authHeader?.replace('Bearer ', '');

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { data, error } = await getSupabaseAdmin()
      .from('orders')
      .select(`
        id,
        status,
        total,
        delivery_fee,
        delivery_address,
        delivery_location,
        payment_method,
        mpesa_receipt,
        created_at
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return NextResponse.json(data || []);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  const userId = authHeader?.replace('Bearer ', '');

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { data: existingProfile } = await getSupabaseAdmin()
      .from('profiles')
      .select('id')
      .eq('id', userId)
      .maybeSingle();

    if (!existingProfile) {
      await getSupabaseAdmin().from('profiles').insert({
        id: userId,
        name: 'Customer',
        email: null,
        phone: null,
        location: 'Nairobi CBD',
        location_detail: 'Gift Shisha, Nairobi CBD',
      });
    }

    const body = await request.json();
    const { items, vendorId, deliveryAddress, deliveryLocation, paymentMethod, phone, total } = body;

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'Order must have items' }, { status: 400 });
    }

    const { data: order, error: orderError } = await getSupabaseAdmin()
      .from('orders')
      .insert({
        user_id: userId,
        vendor_id: vendorId || null,
        total,
        delivery_fee: 0,
        delivery_address: deliveryAddress || '',
        delivery_location: deliveryLocation || null,
        payment_method: paymentMethod || 'mpesa',
      })
      .select()
      .single();

    if (orderError) throw orderError;

    const orderItems = items.map((item: any) => ({
      order_id: order.id,
      product_id: item.product?.id || null,
      product_name: item.product?.name || item.name,
      quantity: item.quantity,
      unit_price: item.product?.price || item.unit_price || 0,
      total_price: (item.product?.price || item.unit_price || 0) * item.quantity,
    }));

    const { error: itemsError } = await getSupabaseAdmin().from('order_items').insert(orderItems);
    if (itemsError) {
      await getSupabaseAdmin().from('orders').delete().eq('id', order.id);
      throw itemsError;
    }

    return NextResponse.json({ id: order.id, ...order }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to create order' }, { status: 500 });
  }
}
