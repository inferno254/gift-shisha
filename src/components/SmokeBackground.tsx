'use client';

// Deterministic smoke particles — no random(), SSR-safe
const PARTICLES = [
  { id: 0,  left: '8%',  dur: '22s', delay: '0s',   size: '130px', drift: '-40px', opacity: 0.45 },
  { id: 1,  left: '20%', dur: '26s', delay: '2.5s', size: '160px', drift: '50px',  opacity: 0.32 },
  { id: 2,  left: '32%', dur: '20s', delay: '5.0s', size: '100px', drift: '-50px', opacity: 0.5  },
  { id: 3,  left: '44%', dur: '28s', delay: '1.5s', size: '180px', drift: '45px',  opacity: 0.28 },
  { id: 4,  left: '56%', dur: '23s', delay: '6.0s', size: '120px', drift: '-35px', opacity: 0.42 },
  { id: 5,  left: '68%', dur: '25s', delay: '3.5s', size: '150px', drift: '55px',  opacity: 0.35 },
  { id: 6,  left: '80%', dur: '21s', delay: '0.8s', size: '110px', drift: '-60px', opacity: 0.48 },
  { id: 7,  left: '12%', dur: '27s', delay: '7.0s', size: '170px', drift: '35px',  opacity: 0.3  },
  { id: 8,  left: '38%', dur: '19s', delay: '5.2s', size: '90px',  drift: '-45px', opacity: 0.52 },
  { id: 9,  left: '62%', dur: '24s', delay: '4.0s', size: '140px', drift: '-30px', opacity: 0.38 },
  { id: 10, left: '88%', dur: '22s', delay: '1.0s', size: '130px', drift: '60px',  opacity: 0.4  },
  { id: 11, left: '26%', dur: '26s', delay: '6.5s', size: '155px', drift: '-50px', opacity: 0.34 },
  { id: 12, left: '50%', dur: '20s', delay: '2.0s', size: '105px', drift: '45px',  opacity: 0.44 },
  { id: 13, left: '74%', dur: '25s', delay: '5.5s', size: '125px', drift: '-40px', opacity: 0.4  },
  { id: 14, left: '92%', dur: '23s', delay: '3.0s', size: '115px', drift: '55px',  opacity: 0.36 },
  { id: 15, left: '42%', dur: '21s', delay: '6.8s', size: '145px', drift: '-55px', opacity: 0.38 },
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