'use client';

// Deterministic smoke particles — no random(), SSR-safe
const PARTICLES = [
  { id: 0,  left: '6%',  dur: '18s', delay: '0s',   size: '120px', drift: '-40px', opacity: 0.5 },
  { id: 1,  left: '16%', dur: '22s', delay: '2.1s', size: '160px', drift: '60px',  opacity: 0.35 },
  { id: 2,  left: '24%', dur: '16s', delay: '4.5s', size: '90px',  drift: '-50px', opacity: 0.55 },
  { id: 3,  left: '32%', dur: '25s', delay: '1.2s', size: '180px', drift: '45px',  opacity: 0.3 },
  { id: 4,  left: '40%', dur: '19s', delay: '5.8s', size: '110px', drift: '-30px', opacity: 0.5 },
  { id: 5,  left: '48%', dur: '21s', delay: '3.4s', size: '140px', drift: '55px',  opacity: 0.4 },
  { id: 6,  left: '56%', dur: '17s', delay: '0.6s', size: '100px', drift: '-60px', opacity: 0.55 },
  { id: 7,  left: '64%', dur: '24s', delay: '4.8s', size: '170px', drift: '35px',  opacity: 0.32 },
  { id: 8,  left: '72%', dur: '15s', delay: '2.9s', size: '80px',  drift: '-45px', opacity: 0.6 },
  { id: 9,  left: '80%', dur: '20s', delay: '6.2s', size: '130px', drift: '50px',  opacity: 0.38 },
  { id: 10, left: '88%', dur: '23s', delay: '1.5s', size: '150px', drift: '-55px', opacity: 0.35 },
  { id: 11, left: '10%', dur: '26s', delay: '7.0s', size: '190px', drift: '30px',  opacity: 0.28 },
  { id: 12, left: '36%', dur: '14s', delay: '5.0s', size: '70px',  drift: '-35px', opacity: 0.62 },
  { id: 13, left: '68%', dur: '22s', delay: '3.8s', size: '125px', drift: '-25px', opacity: 0.42 },
  { id: 14, left: '92%', dur: '19s', delay: '0.3s', size: '95px',  drift: '65px',  opacity: 0.5 },
  { id: 15, left: '44%', dur: '20s', delay: '6.8s', size: '145px', drift: '-50px', opacity: 0.36 },
];

export default function SmokeBackground() {
  return (
    <div
      className="smoke-bg"
      aria-hidden="true"
      style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}
    >
      {PARTICLES.map((p) => (
        <span
          key={p.id}
          className="smoke-p"
          style={{
            left: p.left,
            width: p.size,
            height: p.size,
            animationDuration: p.dur,
            animationDelay: p.delay,
            '--drift': p.drift,
            '--max-opacity': p.opacity,
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
}