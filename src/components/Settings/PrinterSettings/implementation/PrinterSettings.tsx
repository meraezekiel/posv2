import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { FilterChips } from '@/components/FilterChips/implementation/FilterChips';
import { ToggleSwitch } from '@/components/ToggleSwitch/implementation/ToggleSwitch';
import { color, font, radius } from '@/theme/tokens';

import { usePrinterSettingsHandler } from './usePrinterSettingsHandler';

/** Pair a Bluetooth printer, pick paper width, auto-print, test page. */
export function PrinterSettings() {
  const {
    status,
    sub,
    paired,
    searchLabel,
    search,
    devices,
    paperOptions,
    paper,
    setPaper,
    auto,
    toggleAuto,
    testPage,
  } = usePrinterSettingsHandler();

  return (
    <View>
      <View style={[styles.card, paired && styles.cardPaired]}>
        <Text style={styles.cardTitle}>{status}</Text>
        <Text style={styles.cardSub}>{sub}</Text>
      </View>

      <Pressable onPress={search} accessibilityRole="button" style={styles.primary}>
        <Text style={styles.primaryText}>{searchLabel}</Text>
      </Pressable>

      {devices.map((device) => (
        <Pressable
          key={device.name}
          onPress={device.pair}
          accessibilityRole="button"
          style={[styles.device, device.paired && styles.devicePaired]}>
          <View style={styles.deviceText}>
            <Text style={styles.deviceName}>{device.name}</Text>
            <Text style={styles.deviceSub}>{device.sub}</Text>
          </View>
          <Text style={styles.deviceAction}>{device.action}</Text>
        </Pressable>
      ))}

      <Text style={styles.label}>Paper width</Text>
      <View style={styles.paperRow}>
        <FilterChips options={paperOptions} selected={paper} onSelect={setPaper} />
      </View>

      <ToggleSwitch
        label="Auto-print after every sale"
        sub="Skips the receipt screen entirely."
        value={auto}
        onToggle={toggleAuto}
      />

      <Pressable onPress={testPage} accessibilityRole="button" style={styles.secondary}>
        <Text style={styles.secondaryText}>Print a test page</Text>
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
  cardPaired: { borderColor: color.accentLine },
  cardTitle: { fontFamily: font.medium, fontSize: 13, color: color.text },
  cardSub: { fontFamily: font.regular, fontSize: 11.5, lineHeight: 18, color: color.textFaint, marginTop: 4 },

  primary: {
    minHeight: 48,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: color.accent,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  primaryText: { fontFamily: font.medium, fontSize: 13.5, color: color.textBright },

  device: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 11,
    paddingHorizontal: 12,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: color.line,
    marginBottom: 8,
  },
  devicePaired: { borderColor: color.accent, backgroundColor: color.accentInk },
  deviceText: { flex: 1, minWidth: 0 },
  deviceName: { fontFamily: font.regular, fontSize: 12.5, color: color.text },
  deviceSub: { fontFamily: font.regular, fontSize: 11, color: color.textFaint, marginTop: 3 },
  deviceAction: { fontFamily: font.medium, fontSize: 11.5, color: color.accentSoft },

  label: { fontFamily: font.regular, fontSize: 11.5, color: color.textDim, marginTop: 16, marginBottom: 7 },
  paperRow: { marginBottom: 14 },

  secondary: {
    minHeight: 46,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: color.lineStrong,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  secondaryText: { fontFamily: font.medium, fontSize: 13, color: '#cfd3e5' },
});
