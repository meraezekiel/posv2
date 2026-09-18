import * as Haptics from 'expo-haptics';
import { useCallback, useRef, useState } from 'react';

import { DEMO_SEQUENCE, DEMO_UNKNOWN_CODE } from '@/domain/catalog';
import { usePosStore } from '@/store/pos-store';

/**
 * Turns barcode reads into cart lines.
 *
 * A real read looks the product up by barcode; an unknown code opens the
 * "add as new product" sheet. Tapping the viewfinder walks a fixed demo
 * sequence instead, so the flow can be shown without physical barcodes.
 */
export function useScanSessionHandler() {
  const { products, addProductToCart, findByBarcode } = usePosStore();
  const [unknownCode, setUnknownCode] = useState<string | null>(null);
  const demoIndex = useRef(0);

  const acceptProductCode = useCallback(
    (code: string) => {
      const product = findByBarcode(code);
      if (product) {
        void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        addProductToCart(product);
        return;
      }
      void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      setUnknownCode(code);
    },
    [addProductToCart, findByBarcode],
  );

  const onDetected = useCallback(
    (code: string) => {
      // One sheet at a time — ignore reads while the unknown-code sheet is up.
      if (unknownCode) return;
      acceptProductCode(code);
    },
    [acceptProductCode, unknownCode],
  );

  const onSimulate = useCallback(() => {
    if (unknownCode) return;
    const key = DEMO_SEQUENCE[demoIndex.current % DEMO_SEQUENCE.length];
    demoIndex.current += 1;
    if (key === '?') {
      void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      setUnknownCode(DEMO_UNKNOWN_CODE);
      return;
    }
    const product = products.find((p) => p.id === key);
    if (product) {
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      addProductToCart(product);
    }
  }, [addProductToCart, products, unknownCode]);

  return {
    unknownCode,
    onDetected,
    onSimulate,
    dismissUnknown: useCallback(() => setUnknownCode(null), []),
  };
}
