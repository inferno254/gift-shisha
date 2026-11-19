'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCartContext } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import Image from 'next/image';
import Icon from '@/components/ui/Icon';

const LOGO = '/gs2.jpg';

export default function Header() {
  const pathname = usePathname();
  const { cartCount } = useCartContext();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/shop', label: 'Shop' },
    { href: '/tracking', label: 'Tracking' },
  ];

  const isActive = (href: string) => pathname === href || (href !== '/' && pathname.startsWith(href));

  return (
    <header className="header">
      <div className="brand-button">
        <Link href="/" className="flex items-center gap-2" style={{ textDecoration: 'none' }}>
          <div className="logo">
            <Image src={LOGO} alt="Gift Shisha logo" width={100} height={96} priority />
          </div>
        </Link>
      </div>

      <nav className="desktop-nav">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`desktop-nav-link ${isActive(link.href) ? 'active' : ''}`}
          >
            {link.label}
          </Link>
        ))}
        {user ? (
          <div className="nav-profile-button">
            <Link href="/profile" style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'inherit', textDecoration: 'none' }}>
              <div className="profile-avatar-mini">{user.name ? user.name.charAt(0).toUpperCase() : 'U'}</div>
              <span className="profile-name">{user.name || 'Account'}</span>
            </Link>
            <button className="logout-button" onClick={logout} title="Sign out" aria-label="Sign out">
              <Icon name="logout" size={16} />
            </button>
          </div>
        ) : (
          <Link href="/login" className="login-button">Login</Link>
        )}
        <button className="theme-toggle" onClick={toggleTheme} title="Toggle theme" aria-label="Toggle theme">
          {theme === 'dark' ? <Icon name="sun" size={18} /> : <Icon name="moon" size={18} />}
        </button>
        <Link href="/cart" className="cart-button" title={`Cart (${cartCount})`} aria-label={`Cart with ${cartCount} items`}>
          <Icon name="cart" size={20} />
          {cartCount > 0 && <span>{cartCount}</span>}
        </Link>
      </nav>
    </header>
  );
}

