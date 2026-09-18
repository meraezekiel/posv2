import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { Product } from '@/domain/catalog';
import { color, font, tabularNums } from '@/theme/tokens';

import { useInventoryRowHandler } from './useInventoryRowHandler';

type InventoryRowProps = {
  product: Product;
};

/** Stock line with its LOW / OUT badge and the two stock actions. */
export function InventoryRow({ product }: InventoryRowProps) {
  const { stockLine, stockColor, badge, stockIn, adjust } = useInventoryRowHandler(product);

  return (
    <View style={styles.row}>
      <View style={styles.left}>
        <Text style={styles.name} numberOfLines={2}>
          {product.name}
        </Text>
        <View style={styles.metaRow}>
          <Text style={[styles.stock, { color: stockColor }]}>{stockLine}</Text>
          {badge ? (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{badge}</Text>
            </View>
          ) : null}
        </View>
      </View>
      <Pressable
        onPress={stockIn}
        accessibilityRole="button"
        accessibilityLabel={`Stock in ${product.name}`}
        style={styles.primary}>
        <Text style={styles.primaryText}>Stock in</Text>
      </Pressable>
      <Pressable
        onPress={adjust}
        accessibilityRole="button"
        accessibilityLabel={`Adjust ${product.name}`}
        style={styles.secondary}>
        <Text style={styles.secondaryText}>Adjust</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 11,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: color.hairlineSoft,
  },
  left: { flex: 1, minWidth: 0 },
  name: { fontFamily: font.medium, fontSize: 13.5, lineHeight: 18, color: color.text },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 },
  stock: { fontFamily: font.regular, fontSize: 11.5, ...tabularNums },
  badge: {
    paddingVertical: 3,
    paddingHorizontal: 6,
    borderRadius: 20,
    backgroundColor: color.accentInk,
    borderWidth: 1,
    borderColor: color.accentLine,
  },
  badgeText: { fontFamily: font.medium, fontSize: 10, color: color.accentPale },
  primary: {
    minHeight: 38,
    paddingHorizontal: 12,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: color.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryText: { fontFamily: font.medium, fontSize: 12, color: color.textBright },
  secondary: {
    minHeight: 38,
    paddingHorizontal: 10,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: color.line,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryText: { fontFamily: font.medium, fontSize: 12, color: color.textDim },
});
