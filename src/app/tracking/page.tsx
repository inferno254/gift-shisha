'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAppContext } from '@/context/AppContext';
import { formatKES } from '@/lib/utils';
import Icon from '@/components/ui/Icon';
import Button from '@/components/ui/Button';

export default function TrackingPage() {
  const { go } = useAppContext();
  const [searchCode, setSearchCode] = useState('');
  const [currentOrder, setCurrentOrder] = useState('GSH-884920');

  const stages = [
    { title: 'Order Received', time: '10 mins ago', done: true, desc: 'Gift Shisha received and verified your order.' },
    { title: 'Packing & Quality Check', time: '5 mins ago', done: true, desc: 'Authentic hookah, fresh coals & foil packed.' },
    { title: 'Out for Delivery', time: 'In transit', done: true, current: true, desc: 'Dispatch rider is en route to your location.' },
    { title: 'Delivered', time: 'Est. 15-25 min', done: false, desc: 'Arrived at your doorstep. Enjoy the session!' },
  ];

  return (
    <div className="min-h-[calc(100vh-68px)] flex flex-col bg-[var(--smoke)] py-8">
      <div className="page-shell">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
          <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: '#f59e0b', fontWeight: 800, fontSize: 14, textDecoration: 'none' }}>
            <Icon name="chevron" size={16} /> Back to Home
          </Link>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <input
              value={searchCode}
              onChange={(e) => setSearchCode(e.target.value)}
              placeholder="Enter Order # e.g. GSH-884920"
              className="px-3 py-2 text-xs bg-[var(--ink)] border border-line rounded-lg text-cream outline-none focus:border-ember"
            />
            <Button
              variant="amber"
              onClick={() => {
                if (searchCode.trim()) setCurrentOrder(searchCode.trim().toUpperCase());
              }}
              style={{ minHeight: 34, padding: '0 12px', fontSize: 12 }}
            >
              Lookup
            </Button>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: 40, alignItems: 'start' }}>
          <div>
            <div className="section-head" style={{ marginBottom: 20 }}>
              <div>
                <span className="kicker">Live Order Status</span>
                <h2>Tracking Order #{currentOrder}</h2>
              </div>
            </div>

            <div className="track-map" style={{ marginBottom: 28 }}>
              <div className="track-road r1" />
              <div className="track-road r2" />
              <div className="track-road r3" />
              <div className="track-route" />
              <div className="track-pin start" title="Gift Shisha Depot"><span className="glyph">G</span></div>
              <div className="track-pin end" title="Delivery Address"><span className="glyph">📍</span></div>
              <div className="track-rider" title="Rider en route">🛵</div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, background: 'var(--ink)', padding: 24, borderRadius: 20, border: '1px solid var(--line)' }}>
              {stages.map((s, i) => (
                <div key={s.title} style={{ display: 'flex', alignItems: 'center', gap: 14, opacity: s.done ? 1 : 0.65 }}>
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: '50%',
                      background: s.current ? 'var(--ember-glow)' : s.done ? 'var(--ember)' : 'rgba(255,255,255,.08)',
                      color: s.done ? '#0a0a0a' : '#a3a3a2',
                      display: 'grid',
                      placeItems: 'center',
                      fontWeight: 800,
                      fontSize: 13,
                      flex: '0 0 36px',
                      border: s.done ? '2px solid #fff' : '1px solid rgba(255,255,255,.12)',
                      boxShadow: s.current ? '0 0 16px rgba(245,158,11,0.6)' : 'none',
                    }}
                  >
                    {s.done ? <Icon name="check" size={16} /> : i + 1}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 800, color: '#f5f5f0', fontSize: 14 }}>{s.title}</div>
                    <div style={{ fontSize: 12, color: '#a3a3a2', marginTop: 2 }}>{s.desc}</div>
                  </div>
                  <div style={{ fontSize: 12, fontWeight: 800, color: s.done ? '#f59e0b' : '#a3a3a2', whiteSpace: 'nowrap' }}>{s.time}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div style={{ background: 'var(--ink)', border: '1px solid rgba(255,255,255,.08)', borderRadius: 20, padding: 24, color: '#f5f5f0' }}>
              <div style={{ fontWeight: 800, fontSize: 16, marginBottom: 14, color: '#f59e0b' }}>Assigned Dispatch Courier</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                <div style={{ width: 44, height: 44, background: '#1c1917', border: '2px solid rgba(217,119,6,.4)', borderRadius: 12, display: 'grid', placeItems: 'center', fontSize: 18, color: '#f59e0b', fontWeight: 800 }}>JM</div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: 15 }}>James Mwangi</div>
                  <div style={{ fontSize: 12, color: '#a3a3a2' }}>Express Motorbike Rider</div>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <a href="tel:+254712345678" className="btn btn-amber" style={{ width: '100%', minHeight: 42, fontSize: 13, textDecoration: 'none' }}>
                  <Icon name="phone" size={14} /> Call Dispatch Rider
                </a>
                <a href="https://wa.me/254712345678" target="_blank" rel="noopener noreferrer" className="btn btn-ghost" style={{ width: '100%', minHeight: 40, fontSize: 13, textDecoration: 'none' }}>
                  <Icon name="chat" size={14} /> WhatsApp Support
                </a>
              </div>
              <div style={{ background: 'rgba(217,119,6,.1)', border: '1px solid rgba(217,119,6,.25)', borderRadius: 10, padding: 12, fontSize: 12, color: '#f59e0b', fontWeight: 800, marginTop: 14 }}>
                <Icon name="bike" size={14} style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: 6 }} /> Estimated arrival: 10 - 20 mins
              </div>
            </div>

            <div style={{ background: 'var(--ink)', border: '1px solid rgba(255,255,255,.08)', borderRadius: 20, padding: 20, color: '#f5f5f0' }}>
              <div style={{ fontWeight: 800, fontSize: 14, marginBottom: 8, color: '#f5f5f0' }}>Need to adjust delivery?</div>
              <p style={{ fontSize: 12, color: '#a3a3a2', margin: '0 0 12px', lineHeight: 1.5 }}>
                Rider not answering or need to change flat/building info? Chat with our Nairobi team directly on WhatsApp.
              </p>
              <Link href="/shop" className="btn btn-ghost" style={{ width: '100%', minHeight: 38, fontSize: 12, textDecoration: 'none' }}>
                Order More Items
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
