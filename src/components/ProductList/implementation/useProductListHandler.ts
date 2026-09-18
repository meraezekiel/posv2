import { useRouter } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';

import { usePosStore } from '@/store/pos-store';

export function useProductListHandler() {
  const router = useRouter();
  const { products } = usePosStore();
  const [query, setQuery] = useState('');

  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return products;
    return products.filter(
      (p) => p.name.toLowerCase().includes(q) || (p.barcode || '').includes(q),
    );
  }, [products, query]);

  return {
    query,
    setQuery,
    list,
    countLabel: `${products.length} items`,
    addProduct: useCallback(() => router.push('/products/form'), [router]),
  };
}
