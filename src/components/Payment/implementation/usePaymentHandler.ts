import { useRouter } from 'expo-router';
import { useCallback } from 'react';

import { money } from '@/domain/catalog';
import { usePosStore } from '@/store/pos-store';
import { color } from '@/theme/tokens';

export function usePaymentHandler() {
  const router = useRouter();
  const {
    count,
    subtotal,
    vat,
    total,
    vatEnabled,
    method,
    setMethod,
    tendered,
    splitCash,
    splitWallet,
    refNo,
    setRefNo,
    completeSale,
  } = usePosStore();

  const tenderedValue = Number(tendered || 0);
  const change = tenderedValue - total;
  const splitLeft = total - ((Number(splitCash) || 0) + (Number(splitWallet) || 0));
  /** Cash needs enough tendered; a split has to be fully covered with some cash. */
  const paymentOk =
    method === 'cash'
      ? tenderedValue >= total && total > 0
      : method === 'split'
        ? total > 0 && splitLeft <= 0.005 && (Number(splitCash) || 0) > 0
        : true;
  const canComplete = count > 0 && paymentOk;

  const complete = useCallback(() => {
    if (!canComplete) return;
    completeSale();
    router.replace('/sell/receipt');
  }, [canComplete, completeSale, router]);

  return {
    back: useCallback(() => router.back(), [router]),
    countLabel: count === 1 ? '1 item' : `${count} items`,
    vatLine: vatEnabled ? 'VAT incl. 12%' : 'No VAT',
    subtotalLabel: money(subtotal),
    vatLabel: money(vat),
    totalLabel: money(total),
    method,
    setMethod,
    tenderLabel: tendered ? money(tenderedValue) : '₱0.00',
    changeLabel: change >= 0 && tendered ? money(change) : '—',
    changeColor: change >= 0 && tendered ? color.accentPale : color.textFaint,
    refNo,
    setRefNo,
    canComplete,
    completeLabel: canComplete
      ? `Complete sale · ${money(total)}`
      : count === 0
        ? 'Add an item first'
        : method === 'cash'
          ? 'Enter cash received'
          : method === 'split'
            ? 'Cover the full total across both'
            : 'Add an item first',
    complete,
  };
}
