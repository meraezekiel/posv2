import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { FilterChips } from '@/components/FilterChips/implementation/FilterChips';
import { ToggleSwitch } from '@/components/ToggleSwitch/implementation/ToggleSwitch';
import { color, font, radius } from '@/theme/tokens';

import { useScannerSettingsHandler } from './useScannerSettingsHandler';

/** Scan feedback, default scan mode and Bluetooth scanner pairing. */
export function ScannerSettings() {
  const { toggles, modeOptions, mode, setMode, pair } = useScannerSettingsHandler();

  return (
    <View>
      {toggles.map((toggle) => (
        <ToggleSwitch
          key={toggle.label}
          label={toggle.label}
          sub={toggle.sub}
          value={toggle.value}
          onToggle={toggle.onToggle}
        />
      ))}

      <Text style={styles.label}>Default scan mode</Text>
      <View style={styles.modeRow}>
        <FilterChips options={modeOptions} selected={mode} onSelect={setMode} />
      </View>

      <Pressable onPress={pair} accessibilityRole="button" style={styles.primary}>
        <Text style={styles.primaryText}>Pair a Bluetooth scanner</Text>
      </Pressable>
      <Text style={styles.hint}>
        A handheld scanner frees the screen up — the cart then fills the whole phone.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  label: { fontFamily: font.regular, fontSize: 11.5, color: color.textDim, marginTop: 16, marginBottom: 7 },
  modeRow: { marginBottom: 16 },
  primary: {
    minHeight: 48,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: color.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryText: { fontFamily: font.medium, fontSize: 13.5, color: color.textBright },
  hint: { fontFamily: font.regular, fontSize: 11.5, lineHeight: 18, color: color.textFaint, marginTop: 10 },
});
