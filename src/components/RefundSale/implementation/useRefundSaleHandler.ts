import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';

import { money } from '@/domain/catalog';
import { REFUND_REASONS } from '@/domain/sales';
import { usePosStore } from '@/store/pos-store';

export function useRefundSaleHandler() {
  const router = useRouter();
  const { no } = useLocalSearchParams<{ no?: string }>();
  const { sales, itemPrice, productName, refundSale, showGlobalToast } = usePosStore();

  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const [reason, setReason] = useState<string | null>(null);

  const sale = useMemo(() => sales.find((s) => s.no === no) ?? null, [no, sales]);

  const items = useMemo(
    () =>
      sale?.items.map((item) => ({
        key: item.pid,
        qty: item.qty,
        name: item.name || productName(item.pid),
        total: money(itemPrice(item) * item.qty),
        selected: !!selected[item.pid],
        toggle: () => setSelected((prev) => ({ ...prev, [item.pid]: !prev[item.pid] })),
      })) ?? [],
    [itemPrice, productName, sale, selected],
  );

  const picked = useMemo(
    () => sale?.items.filter((item) => selected[item.pid]) ?? [],
    [sale, selected],
  );
  const amount = useMemo(
    () => picked.reduce((n, item) => n + itemPrice(item) * item.qty, 0),
    [itemPrice, picked],
  );

  const canRefund = amount > 0 && !!reason;

  const doRefund = useCallback(() => {
    if (!sale || !canRefund || !reason) return;
    const partial = picked.length < sale.items.length;
    const refunded = refundSale(sale.no, picked, reason, partial);
    showGlobalToast(`Refunded ${money(refunded)} · stock returned`);
    router.back();
  }, [canRefund, picked, reason, refundSale, router, sale, showGlobalToast]);

  return {
    cancel: useCallback(() => router.back(), [router]),
    saleNo: sale?.no ?? '',
    items,
    reasons: REFUND_REASONS.map((r) => ({ key: r, label: r })),
    reason,
    setReason,
    canRefund,
    refundLabel:
      amount > 0
        ? reason
          ? `Refund ${money(amount)}`
          : 'Pick a reason first'
        : 'Choose the items to refund',
    doRefund,
  };
}
