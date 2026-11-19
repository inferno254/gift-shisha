import Link from 'next/link';
import Icon from '@/components/ui/Icon';

export default function Footer() {
  return (
    <footer>
      <div className="footer-top">
        <h2>
          Gift <em>Shisha</em>
        </h2>
        <Link href="/shop" className="btn btn-amber">
          Shop Now <Icon name="chevronRight" size={16} />
        </Link>
      </div>

      <div className="footer-grid">
        <div>
          <p>
            Premium authentic hookahs, imported shisha flavours, coconut coals, and accessories delivered fast across Kenya.
          </p>
          <div style={{ display: 'flex', flexDirection: 'row', gap: 12, alignItems: 'center', marginTop: 8 }}>
            <span style={{ fontSize: 13, color: '#f59e0b', fontWeight: 800 }}>⚡ Same-day Nairobi Delivery</span>
          </div>
        </div>

        <div>
          <strong style={{ color: '#f5f5f0', fontSize: 15, marginBottom: 4 }}>Quick Links</strong>
          <Link href="/" style={{ color: 'var(--muted)', textDecoration: 'none', fontSize: 14 }}>Home</Link>
          <Link href="/shop" style={{ color: 'var(--muted)', textDecoration: 'none', fontSize: 14 }}>Shop Catalog</Link>
          <Link href="/cart" style={{ color: 'var(--muted)', textDecoration: 'none', fontSize: 14 }}>My Cart</Link>
          <Link href="/tracking" style={{ color: 'var(--muted)', textDecoration: 'none', fontSize: 14 }}>Track Delivery</Link>
        </div>

        <div>
          <strong style={{ color: '#f5f5f0', fontSize: 15, marginBottom: 4 }}>Categories</strong>
          <Link href="/shop?category=pipes" style={{ color: 'var(--muted)', textDecoration: 'none', fontSize: 14 }}>Hookah Pipes</Link>
          <Link href="/shop?category=flavours" style={{ color: 'var(--muted)', textDecoration: 'none', fontSize: 14 }}>Shisha Flavours</Link>
          <Link href="/shop?category=charcoal" style={{ color: 'var(--muted)', textDecoration: 'none', fontSize: 14 }}>Charcoal & Heat</Link>
          <Link href="/shop?category=accessories" style={{ color: 'var(--muted)', textDecoration: 'none', fontSize: 14 }}>Accessories</Link>
          <Link href="/shop?category=bundles" style={{ color: 'var(--muted)', textDecoration: 'none', fontSize: 14 }}>Starter Bundles</Link>
        </div>

        <div>
          <strong style={{ color: '#f5f5f0', fontSize: 15, marginBottom: 4 }}>Contact & Support</strong>
          <span style={{ color: 'var(--muted)', fontSize: 14 }}>📍 Nairobi CBD, Kenya</span>
          <span style={{ color: 'var(--muted)', fontSize: 14 }}>📞 0712 345 678</span>
          <span style={{ color: 'var(--muted)', fontSize: 14 }}>💬 WhatsApp Orders</span>
          <span style={{ color: 'var(--muted)', fontSize: 14 }}>💳 Pay with M-Pesa / Cash</span>
        </div>
      </div>

      <div className="footer-bottom">
        <span>&copy; {new Date().getFullYear()} Gift Shisha Kenya. All rights reserved.</span>
        <span>Must be 18+ to purchase. Enjoy responsibly.</span>
      </div>
    </footer>
  );
}
