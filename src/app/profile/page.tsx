'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useAppContext } from '@/context/AppContext';
import { deliveryZones } from '@/data/deliveryZones';
import Button from '@/components/ui/Button';
import Icon from '@/components/ui/Icon';

export default function ProfilePage() {
  const { user, updateProfile, logout } = useAuth();
  const { setLocation } = useAppContext();

  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [location, setAreaLocation] = useState(user?.location || 'Nairobi CBD');
  const [locationDetail, setLocationDetail] = useState(user?.locationDetail || '');
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!user) {
    return (
      <div className="min-h-[calc(100vh-68px)] flex items-center justify-center bg-[var(--ink)] pb-20">
        <div className="page-shell" style={{ maxWidth: 460, width: '100%', textAlign: 'center', padding: '40px 20px' }}>
          <Icon name="user2" size={48} style={{ margin: '0 auto 16px', color: 'var(--ember)' }} />
          <h2 style={{ fontSize: 32, marginBottom: 10, color: 'var(--cream)' }}>Sign in to your account</h2>
          <p style={{ color: 'var(--muted)', marginBottom: 24, fontSize: 15 }}>
            Access saved addresses, order history, and fast M-Pesa checkout.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
            <Link href="/login" className="btn btn-amber">
              Sign In
            </Link>
            <Link href="/signup" className="btn btn-ghost">
              Create Account
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSaved(false);
    setLoading(true);

    try {
      const res = await updateProfile({
        name,
        phone,
        location,
        locationDetail,
      });

      if (res.error) {
        setError(res.error);
      } else {
        const zone = deliveryZones.find((z) => z.name.toLowerCase() === location.toLowerCase());
        if (zone) {
          setLocation({
            name: zone.name,
            detail: locationDetail || zone.detail,
            fee: zone.fee,
          });
        }
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-68px)] bg-[var(--ink)] py-10">
      <div className="page-shell" style={{ maxWidth: 640 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
          <div>
            <span className="kicker">Account settings</span>
            <h1 style={{ fontSize: 36, margin: '4px 0 0', color: 'var(--cream)' }}>My Profile</h1>
          </div>
          <button
            onClick={logout}
            className="btn btn-ghost"
            style={{ fontSize: 13, minHeight: 40, padding: '0 16px' }}
          >
            <Icon name="logout" size={16} /> Sign out
          </button>
        </div>

        {saved && (
          <div style={{ background: 'rgba(34,197,94,.12)', border: '1px solid rgba(34,197,94,.35)', color: '#86efac', padding: 12, borderRadius: 12, fontSize: 14, marginBottom: 18, fontWeight: 700 }}>
            Profile details updated successfully!
          </div>
        )}

        {error && (
          <div style={{ background: 'rgba(239,68,68,.12)', border: '1px solid rgba(239,68,68,.35)', color: '#fca5a5', padding: 12, borderRadius: 12, fontSize: 13, marginBottom: 18, fontWeight: 700 }}>
            {error}
          </div>
        )}

        <div style={{ background: 'var(--smoke)', border: '1px solid var(--line)', borderRadius: 24, padding: 30 }}>
          <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label style={{ fontSize: '13px', fontWeight: 800, color: 'var(--muted)' }}>Full Name</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your full name"
                className="w-full min-h-[48px] px-4 bg-[var(--ink)] border border-line rounded-xl text-cream focus:border-ember outline-none"
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label style={{ fontSize: '13px', fontWeight: 800, color: 'var(--muted)' }}>Email (read only)</label>
              <input
                value={user.email || ''}
                disabled
                className="w-full min-h-[48px] px-4 bg-[var(--ink)] border border-line rounded-xl text-muted opacity-70 cursor-not-allowed"
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label style={{ fontSize: '13px', fontWeight: 800, color: 'var(--muted)' }}>M-Pesa Phone Number</label>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g. 0712345678"
                className="w-full min-h-[48px] px-4 bg-[var(--ink)] border border-line rounded-xl text-cream focus:border-ember outline-none"
              />
              <span style={{ fontSize: 11, color: 'var(--muted)' }}>Used for M-Pesa STK push and delivery updates.</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label style={{ fontSize: '13px', fontWeight: 800, color: 'var(--muted)' }}>Default Delivery Zone</label>
              <select
                value={location}
                onChange={(e) => setAreaLocation(e.target.value)}
                className="w-full min-h-[48px] px-4 bg-[var(--ink)] border border-line rounded-xl text-cream focus:border-ember outline-none"
                style={{ colorScheme: 'dark' }}
              >
                {deliveryZones.map((z) => (
                  <option key={z.id} value={z.name} style={{ background: '#131313', color: '#f5f5f0' }}>
                    {z.name} (KES {z.fee})
                  </option>
                ))}
              </select>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label style={{ fontSize: '13px', fontWeight: 800, color: 'var(--muted)' }}>Specific Building / House / Landmark</label>
              <input
                value={locationDetail}
                onChange={(e) => setLocationDetail(e.target.value)}
                placeholder="e.g. Apartment 4B, Moon Valley Court, Rhapta Rd"
                className="w-full min-h-[48px] px-4 bg-[var(--ink)] border border-line rounded-xl text-cream focus:border-ember outline-none"
              />
            </div>

            <Button variant="amber" type="submit" disabled={loading} className="w-full mt-4" style={{ fontSize: 16 }}>
              {loading ? 'Saving...' : 'Save Profile Details'}
            </Button>
          </form>
        </div>

        <div style={{ marginTop: 24, textAlign: 'center' }}>
          <Link href="/shop" style={{ color: 'var(--ember-glow)', textDecoration: 'none', fontWeight: 800, fontSize: 14 }}>
            ← Back to Shisha Catalog
          </Link>
        </div>
      </div>
    </div>
  );
}
