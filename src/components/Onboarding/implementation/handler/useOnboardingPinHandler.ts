import { useCallback, useState } from 'react';

type Args = {
  onConfirmed: (pin: string) => void;
};

/** Type the owner PIN once, then again to confirm; a mismatch starts over. */
export function useOnboardingPinHandler({ onConfirmed }: Args) {
  const [digits, setDigits] = useState('');
  const [firstEntry, setFirstEntry] = useState('');
  const [error, setError] = useState<string | null>(null);

  const press = useCallback(
    (key: string) => {
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
        if (next.length === 4) {
          setTimeout(() => {
            if (!firstEntry) {
              setFirstEntry(next);
              setDigits('');
            } else if (firstEntry === next) {
              setDigits('');
              onConfirmed(next);
            } else {
              setDigits('');
              setFirstEntry('');
              setError("Those didn't match — start again");
            }
          }, 120);
        }
        return next;
      });
      setError(null);
    },
    [firstEntry, onConfirmed],
  );

  return { filled: digits.length, error, press, firstEntry };
}
