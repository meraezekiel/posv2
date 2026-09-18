import React from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';

import { color, font, radius } from '@/theme/tokens';

import { useToastHandler } from './useToastHandler';

type ToastProps = {
  /** Distance from the bottom of the parent, above the charge bar. */
  bottom?: number;
};

/** Scan-confirmation toast: a check chip plus one line of text. */
export function Toast({ bottom = 82 }: ToastProps) {
  const { message, style } = useToastHandler();
  if (!message) return null;

  return (
    <Animated.View style={[styles.wrap, { bottom }, style]} pointerEvents="none">
      <View style={styles.card}>
        <View style={styles.check}>
          <Text style={styles.checkMark}>✓</Text>
        </View>
        <Text style={styles.text} numberOfLines={1}>
          {message}
        </Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: { position: 'absolute', left: 12, right: 12, zIndex: 6 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
    paddingVertical: 11,
    paddingHorizontal: 13,
    borderRadius: radius.md,
    backgroundColor: color.accentInk,
    borderWidth: 1,
    borderColor: color.accentLine,
    elevation: 8,
  },
  check: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: color.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkMark: { color: color.bg, fontFamily: font.semibold, fontSize: 12 },
  text: { flex: 1, color: color.textBright, fontFamily: font.medium, fontSize: 12.5 },
});
