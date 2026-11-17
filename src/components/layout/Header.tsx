'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCartContext } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import Image from 'next/image';
import Icon from '@/components/ui/Icon';
import Button from '@/components/ui/Button';

const LOGO = '/gs2.jpg';

export default function Header() {
  const pathname = usePathname();
  const { items, cartCount } = useCartContext();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/shop', label: 'Shop' },
  ];

  const isActive = (href: string) => pathname === href || (href !== '/' && pathname.startsWith(href));

  return (
    <header className="header">
      <div className="brand-button" onClick={() => { if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
        <Link href="/">
          <div className="logo">
            <Image src={LOGO} alt="Gift Shisha logo" width={100} height={96} priority />
          </div>
        </Link>
      </div>

      <nav className="desktop-nav">
        {navLinks.map((link) => (
          <a key={link.href} href={link.href} className={`desktop-nav-link ${isActive(link.href) ? 'active' : ''}`}>
            {link.label}
          </a>
        ))}
        <a href="/shop" className="desktop-nav-link">Shop</a>
        {user ? (
          <div className="nav-profile-button">
            <div className="profile-avatar-mini">{user.name.charAt(0).toUpperCase()}</div>
            <span className="profile-name">{user.name}</span>
            <button className="logout-button" onClick={logout}>
              <Icon name="logout" size={16} />
            </button>
          </div>
        ) : (
          <Link href="/login" className="login-button">Login</Link>
        )}
        <button className="theme-toggle" onClick={toggleTheme} title="Toggle theme" aria-label="Toggle theme">
          {theme === 'dark' ? <Icon name="sun" size={18} /> : <Icon name="moon" size={18} />}
        </button>
        <div className="cart-button" title={`Cart (${cartCount})`} onClick={() => { if (typeof window !== 'undefined') window.location.href = '/cart'; }}>
          <Icon name="cart" size={20} />
          {cartCount > 0 && <span>{cartCount}</span>}
        </div>
      </nav>
    </header>
  );
}
