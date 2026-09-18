import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { color, font, radius } from '@/theme/tokens';

import { useBackupSettingsHandler } from './useBackupSettingsHandler';

/** Back up to this phone, or restore an earlier one. */
export function BackupSettings() {
  const { state, sub, backup, restore, startFresh } = useBackupSettingsHandler();

  return (
    <View>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>{state}</Text>
        <Text style={styles.cardSub}>{sub}</Text>
      </View>

      <Pressable onPress={backup} accessibilityRole="button" style={styles.primary}>
        <Text style={styles.primaryText}>Back up now</Text>
      </Pressable>
      <Pressable onPress={restore} accessibilityRole="button" style={styles.secondary}>
        <Text style={styles.secondaryText}>Restore from a backup</Text>
      </Pressable>

      <Text style={styles.hint}>
        Everything lives on this phone in Phase 1 — a weekly backup is the only safety net until the
        web dashboard lands.
      </Text>

      <Pressable onPress={startFresh} accessibilityRole="button" style={styles.danger}>
        <Text style={styles.dangerText}>Start fresh · erase this phone</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 12,
    borderRadius: radius.lg,
    backgroundColor: color.surfaceSunken,
    borderWidth: 1,
    borderColor: color.line,
    marginBottom: 12,
  },
  cardTitle: { fontFamily: font.medium, fontSize: 13, color: color.text },
  cardSub: { fontFamily: font.regular, fontSize: 11.5, lineHeight: 18, color: color.textFaint, marginTop: 4 },
  primary: {
    minHeight: 48,
    borderRadius: radius.md,
    backgroundColor: color.accentInk,
    borderWidth: 1,
    borderColor: color.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryText: { fontFamily: font.medium, fontSize: 13.5, color: color.textBright },
  secondary: {
    minHeight: 48,
    marginTop: 9,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: color.lineStrong,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryText: { fontFamily: font.medium, fontSize: 13.5, color: '#cfd3e5' },
  hint: { fontFamily: font.regular, fontSize: 11.5, lineHeight: 19, color: color.textFaint, marginTop: 12 },
  danger: {
    minHeight: 48,
    marginTop: 18,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: color.line,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dangerText: { fontFamily: font.medium, fontSize: 13, color: color.textDim },
});
