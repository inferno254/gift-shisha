'use client';

import { useState, useEffect } from 'react';
import { useAppContext } from '@/context/AppContext';
import { useCartContext } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { formatKES } from '@/lib/utils';
import Button from '@/components/ui/Button';
import Icon from '@/components/ui/Icon';

const FREE_THRESHOLD = 3000;

type PaymentMethod = 'mpesa' | 'cash';

export default function CheckoutPage() {
  const { go } = useAppContext();
  const { items, subtotal, clearCart } = useCartContext();
  const { user } = useAuth();
  const router = useRouter();

  const deliveryFee = items.length > 0 ? (subtotal >= FREE_THRESHOLD ? 0 : 150) : 0;
  const total = subtotal + deliveryFee;

  const [step, setStep] = useState<'details' | 'payment' | 'processing' | 'done'>('details');
  const [phone, setPhone] = useState(user?.phone || '');
  const [address, setAddress] = useState(user?.location || '');
  const [location, setLocation] = useState(user?.locationDetail || '');
  const [notes, setNotes] = useState('');
  const [guestId, setGuestId] = useState<string | null>(null);

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

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('mpesa');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const phoneError = Boolean(phone && !/^(\+254|254|0)[17]\d{8}$/.test(phone));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (items.length === 0) { setError('Your cart is empty.'); return; }
    if (!address) { setError('Please enter your delivery area.'); return; }
    if (paymentMethod === 'mpesa' && phoneError) { setError('Please enter a valid Kenyan phone number (e.g. 0712345678).'); return; }

    setLoading(true);
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer ' + (user?.id || guestId || ''),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: items.map((i) => ({ product: i.product, quantity: i.quantity })),
          vendorId: null,
          deliveryAddress: address,
          deliveryLocation: location,
          paymentMethod: paymentMethod === 'mpesa' ? 'mpesa' : 'cash',
          phone,
          total,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Order failed');

      if (paymentMethod === 'mpesa') {
        const push = await fetch('/api/mpesa/stkpush', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ phone, amount: total, orderId: data.id }),
        });
        const pushData = await push.json();
        if (!push.ok) throw new Error(pushData.error || 'STK push failed');
        setStep('processing');
      } else {
        clearCart();
        router.push('/success?order=' + data.id + '&method=cash');
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Try again.');
      setLoading(false);
    }
  };

  const pollPayment = async () => {
    await new Promise((r) => setTimeout(r, 5000));
    clearCart();
    router.push('/success?order=pending&method=mpesa');
  };

  return (
    <div className="min-h-[calc(100vh-68px)] flex flex-col bg-[var(--ink)]">
      <a href="/cart" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, margin: 26, color: '#f59e0b', fontWeight: 800, fontSize: 14, textDecoration: 'none' }}>
        <Icon name="chevron" size={16} /> Back to cart
      </a>
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
                <form onSubmit={handleSubmit}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 16 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      <label style={{ fontSize: '13px', fontWeight: 800, color: '#a3a3a2' }}>Area / Estate</label>
                      <input
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="e.g. Westlands, Kilimani, Karen"
                        className="w-full min-h-[48px] px-4 bg-[var(--ink)] border border-line rounded-xl text-cream focus:border-ember outline-none"
                      />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      <label style={{ fontSize: '13px', fontWeight: 800, color: '#a3a3a2' }}>Building / Flat (optional)</label>
                      <input
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="e.g. ABC Plaza, 2nd Floor"
                        className="w-full min-h-[48px] px-4 bg-[var(--ink)] border border-line rounded-xl text-cream focus:border-ember outline-none"
                      />
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 16 }}>
                    <label style={{ fontSize: '13px', fontWeight: 800, color: '#a3a3a2' }}>Order notes (optional)</label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="e.g. Leave with reception, call on arrival"
                      rows={3}
                      className="w-full min-h-[72px] px-4 py-3 bg-[var(--ink)] border border-line rounded-xl text-cream focus:border-ember outline-none"
                    />
                  </div>
                  <Button variant="amber" type="submit" disabled={loading} className="w-full" style={{ fontSize: 16 }}>
                    Continue to Payment <Icon name="chevronRight" size={16} />
                  </Button>
                </form>
              </div>
            )}
            {step === 'payment' && (
              <>
                <div className="checkout-block">
                  <div className="block-title"><span>2</span><div><h3>Choose payment</h3><p>Secure M-Pesa or pay cash on delivery.</p></div></div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', padding: 14, borderRadius: 16, border: '1px solid ' + (paymentMethod === 'mpesa' ? 'var(--ember)' : 'var(--line)'), background: paymentMethod === 'mpesa' ? 'rgba(217,119,6,.1)' : 'transparent' }} onClick={() => setPaymentMethod('mpesa')}>
                      <input type="radio" name="payment" defaultChecked readOnly />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 800, color: '#f5f5f0' }}>M-Pesa STK Push</div>
                        <div style={{ fontSize: '12px', color: '#a3a3a2' }}>Pay now from your phone - enter number below</div>
                      </div>
                      <Icon name="phone" size={16} style={{ color: '#f59e0b' }} />
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', padding: 14, borderRadius: 16, border: '1px solid ' + (paymentMethod === 'cash' ? 'var(--ember)' : 'var(--line)'), background: paymentMethod === 'cash' ? 'rgba(217,119,6,.1)' : 'transparent' }} onClick={() => setPaymentMethod('cash')}>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 800, color: '#f5f5f0' }}>Cash on Delivery</div>
                        <div style={{ fontSize: '12px', color: '#a3a3a2' }}>Pay the rider when your order arrives</div>
                      </div>
                      <Icon name="receipt" size={16} style={{ color: '#f59e0b' }} />
                    </label>
                  </div>
                  {paymentMethod === 'mpesa' && (
                    <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 6 }}>
                      <label style={{ fontSize: '13px', fontWeight: 800, color: '#a3a3a2' }}>Phone number</label>
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
                  <Button variant="amber" onClick={() => handleSubmit({ preventDefault: () => {} } as React.FormEvent)} disabled={loading || (paymentMethod === 'mpesa' && phoneError)} className="w-full mt-6" style={{ fontSize: 16 }}>
                    {loading ? 'Processing...' : 'Place Order'}
                  </Button>
                </div>
              </>
            )}
            {step === 'processing' && (
              <div className="checkout-block" style={{ textAlign: 'center', padding: 40 }}>
                <div style={{ width: 64, height: 64, border: '4px solid rgba(217,119,6,.25)', borderTopColor: 'var(--ember)', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 18px' }} />
                <h3 style={{ color: '#f5f5f0', fontSize: 22, marginBottom: 8 }}>Sending M-Pesa prompt</h3>
                <p style={{ color: '#a3a3a2', fontSize: 14, marginBottom: 22 }}>Check your phone and enter your M-Pesa PIN to complete payment of <span style={{ color: '#f59e0b', fontWeight: 800 }}>{formatKES(total)}</span>.</p>
                <p style={{ color: '#a3a3a2', fontSize: 13, marginBottom: 22, fontStyle: 'italic' }}>Once paid, your order will be confirmed and a rider assigned.</p>
                <Button variant="ghost" onClick={() => { pollPayment(); }} className="w-full">I've Paid</Button>
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
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#a3a3a2', marginBottom: 6 }}><span>Delivery Nairobi</span><span>{formatKES(deliveryFee)}</span></div>
            ) : (
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#f59e0b', fontWeight: 800, marginBottom: 6 }}><span>Delivery</span><span>Free</span></div>
            )}
            {subtotal > 0 && subtotal < FREE_THRESHOLD && <div style={{ fontSize: '11px', color: '#f59e0b', fontWeight: 800, marginBottom: 10 }}>Add {formatKES(FREE_THRESHOLD - subtotal)} more for free delivery</div>}
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
