'use client';

import { useState, useCallback } from 'react';
import { shishaProducts, ShishaProduct } from '@/data/products';

export function useProducts() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<string>('all');

  const products = useCallback(() => {
    return shishaProducts.filter((p) => {
      const matchesQuery =
        query === '' ||
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.description.toLowerCase().includes(query.toLowerCase());
      const matchesCat = category === 'all' || p.category === category;
      return matchesQuery && matchesCat;
    });
  }, [query, category]);

  return { products: products(), query, setQuery, category, setCategory, all: shishaProducts };
}

export function useProduct(id: string) {
  return shishaProducts.find((p) => p.id === id);
}
