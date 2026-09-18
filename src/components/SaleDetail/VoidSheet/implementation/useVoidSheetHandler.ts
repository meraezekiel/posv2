import { useCallback, useEffect, useMemo, useState } from 'react';

import { VOID_REASONS } from '@/domain/sales';

type Args = {
  visible: boolean;
  onConfirm: (reason: string) => void;
};

export function useVoidSheetHandler({ visible, onConfirm }: Args) {
  const [reason, setReason] = useState<string | null>(null);

  // A fresh sheet each time it opens — a stale reason is easy to confirm by accident.
  useEffect(() => {
    if (visible) setReason(null);
  }, [visible]);

  const reasons = useMemo(() => VOID_REASONS.map((r) => ({ key: r, label: r })), []);

  return {
    reasons,
    reason,
    setReason,
    canVoid: !!reason,
    label: reason ? 'Void this sale' : 'Pick a reason first',
    confirm: useCallback(() => {
      if (reason) onConfirm(reason);
    }, [onConfirm, reason]),
  };
}
