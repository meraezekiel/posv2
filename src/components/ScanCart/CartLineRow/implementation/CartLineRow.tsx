import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { CartLine } from '@/domain/catalog';
import { color, font, radius, tabularNums } from '@/theme/tokens';

import { useCartLineRowHandler } from './useCartLineRowHandler';

type CartLineRowProps = {
  line: CartLine;
  /** Tapping the name opens the price / discount / remove sheet. */
  onOpen: () => void;
};

/** One cart line: name, −/qty/+ stepper, unit price line and line total. */
export function CartLineRow({ line, onOpen }: CartLineRowProps) {
  const { unitLine, total, inc, dec } = useCartLineRowHandler(line);

  return (
    <View style={styles.row}>
      <Pressable onPress={onOpen} accessibilityRole="button" accessibilityLabel={`Edit ${line.name}`}>
        <Text style={styles.name} numberOfLines={2}>
          {line.name}
        </Text>
      </Pressable>
      <View style={styles.controls}>
        <View style={styles.stepper}>
          <Pressable
            onPress={dec}
            accessibilityRole="button"
            accessibilityLabel={`Remove one ${line.name}`}
            style={styles.stepBtn}>
            <Text style={styles.stepText}>−</Text>
          </Pressable>
          <Text style={styles.qty}>{line.qty}</Text>
          <Pressable
            onPress={inc}
            accessibilityRole="button"
            accessibilityLabel={`Add one ${line.name}`}
            style={styles.stepBtn}>
            <Text style={styles.stepText}>+</Text>
          </Pressable>
        </View>
        <Text style={styles.unitLine} numberOfLines={1}>
          {unitLine}
        </Text>
        <Text style={styles.total}>{total}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    gap: 7,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: color.hairlineSoft,
  },
  name: { fontFamily: font.medium, fontSize: 13.5, lineHeight: 18, color: color.text },
  controls: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  stepper: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  stepBtn: {
    width: 34,
    height: 34,
    borderRadius: radius.sm,
    backgroundColor: color.surface,
    borderWidth: 1,
    borderColor: color.line,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepText: { fontFamily: font.medium, fontSize: 16, color: color.text },
  qty: { minWidth: 26, textAlign: 'center', fontFamily: font.medium, fontSize: 13.5, color: color.text },
  unitLine: { flex: 1, fontFamily: font.regular, fontSize: 11.5, color: color.textFaint },
  total: { fontFamily: font.medium, fontSize: 14, color: color.text, ...tabularNums },
});
