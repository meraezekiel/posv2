import { useRouter } from 'expo-router';
import { useCallback } from 'react';

import { money } from '@/domain/catalog';
import { usePosStore } from '@/store/pos-store';

export function useReceiptHandler() {
  const router = useRouter();
  const { sale, toast, showToast, startNewSale } = usePosStore();

  const newSale = useCallback(() => {
    startNewSale();
    router.replace('/sell');
  }, [router, startNewSale]);

  return {
    saleNo: sale ? sale.no : '#—',
    saleMethod: sale ? sale.method : '',
    totalLabel: money(sale ? sale.total : 0),
    changeLabel: money(sale ? sale.change : 0),
    printReceipt: useCallback(
      () => showToast('No printer paired yet — open Settings › Printer'),
      [showToast],
    ),
    shareReceipt: useCallback(() => showToast('Receipt image ready to share'), [showToast]),
    newSale,
    toast,
  };
}
