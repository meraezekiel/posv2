import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';

import { ADJUST_REASONS } from '@/domain/sales';
import { usePosStore } from '@/store/pos-store';

const BUMPS = [1, 6, 12];

export function useStockFormHandler() {
  const router = useRouter();
  const { id, mode } = useLocalSearchParams<{ id?: string; mode?: string }>();
  const { products, applyStockChange, showGlobalToast } = usePosStore();

  const [qty, setQty] = useState('');
  const [cost, setCost] = useState('');
  const [reason, setReason] = useState<string | null>(null);

  const product = useMemo(() => products.find((p) => p.id === id) ?? null, [id, products]);
  const isStockIn = mode !== 'adjust';
  const amount = Number(qty);
  const canSave = !!amount && (isStockIn || !!reason);

  const save = useCallback(() => {
    if (!canSave || !product) return;
    applyStockChange(product.id, amount, isStockIn ? Number(cost) : undefined);
    showGlobalToast(
      `${isStockIn ? 'Stocked in ' : 'Adjusted '}${amount > 0 ? '+' : ''}${amount} · ${product.name}`,
    );
    router.back();
  }, [amount, applyStockChange, canSave, cost, isStockIn, product, router, showGlobalToast]);

  return {
    cancel: useCallback(() => router.back(), [router]),
    title: isStockIn ? 'Stock in' : 'Stock adjustment',
    productName: product?.name ?? '',
    onHand: product ? `${product.stock} ${product.unit} on hand` : '',
    qtyLabel: isStockIn ? 'Quantity received' : 'Adjustment (+ or −)',
    qty,
    setQty,
    bumps: BUMPS.map((n) => ({
      label: `+${n}`,
      press: () => setQty((prev) => String((Number(prev) || 0) + n)),
    })),
    isStockIn,
    cost,
    setCost,
    reasons: ADJUST_REASONS.map((r) => ({ key: r, label: r })),
    reason,
    setReason,
    canSave,
    saveLabel: !amount
      ? 'Enter a quantity'
      : !isStockIn
        ? reason
          ? 'Save adjustment'
          : 'Pick a reason first'
        : `Save · ${amount > 0 ? '+' : ''}${amount} ${product?.unit ?? 'pc'}`,
    save,
  };
}
