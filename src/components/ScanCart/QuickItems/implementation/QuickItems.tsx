import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { color, font, radius } from '@/theme/tokens';

import { useQuickItemsHandler } from './useQuickItemsHandler';

/** Grid of favourite, no-barcode items — shown when the camera is hidden. */
export function QuickItems() {
  const { items } = useQuickItemsHandler();
  if (!items.length) return null;

  return (
    <View style={styles.wrap}>
      <Text style={styles.heading}>Quick items · no barcode</Text>
      <View style={styles.grid}>
        {items.map((item) => (
          <Pressable
            key={item.id}
            onPress={item.add}
            accessibilityRole="button"
            accessibilityLabel={`Add ${item.name}`}
            style={styles.tile}>
            <Text style={styles.name} numberOfLines={1}>
              {item.name}
            </Text>
            <Text style={styles.price}>{item.price}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { paddingTop: 12, paddingHorizontal: 14, paddingBottom: 6 },
  heading: {
    fontFamily: font.semibold,
    fontSize: 11,
    letterSpacing: 1.1,
    textTransform: 'uppercase',
    color: color.textFaint,
    marginBottom: 9,
  },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  tile: {
    // Two per row on small phones, more as the grid widens.
    flexGrow: 1,
    flexBasis: 88,
    minHeight: 58,
    padding: 8,
    borderRadius: radius.md,
    backgroundColor: color.surface,
    borderWidth: 1,
    borderColor: color.line,
    justifyContent: 'center',
  },
  name: { fontFamily: font.medium, fontSize: 12, color: color.text },
  price: { fontFamily: font.regular, fontSize: 11, color: '#9690c9', marginTop: 3 },
});
