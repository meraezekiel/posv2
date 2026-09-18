import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { color, font } from '@/theme/tokens';

import { usePinPadHandler } from './usePinPadHandler';

type PinPadProps = {
  /** How many digits are filled in, 0–4. */
  filled: number;
  error?: string | null;
  onPress: (key: string) => void;
};

/** Four dots and a 3-column keypad — shared by onboarding, login and the PIN gate. */
export function PinPad({ filled, error, onPress }: PinPadProps) {
  const { dots, keys } = usePinPadHandler({ filled, onPress });

  return (
    <View>
      <View style={styles.dots}>
        {dots.map((on, i) => (
          <View key={i} style={[styles.dot, on && styles.dotOn]} />
        ))}
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <View style={styles.pad}>
        {keys.map((key) => (
          <Pressable
            key={key.label}
            onPress={key.press}
            accessibilityRole="button"
            accessibilityLabel={key.label === '⌫' ? 'Delete' : key.label}
            style={styles.key}>
            <Text style={styles.keyText}>{key.label}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  dots: { flexDirection: 'row', gap: 9, justifyContent: 'center', marginBottom: 12 },
  dot: { width: 13, height: 13, borderRadius: 7, borderWidth: 1, borderColor: color.lineStrong },
  dotOn: { backgroundColor: color.accent, borderColor: color.accent },
  error: {
    textAlign: 'center',
    fontFamily: font.medium,
    fontSize: 12,
    color: color.accentPale,
    marginBottom: 10,
  },
  pad: { flexDirection: 'row', flexWrap: 'wrap', gap: 7 },
  key: {
    width: '31.7%',
    flexGrow: 1,
    minHeight: 50,
    borderRadius: 9,
    backgroundColor: color.surfaceSunken,
    borderWidth: 1,
    borderColor: color.line,
    alignItems: 'center',
    justifyContent: 'center',
  },
  keyText: { fontFamily: font.medium, fontSize: 18, color: color.text },
});
