'use client';

// Deterministic smoke particles — no random(), SSR-safe
const PARTICLES = [
  { id: 0,  left: '6%',  dur: '20s', delay: '0s',   size: '140px', drift: '-50px', opacity: 0.55 },
  { id: 1,  left: '16%', dur: '24s', delay: '2.5s', size: '180px', drift: '60px',  opacity: 0.4  },
  { id: 2,  left: '24%', dur: '18s', delay: '5.0s', size: '110px', drift: '-60px', opacity: 0.6  },
  { id: 3,  left: '32%', dur: '28s', delay: '1.5s', size: '200px', drift: '50px',  opacity: 0.35 },
  { id: 4,  left: '40%', dur: '21s', delay: '6.2s', size: '130px', drift: '-35px', opacity: 0.5  },
  { id: 5,  left: '48%', dur: '23s', delay: '3.8s', size: '160px', drift: '65px',  opacity: 0.42 },
  { id: 6,  left: '56%', dur: '19s', delay: '0.8s', size: '120px', drift: '-70px', opacity: 0.58 },
  { id: 7,  left: '64%', dur: '26s', delay: '5.2s', size: '190px', drift: '40px',  opacity: 0.38 },
  { id: 8,  left: '72%', dur: '17s', delay: '3.2s', size: '100px', drift: '-55px', opacity: 0.62 },
  { id: 9,  left: '80%', dur: '22s', delay: '6.8s', size: '150px', drift: '55px',  opacity: 0.4  },
  { id: 10, left: '88%', dur: '25s', delay: '1.8s', size: '170px', drift: '-65px', opacity: 0.38 },
  { id: 11, left: '10%', dur: '28s', delay: '7.5s', size: '210px', drift: '35px',  opacity: 0.32 },
  { id: 12, left: '36%', dur: '16s', delay: '5.4s', size: '90px',  drift: '-40px', opacity: 0.65 },
  { id: 13, left: '68%', dur: '24s', delay: '4.2s', size: '145px', drift: '-30px', opacity: 0.42 },
  { id: 14, left: '92%', dur: '21s', delay: '0.5s', size: '115px', drift: '70px',  opacity: 0.5  },
  { id: 15, left: '44%', dur: '22s', delay: '7.2s', size: '165px', drift: '-55px', opacity: 0.36 },
];

export default function SmokeBackground() {
  return (
    <div
      className="smoke-bg"
      aria-hidden="true"
      style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}
    >
      <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.18 }}>
        <defs>
          <filter id="smoke-filter" x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence type="fractalNoise" baseFrequency="0.012 0.03" numOctaves="4" seed="3" result="turbulence">
              <animate attributeName="baseFrequency" values="0.012 0.03;0.015 0.025;0.010 0.035;0.012 0.03" dur="18s" repeatCount="indefinite" />
            </feTurbulence>
            <feDisplacementMap in="SourceGraphic" in2="turbulence" scale="40" xChannelSelector="R" yChannelSelector="G" result="displaced" />
            <feGaussianBlur in="displaced" stdDeviation="6" result="blurred" />
            <feComponentTransfer in="blurred" result="contrasted">
              <feFuncA type="linear" slope="2.5" intercept="-0.4" />
            </feComponentTransfer>
          </filter>
        </defs>
      </svg>
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