import React from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';

import { color, font, radius } from '@/theme/tokens';

import { useConfirmDialogHandler } from './useConfirmDialogHandler';

/** The one confirmation dialog — clear cart, discard held, delete product, restore. */
export function ConfirmDialog() {
  const { request, confirm, cancel } = useConfirmDialogHandler();

  return (
    <Modal visible={!!request} transparent animationType="fade" onRequestClose={cancel}>
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <Text style={styles.title}>{request?.title}</Text>
          <Text style={styles.body}>{request?.body}</Text>
          <Pressable onPress={confirm} accessibilityRole="button" style={styles.yes}>
            <Text style={styles.yesText}>{request?.label}</Text>
          </Pressable>
          <Pressable onPress={cancel} accessibilityRole="button" style={styles.no}>
            <Text style={styles.noText}>Cancel</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 18,
    backgroundColor: 'rgba(11,12,20,0.78)',
  },
  card: {
    width: '100%',
    maxWidth: 300,
    padding: 16,
    borderRadius: radius.xl,
    backgroundColor: color.surface,
    borderWidth: 1,
    borderColor: color.lineStrong,
    elevation: 18,
  },
  title: { fontFamily: font.medium, fontSize: 15, color: color.text, marginBottom: 6 },
  body: { fontFamily: font.regular, fontSize: 12, lineHeight: 19, color: color.textMuted, marginBottom: 14 },
  yes: {
    minHeight: 48,
    borderRadius: radius.md,
    backgroundColor: color.accentInk,
    borderWidth: 1,
    borderColor: color.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  yesText: { fontFamily: font.medium, fontSize: 13.5, color: color.textBright },
  no: {
    minHeight: 46,
    marginTop: 9,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: color.lineStrong,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noText: { fontFamily: font.medium, fontSize: 13, color: '#cfd3e5' },
});
