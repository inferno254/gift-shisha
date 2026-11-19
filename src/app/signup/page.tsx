'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
import Button from '@/components/ui/Button';
import Icon from '@/components/ui/Icon';

export default function SignupPage() {
  const { signup } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await signup(name, email, password);
      if (res.error) setError(res.error);
    } catch (err: any) {
      setError(err.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-68px)] flex items-center justify-center bg-[var(--ink)] pb-20">
      <div className="page-shell" style={{ maxWidth: 420, width: '100%', padding: '30px 20px' }}>
        <div style={{ textAlign: 'center', marginBottom: 30 }}>
          <div className="logo" style={{ width: '72px', height: '52px', margin: '0 auto 12px' }}>
            <Image src="/gs5.jpg" alt="Gift Shisha" width={72} height={52} />
          </div>
          <h2 style={{ color: '#f5f5f0', fontSize: 34, marginBottom: 6, letterSpacing: '-.03em' }}>Create account</h2>
          <p style={{ color: '#a3a3a2', fontSize: 14 }}>Join Gift Shisha and start ordering</p>
        </div>
        {error && <div style={{ background: 'rgba(239,68,68,.12)', border: '1px solid rgba(239,68,68,.35)', color: '#fca5a5', padding: 12, borderRadius: 12, fontSize: 13, marginBottom: 18, fontWeight: 700 }}>{error}</div>}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label style={{ fontSize: '13px', fontWeight: 800, color: '#a3a3a2' }}>Full name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Kamau"
              className="w-full min-h-[48px] px-4 bg-[var(--ink)] border border-line rounded-xl text-cream focus:border-ember outline-none"
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label style={{ fontSize: '13px', fontWeight: 800, color: '#a3a3a2' }}>Email</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="you@example.com"
              className="w-full min-h-[48px] px-4 bg-[var(--ink)] border border-line rounded-xl text-cream focus:border-ember outline-none"
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label style={{ fontSize: '13px', fontWeight: 800, color: '#a3a3a2' }}>Password</label>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="••••••••"
              className="w-full min-h-[48px] px-4 bg-[var(--ink)] border border-line rounded-xl text-cream focus:border-ember outline-none"
            />
          </div>
          <Button variant="amber" type="submit" disabled={loading} className="w-full" style={{ fontSize: 16 }}>
            {loading ? 'Creating account...' : 'Create account'}
          </Button>
        </form>
        <p style={{ marginTop: 22, textAlign: 'center', color: '#a3a3a2', fontSize: 14 }}>
          Already have an account?{' '}
          <Link href="/login" style={{ color: '#f59e0b', fontWeight: 800, textDecoration: 'none' }}>Sign in</Link>
        </p>
      </div>
    </div>
  );
}
