import type { BarcodeScanningResult } from 'expo-camera';
import { useCameraPermissions } from 'expo-camera';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Animated, Easing, LayoutChangeEvent, Linking } from 'react-native';

/** Ignore repeat reads of the same code for this long (continuous mode). */
const RESCAN_MS = 1500;

type Args = {
  onDetected: (code: string) => void;
};

export function useCameraPaneHandler({ onDetected }: Args) {
  const [permission, requestPermission] = useCameraPermissions();
  const [torch, setTorch] = useState(false);
  const [continuous, setContinuous] = useState(true);
  const [reticleHeight, setReticleHeight] = useState(0);

  const lastScan = useRef<{ code: string; at: number }>({ code: '', at: 0 });
  const scanLine = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(scanLine, {
          toValue: 1,
          duration: 1100,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(scanLine, {
          toValue: 0,
          duration: 1100,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [scanLine]);

  const onReticleLayout = useCallback((e: LayoutChangeEvent) => {
    setReticleHeight(e.nativeEvent.layout.height);
  }, []);

  const onBarcodeScanned = useCallback(
    (result: BarcodeScanningResult) => {
      const code = result?.data;
      if (!code) return;
      const now = Date.now();
      // Single-shot mode: one read until the mode is toggled again.
      if (!continuous && lastScan.current.code) return;
      if (lastScan.current.code === code && now - lastScan.current.at < RESCAN_MS) return;
      lastScan.current = { code, at: now };
      onDetected(code);
    },
    [continuous, onDetected],
  );

  const toggleContinuous = useCallback(() => {
    lastScan.current = { code: '', at: 0 };
    setContinuous((v) => !v);
  }, []);

  const requestAccess = useCallback(() => {
    void requestPermission();
  }, [requestPermission]);

  const openSettings = useCallback(() => {
    void Linking.openSettings();
  }, []);

  return {
    granted: !!permission?.granted,
    canAsk: !permission || permission.canAskAgain !== false,
    requestAccess,
    openSettings,
    torch,
    toggleTorch: () => setTorch((v) => !v),
    continuous,
    toggleContinuous,
    onBarcodeScanned,
    onReticleLayout,
    scanLineStyle: {
      transform: [
        {
          translateY: scanLine.interpolate({
            inputRange: [0, 1],
            outputRange: [0, Math.max(0, reticleHeight - 2)],
          }),
        },
      ],
      opacity: scanLine.interpolate({
        inputRange: [0, 0.12, 0.88, 1],
        outputRange: [0, 0.9, 0.9, 0],
      }),
    },
  };
}
