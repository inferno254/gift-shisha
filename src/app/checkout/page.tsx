'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAppContext } from '@/context/AppContext';
import { useCartContext } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { formatKES } from '@/lib/utils';
import { deliveryZones, FREE_DELIVERY_THRESHOLD } from '@/data/deliveryZones';
import Button from '@/components/ui/Button';
import Icon from '@/components/ui/Icon';

type PaymentMethod = 'mpesa' | 'cash';

export default function CheckoutPage() {
  const { go, location: appLocation, setLocation: setAppLocation } = useAppContext();
  const { items, subtotal, clearCart } = useCartContext();
  const { user } = useAuth();
  const router = useRouter();

  const [address, setAddress] = useState(user?.location || appLocation.name || 'Nairobi CBD');
  const [locationDetail, setLocationDetail] = useState(user?.locationDetail || appLocation.detail || '');
  const [notes, setNotes] = useState('');
  const [phone, setPhone] = useState(user?.phone || '');
  const [guestId, setGuestId] = useState<string | null>(null);

  // Match selected delivery zone
  const activeZone = deliveryZones.find((z) => z.name.toLowerCase() === address.toLowerCase()) || {
    id: 'custom',
    name: address,
    fee: 200,
  };
  const deliveryFee = items.length > 0 ? (subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : activeZone.fee) : 0;
  const total = subtotal + deliveryFee;

  useEffect(() => {
    if (!user) {
      const stored = localStorage.getItem('gift-shisha-guest-id');
      if (!stored) {
        const g = 'guest_' + Math.random().toString(36).slice(2);
        localStorage.setItem('gift-shisha-guest-id', g);
        setGuestId(g);
      } else {
        setGuestId(stored);
      }
    }
  }, [user]);

  const [step, setStep] = useState<'details' | 'payment' | 'processing' | 'done'>('details');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('mpesa');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [createdOrderId, setCreatedOrderId] = useState<string>('');

  const phoneError = Boolean(phone && !/^(\+254|254|0)[17]\d{8}$/.test(phone));

  const handleDetailsNext = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (items.length === 0) {
      setError('Your cart is empty.');
      return;
    }
    if (!address.trim()) {
      setError('Please select or enter your delivery area.');
      return;
    }
    setStep('payment');
  };

  const handlePlaceOrder = async () => {
    setError('');
    if (items.length === 0) {
      setError('Your cart is empty.');
      return;
    }
    if (!address.trim()) {
      setError('Please enter your delivery area.');
      return;
    }
    if (paymentMethod === 'mpesa') {
      if (!phone.trim()) {
        setError('Please enter your M-Pesa phone number.');
        return;
      }
      if (phoneError) {
        setError('Please enter a valid Kenyan phone number (e.g. 0712345678).');
        return;
      }
    }

    setLoading(true);
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer ' + (user?.id || guestId || 'guest_user'),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: items.map((i) => ({ product: i.product, quantity: i.quantity })),
          vendorId: null,
          deliveryAddress: address,
          deliveryLocation: locationDetail + (notes ? ` (Notes: ${notes})` : ''),
          paymentMethod: paymentMethod === 'mpesa' ? 'mpesa' : 'cash',
          phone,
          total,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Order creation failed');

      setCreatedOrderId(data.id);

      if (paymentMethod === 'mpesa') {
        const push = await fetch('/api/mpesa/stkpush', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ phone, amount: total, orderId: data.id }),
        });
        const pushData = await push.json();
        if (!push.ok) throw new Error(pushData.error || 'M-Pesa STK push failed');
        setStep('processing');
      } else {
        clearCart();
        router.push('/success?order=' + data.id + '&method=cash');
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  const handlePaidConfirmation = () => {
    clearCart();
    router.push('/success?order=' + (createdOrderId || 'pending') + '&method=mpesa');
  };

  return (
    <div className="min-h-[calc(100vh-68px)] flex flex-col bg-[var(--ink)]">
      <Link href="/cart" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, margin: 26, color: '#f59e0b', fontWeight: 800, fontSize: 14, textDecoration: 'none' }}>
        <Icon name="chevron" size={16} /> Back to cart
      </Link>
      <div className="page-shell">
        <div className="section-head">
          <div>
            <span className="kicker">Checkout</span>
            <h2>Complete your order</h2>
          </div>
        </div>

        {error && <div style={{ background: 'rgba(239,68,68,.12)', border: '1px solid rgba(239,68,68,.35)', color: '#fca5a5', padding: 12, borderRadius: 12, fontSize: 13, marginBottom: 18, fontWeight: 700 }}>{error}</div>}

        <div className="checkout-grid">
          <div>
            {step === 'details' && (
              <div className="checkout-block">
                <div className="block-title"><span>1</span><div><h3>Delivery details</h3><p>Where should we deliver your shisha?</p></div></div>
                <form onSubmit={handleDetailsNext}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 16 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      <label style={{ fontSize: '13px', fontWeight: 800, color: '#a3a3a2' }}>Delivery Area / Town</label>
                      <select
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="w-full min-h-[48px] px-4 bg-[var(--ink)] border border-line rounded-xl text-cream focus:border-ember outline-none"
                        style={{ colorScheme: 'dark' }}
                      >
                        {deliveryZones.map((z) => (
                          <option key={z.id} value={z.name} style={{ background: '#131313', color: '#f5f5f0' }}>
                            {z.name} ({subtotal >= FREE_DELIVERY_THRESHOLD ? 'FREE' : `KES ${z.fee}`})
                          </option>
                        ))}
                      </select>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      <label style={{ fontSize: '13px', fontWeight: 800, color: '#a3a3a2' }}>Building / Apartment / House</label>
                      <input
                        value={locationDetail}
                        onChange={(e) => setLocationDetail(e.target.value)}
                        placeholder="e.g. ABC Plaza, 2nd Floor, Apt 4B"
                        className="w-full min-h-[48px] px-4 bg-[var(--ink)] border border-line rounded-xl text-cream focus:border-ember outline-none"
                      />
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 16 }}>
                    <label style={{ fontSize: '13px', fontWeight: 800, color: '#a3a3a2' }}>Order notes (optional)</label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="e.g. Leave with reception, call on arrival, extra coal tongs requested"
                      rows={3}
                      className="w-full min-h-[72px] px-4 py-3 bg-[var(--ink)] border border-line rounded-xl text-cream focus:border-ember outline-none"
                    />
                  </div>
                  <Button variant="amber" type="submit" className="w-full" style={{ fontSize: 16 }}>
                    Continue to Payment <Icon name="chevronRight" size={16} />
                  </Button>
                </form>
              </div>
            )}
            {step === 'payment' && (
              <>
                <div className="checkout-block">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
                    <div className="block-title" style={{ margin: 0 }}><span>2</span><div><h3>Choose payment</h3><p>Delivering to: <strong style={{ color: '#f59e0b' }}>{address}</strong></p></div></div>
                    <button onClick={() => setStep('details')} className="btn btn-ghost" style={{ minHeight: 34, padding: '0 12px', fontSize: 12 }}>Change details</button>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', padding: 14, borderRadius: 16, border: '1px solid ' + (paymentMethod === 'mpesa' ? 'var(--ember)' : 'var(--line)'), background: paymentMethod === 'mpesa' ? 'rgba(217,119,6,.1)' : 'transparent' }} onClick={() => setPaymentMethod('mpesa')}>
                      <input type="radio" name="payment" checked={paymentMethod === 'mpesa'} onChange={() => setPaymentMethod('mpesa')} />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 800, color: '#f5f5f0' }}>M-Pesa STK Push</div>
                        <div style={{ fontSize: '12px', color: '#a3a3a2' }}>Instant prompt directly on your Safaricom phone</div>
                      </div>
                      <Icon name="phone" size={16} style={{ color: '#f59e0b' }} />
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', padding: 14, borderRadius: 16, border: '1px solid ' + (paymentMethod === 'cash' ? 'var(--ember)' : 'var(--line)'), background: paymentMethod === 'cash' ? 'rgba(217,119,6,.1)' : 'transparent' }} onClick={() => setPaymentMethod('cash')}>
                      <input type="radio" name="payment" checked={paymentMethod === 'cash'} onChange={() => setPaymentMethod('cash')} />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 800, color: '#f5f5f0' }}>Cash on Delivery</div>
                        <div style={{ fontSize: '12px', color: '#a3a3a2' }}>Pay cash to the dispatch rider upon delivery</div>
                      </div>
                      <Icon name="receipt" size={16} style={{ color: '#f59e0b' }} />
                    </label>
                  </div>
                  {paymentMethod === 'mpesa' && (
                    <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 6 }}>
                      <label style={{ fontSize: '13px', fontWeight: 800, color: '#a3a3a2' }}>M-Pesa Phone number</label>
                      <div className="phone-input">
                        <span style={{ color: '#a3a3a2', fontWeight: 700 }}>+254</span>
                        <input
                          value={phone.replace(/^(\+254|254|0)/, '')}
                          onChange={(e) => {
                            const v = e.target.value.replace(/\D/g, '');
                            setPhone('0' + v);
                          }}
                          placeholder="712345678"
                          className="flex-1 bg-transparent border-0 outline-0 text-cream"
                        />
                      </div>
                      {phoneError && phone && <span style={{ color: '#fca5a5', fontSize: '12px', fontWeight: 700 }}>Invalid Kenyan number</span>}
                    </div>
                  )}
                  <Button variant="amber" onClick={handlePlaceOrder} disabled={loading || (paymentMethod === 'mpesa' && (!phone || phoneError))} className="w-full mt-6" style={{ fontSize: 16 }}>
                    {loading ? 'Processing...' : `Place Order (${formatKES(total)})`}
                  </Button>
                </div>
              </>
            )}
            {step === 'processing' && (
              <div className="checkout-block" style={{ textAlign: 'center', padding: 40 }}>
                <div style={{ width: 64, height: 64, border: '4px solid rgba(217,119,6,.25)', borderTopColor: 'var(--ember)', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 18px' }} />
                <h3 style={{ color: '#f5f5f0', fontSize: 22, marginBottom: 8 }}>M-Pesa PIN prompt sent!</h3>
                <p style={{ color: '#a3a3a2', fontSize: 14, marginBottom: 22 }}>Please check your phone and enter your M-Pesa PIN for <span style={{ color: '#f59e0b', fontWeight: 800 }}>{formatKES(total)}</span>.</p>
                <p style={{ color: '#a3a3a2', fontSize: 13, marginBottom: 22, fontStyle: 'italic' }}>Once entered, your order will be confirmed immediately.</p>
                <Button variant="amber" onClick={handlePaidConfirmation} className="w-full">I Have Completed Payment</Button>
              </div>
            )}
            {step === 'done' && (
              <div className="checkout-block" style={{ textAlign: 'center', padding: 40 }}>
                <div style={{ width: 64, height: 64, display: 'grid', placeItems: 'center', color: 'white', background: 'var(--ember)', borderRadius: '50%', margin: '0 auto 18px' }}><Icon name="check" size={32} /></div>
                <h3 style={{ color: '#f5f5f0', fontSize: 24, marginBottom: 8 }}>Order placed</h3>
                <p style={{ color: '#a3a3a2', fontSize: 14 }}>Thank you for choosing Gift Shisha.</p>
                <Button variant="amber" onClick={() => router.push('/')} className="w-full mt-6" style={{ fontSize: 16 }}>Back to shop</Button>
              </div>
            )}
          </div>
          <div className="order-summary">
            <div style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 20, fontWeight: 800, color: '#f5f5f0', marginBottom: 14 }}>Order Summary</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16 }}>
              {items.map((item) => (
                <div key={item.product.id} style={{ display: 'flex', gap: 10, alignItems: 'center', paddingBottom: 10, borderBottom: '1px solid rgba(255,255,255,.06)' }}>
                  <img src={item.product.image} alt={item.product.name} style={{ width: 48, height: 48, borderRadius: 10, objectFit: 'cover', background: '#0a0a0a' }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '13px', fontWeight: 800, color: '#f5f5f0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.product.name}</div>
                    <div style={{ fontSize: '12px', color: '#a3a3a2', marginTop: 2 }}>{formatKES(item.product.price)} x {item.quantity}</div>
                  </div>
                  <div style={{ fontWeight: 800, color: '#f59e0b', minWidth: 50, textAlign: 'right' }}>{formatKES(item.product.price * item.quantity)}</div>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#a3a3a2', marginBottom: 6 }}><span>Subtotal</span><span>{formatKES(subtotal)}</span></div>
            {deliveryFee > 0 ? (
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#a3a3a2', marginBottom: 6 }}><span>Delivery · {activeZone.name}</span><span>{formatKES(deliveryFee)}</span></div>
            ) : (
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#f59e0b', fontWeight: 800, marginBottom: 6 }}><span>Delivery · {activeZone.name}</span><span>Free</span></div>
            )}
            {subtotal > 0 && subtotal < FREE_DELIVERY_THRESHOLD && <div style={{ fontSize: '11px', color: '#f59e0b', fontWeight: 800, marginBottom: 10 }}>Add {formatKES(FREE_DELIVERY_THRESHOLD - subtotal)} more for free delivery</div>}
            <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: '18px', fontWeight: 800, color: '#f59e0b', marginBottom: 16, paddingTop: 10, borderTop: '1px solid rgba(255,255,255,.08)' }}><span>Total</span><span>{formatKES(total)}</span></div>
            <div style={{ background: 'rgba(217,119,6,.1)', border: '1px solid rgba(217,119,6,.25)', borderRadius: 12, padding: 12, fontSize: 13, color: '#f59e0b', fontWeight: 700 }}>
              <Icon name="bike" size={14} style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: 6 }} /> Tracked delivery to your door
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
