import { useMemo } from 'react';

import { usePosStore } from '@/store/pos-store';

const KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0', '⌫'];

export function useKeypadHandler() {
  const { total, setTendered } = usePosStore();

  const quickAmounts = useMemo(
    () => [
      { label: 'Exact', set: () => setTendered(total.toFixed(2)) },
      { label: '₱100', set: () => setTendered('100') },
      { label: '₱500', set: () => setTendered('500') },
      { label: '₱1000', set: () => setTendered('1000') },
    ],
    [setTendered, total],
  );

  const keys = useMemo(
    () =>
      KEYS.map((label) => ({
        label,
        press: () =>
          setTendered((prev) => {
            if (label === '⌫') return prev.slice(0, -1);
            if (label === '.' && prev.includes('.')) return prev;
            return (prev + label).slice(0, 9);
          }),
      })),
    [setTendered],
  );

  return { quickAmounts, keys };
}
