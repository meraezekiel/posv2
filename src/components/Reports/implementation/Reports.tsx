import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { FilterChips } from '@/components/FilterChips/implementation/FilterChips';
import { GlobalToast } from '@/components/GlobalToast/implementation/GlobalToast';
import { color, font, radius, tabularNums } from '@/theme/tokens';

import { useReportsHandler } from './useReportsHandler';

/** Today at a glance, best sellers, payment split, low stock, end-of-day. */
export function Reports() {
  const {
    ranges,
    range,
    setRange,
    rangeLabel,
    total,
    stats,
    bestSellers,
    byMethod,
    lowCount,
    lowList,
    eodCta,
    goEod,
    exportCsv,
  } = useReportsHandler();

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.title}>Reports</Text>
        <FilterChips options={ranges} selected={range} onSelect={setRange} scrollable />
      </View>

      <ScrollView style={styles.body} contentContainerStyle={styles.bodyContent}>
        <View style={styles.hero}>
          <Text style={styles.heroKicker}>{rangeLabel}</Text>
          <Text style={styles.heroTotal}>{total}</Text>
          <View style={styles.statRow}>
            {stats.map((stat) => (
              <View key={stat.label} style={styles.stat}>
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
            ))}
          </View>
        </View>

        <Text style={styles.sectionTitle}>Best sellers</Text>
        {bestSellers.map((item) => (
          <View key={item.name} style={styles.bar}>
            <View style={styles.barTop}>
              <Text style={styles.barName} numberOfLines={1}>
                {item.name}
              </Text>
              <Text style={styles.barValue}>{item.value}</Text>
            </View>
            <View style={styles.barTrack}>
              <View style={[styles.barFill, { width: `${item.pct}%` }]} />
            </View>
          </View>
        ))}

        <Text style={styles.sectionTitle}>By payment method</Text>
        {byMethod.map((row) => (
          <View key={row.label} style={styles.listRow}>
            <Text style={styles.listLabel}>{row.label}</Text>
            <Text style={styles.listValue}>{row.value}</Text>
          </View>
        ))}

        <Text style={styles.sectionTitle}>Low stock · {lowCount}</Text>
        {lowList.map((row) => (
          <View key={row.name} style={styles.listRow}>
            <Text style={styles.listLabel} numberOfLines={1}>
              {row.name}
            </Text>
            <Text style={styles.lowValue}>{row.left}</Text>
          </View>
        ))}

        <View style={styles.actions}>
          <Pressable onPress={goEod} accessibilityRole="button" style={styles.primary}>
            <Text style={styles.primaryText}>{eodCta}</Text>
          </Pressable>
          <Pressable onPress={exportCsv} accessibilityRole="button" style={styles.secondary}>
            <Text style={styles.secondaryText}>Export CSV · share</Text>
          </Pressable>
        </View>
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
  title: { fontFamily: font.medium, fontSize: 16, color: color.text, marginBottom: 10 },
  body: { flex: 1, minHeight: 0 },
  bodyContent: { padding: 12, paddingBottom: 24 },

  hero: {
    padding: 14,
    borderRadius: radius.lg,
    backgroundColor: color.surfaceSunken,
    borderWidth: 1,
    borderColor: color.line,
    marginBottom: 12,
  },
  heroKicker: {
    fontFamily: font.semibold,
    fontSize: 10.5,
    letterSpacing: 1.15,
    textTransform: 'uppercase',
    color: '#9690c9',
    marginBottom: 9,
  },
  heroTotal: { fontFamily: font.medium, fontSize: 28, color: color.text, marginBottom: 12, ...tabularNums },
  statRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  stat: { flexGrow: 1, flexBasis: 84 },
  statValue: { fontFamily: font.medium, fontSize: 15, color: color.text, ...tabularNums },
  statLabel: { fontFamily: font.regular, fontSize: 11, lineHeight: 14, color: color.textFaint, marginTop: 4 },

  sectionTitle: {
    fontFamily: font.semibold,
    fontSize: 10.5,
    letterSpacing: 1.15,
    textTransform: 'uppercase',
    color: color.textFaint,
    marginTop: 16,
    marginBottom: 9,
  },
  bar: { marginBottom: 10 },
  barTop: { flexDirection: 'row', justifyContent: 'space-between', gap: 10, marginBottom: 5 },
  barName: { flex: 1, minWidth: 0, fontFamily: font.regular, fontSize: 12.5, color: color.text },
  barValue: { fontFamily: font.medium, fontSize: 12.5, color: color.textMuted, ...tabularNums },
  barTrack: { height: 5, borderRadius: 3, backgroundColor: color.surface, overflow: 'hidden' },
  barFill: { height: '100%', borderRadius: 3, backgroundColor: color.accent },

  listRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    gap: 10,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: color.hairlineSoft,
  },
  listLabel: { flex: 1, minWidth: 0, fontFamily: font.regular, fontSize: 12.5, color: color.text },
  listValue: { fontFamily: font.medium, fontSize: 12.5, color: color.textMuted, ...tabularNums },
  lowValue: { fontFamily: font.medium, fontSize: 12, color: color.accentPale, ...tabularNums },

  actions: { gap: 9, marginTop: 20, marginBottom: 8 },
  primary: {
    minHeight: 50,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: color.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryText: { fontFamily: font.medium, fontSize: 14, color: color.textBright },
  secondary: {
    minHeight: 48,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: color.lineStrong,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryText: { fontFamily: font.medium, fontSize: 13.5, color: '#cfd3e5' },
});
