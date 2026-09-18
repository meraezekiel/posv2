import { Image } from 'expo-image';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { Product } from '@/domain/catalog';
import { color, font, radius, tabularNums } from '@/theme/tokens';

import { useProductRowHandler } from './useProductRowHandler';

type ProductRowProps = {
  product: Product;
};

/** One product row: thumb, name, stock line with LOW badge, price. */
export function ProductRow({ product }: ProductRowProps) {
  const { stockLine, low, price, open } = useProductRowHandler(product);

  return (
    <Pressable
      onPress={open}
      accessibilityRole="button"
      accessibilityLabel={`Edit ${product.name}`}
      style={styles.row}>
      {product.photo ? (
        <Image source={{ uri: product.photo }} style={styles.thumb} contentFit="cover" />
      ) : (
        <View style={styles.thumb} />
      )}
      <View style={styles.middle}>
        <Text style={styles.name} numberOfLines={2}>
          {product.name}
        </Text>
        <View style={styles.metaRow}>
          <Text style={styles.stock}>{stockLine}</Text>
          {low ? (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>LOW</Text>
            </View>
          ) : null}
        </View>
      </View>
      <Text style={styles.price}>{price}</Text>
    </Pressable>
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
  thumb: {
    width: 38,
    height: 38,
    borderRadius: radius.sm,
    backgroundColor: color.surface,
    borderWidth: 1,
    borderColor: color.line,
  },
  middle: { flex: 1, minWidth: 0 },
  name: { fontFamily: font.medium, fontSize: 13.5, lineHeight: 18, color: color.text },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 3 },
  stock: { fontFamily: font.regular, fontSize: 11.5, color: color.textFaint },
  badge: {
    paddingVertical: 3,
    paddingHorizontal: 6,
    borderRadius: 20,
    backgroundColor: color.accentInk,
    borderWidth: 1,
    borderColor: color.accentLine,
  },
  badgeText: { fontFamily: font.medium, fontSize: 10, color: color.accentPale },
  price: { fontFamily: font.medium, fontSize: 13.5, color: color.text, ...tabularNums },
});
