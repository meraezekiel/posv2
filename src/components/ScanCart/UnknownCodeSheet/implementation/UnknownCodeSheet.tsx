import React from 'react';
import { Animated, Modal, Pressable, StyleSheet, Text, View } from 'react-native';

import { color, font, radius } from '@/theme/tokens';

import { useUnknownCodeSheetHandler } from './useUnknownCodeSheetHandler';

type UnknownCodeSheetProps = {
  code: string | null;
  onAddAsNew: (code: string) => void;
  onDismiss: () => void;
};

/** Bottom sheet shown when a scanned barcode is not in the catalog. */
export function UnknownCodeSheet({ code, onAddAsNew, onDismiss }: UnknownCodeSheetProps) {
  const { visible, sheetStyle, addAsNew } = useUnknownCodeSheetHandler({ code, onAddAsNew });

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onDismiss}>
      <View style={styles.backdrop}>
        <Pressable style={styles.backdropFill} onPress={onDismiss} accessibilityLabel="Dismiss" />
        <Animated.View style={[styles.sheet, sheetStyle]}>
          <View style={styles.grabber} />
          <Text style={styles.title}>We don&apos;t know this one yet</Text>
          <Text style={styles.body}>
            Barcode <Text style={styles.code}>{code}</Text> isn&apos;t in your products. Add it now
            and it goes straight into the cart.
          </Text>
          <Pressable onPress={addAsNew} accessibilityRole="button" style={styles.primary}>
            <Text style={styles.primaryText}>Add as new product</Text>
          </Pressable>
          <Pressable onPress={onDismiss} accessibilityRole="button" style={styles.secondary}>
            <Text style={styles.secondaryText}>Not now</Text>
          </Pressable>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(11,12,20,0.7)' },
  backdropFill: { position: 'absolute', inset: 0 },
  sheet: {
    backgroundColor: color.surface,
    borderTopWidth: 1,
    borderTopColor: color.lineStrong,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 18,
  },
  grabber: {
    width: 38,
    height: 4,
    borderRadius: 2,
    backgroundColor: color.line,
    alignSelf: 'center',
    marginBottom: 14,
  },
  title: { fontFamily: font.medium, fontSize: 16, color: color.text, marginBottom: 6 },
  body: { fontFamily: font.regular, fontSize: 12.5, lineHeight: 19, color: color.textMuted, marginBottom: 12 },
  code: { fontFamily: font.mono, color: color.accentPale },
  primary: {
    height: 48,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: color.accent,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 9,
  },
  primaryText: { fontFamily: font.medium, fontSize: 14, color: color.textBright },
  secondary: {
    height: 48,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: color.lineStrong,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryText: { fontFamily: font.medium, fontSize: 14, color: '#cfd3e5' },
});
