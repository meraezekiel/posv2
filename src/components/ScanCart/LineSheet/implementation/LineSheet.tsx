import React from 'react';
import { Modal, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { color, font, radius } from '@/theme/tokens';

import { useLineSheetHandler } from './useLineSheetHandler';

type LineSheetProps = {
  lineId: string | null;
  onClose: () => void;
};

/** Tap a cart line: override its price, take a quick discount, or drop it. */
export function LineSheet({ lineId, onClose }: LineSheetProps) {
  const { line, sub, draft, setDraft, discounts, apply, remove } = useLineSheetHandler({
    lineId,
    onClose,
  });

  return (
    <Modal visible={!!line} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <Pressable style={styles.backdropFill} onPress={onClose} accessibilityLabel="Dismiss" />
        <View style={styles.sheet}>
          <View style={styles.grabber} />
          <Text style={styles.title}>{line?.name}</Text>
          <Text style={styles.sub}>{sub}</Text>

          <Text style={styles.label}>Price on this sale</Text>
          <TextInput
            value={draft}
            onChangeText={setDraft}
            placeholder="0.00"
            placeholderTextColor={color.textFaint}
            keyboardType="decimal-pad"
            style={styles.input}
          />

          <Text style={styles.label}>Quick discount</Text>
          <View style={styles.discounts}>
            {discounts.map((d) => (
              <Pressable key={d.label} onPress={d.set} accessibilityRole="button" style={styles.discount}>
                <Text style={styles.discountText}>{d.label}</Text>
              </Pressable>
            ))}
          </View>

          <Pressable onPress={apply} accessibilityRole="button" style={styles.apply}>
            <Text style={styles.applyText}>Apply to this line</Text>
          </Pressable>
          <Pressable onPress={remove} accessibilityRole="button" style={styles.remove}>
            <Text style={styles.removeText}>Remove this line</Text>
          </Pressable>
          <Pressable onPress={onClose} accessibilityRole="button" style={styles.cancel}>
            <Text style={styles.cancelText}>Cancel</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(11,12,20,0.72)' },
  backdropFill: { position: 'absolute', inset: 0 },
  sheet: {
    backgroundColor: color.surface,
    borderTopWidth: 1,
    borderTopColor: color.lineStrong,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 16,
  },
  grabber: {
    width: 38,
    height: 4,
    borderRadius: 2,
    backgroundColor: color.line,
    alignSelf: 'center',
    marginBottom: 14,
  },
  title: { fontFamily: font.medium, fontSize: 15, color: color.text, marginBottom: 4 },
  sub: { fontFamily: font.regular, fontSize: 11.5, lineHeight: 18, color: color.textFaint, marginBottom: 14 },
  label: { fontFamily: font.regular, fontSize: 11.5, color: color.textDim, marginBottom: 6 },
  input: {
    height: 46,
    paddingHorizontal: 12,
    marginBottom: 12,
    borderRadius: radius.md,
    backgroundColor: color.surfaceSunken,
    borderWidth: 1,
    borderColor: color.line,
    color: color.text,
    fontFamily: font.regular,
    fontSize: 15,
  },
  discounts: { flexDirection: 'row', gap: 7, marginBottom: 14 },
  discount: {
    flex: 1,
    minHeight: 44,
    borderRadius: 9,
    backgroundColor: color.surfaceSunken,
    borderWidth: 1,
    borderColor: color.line,
    alignItems: 'center',
    justifyContent: 'center',
  },
  discountText: { fontFamily: font.medium, fontSize: 12.5, color: color.text },
  apply: {
    minHeight: 50,
    borderRadius: radius.md,
    backgroundColor: color.accentInk,
    borderWidth: 1,
    borderColor: color.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  applyText: { fontFamily: font.medium, fontSize: 14, color: color.textBright },
  remove: {
    minHeight: 48,
    marginTop: 9,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: color.lineStrong,
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeText: { fontFamily: font.medium, fontSize: 13.5, color: '#cfd3e5' },
  cancel: {
    minHeight: 44,
    marginTop: 9,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: color.line,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelText: { fontFamily: font.medium, fontSize: 13, color: color.textDim },
});
