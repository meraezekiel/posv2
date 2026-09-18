import { useRouter } from 'expo-router';
import { useCallback, useMemo } from 'react';

import { money } from '@/domain/catalog';
import { usePosStore } from '@/store/pos-store';
import { color } from '@/theme/tokens';

export function useEndOfDayHandler() {
  const router = useRouter();
  const {
    sales,
    saleAmount,
    eodStart,
    eodActual,
    setEodStart,
    setEodActual,
    dayClosed,
    closeDay,
    showGlobalToast,
  } = usePosStore();

  // Cash sales in full, plus the cash half of any split payment.
  const cashToday = useMemo(
    () =>
      sales
        .filter((s) => s.dayIdx === 0 && s.status === 'Completed')
        .reduce((n, s) => n + (s.method === 'Cash' ? saleAmount(s) : (s.cashPart ?? 0)), 0),
    [saleAmount, sales],
  );

  const expected = (Number(eodStart) || 0) + cashToday;
  const difference = (Number(eodActual) || 0) - expected;
  const counted = !!eodActual;
  const balanced = Math.abs(difference) < 0.005;

  const close = useCallback(() => {
    if (!counted || dayClosed) return;
    closeDay();
    showGlobalToast('Day closed · summary saved to Reports');
    router.back();
  }, [closeDay, counted, dayClosed, router, showGlobalToast]);

  return {
    back: useCallback(() => router.back(), [router]),
    start: eodStart,
    setStart: setEodStart,
    cashSales: money(cashToday),
    expected: money(expected),
    actual: eodActual,
    setActual: setEodActual,
    difference: counted ? `${difference >= 0 ? '+' : '−'}${money(Math.abs(difference))}` : '—',
    differenceColor: !counted ? color.textFaint : balanced ? color.accentSoft : color.accentPale,
    note: !counted
      ? "Count the drawer, then type what's really there."
      : balanced
        ? "Spot on — the drawer matches the day's cash sales."
        : difference > 0
          ? `Over by ${money(difference)}. Check for an unrecorded sale.`
          : `Short by ${money(-difference)}. Check change given and voids.`,
    canClose: counted && !dayClosed,
    closeLabel: dayClosed ? 'Day already closed' : counted ? 'Close the day' : 'Enter the counted cash',
    close,
  };
}
