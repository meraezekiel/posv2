import { useCallback } from 'react';

import { CartLine, money } from '@/domain/catalog';
import { usePosStore } from '@/store/pos-store';

export function useCartLineRowHandler(line: CartLine) {
  const { incLine, decLine } = usePosStore();

  return {
    unitLine: `${money(line.price)} × ${line.qty} ${line.unit}`,
    total: money(line.price * line.qty),
    inc: useCallback(() => incLine(line.id), [incLine, line.id]),
    dec: useCallback(() => decLine(line.id), [decLine, line.id]),
  };
}
