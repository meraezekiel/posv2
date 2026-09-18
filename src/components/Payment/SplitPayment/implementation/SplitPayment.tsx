import React from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { color, font, radius, tabularNums } from '@/theme/tokens';

import { useSplitPaymentHandler } from './useSplitPaymentHandler';

/** Part cash, part GCash — the remainder has to reach zero. */
export function SplitPayment() {
  const {
    cash,
    setCash,
    wallet,
    setWallet,
    remainLabel,
    remain,
    remainColor,
    putRestOnWallet,
  } = useSplitPaymentHandler();

  return (
    <View>
      <Text style={styles.label}>Cash part</Text>
      <TextInput
        value={cash}
        onChangeText={setCash}
        placeholder="0.00"
        placeholderTextColor={color.textFaint}
        keyboardType="decimal-pad"
        style={[styles.input, styles.inputSpaced]}
      />
      <Text style={styles.label}>GCash part</Text>
      <TextInput
        value={wallet}
        onChangeText={setWallet}
        placeholder="0.00"
        placeholderTextColor={color.textFaint}
        keyboardType="decimal-pad"
        style={styles.input}
      />

      <View style={styles.remainRow}>
        <Text style={styles.remainLabel}>{remainLabel}</Text>
        <Text style={[styles.remainValue, { color: remainColor }]}>{remain}</Text>
      </View>

      <Pressable onPress={putRestOnWallet} accessibilityRole="button" style={styles.rest}>
        <Text style={styles.restText}>Put the rest on GCash</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  label: { fontFamily: font.regular, fontSize: 11.5, color: color.textDim, marginBottom: 6 },
  input: {
    height: 46,
    paddingHorizontal: 12,
    borderRadius: radius.md,
    backgroundColor: color.surfaceSunken,
    borderWidth: 1,
    borderColor: color.line,
    color: color.text,
    fontFamily: font.regular,
    fontSize: 15,
  },
  inputSpaced: { marginBottom: 11 },
  remainRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginTop: 13,
  },
  remainLabel: { fontFamily: font.regular, fontSize: 12.5, color: color.textDim },
  remainValue: { fontFamily: font.medium, fontSize: 18, ...tabularNums },
  rest: {
    minHeight: 44,
    marginTop: 11,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: color.lineStrong,
    alignItems: 'center',
    justifyContent: 'center',
  },
  restText: { fontFamily: font.medium, fontSize: 12.5, color: '#cfd3e5' },
});
