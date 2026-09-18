import React from 'react';
import { ActivityIndicator, Modal, StyleSheet, Text, View } from 'react-native';

import { color, font, radius } from '@/theme/tokens';

import { useBusyOverlayHandler } from './useBusyOverlayHandler';

/** Spinner shown while pairing, printing, backing up or restoring. */
export function BusyOverlay() {
  const { label } = useBusyOverlayHandler();

  return (
    <Modal visible={!!label} transparent animationType="fade">
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <ActivityIndicator size="small" color={color.accentSoft} />
          <Text style={styles.text}>{label}</Text>
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
    backgroundColor: 'rgba(11,12,20,0.66)',
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 13,
    paddingHorizontal: 16,
    borderRadius: radius.lg,
    backgroundColor: color.surface,
    borderWidth: 1,
    borderColor: color.accentLine,
  },
  text: { fontFamily: font.medium, fontSize: 12.5, color: color.textBright },
});
