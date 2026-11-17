'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useAppContext } from '@/context/AppContext';
import Icon from '@/components/ui/Icon';

export default function TrackingPage() {
  const { go } = useAppContext();

  const stages = [
    { title: 'Order Received', time: 'Just now', done: true, desc: 'Gift Shisha has received your order.' },
    { title: 'Preparing', time: '2 min ago', done: true, desc: 'Your hookah and flavours are being packed.' },
    { title: 'Out for Delivery', time: 'Now', done: false, desc: 'Rider is on the way to your door.' },
    { title: 'Delivered', time: 'Coming soon', done: false, desc: 'Enjoy your session!' },
  ];

  return (
    <div className="min-h-[calc(100vh-68px)] flex flex-col bg-[var(--smoke)]">
      <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, margin: 26, color: '#f59e0b', fontWeight: 800, fontSize: 14, textDecoration: 'none' }}>
        <Icon name="chevron" size={16} /> Home
      </Link>
      <div className="page-shell" style={{ display: 'grid', gridTemplateColumns: '1fr 420px', gap: 56, alignItems: 'start' }}>
        <div>
          <div className="section-head">
            <div>
              <span className="kicker">Order Tracking</span>
              <h2>Your delivery is on the way</h2>
            </div>
          </div>
          <div className="track-map">
            <div className="track-road r1" />
            <div className="track-road r2" />
            <div className="track-road r3" />
            <div className="track-route" />
            <div className="track-pin start"><span className="glyph">G</span></div>
            <div className="track-pin end"><span className="glyph">H</span></div>
            <div className="track-rider">🛵</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {stages.map((s, i) => (
              <div key={s.title} style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ width: 34, height: 34, borderRadius: '50%', background: s.done ? 'var(--ember)' : 'rgba(255,255,255,.08)', color: s.done ? '#0a0a0a' : '#a3a3a2', display: 'grid', placeItems: 'center', fontWeight: 800, fontSize: 12, flex: '0 0 34', border: s.done ? '2px solid #fff' : '1px solid rgba(255,255,255,.12)' }}>
                  {s.done ? <Icon name="check" size={14} /> : i + 1}
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
        <div className="desktop-cart" style={{ position: 'static' }}>
          <div style={{ background: 'var(--ink)', border: '1px solid rgba(255,255,255,.08)', borderRadius: 20, padding: 24, color: '#f5f5f0' }}>
            <div style={{ fontWeight: 800, fontSize: 16, marginBottom: 14, color: '#f59e0b' }}>Rider Assigned</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
              <div style={{ width: 36, height: 36, background: '#0a0a0a', border: '2px solid rgba(255,255,255,.08)', borderRadius: 10, display: 'grid', placeItems: 'center', fontSize: 14 }}>J</div>
              <div>
                <div style={{ fontWeight: 800, fontSize: 13 }}>James M.</div>
                <div style={{ fontSize: 12, color: '#a3a3a2' }}>07xx xxx xxx</div>
              </div>
            </div>
            <div style={{ background: 'rgba(217,119,6,.1)', border: '1px solid rgba(217,119,6,.25)', borderRadius: 10, padding: 10, fontSize: 12, color: '#f59e0b', fontWeight: 800, marginTop: 10 }}>
              <Icon name="bike" size={14} style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: 6 }} /> 8 min away
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
