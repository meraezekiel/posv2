import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { color, font, radius } from '@/theme/tokens';

import { useKeypadHandler } from './useKeypadHandler';

/** Quick-amount row plus the 3-column number pad from the mockup. */
export function Keypad() {
  const { quickAmounts, keys } = useKeypadHandler();

  return (
    <View>
      <View style={styles.quickRow}>
        {quickAmounts.map((amount) => (
          <Pressable
            key={amount.label}
            onPress={amount.set}
            accessibilityRole="button"
            style={styles.quickBtn}>
            <Text style={styles.quickText}>{amount.label}</Text>
          </Pressable>
        ))}
      </View>
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
  quickRow: { flexDirection: 'row', gap: 7, marginBottom: 10 },
  quickBtn: {
    flex: 1,
    minHeight: 44,
    borderRadius: 9,
    backgroundColor: color.surface,
    borderWidth: 1,
    borderColor: color.line,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickText: { fontFamily: font.medium, fontSize: 12.5, color: color.text },
  pad: { flexDirection: 'row', flexWrap: 'wrap', gap: 7 },
  key: {
    // Three to a row, whatever the phone width.
    width: '31.7%',
    flexGrow: 1,
    minHeight: 52,
    borderRadius: 9,
    backgroundColor: color.surfaceSunken,
    borderWidth: 1,
    borderColor: color.line,
    alignItems: 'center',
    justifyContent: 'center',
  },
  keyText: { fontFamily: font.medium, fontSize: 18, color: color.text },
});
