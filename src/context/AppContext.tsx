'use client';

import { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useCartContext } from '@/context/CartContext';

type Page = 'home' | 'shop' | 'checkout' | 'tracking' | 'profile';

interface AppContextType {
  page: Page;
  cartCount: number;
  location: { name: string; detail: string; fee: number };
  setLocation: (loc: { name: string; detail: string; fee: number }) => void;
  go: (page: Page | string) => void;
  selectedDeliveryFee: number;
  deliveryZoneName: string;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const page = (() => {
    if (pathname.startsWith('/shop')) return 'shop';
    if (pathname.startsWith('/checkout')) return 'checkout';
    if (pathname.startsWith('/tracking')) return 'tracking';
    if (pathname.startsWith('/profile')) return 'profile';
    return 'home';
  })();
  const { cartCount } = useCartContext();

  const [location, setLocation] = useState<{ name: string; detail: string; fee: number }>({
    name: 'Nairobi CBD',
    detail: 'Gift Shisha, Central Business District, Nairobi',
    fee: 150,
  });

  const go = useCallback(
    (p: Page | string) => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      if (typeof p === 'string') {
        router.push(p);
      } else if (p === 'home') {
        router.push('/');
      } else {
        router.push(`/${p}`);
      }
    },
    [router]
  );

  const selectedDeliveryFee = location.fee;
  const deliveryZoneName = location.name;

  return (
    <AppContext.Provider
      value={{
        page,
        cartCount,
        location,
        setLocation,
        go,
        selectedDeliveryFee,
        deliveryZoneName,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppContext must be used within AppProvider');
  return context;
}
