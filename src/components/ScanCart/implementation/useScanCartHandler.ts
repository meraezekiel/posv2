import { useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { LayoutChangeEvent } from 'react-native';

import { usePosStore } from '@/store/pos-store';
import { useUiStore } from '@/store/ui-store';

import { useScanSessionHandler } from './handler/useScanSessionHandler';

/** Share of the Sell area the viewfinder takes, per the design brief (35–45%). */
const CAMERA_RATIO = 0.42;

export function useScanCartHandler() {
  const router = useRouter();
  const { cart, count, clearCart, holdCart, showGlobalToast } = usePosStore();
  const { askConfirm } = useUiStore();
  const [cameraVisible, setCameraVisible] = useState(true);
  const [areaHeight, setAreaHeight] = useState(0);
  const [openLineId, setOpenLineId] = useState<string | null>(null);
  const { unknownCode, onDetected, onSimulate, dismissUnknown } = useScanSessionHandler();

  const onContentLayout = useCallback((e: LayoutChangeEvent) => {
    setAreaHeight(e.nativeEvent.layout.height);
  }, []);

  const addUnknownAsNew = useCallback(
    (code: string) => {
      dismissUnknown();
      router.push({ pathname: '/sell/quick-add', params: { barcode: code, addToCart: '1' } });
    },
    [dismissUnknown, router],
  );

  return {
    cart,
    cartEmpty: cart.length === 0,
    countLabel: count === 1 ? '1 item' : `${count} items`,
    cameraVisible,
    // Falls back to a sane height for the first frame, before layout lands.
    cameraHeight: Math.round((areaHeight || 640) * CAMERA_RATIO),
    onContentLayout,
    onDetected,
    onSimulate,
    hideCamera: useCallback(() => setCameraVisible(false), []),
    showCamera: useCallback(() => setCameraVisible(true), []),
    // Clearing a cart is easy to regret, so it asks first and offers Hold.
    askClear: useCallback(() => {
      if (!cart.length) return;
      askConfirm({
        title: 'Clear the cart?',
        body: `${count === 1 ? '1 item' : `${count} items`} will be removed. Hold the sale instead if the customer is coming back.`,
        label: 'Clear cart',
        action: clearCart,
      });
    }, [askConfirm, cart.length, clearCart, count]),
    holdSale: useCallback(() => {
      showGlobalToast(
        holdCart() ? 'Sale held — serve the next customer' : 'Nothing in the cart to hold',
      );
    }, [holdCart, showGlobalToast]),
    unknownCode,
    addUnknownAsNew,
    dismissUnknown,
    openLineId,
    openLine: useCallback((id: string) => setOpenLineId(id), []),
    closeLine: useCallback(() => setOpenLineId(null), []),
  };
}
