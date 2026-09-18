import { useEffect, useRef } from 'react';
import { Animated, Easing } from 'react-native';

import { usePosStore } from '@/store/pos-store';

/** Reads the current toast from the store and runs the slide-up fade of the mockup. */
export function useToastHandler() {
  const { toast } = usePosStore();
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(progress, {
      toValue: toast ? 1 : 0,
      duration: 180,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start();
  }, [toast, progress]);

  return {
    message: toast,
    style: {
      opacity: progress,
      transform: [
        { translateY: progress.interpolate({ inputRange: [0, 1], outputRange: [8, 0] }) },
      ],
    },
  };
}
