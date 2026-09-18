import { useRouter } from 'expo-router';
import { useCallback } from 'react';

import type { Product } from '@/domain/catalog';
import { color } from '@/theme/tokens';

export function useInventoryRowHandler(product: Product) {
  const router = useRouter();

  const open = useCallback(
    (mode: 'in' | 'adjust') =>
      router.push({ pathname: '/products/stock', params: { id: product.id, mode } }),
    [product.id, router],
  );

  return {
    stockLine: product.quick
      ? 'No barcode · not tracked'
      : `${product.stock} ${product.unit} on hand · alert at ${product.low}`,
    stockColor: product.quick
      ? color.textFaint
      : product.stock === 0
        ? color.accentPale
        : product.stock <= product.low
          ? color.accentSoft
          : color.textFaint,
    badge: product.quick ? null : product.stock === 0 ? 'OUT' : product.stock <= product.low ? 'LOW' : null,
    stockIn: useCallback(() => open('in'), [open]),
    adjust: useCallback(() => open('adjust'), [open]),
  };
}
