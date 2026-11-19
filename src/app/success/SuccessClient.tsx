'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { formatKES } from '@/lib/utils';
import Icon from '@/components/ui/Icon';
import Button from '@/components/ui/Button';

export default function SuccessClient({ order, method }: { order: string; method: string }) {
  const router = useRouter();
  const [paid, setPaid] = useState(method === 'mpesa');

  useEffect(() => {
    if (method === 'mpesa' && !paid) {
      const t = setTimeout(() => setPaid(true), 2500);
      return () => clearTimeout(t);
    }
  }, [method, paid]);

  return (
    <div className="min-h-[calc(100vh-68px)] flex flex-col bg-[var(--smoke)]">
      <Link href="/shop" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, margin: 30, color: '#f59e0b', fontWeight: 800, fontSize: 14, textDecoration: 'none' }}>
        <Icon name="chevron" size={16} /> Continue shopping
      </Link>
      <div className="page-shell">
        <div className="success-page">
          <div className="success-plug"><Icon name="check" size={32} /></div>
          {method === 'mpesa' && !paid ? (
            <>
              <h3 style={{ color: '#f5f5f0', fontSize: 20, marginBottom: 6 }}>Awaiting payment</h3>
              <p style={{ color: '#a3a3a2', fontSize: 14, marginBottom: 22 }}>Please complete the M-Pesa prompt on your phone.</p>
              <Button variant="ghost" onClick={() => setPaid(true)} className="w-full max-w-[300px] mx-auto">I've Completed Payment</Button>
            </>
          ) : (
            <>
              <h1 style={{ color: '#f5f5f0', fontSize: 56, marginBottom: 10 }}>Order Confirmed</h1>
              <p style={{ color: '#a3a3a2', fontSize: 15, marginBottom: 26 }}>Your shisha essentials are on the way. A rider will contact you shortly.</p>
              <div className="order-number">
                <div><span style={{ display: 'block', fontSize: '11px', fontWeight: 900, letterSpacing: '.16em', textTransform: 'uppercase', color: '#a3a3a2' }}>Order number</span><span style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 800, color: '#f5f5f0' }}>{order && order !== 'pending' ? order : 'GSH-' + Math.floor(100000 + Math.random() * 900000)}</span></div>
                <div><span style={{ display: 'block', fontSize: '11px', fontWeight: 900, letterSpacing: '.16em', textTransform: 'uppercase', color: '#a3a3a2' }}>Method</span><span style={{ fontWeight: 800, color: '#f59e0b' }}>{method === 'mpesa' ? 'M-Pesa STK' : 'Cash on Delivery'}</span></div>
                <div><span style={{ display: 'block', fontSize: '11px', fontWeight: 900, letterSpacing: '.16em', textTransform: 'uppercase', color: '#a3a3a2' }}>Status</span><span style={{ fontWeight: 800, color: '#22c55e' }}>{paid ? 'Confirmed & Dispatched' : 'Payment Processing'}</span></div>
              </div>
              <div style={{ display: 'flex', gap: 10, marginTop: 22, flexWrap: 'wrap', justifyContent: 'center' }}>
                <Button variant="amber" onClick={() => router.push('/tracking')} className="flex-1 min-w-[180px]">Track Order Live</Button>
                <Button variant="ghost" onClick={() => router.push('/shop')} className="min-w-[140px]">Back to Shop</Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
