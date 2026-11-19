'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useAppContext } from '@/context/AppContext';
import { useCartContext } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { formatKES } from '@/lib/utils';
import Button from '@/components/ui/Button';
import Icon from '@/components/ui/Icon';

const FREE_THRESHOLD = 3000;

export default function CartPage() {
  const { items, subtotal, updateQuantity, removeItem, clearCart } = useCartContext();
  const { selectedDeliveryFee, deliveryZoneName, go } = useAppContext();
  const { user } = useAuth();

  const deliveryFee = items.length > 0 ? (subtotal >= FREE_THRESHOLD ? 0 : selectedDeliveryFee) : 0;
  const total = subtotal + deliveryFee;

  return (
    <div className="min-h-[calc(100vh-68px)] flex flex-col bg-[var(--ink)]">
      <Link href="/shop" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, margin: 30, color: '#f59e0b', fontWeight: 800, fontSize: 14, textDecoration: 'none' }}>
        <Icon name="chevron" size={16} /> Continue shopping
      </Link>
      <div className="page-shell">
        <div className="section-head">
          <div>
            <span className="kicker">Your Cart</span>
            <h2>Review your order</h2>
          </div>
        </div>
        {items.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 20px', color: '#a3a3a2' }}>
            <Icon name="cart" size={64} style={{ display: 'block', margin: '0 auto 18px', opacity: 0.3 }} />
            <h2 style={{ color: '#f5f5f0', fontSize: 32, marginBottom: 10 }}>Your cart is empty</h2>
            <p style={{ marginBottom: 22 }}>Add some shisha essentials to get started.</p>
            <Link href="/shop" className="btn btn-amber" style={{ display: 'inline-block' }}>
              Browse Shisha
            </Link>
          </div>
        ) : (
          <div className="menu-layout">
            <div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 22 }}>
                {items.map((item) => (
                  <CartItemRow key={item.product.id} item={item} updateQuantity={updateQuantity} removeItem={removeItem} />
                ))}
              </div>
              <div style={{ borderTop: '1px solid rgba(255,255,255,.08)', paddingTop: 14, display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#a3a3a2' }}><span>Subtotal</span><span>{formatKES(subtotal)}</span></div>
                {deliveryFee > 0 ? (
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#a3a3a2' }}><span>Delivery · {deliveryZoneName}</span><span>{formatKES(deliveryFee)}</span></div>
                ) : (
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#f59e0b', fontWeight: 800 }}><span>Delivery</span><span>Free</span></div>
                )}
                {subtotal > 0 && subtotal < FREE_THRESHOLD && (
                  <div style={{ fontSize: '11px', color: '#f59e0b', fontWeight: 800, marginTop: 2 }}>Add {formatKES(FREE_THRESHOLD - subtotal)} more for free delivery</div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: '19px', fontWeight: 800, color: '#f59e0b', marginTop: 8 }}><span>Total</span><span>{formatKES(total)}</span></div>
              </div>
            </div>
            <aside className="desktop-cart">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <Button variant="amber" onClick={() => go('/checkout')} className="w-full">
                  Proceed to Checkout <Icon name="chevronRight" size={16} />
                </Button>
                {user ? (
                  <Button variant="ghost" onClick={() => go('/profile')} className="w-full mt-2">
                    Manage Delivery Profile
                  </Button>
                ) : (
                  <Button variant="ghost" onClick={() => go('/login')} className="w-full mt-2">
                    Login to Save Address
                  </Button>
                )}
                <button onClick={clearCart} style={{ width: '100%', minHeight: 40, marginTop: 8, background: 'transparent', color: '#a3a3a2', border: '1px solid rgba(255,255,255,.12)', borderRadius: 99, fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>Clear cart</button>
              </div>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
}

function CartItemRow({ item, updateQuantity, removeItem }: { item: any; updateQuantity: any; removeItem: any }) {
  const lineTotal = item.product.price * item.quantity;
  return (
    <div style={{ border: '1px solid rgba(255,255,255,.08)', borderRadius: 18, overflow: 'hidden', background: 'var(--smoke)', display: 'flex', gap: 14, alignItems: 'center', padding: 14, flexWrap: 'wrap' }}>
      <Image src={item.product.image} alt={item.product.name} width={80} height={80} style={{ display: 'block', borderRadius: 10, objectFit: 'cover', flex: '0 0 80px' }} />
      <div style={{ flex: 1, minWidth: 160 }}>
        <div style={{ fontSize: '15px', fontWeight: 800, color: '#f5f5f0' }}>{item.product.name}</div>
        <div style={{ fontSize: '13px', color: '#a3a3a2', marginTop: 3 }}>{formatKES(item.product.price)} each</div>
      </div>
      <div className="stepper" style={{ color: '#f5f5f0', background: 'rgba(255,255,255,.06)' }}>
        <button onClick={() => updateQuantity(item.product, Math.max(1, item.quantity - 1))} aria-label="Decrease quantity"><Icon name="minus" size={16} /></button>
        <span style={{ color: '#f5f5f0' }}>{item.quantity}</span>
        <button onClick={() => updateQuantity(item.product, item.quantity + 1)} aria-label="Increase quantity"><Icon name="plus" size={16} /></button>
      </div>
      <div style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 800, color: '#f59e0b', minWidth: 80, textAlign: 'right', fontSize: 16 }}>{formatKES(lineTotal)}</div>
      <button onClick={() => removeItem(item.product)} style={{ padding: 6, color: '#a3a3a2', background: 'transparent', border: 0, cursor: 'pointer' }} title="Remove item" aria-label={`Remove ${item.product.name}`}><Icon name="trash" size={18} /></button>
    </div>
  );
}
