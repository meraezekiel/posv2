import { useCallback, useEffect, useRef } from 'react';
import { Animated, Easing } from 'react-native';

type Args = {
  code: string | null;
  onAddAsNew: (code: string) => void;
};

/** Drives the sheet's slide-up and forwards the code to the quick-add form. */
export function useUnknownCodeSheetHandler({ code, onAddAsNew }: Args) {
  const slide = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!code) {
      slide.setValue(0);
      return;
    }
    Animated.timing(slide, {
      toValue: 1,
      duration: 200,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [code, slide]);

  const addAsNew = useCallback(() => {
    if (code) onAddAsNew(code);
  }, [code, onAddAsNew]);

  return {
    visible: !!code,
    addAsNew,
    sheetStyle: {
      transform: [
        { translateY: slide.interpolate({ inputRange: [0, 1], outputRange: [400, 0] }) },
      ],
    },
  };
}
