import { useCallback } from 'react';

import { money } from '@/domain/catalog';
import { usePosStore } from '@/store/pos-store';
import { color } from '@/theme/tokens';

export function useSplitPaymentHandler() {
  const { total, splitCash, splitWallet, setSplitCash, setSplitWallet } = usePosStore();

  const paid = (Number(splitCash) || 0) + (Number(splitWallet) || 0);
  const left = total - paid;
  const settled = Math.abs(left) < 0.005;

  return {
    cash: splitCash,
    setCash: setSplitCash,
    wallet: splitWallet,
    setWallet: setSplitWallet,
    remainLabel: left > 0.005 ? 'Still to cover' : left < -0.005 ? 'Over by' : 'Fully covered',
    remain: money(Math.abs(left)),
    remainColor: settled ? color.accentSoft : color.accentPale,
    putRestOnWallet: useCallback(
      () => setSplitWallet(Math.max(0, total - (Number(splitCash) || 0)).toFixed(2)),
      [setSplitWallet, splitCash, total],
    ),
  };
}
