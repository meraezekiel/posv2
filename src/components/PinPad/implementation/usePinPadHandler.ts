import { useMemo } from 'react';

const KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'C', '0', '⌫'];

type Args = {
  filled: number;
  onPress: (key: string) => void;
};

export function usePinPadHandler({ filled, onPress }: Args) {
  return {
    dots: [0, 1, 2, 3].map((i) => filled > i),
    keys: useMemo(
      () => KEYS.map((label) => ({ label, press: () => onPress(label) })),
      [onPress],
    ),
  };
}
