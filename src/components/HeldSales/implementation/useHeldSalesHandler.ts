import { useRouter } from 'expo-router';
import { useCallback } from 'react';

import { money } from '@/domain/catalog';
import { usePosStore } from '@/store/pos-store';
import { useUiStore } from '@/store/ui-store';

export function useHeldSalesHandler() {
  const router = useRouter();
  const { held, resumeHeld, discardHeld, showGlobalToast } = usePosStore();
  const { askConfirm } = useUiStore();

  return {
    back: useCallback(() => router.back(), [router]),
    list: held.map((sale) => ({
      id: sale.id,
      label: sale.label,
      items: sale.items.map((i) => `${i.qty}× ${i.name}`).join(' · '),
      total: money(sale.items.reduce((n, i) => n + i.price * i.qty, 0)),
      resume: () => {
        resumeHeld(sale.id);
        showGlobalToast('Sale resumed');
        router.replace('/sell');
      },
      discard: () =>
        askConfirm({
          title: 'Discard this held sale?',
          body: `${sale.items.length} lines will be thrown away.`,
          label: 'Discard',
          action: () => {
            discardHeld(sale.id);
            showGlobalToast('Held sale discarded');
          },
        }),
    })),
  };
}
