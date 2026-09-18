import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { BusyOverlay } from '@/components/BusyOverlay/implementation/BusyOverlay';
import { GlobalToast } from '@/components/GlobalToast/implementation/GlobalToast';
import { color, font, radius } from '@/theme/tokens';

import { BackupSettings } from '../BackupSettings/implementation/BackupSettings';
import { PrinterSettings } from '../PrinterSettings/implementation/PrinterSettings';
import { ScannerSettings } from '../ScannerSettings/implementation/ScannerSettings';
import { UsersSettings } from '../UsersSettings/implementation/UsersSettings';
import { useSettingsHandler } from './useSettingsHandler';

/** Shell for the four settings sub-pages behind More. */
export function Settings() {
  const { back, title, page } = useSettingsHandler();

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Pressable onPress={back} accessibilityRole="button" accessibilityLabel="Back" style={styles.backBtn}>
          <Text style={styles.backText}>‹</Text>
        </Pressable>
        <Text style={styles.headerTitle}>{title}</Text>
      </View>

      <ScrollView style={styles.body} contentContainerStyle={styles.bodyContent}>
        {page === 'printer' ? <PrinterSettings /> : null}
        {page === 'scanner' ? <ScannerSettings /> : null}
        {page === 'users' ? <UsersSettings /> : null}
        {page === 'backup' ? <BackupSettings /> : null}
      </ScrollView>

      <GlobalToast />
      <BusyOverlay />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: color.bg },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: color.hairline,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: color.line,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backText: { fontFamily: font.regular, fontSize: 15, color: color.text },
  headerTitle: { fontFamily: font.medium, fontSize: 15, color: color.text },
  body: { flex: 1, minHeight: 0 },
  bodyContent: { padding: 12, paddingBottom: 24 },
});
