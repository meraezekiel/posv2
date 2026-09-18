import { useRouter } from 'expo-router';
import { useCallback } from 'react';

import { money } from '@/domain/catalog';
import { usePosStore } from '@/store/pos-store';

export function useChargeBarHandler() {
  const router = useRouter();
  const { count, total, vatEnabled } = usePosStore();
  const enabled = count > 0;

  const charge = useCallback(() => {
    if (enabled) router.push('/sell/payment');
  }, [enabled, router]);

  return {
    countLabel: count === 1 ? '1 item' : `${count} items`,
    vatLine: vatEnabled ? 'VAT incl. 12%' : 'No VAT',
    totalLabel: money(total),
    enabled,
    charge,
  };
}
