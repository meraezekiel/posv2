import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { color, font, radius, tabularNums } from '@/theme/tokens';

import { useChargeBarHandler } from './useChargeBarHandler';

/** Sticky footer: item count, VAT line, total and the Charge button. */
export function ChargeBar() {
  const { countLabel, vatLine, totalLabel, enabled, charge } = useChargeBarHandler();

  return (
    <View style={styles.bar}>
      <View style={styles.summary}>
        <Text style={styles.meta}>
          {countLabel} · {vatLine}
        </Text>
        <Text style={styles.total}>{totalLabel}</Text>
      </View>
      <Pressable
        onPress={charge}
        disabled={!enabled}
        accessibilityRole="button"
        accessibilityState={{ disabled: !enabled }}
        style={[styles.button, enabled ? styles.buttonOn : styles.buttonOff]}>
        <Text style={[styles.buttonText, !enabled && styles.buttonTextOff]}>
          Charge {totalLabel}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    paddingTop: 10,
    paddingHorizontal: 12,
    paddingBottom: 12,
    backgroundColor: color.bg,
    borderTopWidth: 1,
    borderTopColor: color.hairline,
  },
  summary: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  meta: { fontFamily: font.regular, fontSize: 12, color: color.textDim },
  total: { fontFamily: font.medium, fontSize: 19, color: color.text, ...tabularNums },
  button: {
    width: '100%',
    minHeight: 52,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  buttonOn: { backgroundColor: color.accentInk, borderColor: color.accent },
  buttonOff: { backgroundColor: 'transparent', borderColor: color.line, opacity: 0.7 },
  buttonText: { fontFamily: font.medium, fontSize: 15, color: color.textBright },
  buttonTextOff: { color: color.lineStrong },
});
