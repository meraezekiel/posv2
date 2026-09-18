import React from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

import { FilterChips } from '@/components/FilterChips/implementation/FilterChips';
import { GlobalToast } from '@/components/GlobalToast/implementation/GlobalToast';
import type { Product } from '@/domain/catalog';
import { color, font, radius } from '@/theme/tokens';

import { InventoryRow } from '../InventoryRow/implementation/InventoryRow';
import { useInventoryHandler } from './useInventoryHandler';

/** Stock overview: all / low / out, each row with stock-in and adjust. */
export function Inventory() {
  const { back, summary, filters, filter, setFilter, list } = useInventoryHandler();

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <View style={styles.titleLeft}>
            <Pressable onPress={back} accessibilityRole="button" accessibilityLabel="Back" style={styles.backBtn}>
              <Text style={styles.backText}>‹</Text>
            </Pressable>
            <Text style={styles.title}>Inventory</Text>
          </View>
          <Text style={styles.summary}>{summary}</Text>
        </View>
        <FilterChips options={filters} selected={filter} onSelect={setFilter} />
      </View>

      <FlatList<Product>
        data={list}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <InventoryRow product={item} />}
        ListFooterComponent={
          <Text style={styles.footnote}>
            Every stock-in and adjustment is written to that product&apos;s movement history —
            visible on its detail page.
          </Text>
        }
      />

      <GlobalToast />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: color.bg },
  header: {
    paddingTop: 12,
    paddingHorizontal: 12,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: color.hairline,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  titleLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: color.line,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backText: { fontFamily: font.regular, fontSize: 15, color: color.text },
  title: { fontFamily: font.medium, fontSize: 16, color: color.text },
  summary: { fontFamily: font.regular, fontSize: 11.5, color: color.textFaint },
  footnote: {
    paddingTop: 14,
    paddingHorizontal: 12,
    paddingBottom: 18,
    fontFamily: font.regular,
    fontSize: 11.5,
    lineHeight: 18,
    color: color.textFaint,
  },
});
