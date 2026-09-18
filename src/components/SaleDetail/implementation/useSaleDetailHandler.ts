import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';

import { money } from '@/domain/catalog';
import { dayLabel } from '@/domain/sales';
import { usePosStore } from '@/store/pos-store';

import type { PinPurpose } from '@/components/PinSheet/implementation/PinSheet';

export function useSaleDetailHandler() {
  const router = useRouter();
  const { no } = useLocalSearchParams<{ no?: string }>();
  const { sales, saleAmount, itemPrice, productName, role, voidSale, showToast, showGlobalToast } =
    usePosStore();

  const [pinPurpose, setPinPurpose] = useState<PinPurpose>(null);
  const [voidOpen, setVoidOpen] = useState(false);

  const sale = useMemo(() => sales.find((s) => s.no === no) ?? null, [no, sales]);

  const items = useMemo(
    () =>
      sale?.items.map((item) => ({
        key: item.pid,
        qty: item.qty,
        name: item.name || productName(item.pid),
        total: money(itemPrice(item) * item.qty),
      })) ?? [],
    [itemPrice, productName, sale],
  );

  /** Voids are same-day and owner-only; older sales go the refund route. */
  const canVoid = !!sale && sale.status === 'Completed' && sale.dayIdx === 0 && role === 'owner';

  const lockNote =
    sale && sale.status === 'Completed' && sale.dayIdx !== 0
      ? 'Only same-day sales can be voided. Older sales need a refund from the web dashboard.'
      : role === 'cashier' && sale && sale.status === 'Completed'
        ? 'Voids and refunds need the owner’s PIN.'
        : null;

  const askPin = useCallback(
    (purpose: Exclude<PinPurpose, null>) => {
      if (role === 'cashier') {
        showGlobalToast('Cashiers can’t do this — ask the owner');
        return;
      }
      setPinPurpose(purpose);
    },
    [role, showGlobalToast],
  );

  const onPinSuccess = useCallback(
    (purpose: Exclude<PinPurpose, null>) => {
      setPinPurpose(null);
      if (purpose === 'void') setVoidOpen(true);
      else router.push({ pathname: '/sales/refund', params: { no: sale?.no ?? '' } });
    },
    [router, sale],
  );

  const confirmVoid = useCallback(
    (reason: string) => {
      if (!sale) return;
      voidSale(sale.no, reason);
      setVoidOpen(false);
      showGlobalToast(`Sale ${sale.no} voided · stock returned`);
    },
    [sale, showGlobalToast, voidSale],
  );

  return {
    back: useCallback(() => router.back(), [router]),
    sale,
    status: sale?.status ?? '',
    voidedish: !!sale && sale.status !== 'Completed',
    meta: sale
      ? `${dayLabel(sale.dayIdx)} · ${sale.time} · ${sale.method} · cashier ${sale.cashier}`
      : '',
    items,
    total: money(sale ? saleAmount(sale) : 0),
    payLine: sale
      ? `Paid by ${sale.method}${
          sale.method === 'Cash'
            ? ' · change given at the counter'
            : sale.method === 'GCash'
              ? ' · reference logged manually'
              : ' · on the customer’s tab'
        }`
      : '',
    reason: sale?.reason ?? null,
    canVoid,
    lockNote,
    askVoid: useCallback(() => askPin('void'), [askPin]),
    askRefund: useCallback(() => askPin('refund'), [askPin]),
    print: useCallback(() => showToast('No printer paired yet — open Settings › Printer'), [showToast]),
    share: useCallback(() => showToast('Receipt image ready to share'), [showToast]),
    pinPurpose,
    cancelPin: useCallback(() => setPinPurpose(null), []),
    onPinSuccess,
    voidOpen,
    cancelVoid: useCallback(() => setVoidOpen(false), []),
    confirmVoid,
  };
}
