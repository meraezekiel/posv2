import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { color, font, radius } from '@/theme/tokens';

import { useGlobalToastHandler } from './useGlobalToastHandler';

/** Confirmation banner for Phase 2 actions — voids, refunds, stock, exports. */
export function GlobalToast() {
  const { message } = useGlobalToastHandler();
  if (!message) return null;

  return (
    <View style={styles.wrap} pointerEvents="none">
      <View style={styles.card}>
        <Text style={styles.text}>{message}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { position: 'absolute', left: 12, right: 12, bottom: 14, zIndex: 7 },
  card: {
    paddingVertical: 11,
    paddingHorizontal: 13,
    borderRadius: radius.md,
    backgroundColor: color.accentInk,
    borderWidth: 1,
    borderColor: color.accentLine,
    elevation: 8,
  },
  text: { fontFamily: font.medium, fontSize: 12.5, lineHeight: 18, color: color.textBright },
});
