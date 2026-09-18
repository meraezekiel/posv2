import { useRouter } from 'expo-router';
import { useCallback } from 'react';

import { Product, money } from '@/domain/catalog';

export function useProductRowHandler(product: Product) {
  const router = useRouter();

  return {
    stockLine: product.quick
      ? `No barcode · ${product.unit}`
      : `${product.stock} ${product.unit} in stock`,
    low: !product.quick && product.stock <= product.low,
    price: money(product.price),
    // Rows now open the detail page; editing is a button from there.
    open: useCallback(
      () => router.push({ pathname: '/products/detail', params: { id: product.id } }),
      [product.id, router],
    ),
  };
}
