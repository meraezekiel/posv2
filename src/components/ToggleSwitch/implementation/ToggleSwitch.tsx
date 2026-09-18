import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { color, font, radius } from '@/theme/tokens';

import { useToggleSwitchHandler } from './useToggleSwitchHandler';

type ToggleSwitchProps = {
  label: string;
  sub?: string;
  value: boolean;
  onToggle: () => void;
};

/** Settings row with the pill switch from the mockup. */
export function ToggleSwitch({ label, sub, value, onToggle }: ToggleSwitchProps) {
  const { trackStyle, knobStyle } = useToggleSwitchHandler(value);

  return (
    <Pressable
      onPress={onToggle}
      accessibilityRole="switch"
      accessibilityState={{ checked: value }}
      accessibilityLabel={label}
      style={styles.row}>
      <View style={styles.text}>
        <Text style={styles.label}>{label}</Text>
        {sub ? <Text style={styles.sub}>{sub}</Text> : null}
      </View>
      <View style={[styles.track, trackStyle]}>
        <View style={[styles.knob, knobStyle]} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 11,
    padding: 12,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: color.line,
    marginBottom: 8,
  },
  text: { flex: 1, minWidth: 0 },
  label: { fontFamily: font.regular, fontSize: 12.5, color: color.text },
  sub: { fontFamily: font.regular, fontSize: 11, lineHeight: 15, color: color.textFaint, marginTop: 3 },
  track: { width: 40, height: 23, borderRadius: 12, borderWidth: 1 },
  knob: { position: 'absolute', top: 2, width: 17, height: 17, borderRadius: 9 },
});
