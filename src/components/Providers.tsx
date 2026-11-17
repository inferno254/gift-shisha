// src/components/Providers.tsx
"use client";

import { ThemeProvider } from '@/context/ThemeContext';
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import { AppProvider } from '@/context/AppContext';
import { ReactNode } from 'react';

type ProvidersProps = {
  children: ReactNode;
};

export default function Providers({ children }: ProvidersProps) {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          <AppProvider>
            {children}
          </AppProvider>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
