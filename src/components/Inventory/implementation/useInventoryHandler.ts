import { useRouter } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';

import { usePosStore } from '@/store/pos-store';

const FILTERS = [
  { key: 'All', label: 'All' },
  { key: 'Low', label: 'Low stock' },
  { key: 'Out', label: 'Out of stock' },
];

export function useInventoryHandler() {
  const router = useRouter();
  const { products } = usePosStore();
  const [filter, setFilter] = useState('All');

  const tracked = useMemo(() => products.filter((p) => !p.quick), [products]);

  const list = useMemo(
    () =>
      products.filter((p) => {
        if (filter === 'Low') return !p.quick && p.stock <= p.low && p.stock > 0;
        if (filter === 'Out') return !p.quick && p.stock === 0;
        return true;
      }),
    [filter, products],
  );

  return {
    back: useCallback(() => router.back(), [router]),
    summary: `${tracked.filter((p) => p.stock <= p.low).length} low · ${
      tracked.filter((p) => p.stock === 0).length
    } out`,
    filters: FILTERS,
    filter,
    setFilter,
    list,
  };
}
