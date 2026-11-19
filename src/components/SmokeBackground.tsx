'use client';

// Deterministic smoke particles — no random(), SSR-safe
const PARTICLES = [
  { id: 0,  left: '5%',  dur: '14s', delay: '0s',    size: '70px',  drift: '-30px', opacity: 0.55 },
  { id: 1,  left: '14%', dur: '18s', delay: '1.4s',  size: '110px', drift: '50px',  opacity: 0.4  },
  { id: 2,  left: '23%', dur: '12s', delay: '3.1s',  size: '60px',  drift: '-55px', opacity: 0.6  },
  { id: 3,  left: '33%', dur: '20s', delay: '0.7s',  size: '130px', drift: '70px',  opacity: 0.35 },
  { id: 4,  left: '41%', dur: '15s', delay: '5.2s',  size: '80px',  drift: '-20px', opacity: 0.5  },
  { id: 5,  left: '50%', dur: '22s', delay: '2.3s',  size: '150px', drift: '40px',  opacity: 0.3  },
  { id: 6,  left: '58%', dur: '13s', delay: '6.8s',  size: '65px',  drift: '-70px', opacity: 0.55 },
  { id: 7,  left: '67%', dur: '19s', delay: '1.1s',  size: '120px', drift: '60px',  opacity: 0.38 },
  { id: 8,  left: '75%', dur: '11s', delay: '4.5s',  size: '55px',  drift: '-45px', opacity: 0.65 },
  { id: 9,  left: '83%', dur: '17s', delay: '0.3s',  size: '100px', drift: '35px',  opacity: 0.42 },
  { id: 10, left: '90%', dur: '24s', delay: '7.2s',  size: '160px', drift: '-80px', opacity: 0.28 },
  { id: 11, left: '8%',  dur: '16s', delay: '9.0s',  size: '90px',  drift: '25px',  opacity: 0.48 },
  { id: 12, left: '28%', dur: '21s', delay: '3.7s',  size: '140px', drift: '-60px', opacity: 0.32 },
  { id: 13, left: '55%', dur: '10s', delay: '8.4s',  size: '50px',  drift: '15px',  opacity: 0.7  },
  { id: 14, left: '72%', dur: '23s', delay: '5.9s',  size: '170px', drift: '90px',  opacity: 0.25 },
  { id: 15, left: '46%', dur: '13s', delay: '11.2s', size: '75px',  drift: '-35px', opacity: 0.52 },
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