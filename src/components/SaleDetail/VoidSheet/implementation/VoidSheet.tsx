import React from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';

import { FilterChips } from '@/components/FilterChips/implementation/FilterChips';
import { color, font, radius } from '@/theme/tokens';

import { useVoidSheetHandler } from './useVoidSheetHandler';

type VoidSheetProps = {
  visible: boolean;
  saleNo: string;
  saleTotal: string;
  onCancel: () => void;
  onConfirm: (reason: string) => void;
};

/** Confirmation sheet for a void: reason first, then the irreversible button. */
export function VoidSheet({ visible, saleNo, saleTotal, onCancel, onConfirm }: VoidSheetProps) {
  const { reasons, reason, setReason, canVoid, confirm, label } = useVoidSheetHandler({
    visible,
    onConfirm,
  });

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onCancel}>
      <View style={styles.backdrop}>
        <Pressable style={styles.backdropFill} onPress={onCancel} accessibilityLabel="Dismiss" />
        <View style={styles.sheet}>
          <View style={styles.grabber} />
          <Text style={styles.title}>Void sale {saleNo}?</Text>
          <Text style={styles.body}>
            {saleTotal} comes off today&apos;s totals and the stock goes back. This can&apos;t be
            undone.
          </Text>

          <Text style={styles.label}>Reason</Text>
          <View style={styles.reasons}>
            <FilterChips options={reasons} selected={reason ?? ''} onSelect={setReason} />
          </View>

          <Pressable
            onPress={confirm}
            disabled={!canVoid}
            accessibilityRole="button"
            accessibilityState={{ disabled: !canVoid }}
            style={[styles.confirm, canVoid ? styles.confirmOn : styles.confirmOff]}>
            <Text style={[styles.confirmText, !canVoid && styles.confirmTextOff]}>{label}</Text>
          </Pressable>
          <Pressable onPress={onCancel} accessibilityRole="button" style={styles.keep}>
            <Text style={styles.keepText}>Keep the sale</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(11,12,20,0.75)' },
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
  title: { fontFamily: font.medium, fontSize: 15, color: color.text, marginBottom: 5 },
  body: { fontFamily: font.regular, fontSize: 12, lineHeight: 19, color: color.textMuted, marginBottom: 12 },
  label: { fontFamily: font.regular, fontSize: 11.5, color: color.textDim, marginBottom: 7 },
  reasons: { marginBottom: 14 },
  confirm: {
    width: '100%',
    minHeight: 52,
    borderRadius: 11,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmOn: { backgroundColor: color.accentInk, borderColor: color.accent },
  confirmOff: { borderColor: color.line, opacity: 0.7 },
  confirmText: { fontFamily: font.medium, fontSize: 15, color: color.textBright },
  confirmTextOff: { color: color.lineStrong },
  keep: {
    width: '100%',
    minHeight: 48,
    marginTop: 9,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: color.lineStrong,
    alignItems: 'center',
    justifyContent: 'center',
  },
  keepText: { fontFamily: font.medium, fontSize: 13.5, color: '#cfd3e5' },
});
