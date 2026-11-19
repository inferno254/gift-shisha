'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAppContext } from '@/context/AppContext';
import { useCartContext } from '@/context/CartContext';
import { useProducts } from '@/hooks/useProducts';
import { shishaCategories, shishaProducts } from '@/data/products';
import { formatKES } from '@/lib/utils';
import Icon from '@/components/ui/Icon';
import Button from '@/components/ui/Button';

const CAT_LABELS: Record<string, string> = {
  pipes: 'Hookah Pipes',
  flavours: 'Shisha Flavours',
  charcoal: 'Charcoal & Heat',
  accessories: 'Accessories',
  bundles: 'Bundles',
};

export default function ShopClient({ initialCategory }: { initialCategory?: string }) {
  const { go } = useAppContext();
  const { addItem } = useCartContext();
  const { products: allProducts, query, setQuery, category, setCategory, all } = useProducts();
  const router = useRouter();

  const [activeCat, setActiveCat] = useState<string>(initialCategory ?? 'all');
  const [viewGrid, setViewGrid] = useState(true);

  useEffect(() => {
    setCategory(initialCategory ?? 'all');
  }, [initialCategory, setCategory]);

  const handleCat = (slug: string) => {
    setActiveCat(slug);
    setCategory(slug === 'all' ? 'all' : slug);
    router.push(slug === 'all' ? '/shop' : `/shop?category=${slug}`);
  };

  const filtered = allProducts.filter((p) => {
    const matchesQuery = query === '' || p.name.toLowerCase().includes(query.toLowerCase()) || p.description.toLowerCase().includes(query.toLowerCase());
    const matchesCat = activeCat === 'all' || p.category === activeCat;
    return matchesQuery && matchesCat;
  });

  const catName = activeCat === 'all' ? 'All Products' : CAT_LABELS[activeCat] || activeCat;

  return (
    <div className="min-h-[calc(100vh-68px)] flex flex-col bg-[var(--ink)]">
      <div className="shop-cover">
        <Image src={shishaProducts.find((p) => p.category === activeCat)?.image || '/gs2.jpg'} alt={catName} width={1200} height={360} className="cover" style={{ objectPosition: 'center 30%', filter: 'brightness(.55) contrast(1.1)' }} />
        <button className="back-float" onClick={() => go('/')}>
          <Icon name="chevron" size={24} />
        </button>
      </div>
      <div className="page-shell">
        <div className="shop-title">
          <div>
            <span className="kicker">Browse</span>
            <h1>{catName}</h1>
            <p>{filtered.length} item{filtered.length !== 1 ? 's' : ''} available</p>
          </div>
          <div className="shop-stats">
            <span><Icon name="clock" size={14} style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: 6 } as any} /><span style={{ marginLeft: 4 }}>Same-day Nairobi</span></span>
            <span><Icon name="bike" size={14} style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: 6 } as any} /><span style={{ marginLeft: 4 }}>Tracked delivery</span></span>
          </div>
        </div>

        <div className="menu-tabs">
          <button onClick={() => handleCat('all')} className={activeCat === 'all' ? 'active' : ''}>All</button>
          {shishaCategories.map((c) => (
            <button key={c.slug} onClick={() => handleCat(c.slug)} className={activeCat === c.slug ? 'active' : ''}>
              {c.name}
            </button>
          ))}
        </div>

        <div className="menu-layout">
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
              <p style={{ margin: 0, color: '#a3a3a2', fontSize: '13px', fontWeight: 800 }}>{filtered.length} products</p>
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={() => setViewGrid(true)} className={`px-3 py-2 text-xs font-bold rounded border ${viewGrid ? 'border-ember bg-ember text-ink' : 'border-line text-muted'}`}>Grid</button>
                <button onClick={() => setViewGrid(false)} className={`px-3 py-2 text-xs font-bold rounded border ${!viewGrid ? 'border-ember bg-ember text-ink' : 'border-line text-muted'}`}>List</button>
              </div>
            </div>
            <div className={viewGrid ? 'shop-grid' : 'product-grid'}>
              {filtered.map((item) => (
                <ProductCard key={item.id} item={item} onAdd={() => addItem(item)} />
              ))}
              {filtered.length === 0 && (
                <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '60px 20px', color: '#a3a3a2' }}>
                  <Icon name="search" size={40} style={{ display: 'block', margin: '0 auto 12px', opacity: 0.4 }} />
                  <p style={{ margin: 0, fontWeight: 800 }}>No products match your search</p>
                </div>
              )}
            </div>
          </div>
          <aside className="desktop-cart">
            <CartSummary />
          </aside>
        </div>
      </div>
    </div>
  );
}

function ProductCard({ item, onAdd }: { item: typeof shishaProducts[number]; onAdd: () => void }) {
  return (
    <article className="product-card">
      <Link href={`/shop/${item.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
        <div className="product-image">
          <Image src={item.image} alt={item.name} width={400} height={300} style={{ display: 'block' }} />
          {item.featured && <span className="card-badge">Featured</span>}
        </div>
      </Link>
      <div className="product-info">
        <Link href={`/shop/${item.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
          <h3>{item.name}</h3>
        </Link>
        <p>{item.description}</p>
        <div className="product-row">
          <span className="product-price">{formatKES(item.price)}</span>
          <button className="add-button" onClick={() => onAdd()} aria-label={`Add ${item.name} to cart`}>
            <Icon name="plus" size={16} />
          </button>
        </div>
      </div>
    </article>
  );
}

function CartSummary() {
  const { items, subtotal, clearCart, addItem, updateQuantity } = useCartContext();
  const { selectedDeliveryFee, deliveryZoneName, go } = useAppContext();
  const deliveryFee = items.length > 0 ? (subtotal >= 3000 ? 0 : selectedDeliveryFee) : 0;
  const total = subtotal + deliveryFee;
  const freeThreshold = 3000;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 6 }}>
        <span style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: '20px', fontWeight: 800, color: '#f5f5f0' }}>Your Order</span>
        <span style={{ marginLeft: 6, fontSize: '12px', padding: '2px 8px', background: 'rgba(217,119,6,.2)', color: '#f59e0b', borderRadius: 6, fontWeight: 800 }}>{items.length} item{items.length !== 1 ? 's' : ''}</span>
      </div>
      {items.length === 0 ? (
        <div style={{ textAlign: 'center', color: '#a3a3a2', padding: '24px 0', fontSize: '14px' }}>Your cart is empty</div>
      ) : (
        <>
          <div style={{ borderTop: '1px solid rgba(255,255,255,.08)', paddingTop: 10, display: 'flex', flexDirection: 'column', gap: 8 }}>
            {items.map((item) => (
              <div key={item.product.id} style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                <img src={item.product.image} alt={item.product.name} style={{ width: 44, height: 44, borderRadius: 8, objectFit: 'cover', background: '#0a0a0a' }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '13px', fontWeight: 800, color: '#f5f5f0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.product.name}</div>
                  <div style={{ fontSize: '11px', color: '#a3a3a2', marginTop: 2 }}>{formatKES(item.product.price)} x {item.quantity}</div>
                </div>
                <button onClick={() => addItem(item.product)} style={{ padding: 4, color: '#a3a3a2', background: 'transparent', border: 0, cursor: 'pointer' }} title="Add one">
                  <Icon name="plus" size={14} />
                </button>
                <button onClick={() => updateQuantity(item.product, item.quantity - 1)} style={{ padding: 4, color: '#a3a3a2', background: 'transparent', border: 0, cursor: 'pointer' }} title="Remove">
                  <Icon name="trash" size={16} />
                </button>
              </div>
            ))}
          </div>
          <div style={{ borderTop: '1px solid rgba(255,255,255,.08)', marginTop: 10, paddingTop: 10, display: 'flex', flexDirection: 'column', gap: 6 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#a3a3a2' }}><span>Subtotal</span><span>{formatKES(subtotal)}</span></div>
            {deliveryFee > 0 ? (
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#a3a3a2' }}><span>Delivery · {deliveryZoneName}</span><span>{formatKES(deliveryFee)}</span></div>
            ) : null}
            {subtotal > 0 && subtotal < freeThreshold && (
              <div style={{ fontSize: '11px', color: '#f59e0b', fontWeight: 800, marginTop: 2 }}>Add {formatKES(freeThreshold - subtotal)} more for free delivery</div>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: '18px', fontWeight: 800, color: '#f59e0b', marginTop: 6 }}><span>Total</span><span>{formatKES(total)}</span></div>
          </div>
          <button onClick={() => go('/checkout')} disabled={items.length === 0} style={{ width: '100%', minHeight: 48, background: items.length === 0 ? 'rgba(217,119,6,.25)' : 'var(--ember)', color: items.length === 0 ? '#a3a3a2' : '#fff', border: 0, borderRadius: 99, fontWeight: 800, fontSize: 15, cursor: items.length === 0 ? 'not-allowed' : 'pointer', marginTop: 10 }}>
            {items.length === 0 ? 'Start shopping' : 'Proceed to Checkout'}
          </button>
          <button onClick={clearCart} style={{ width: '100%', minHeight: 40, marginTop: 8, background: 'transparent', color: '#a3a3a2', border: '1px solid rgba(255,255,255,.12)', borderRadius: 99, fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>Clear cart</button>
        </>
      )}
    </div>
  );
}
