import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { FilterChips } from '@/components/FilterChips/implementation/FilterChips';
import { GlobalToast } from '@/components/GlobalToast/implementation/GlobalToast';
import { color, font } from '@/theme/tokens';

import { SaleRow } from '../SaleRow/implementation/SaleRow';
import { useSalesHistoryHandler } from './useSalesHistoryHandler';

/** Sales history grouped by day, filtered by payment method. */
export function SalesHistory() {
  const { summary, filters, filter, setFilter, rows, heldLine, openHeld } = useSalesHistoryHandler();

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>Sales</Text>
          <Text style={styles.summary}>{summary}</Text>
        </View>
        <FilterChips options={filters} selected={filter} onSelect={setFilter} scrollable />
      </View>

      <ScrollView style={styles.list}>
        {rows.length ? (
          rows.map((row) => <SaleRow key={row.no} row={row} />)
        ) : (
          <View style={styles.empty}>
            <Text style={styles.emptyTitle}>No sales match that filter</Text>
            <Text style={styles.emptyBody}>Try &quot;All&quot;, or ring up a sale on the Sell tab.</Text>
          </View>
        )}
        <Pressable onPress={openHeld} accessibilityRole="button" style={styles.held}>
          <Text style={styles.heldText}>Held sales: {heldLine}</Text>
        </Pressable>
      </ScrollView>

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
    alignItems: 'baseline',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  title: { fontFamily: font.medium, fontSize: 16, color: color.text },
  summary: { fontFamily: font.regular, fontSize: 11.5, color: color.textFaint },
  list: { flex: 1, minHeight: 0 },
  empty: { paddingVertical: 30, paddingHorizontal: 22, alignItems: 'center' },
  emptyTitle: { fontFamily: font.medium, fontSize: 14, color: color.text, marginBottom: 5 },
  emptyBody: {
    fontFamily: font.regular,
    fontSize: 12,
    lineHeight: 18,
    color: color.textFaint,
    textAlign: 'center',
  },
  held: { paddingTop: 14, paddingHorizontal: 12, paddingBottom: 18 },
  heldText: { fontFamily: font.regular, fontSize: 11.5, lineHeight: 17, color: color.textFaint },
});
