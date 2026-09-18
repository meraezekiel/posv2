import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { color, font, tabularNums } from '@/theme/tokens';

import { SaleRowData, useSaleRowHandler } from './useSaleRowHandler';

type SaleRowProps = {
  row: SaleRowData;
};

/** One sale in the history list, with the day header when the day turns over. */
export function SaleRow({ row }: SaleRowProps) {
  const { open, voidedish } = useSaleRowHandler(row);

  return (
    <View>
      {row.dayHeader ? (
        <View style={styles.dayHeader}>
          <Text style={styles.dayLabel}>{row.dayHeader}</Text>
          <Text style={styles.dayTotal}>{row.dayTotal}</Text>
        </View>
      ) : null}

      <Pressable
        onPress={open}
        accessibilityRole="button"
        accessibilityLabel={`Sale ${row.no}`}
        style={styles.row}>
        <View style={styles.left}>
          <View style={styles.titleRow}>
            <Text style={styles.time}>{row.time}</Text>
            <View style={[styles.badge, voidedish && styles.badgeOn]}>
              <Text style={[styles.badgeText, voidedish && styles.badgeTextOn]}>{row.status}</Text>
            </View>
          </View>
          <Text style={styles.meta} numberOfLines={1}>
            {row.meta}
          </Text>
        </View>
        <View style={styles.right}>
          <Text style={[styles.total, voidedish && styles.totalVoided]}>{row.total}</Text>
          <Text style={styles.no}>{row.no}</Text>
        </View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  dayHeader: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    paddingTop: 11,
    paddingHorizontal: 12,
    paddingBottom: 7,
    backgroundColor: color.navBar,
    borderBottomWidth: 1,
    borderBottomColor: color.hairlineSoft,
  },
  dayLabel: {
    fontFamily: font.semibold,
    fontSize: 10.5,
    letterSpacing: 1.15,
    textTransform: 'uppercase',
    color: '#9690c9',
  },
  dayTotal: { fontFamily: font.medium, fontSize: 11.5, color: color.textMuted, ...tabularNums },

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
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  time: { fontFamily: font.medium, fontSize: 13.5, color: color.text },
  badge: {
    paddingVertical: 4,
    paddingHorizontal: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: color.line,
  },
  badgeOn: { borderColor: color.accentLine, backgroundColor: color.accentInk },
  badgeText: {
    fontFamily: font.medium,
    fontSize: 9.5,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    color: color.textFaint,
  },
  badgeTextOn: { color: color.accentPale },
  meta: { fontFamily: font.regular, fontSize: 11.5, color: color.textFaint, marginTop: 3 },
  right: { alignItems: 'flex-end' },
  total: { fontFamily: font.medium, fontSize: 14, color: color.text, ...tabularNums },
  totalVoided: { color: color.textFaint, textDecorationLine: 'line-through' },
  no: { fontFamily: font.regular, fontSize: 11, color: color.textFaint, marginTop: 4 },
});
