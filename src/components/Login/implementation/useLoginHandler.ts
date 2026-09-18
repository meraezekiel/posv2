import { useRouter } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';

import { PIN_LOCK_MS, PIN_MAX_TRIES } from '@/domain/sales';
import { usePosStore } from '@/store/pos-store';

export function useLoginHandler() {
  const router = useRouter();
  const { users, ownerPin, signIn, showGlobalToast } = usePosStore();

  const [selected, setSelected] = useState('Store owner');
  const [digits, setDigits] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [tries, setTries] = useState(0);
  const [locked, setLocked] = useState(false);
  const lockTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (lockTimer.current) clearTimeout(lockTimer.current);
  }, []);

  const check = useCallback(
    (entered: string) => {
      if (entered === ownerPin) {
        setDigits('');
        setTries(0);
        setError(null);
        signIn(selected);
        showGlobalToast(`Welcome back, ${selected.split(' ')[0]}`);
        router.replace('/sell');
        return;
      }
      const next = tries + 1;
      setDigits('');
      setTries(next);
      if (next >= PIN_MAX_TRIES) {
        setLocked(true);
        setError('Locked for 30 seconds after 5 tries');
        lockTimer.current = setTimeout(() => {
          setLocked(false);
          setTries(0);
          setError(null);
        }, PIN_LOCK_MS);
      } else {
        setError(`Wrong PIN · ${PIN_MAX_TRIES - next} tries left`);
      }
    },
    [ownerPin, router, selected, showGlobalToast, signIn, tries],
  );

  const press = useCallback(
    (key: string) => {
      if (locked) return;
      if (key === 'C') {
        setDigits('');
        setError(null);
        return;
      }
      if (key === '⌫') {
        setDigits((d) => d.slice(0, -1));
        return;
      }
      setDigits((prev) => {
        const next = (prev + key).slice(0, 4);
        if (next.length === 4) setTimeout(() => check(next), 140);
        return next;
      });
      setError(null);
    },
    [check, locked],
  );

  return {
    users: users
      .filter((u) => u.active)
      .map((u) => ({
        name: u.name,
        first: u.name.split(' ')[0],
        role: u.role,
        initials: u.name
          .split(' ')
          .map((w) => w[0])
          .join('')
          .slice(0, 2)
          .toUpperCase(),
        selected: selected === u.name,
        pick: () => {
          setSelected(u.name);
          setDigits('');
          setError(null);
        },
      })),
    pinFilled: digits.length,
    error,
    press,
    forgot: useCallback(
      () => showGlobalToast('Owner PIN reset · answer the security question'),
      [showGlobalToast],
    ),
  };
}
