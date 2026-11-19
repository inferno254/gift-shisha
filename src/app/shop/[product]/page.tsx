'use client';

import React, { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useAppContext } from '@/context/AppContext';
import { useCartContext } from '@/context/CartContext';
import { getProduct } from '@/data/products';
import { formatKES } from '@/lib/utils';
import Icon from '@/components/ui/Icon';
import Button from '@/components/ui/Button';

export default function ProductPage() {
  const params = useParams();
  const router = useRouter();
  const { go } = useAppContext();
  const { addItem } = useCartContext();

  const id = typeof params.product === 'string' ? params.product : '';
  const product = getProduct(id);

  useEffect(() => {
    if (!product) router.push('/shop');
  }, [product, router]);

  if (!product) return null;

  const [qty, setQty] = React.useState(1);

  const inStock = product.stock > 0 && product.is_available;

  const handleAdd = () => {
    if (!inStock || qty < 1) return;
    addItem(product, qty);
    router.push('/cart');
  };

  return (
    <div className="min-h-[calc(100vh-68px)] flex flex-col bg-[var(--ink)]">
      <Link href="/shop" className="back-float" style={{ position: 'fixed', left: 24, top: 90, zIndex: 20 }}>
        <Icon name="chevron" size={24} />
      </Link>
      <div className="page-shell">
        <div className="shop-cover" style={{ height: 'auto', borderRadius: 30 }}>
          <Image src={product.image} alt={product.name} width={900} height={900} style={{ display: 'block', borderRadius: 24, objectFit: 'cover' }} />
        </div>
        <div className="shop-title">
          <div>
            <span className="kicker">{product.category.replace(/^\w/, (c) => c.toUpperCase())}</span>
            <h1>{product.name}</h1>
            <p style={{ color: '#a3a3a2', fontSize: '14px', marginTop: 6 }}>{product.description}</p>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginTop: 10 }}>
              <span className="rating"><Icon name="star" size={12} style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: 4 } as any} /> 4.9 ({product.stock} in stock)</span>
              {product.stock <= 5 && <span style={{ fontSize: '12px', fontWeight: 800, color: '#f59e0b' }}>Limited stock</span>}
            </div>
          </div>
          <div className="shop-stats">
            <span>{formatKES(product.price)}</span>
            <span><Icon name="bike" size={14} style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: 6 } as any} /><span style={{ marginLeft: 4 }}>Tracked delivery</span></span>
            <span><Icon name="clock" size={14} style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: 6 } as any} /><span style={{ marginLeft: 4 }}>Same-day Nairobi</span></span>
          </div>
        </div>

        <div className="menu-layout">
          <div>
            <div style={{ marginBottom: 20 }}>
              <p style={{ margin: 0, color: '#a3a3a2', fontSize: '13px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.12em' }}>Quantity</p>
              <div className="stepper">
                <button onClick={() => setQty((q) => Math.max(1, q - 1))}><Icon name="minus" size={16} /></button>
                <span>{qty}</span>
                <button onClick={() => setQty((q) => Math.min(product.stock, q + 1))} disabled={!inStock || qty >= product.stock}><Icon name="plus" size={16} /></button>
              </div>
            </div>
            <div style={{ marginBottom: 22 }}>
              <p style={{ margin: 0, color: '#a3a3a2', fontSize: '13px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.12em', marginBottom: 8 }}>{formatKES(product.price)}</p>
              <Button variant="amber" onClick={handleAdd} disabled={!inStock} className="w-full">
                {inStock ? 'Add to Cart' : 'Out of Stock'}
              </Button>
              <p style={{ marginTop: 8, fontSize: '12px', color: '#6b6b67' }}>Secure M-Pesa checkout at payment</p>
            </div>
            <div style={{ marginTop: 26, paddingTop: 22, borderTop: '1px solid rgba(255,255,255,.08)' }}>
              <p style={{ margin: 0, color: '#a3a3a2', fontSize: '13px', fontWeight: 800, marginBottom: 10, textTransform: 'uppercase', letterSpacing: '.12em' }}>You may also like</p>
              <div className="product-grid" style={{ gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
                {getProduct('p1') && <MiniCard item={getProduct('p1')!} />}
                {getProduct('f1') && <MiniCard item={getProduct('f1')!} />}
              </div>
            </div>
          </div>
          <aside className="desktop-cart">
            <CartSummary product={product} addItem={addItem} />
          </aside>
        </div>
      </div>
    </div>
  );
}

function MiniCard({ item }: { item: (typeof import('@/data/products').shishaProducts)[number] }) {
  const { addItem } = useCartContext();
  return (
    <article className="product-card" style={{ minHeight: 'auto', padding: 10 }}>
      <Link href={`/shop/${item.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
        <div className="product-image" style={{ height: 130, borderRadius: 14 }}>
          <Image src={item.image} alt={item.name} width={200} height={200} style={{ display: 'block', borderRadius: 14 }} />
        </div>
      </Link>
      <div className="product-info" style={{ padding: '8px 0 0' }}>
        <Link href={`/shop/${item.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
          <h3 style={{ fontSize: '13px' }}>{item.name}</h3>
        </Link>
        <div className="product-row" style={{ paddingTop: 6, borderTop: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span className="product-price" style={{ fontSize: '14px' }}>{formatKES(item.price)}</span>
          <button
            className="add-button"
            onClick={(e) => {
              e.stopPropagation();
              addItem(item, 1);
            }}
            aria-label={`Add ${item.name} to cart`}
            style={{ width: 28, height: 28 }}
          >
            <Icon name="plus" size={14} />
          </button>
        </div>
      </div>
    </article>
  );
}

function CartSummary({ product, addItem }: { product: any; addItem: any }) {
  const { items, subtotal, clearCart } = useCartContext();
  const { selectedDeliveryFee, deliveryZoneName, go } = useAppContext();
  const deliveryFee = items.length > 0 ? (subtotal >= 3000 ? 0 : selectedDeliveryFee) : 0;
  const total = subtotal + deliveryFee;
  const freeThreshold = 3000;

  const already = items.find((i) => i.product.id === product.id);
  const canAdd = product.stock > 0 && product.is_available;

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
          <div style={{ borderTop: '1px solid rgba(255,255,255,.08)', paddingTop: 10, display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 200, overflowY: 'auto' }}>
            {items.map((item) => (
              <div key={item.product.id} style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                <img src={item.product.image} alt={item.product.name} style={{ width: 44, height: 44, borderRadius: 8, objectFit: 'cover', background: '#0a0a0a' }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '13px', fontWeight: 800, color: '#f5f5f0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.product.name}</div>
                  <div style={{ fontSize: '11px', color: '#a3a3a2', marginTop: 2 }}>{formatKES(item.product.price)} x {item.quantity}</div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ borderTop: '1px solid rgba(255,255,255,.08)', marginTop: 10, paddingTop: 10, display: 'flex', flexDirection: 'column', gap: 6 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#a3a3a2' }}><span>Subtotal</span><span>{formatKES(subtotal)}</span></div>
            {deliveryFee > 0 && <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#a3a3a2' }}><span>Delivery {deliveryZoneName}</span><span>{formatKES(deliveryFee)}</span></div>}
            {subtotal > 0 && subtotal < freeThreshold && <div style={{ fontSize: '11px', color: '#f59e0b', fontWeight: 800, marginTop: 2 }}>Add {formatKES(freeThreshold - subtotal)} more for free delivery</div>}
            <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: '18px', fontWeight: 800, color: '#f59e0b', marginTop: 6 }}><span>Total</span><span>{formatKES(total)}</span></div>
          </div>
          <button onClick={() => go('/checkout')} disabled={items.length === 0} style={{ width: '100%', minHeight: 48, background: items.length === 0 ? 'rgba(217,119,6,.25)' : 'var(--ember)', color: items.length === 0 ? '#a3a3a2' : '#fff', border: 0, borderRadius: 99, fontWeight: 800, fontSize: 15, cursor: items.length === 0 ? 'not-allowed' : 'pointer', marginTop: 10 }}>
            {items.length === 0 ? 'Start shopping' : 'Proceed to Checkout'}
          </button>
          <button onClick={clearCart} style={{ width: '100%', minHeight: 40, marginTop: 8, background: 'transparent', color: '#a3a3a2', border: '1px solid rgba(255,255,255,.12)', borderRadius: 99, fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>Clear cart</button>
        </>
      )}
      <div style={{ marginTop: 14, paddingTop: 14, borderTop: '1px solid rgba(255,255,255,.08)' }}>
        <p style={{ marginBottom: 8, color: '#a3a3a2', fontSize: '13px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.12em' }}>{product.name}</p>
        <p style={{ marginBottom: 10, color: '#a3a3a2', fontSize: '13px' }}>{formatKES(product.price)}</p>
        <Button variant="amber" onClick={() => { addItem(product, 1); go('/checkout'); }} disabled={!canAdd} className="w-full">
          {canAdd ? 'Buy Now' : 'Out of Stock'}
        </Button>
      </div>
    </div>
  );
}
