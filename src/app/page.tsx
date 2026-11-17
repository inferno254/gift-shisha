'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAppContext } from '@/context/AppContext';
import { useCartContext } from '@/context/CartContext';
import { useProducts } from '@/hooks/useProducts';
import { shishaCategories, featuredProducts, shishaProducts } from '@/data/products';
import { formatKES } from '@/lib/utils';
import Icon from '@/components/ui/Icon';
import Button from '@/components/ui/Button';

const HERO_PHOTOS = [
  '/gs2.jpg',
  'https://images.unsplash.com/photo-UVtEndlShxA?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=85&w=1400',
  'https://images.unsplash.com/photo-OUGqm1DjYIc?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=85&w=1400',
];

export default function HomePage() {
  const { go } = useAppContext();
  const { addItem, cartCount } = useCartContext();
  const { products, query, setQuery, category, setCategory } = useProducts();
  const [active, setActive] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setActive((a) => (a + 1) % HERO_PHOTOS.length), 4000);
    return () => clearInterval(t);
  }, []);

  return (
    <main className="relative font-sans overflow-x-hidden">
      <section className="hero" style={{ background: active === 0 ? 'radial-gradient(1200px 600px at 80% -10%, rgba(217,119,6,.18), transparent 60%), var(--ink)' : 'var(--ink)' }}>
        <div className="hero-copy">
          <div className="eyebrow"><span className="eyebrow-chip">Gift Shisha · Nairobi</span></div>
          <h1>Premium <em>Shisha</em>, Delivered.</h1>
          <p>Authentic hookahs, rich shisha flavours, coconut charcoal and accessories. Delivered fast across Nairobi, Mombasa, Kisumu, Nakuru and Eldoret. Pay with M-Pesa.</p>
          <div className="hero-actions">
            <Button variant="amber" onClick={() => go('/shop')}>
              Browse Shisha <Icon name="chevronRight" size={16} />
            </Button>
            <Link href="/shop?category=flavours" className="btn btn-ghost">
              Explore Flavours
            </Link>
          </div>
          <div className="hero-note">
            <Icon name="bike" size={14} /> <span>Free delivery on orders over KES 3,000</span>
          </div>
          <div className="slide-dots">
            {HERO_PHOTOS.map((_, i) => (
              <button key={i} className={i === active ? 'active' : ''} aria-label={`Slide ${i + 1}`} />
            ))}
          </div>
        </div>
        <div className="hero-visual">
          <div className="delivery-bag">
            <div className="logo">
              <Image src="/gs2.jpg" alt="Gift Shisha" width={110} height={130} />
            </div>
            <div className="bag-handle" />
            <strong>Gift Shisha</strong>
          </div>
          <div className="hero-sticker"><b>KES</b><br/><span>Nairobi</span></div>
          <div className="float-item item-burger"><Image src={HERO_PHOTOS[1]} alt="" width={100} height={100} className="float-photo" /></div>
          <div className="float-item item-tomato"><Image src={HERO_PHOTOS[2]} alt="" width={100} height={100} className="float-photo" /></div>
          <div className="float-item item-drink"><Image src={HERO_PHOTOS[0]} alt="" width={100} height={100} className="float-photo" /></div>
          <div className="price-tag t1">{formatKES(4500)}</div>
          <div className="price-tag t2">{formatKES(1300)}</div>
          <div className="phone-card">
            <div className="logo">
              <Image src="/gs2.jpg" alt="Gift Shisha" width={75} height={88} />
            </div>
            <div className="mini-check"><Icon name="check" size={34} /></div>
            <b>Order in 60 seconds</b>
            <small>M-Pesa checkout • tracked delivery</small>
            <div className="phone-notch" />
          </div>
          <div className="doodle d1">💨</div>
          <div className="doodle d2">🔥</div>
        </div>
      </section>

      <div className="search-float">
        <Icon name="search" size={18} />
        <input
          placeholder="Hookah, flavours, charcoal…"
          aria-label="Search shisha products"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <Button onClick={() => { setCategory('all'); go('/shop'); }}>Find now</Button>
      </div>

      <section className="section compact-section">
        <div className="section-head">
          <div>
            <span className="kicker">Shop by category</span>
            <h2>What are you in the mood for?</h2>
          </div>
        </div>
        <div className="category-scroll">
          {shishaCategories.map((cat) => (
            <Link key={cat.slug} href={`/shop?category=${cat.slug}`} passHref legacyBehavior>
              <div className="category-chip">
                <div className="category-photo"><Image src={cat.image} alt={cat.name} width={64} height={64} /></div>
                {cat.name}
                <small>{cat.slug === 'pipes' ? 'From KES 4,200' : cat.slug === 'flavours' ? 'From KES 450' : cat.slug === 'charcoal' ? 'From KES 200' : cat.slug === 'accessories' ? 'From KES 200' : 'From KES 6,200'}</small>
                <div className="category-arrow"><Icon name="chevronRight" size={14} /></div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {featuredProducts.length > 0 && (
        <section className="section">
          <div className="section-head">
            <div>
              <span className="kicker">Customer favourites</span>
              <h2>Featured shisha essentials</h2>
            </div>
          </div>
          <div className="product-grid">
            {featuredProducts.map((item) => (
              <ProductCard key={item.id} item={item} onAdd={() => addItem(item)} />
            ))}
          </div>
        </section>
      )}

      <section className="section" style={{ background: '#131313' }}>
        <div className="section-head">
          <div>
            <span className="kicker">Why Gift Shisha</span>
            <h2>Why Kenyans order from us</h2>
          </div>
        </div>
        <div className="deals">
          <div className="ticket">
            <span>Genuine gear</span>
            <b>Khalil Mamoon &amp; Amy Deluxe</b>
            <p style={{ margin: 0, color: '#6b6b67', fontSize: '13px', fontWeight: 700 }}>Authentic Egyptian and German hookahs, in stock in Nairobi.</p>
          </div>
          <div className="ticket alt">
            <span>Fast delivery</span>
            <b>Same-day Nairobi</b>
            <p style={{ margin: 0, color: '#6b6b67', fontSize: '13px', fontWeight: 700 }}>Delivered to Westlands, Kilimani, Karen, Lavington and more.</p>
          </div>
          <div className="ticket">
            <span>Pay with M-Pesa</span>
            <b>STK Push checkout</b>
            <p style={{ margin: 0, color: '#6b6b67', fontSize: '13px', fontWeight: 700 }}>Secure M-Pesa payments straight from your phone.</p>
          </div>
        </div>
      </section>
    </main>
  );
}

function ProductCard({ item, onAdd }: { item: typeof shishaProducts[number]; onAdd: () => void }) {
  return (
    <article className="product-card" onClick={onAdd} role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && onAdd()}>
      <div className="product-image">
        <Image src={item.image} alt={item.name} width={400} height={300} className="cover" style={{ display: 'block' }} />
        {item.featured && <span className="card-badge">Featured</span>}
        <button className="heart" aria-label="Like"><Icon name="heart" size={18} /></button>
      </div>
      <div className="product-info">
        <h3>{item.name}</h3>
        <p>{item.description}</p>
        <div className="product-row">
          <span className="product-price">{formatKES(item.price)}</span>
          <button className="add-button" onClick={(e) => { e.stopPropagation(); onAdd(); }} aria-label={`Add ${item.name} to cart`}>
            <Icon name="plus" size={16} />
          </button>
        </div>
      </div>
    </article>
  );
}
