import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { color, font, radius, tabularNums } from '@/theme/tokens';

import { useReceiptHandler } from './useReceiptHandler';

/** Sale complete: totals, then print / share / no-receipt. */
export function Receipt() {
  const { saleNo, saleMethod, totalLabel, changeLabel, printReceipt, shareReceipt, newSale, toast } =
    useReceiptHandler();

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <View style={styles.hero}>
        <View style={styles.tick}>
          <Text style={styles.tickMark}>✓</Text>
        </View>
        <Text style={styles.heroTitle}>Sale complete — salamat!</Text>
        <Text style={styles.heroMeta}>
          Sale {saleNo} · {saleMethod}
        </Text>
      </View>

      <View style={styles.card}>
        <View style={styles.cardRow}>
          <Text style={styles.cardLabel}>Total</Text>
          <Text style={styles.cardTotal}>{totalLabel}</Text>
        </View>
        <View style={styles.cardRow}>
          <Text style={styles.cardLabel}>Change</Text>
          <Text style={styles.cardChange}>{changeLabel}</Text>
        </View>
      </View>

      <View style={styles.actions}>
        <Pressable onPress={printReceipt} accessibilityRole="button" style={styles.primary}>
          <Text style={styles.primaryText}>Print receipt</Text>
        </Pressable>
        <Pressable onPress={shareReceipt} accessibilityRole="button" style={styles.secondary}>
          <Text style={styles.secondaryText}>Share as image</Text>
        </Pressable>
        <Pressable onPress={newSale} accessibilityRole="button" style={styles.tertiary}>
          <Text style={styles.tertiaryText}>No receipt · new sale</Text>
        </Pressable>
      </View>

      {toast ? (
        <View style={styles.toast}>
          <Text style={styles.toastText}>{toast}</Text>
        </View>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: color.bg },
  content: { paddingTop: 22, paddingHorizontal: 16, paddingBottom: 16 },
  hero: { alignItems: 'center', marginBottom: 18 },
  tick: {
    width: 54,
    height: 54,
    borderRadius: 27,
    borderWidth: 1.5,
    borderColor: color.accent,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  tickMark: { fontFamily: font.regular, fontSize: 24, color: color.accentSoft },
  heroTitle: { fontFamily: font.medium, fontSize: 17, color: color.text },
  heroMeta: { fontFamily: font.regular, fontSize: 12, color: color.textFaint, marginTop: 4 },

  card: {
    borderWidth: 1,
    borderColor: color.line,
    borderRadius: radius.lg,
    padding: 14,
    backgroundColor: color.surfaceSunken,
    marginBottom: 14,
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 8,
  },
  cardLabel: { fontFamily: font.regular, fontSize: 12.5, color: color.textMuted },
  cardTotal: { fontFamily: font.medium, fontSize: 20, color: color.text, ...tabularNums },
  cardChange: { fontFamily: font.medium, fontSize: 14, color: color.accentPale, ...tabularNums },

  actions: { gap: 9 },
  primary: {
    height: 48,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: color.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryText: { fontFamily: font.medium, fontSize: 14, color: color.textBright },
  secondary: {
    height: 48,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: color.lineStrong,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryText: { fontFamily: font.medium, fontSize: 14, color: '#cfd3e5' },
  tertiary: {
    height: 48,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: color.line,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tertiaryText: { fontFamily: font.medium, fontSize: 14, color: color.textDim },

  toast: {
    marginTop: 14,
    paddingVertical: 11,
    paddingHorizontal: 13,
    borderRadius: radius.md,
    backgroundColor: color.accentInk,
    borderWidth: 1,
    borderColor: color.accentLine,
  },
  toastText: { fontFamily: font.medium, fontSize: 12.5, lineHeight: 18, color: color.textBright },
});
