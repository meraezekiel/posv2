import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useMemo } from 'react';

import { money } from '@/domain/catalog';
import { dayLabel } from '@/domain/sales';
import { usePosStore } from '@/store/pos-store';
import { useUiStore } from '@/store/ui-store';
import { color } from '@/theme/tokens';

type StockMove = { delta: string; label: string; when: string; color: string };

export function useProductDetailHandler() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { products, sales, deleteProduct, showGlobalToast } = usePosStore();
  const { askConfirm } = useUiStore();

  const product = useMemo(() => products.find((p) => p.id === id) ?? null, [id, products]);

  const sold = useMemo(
    () =>
      product
        ? sales
            .filter((s) => s.status === 'Completed')
            .reduce(
              (n, s) => n + s.items.filter((i) => i.pid === product.id).reduce((m, i) => m + i.qty, 0),
              0,
            )
        : 0,
    [product, sales],
  );

  /** One seeded restock line, then every sale that touched this product. */
  const moves = useMemo<StockMove[]>(() => {
    if (!product) return [];
    const seeded: StockMove = {
      delta: `+${product.stock + sold > 0 ? 24 : 0}`,
      label: 'Stock in · wholesale run',
      when: '5 days ago',
      color: color.accentSoft,
    };
    return [seeded].concat(
      sales
        .filter((s) => s.items.some((i) => i.pid === product.id))
        .slice(0, 5)
        .map((s) => {
          const item = s.items.find((i) => i.pid === product.id)!;
          const cameBack = s.status !== 'Completed';
          return {
            delta: `${cameBack ? '+' : '−'}${item.qty}`,
            label: `${cameBack ? `${s.status} back · ` : 'Sold · '}${s.no}`,
            when: `${dayLabel(s.dayIdx).toLowerCase()} ${s.time}`,
            color: cameBack ? color.accentSoft : color.textDim,
          };
        }),
    );
  }, [product, sales, sold]);

  const remove = useCallback(() => {
    if (!product) return;
    askConfirm({
      title: `Delete ${product.name}?`,
      body: 'It disappears from the product list but stays on past sales and reports.',
      label: 'Delete product',
      action: () => {
        deleteProduct(product.id);
        showGlobalToast('Product deleted');
        router.back();
      },
    });
  }, [askConfirm, deleteProduct, product, router, showGlobalToast]);

  return {
    back: useCallback(() => router.back(), [router]),
    name: product?.name ?? '',
    photo: product?.photo,
    price: money(product?.price ?? 0),
    costLine:
      product && product.cost != null
        ? `Cost ${money(product.cost)} · margin ${money(product.price - product.cost)} per ${product.unit}`
        : 'No cost entered — add one on the next stock-in to track profit',
    barcode: product?.barcode ? product.barcode : 'No barcode · quick item',
    stats: product
      ? [
          {
            value: `${product.stock} ${product.unit}`,
            label: 'on hand',
            color: product.stock <= product.low ? color.accentSoft : color.text,
          },
          { value: String(sold), label: 'sold, last 30 days', color: color.text },
          { value: `${product.low} ${product.unit}`, label: 'low-stock alert', color: color.text },
        ]
      : [],
    moves,
    edit: useCallback(
      () => product && router.push({ pathname: '/products/form', params: { id: product.id } }),
      [product, router],
    ),
    stockIn: useCallback(
      () => product && router.push({ pathname: '/products/stock', params: { id: product.id, mode: 'in' } }),
      [product, router],
    ),
    adjust: useCallback(
      () =>
        product && router.push({ pathname: '/products/stock', params: { id: product.id, mode: 'adjust' } }),
      [product, router],
    ),
    remove,
  };
}
