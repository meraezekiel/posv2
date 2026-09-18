import { useMemo } from 'react';

import { money } from '@/domain/catalog';
import { usePosStore } from '@/store/pos-store';

export function useQuickItemsHandler() {
  const { products, addProductToCart } = usePosStore();

  const items = useMemo(
    () =>
      products
        .filter((p) => p.quick)
        .map((p) => ({
          id: p.id,
          name: p.name,
          price: money(p.price),
          add: () => addProductToCart(p),
        })),
    [products, addProductToCart],
  );

  return { items };
}
