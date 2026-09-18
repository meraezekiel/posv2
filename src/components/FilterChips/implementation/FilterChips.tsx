import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { color, font } from '@/theme/tokens';

import { useFilterChipsHandler } from './useFilterChipsHandler';

export type ChipOption = {
  key: string;
  label: string;
};

type FilterChipsProps = {
  options: ChipOption[];
  selected: string;
  onSelect: (key: string) => void;
  /** Sales and Reports scroll their rows; Inventory's three fit as-is. */
  scrollable?: boolean;
};

/** The pill filter row used by Sales, Inventory and Reports. */
export function FilterChips({ options, selected, onSelect, scrollable = false }: FilterChipsProps) {
  const { chips } = useFilterChipsHandler({ options, selected, onSelect });

  const row = chips.map((chip) => (
    <Pressable
      key={chip.key}
      onPress={chip.press}
      accessibilityRole="button"
      accessibilityState={{ selected: chip.active }}
      style={[styles.chip, chip.active && styles.chipOn]}>
      <Text style={[styles.label, chip.active && styles.labelOn]}>{chip.label}</Text>
    </Pressable>
  ));

  // Reason pickers wrap onto more lines; filter rows scroll sideways instead.
  if (!scrollable) return <View style={[styles.row, styles.rowWrap]}>{row}</View>;

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}>
      {row}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 6, paddingBottom: 2 },
  rowWrap: { flexWrap: 'wrap', rowGap: 7 },
  chip: {
    minHeight: 38,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: color.line,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipOn: { backgroundColor: color.accentInk, borderColor: color.accent },
  label: { fontFamily: font.medium, fontSize: 12, color: color.textMuted },
  labelOn: { color: color.textBright },
});
