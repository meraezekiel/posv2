import { useCallback, useEffect, useMemo, useState } from 'react';

import { money } from '@/domain/catalog';
import { usePosStore } from '@/store/pos-store';

type Args = {
  lineId: string | null;
  onClose: () => void;
};

const DISCOUNTS = [0, 5, 10, 20];

export function useLineSheetHandler({ lineId, onClose }: Args) {
  const { cart, products, setLinePrice, removeLine, showGlobalToast } = usePosStore();
  const [draft, setDraft] = useState('');

  const line = useMemo(() => cart.find((l) => l.id === lineId) ?? null, [cart, lineId]);
  const listPrice = useMemo(
    () => (line ? (products.find((p) => p.id === line.id)?.price ?? line.price) : 0),
    [line, products],
  );

  useEffect(() => {
    if (line) setDraft(String(line.price));
  }, [line]);

  const apply = useCallback(() => {
    const value = Number(draft);
    if (!line || !(value >= 0)) return;
    setLinePrice(line.id, value);
    showGlobalToast(`Line price set to ${money(value)}`);
    onClose();
  }, [draft, line, onClose, setLinePrice, showGlobalToast]);

  const remove = useCallback(() => {
    if (!line) return;
    removeLine(line.id);
    showGlobalToast('Line removed');
    onClose();
  }, [line, onClose, removeLine, showGlobalToast]);

  return {
    line,
    sub: line ? `${line.qty} × list price ${money(listPrice)}` : '',
    draft,
    setDraft,
    discounts: DISCOUNTS.map((pct) => ({
      label: pct === 0 ? 'List' : `−${pct}%`,
      set: () => setDraft((listPrice * (1 - pct / 100)).toFixed(2)),
    })),
    apply,
    remove,
  };
}
