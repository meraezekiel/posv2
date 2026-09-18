import React from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';

import { color, font, radius } from '@/theme/tokens';

import { usePinSheetHandler } from './usePinSheetHandler';

export type PinPurpose = 'void' | 'refund' | null;

type PinSheetProps = {
  purpose: PinPurpose;
  onCancel: () => void;
  onSuccess: (purpose: Exclude<PinPurpose, null>) => void;
};

/** Owner-PIN gate for voids and refunds. Five wrong tries locks it for 30s. */
export function PinSheet({ purpose, onCancel, onSuccess }: PinSheetProps) {
  const { why, dots, error, keys, forgot } = usePinSheetHandler({ purpose, onSuccess });

  return (
    <Modal visible={!!purpose} transparent animationType="slide" onRequestClose={onCancel}>
      <View style={styles.backdrop}>
        <Pressable style={styles.backdropFill} onPress={onCancel} accessibilityLabel="Dismiss" />
        <View style={styles.sheet}>
          <View style={styles.grabber} />
          <Text style={styles.title}>Owner PIN required</Text>
          <Text style={styles.why}>{why}</Text>

          <View style={styles.dots}>
            {dots.map((filled, i) => (
              <View key={i} style={[styles.dot, filled && styles.dotOn]} />
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

          <View style={styles.actions}>
            <Pressable onPress={onCancel} accessibilityRole="button" style={styles.cancel}>
              <Text style={styles.cancelText}>Cancel</Text>
            </Pressable>
            <Pressable onPress={forgot} accessibilityRole="button" style={styles.forgot}>
              <Text style={styles.forgotText}>Forgot PIN</Text>
            </Pressable>
          </View>

          <Text style={styles.footnote}>Demo PIN is 1234 · 5 wrong tries locks for 30 seconds</Text>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(11,12,20,0.8)' },
  backdropFill: { position: 'absolute', inset: 0 },
  sheet: {
    backgroundColor: color.surface,
    borderTopWidth: 1,
    borderTopColor: color.lineStrong,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingHorizontal: 14,
    paddingTop: 16,
    paddingBottom: 16,
  },
  grabber: {
    width: 38,
    height: 4,
    borderRadius: 2,
    backgroundColor: color.line,
    alignSelf: 'center',
    marginBottom: 14,
  },
  title: { fontFamily: font.medium, fontSize: 15, color: color.text, marginBottom: 5 },
  why: { fontFamily: font.regular, fontSize: 12, lineHeight: 18, color: color.textMuted, marginBottom: 12 },
  dots: { flexDirection: 'row', gap: 9, justifyContent: 'center', marginBottom: 12 },
  dot: {
    width: 13,
    height: 13,
    borderRadius: 7,
    borderWidth: 1,
    borderColor: color.lineStrong,
  },
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
  actions: { flexDirection: 'row', gap: 9, marginTop: 11 },
  cancel: {
    flex: 1,
    minHeight: 46,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: color.lineStrong,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelText: { fontFamily: font.medium, fontSize: 13, color: '#cfd3e5' },
  forgot: {
    flex: 1,
    minHeight: 46,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: color.line,
    alignItems: 'center',
    justifyContent: 'center',
  },
  forgotText: { fontFamily: font.medium, fontSize: 13, color: color.textDim },
  footnote: {
    textAlign: 'center',
    fontFamily: font.regular,
    fontSize: 11,
    lineHeight: 17,
    color: color.textFaint,
    marginTop: 10,
  },
});
