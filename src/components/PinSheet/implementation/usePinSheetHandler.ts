import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { OWNER_PIN, PIN_LOCK_MS, PIN_MAX_TRIES } from '@/domain/sales';
import { usePosStore } from '@/store/pos-store';

import type { PinPurpose } from './PinSheet';

const KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'C', '0', '⌫'];

type Args = {
  purpose: PinPurpose;
  onSuccess: (purpose: Exclude<PinPurpose, null>) => void;
};

export function usePinSheetHandler({ purpose, onSuccess }: Args) {
  const { showGlobalToast } = usePosStore();
  const [digits, setDigits] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [tries, setTries] = useState(0);
  const [locked, setLocked] = useState(false);
  const lockTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Each time the sheet opens it starts clean, but the lockout survives.
  useEffect(() => {
    if (purpose) {
      setDigits('');
      setError(null);
    }
  }, [purpose]);

  useEffect(() => () => {
    if (lockTimer.current) clearTimeout(lockTimer.current);
  }, []);

  const check = useCallback(
    (entered: string) => {
      if (entered === OWNER_PIN) {
        setDigits('');
        setTries(0);
        setError(null);
        if (purpose) onSuccess(purpose);
        return;
      }
      const next = tries + 1;
      setDigits('');
      setTries(next);
      if (next >= PIN_MAX_TRIES) {
        setLocked(true);
        setError('Too many tries — locked for 30 seconds');
        lockTimer.current = setTimeout(() => {
          setLocked(false);
          setTries(0);
          setError(null);
        }, PIN_LOCK_MS);
      } else {
        setError(`Wrong PIN · ${PIN_MAX_TRIES - next} tries left`);
      }
    },
    [onSuccess, purpose, tries],
  );

  const press = useCallback(
    (label: string) => {
      if (locked) return;
      if (label === 'C') {
        setDigits('');
        setError(null);
        return;
      }
      if (label === '⌫') {
        setDigits((d) => d.slice(0, -1));
        return;
      }
      setDigits((d) => {
        const next = (d + label).slice(0, 4);
        if (next.length === 4) setTimeout(() => check(next), 140);
        return next;
      });
      setError(null);
    },
    [check, locked],
  );

  const keys = useMemo(
    () => KEYS.map((label) => ({ label, press: () => press(label) })),
    [press],
  );

  return {
    why:
      purpose === 'refund'
        ? 'Refunds are owner-only. Enter the PIN to continue.'
        : 'Voiding a sale is owner-only. Enter the PIN to continue.',
    dots: [0, 1, 2, 3].map((i) => digits.length > i),
    error,
    keys,
    forgot: useCallback(
      () => showGlobalToast('Owner PIN reset · answer the security question'),
      [showGlobalToast],
    ),
  };
}
