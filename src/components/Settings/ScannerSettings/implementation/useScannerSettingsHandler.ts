import { useCallback } from 'react';

import { usePosStore } from '@/store/pos-store';
import { useUiStore } from '@/store/ui-store';

export function useScannerSettingsHandler() {
  const { scanner, setScanner, showGlobalToast } = usePosStore();
  const { runBusy } = useUiStore();

  return {
    toggles: [
      {
        label: 'Beep on scan',
        sub: 'A short tone when a barcode is read.',
        value: scanner.beep,
        onToggle: () => setScanner({ beep: !scanner.beep }),
      },
      {
        label: 'Vibrate on scan',
        sub: 'Useful in a noisy store.',
        value: scanner.vibrate,
        onToggle: () => setScanner({ vibrate: !scanner.vibrate }),
      },
    ],
    modeOptions: [
      { key: 'continuous', label: 'Continuous' },
      { key: 'single', label: 'One at a time' },
    ],
    mode: scanner.mode,
    setMode: (key: string) => setScanner({ mode: key as 'continuous' | 'single' }),
    pair: useCallback(
      () => runBusy('Looking for scanners…', 1300, () => showGlobalToast('No handheld scanner found nearby')),
      [runBusy, showGlobalToast],
    ),
  };
}
