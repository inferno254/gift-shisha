'use client';

import { useEffect, useState } from 'react';

interface SmokeProps {
  color?: string;
  opacity?: number;
  count?: number;
}

export default function SmokeBackground({ color = '#f59e0b', opacity = 0.06, count = 5 }: SmokeProps) {
  const [bubbles, setBubbles] = useState<{ id: number; x: number; y: number; size: number; duration: number; delay: number }[]>([]);

  useEffect(() => {
    const items = Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 40 + Math.random() * 120,
      duration: 15 + Math.random() * 25,
      delay: Math.random() * 20,
    }));
    setBubbles(items);
  }, [count]);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
        zIndex: 0,
      }}
      aria-hidden="true"
    >
      {bubbles.map((b) => (
        <div
          key={b.id}
          style={{
            position: 'absolute',
            left: `${b.x}%`,
            top: `${b.y}%`,
            width: b.size,
            height: b.size,
            background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
            opacity,
            borderRadius: '50%',
            filter: 'blur(40px)',
            animation: `smoke-rise ${b.duration}s ease-in-out ${b.delay}s infinite`,
          }}
        />
      ))}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes smoke-rise {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(30px, -40px) scale(1.1); }
          50% { transform: translate(-20px, -80px) scale(0.9); }
          75% { transform: translate(15px, -120px) scale(1.15); }
        }
      ` }} />
    </div>
  );
}