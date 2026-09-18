import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { GlobalToast } from '@/components/GlobalToast/implementation/GlobalToast';
import { PinSheet } from '@/components/PinSheet/implementation/PinSheet';
import { color, font, radius, tabularNums } from '@/theme/tokens';

import { VoidSheet } from '../VoidSheet/implementation/VoidSheet';
import { useSaleDetailHandler } from './useSaleDetailHandler';

/** One sale: what was sold, how it was paid, and the void / refund routes. */
export function SaleDetail() {
  const {
    back,
    sale,
    status,
    voidedish,
    meta,
    items,
    total,
    payLine,
    reason,
    canVoid,
    lockNote,
    askVoid,
    askRefund,
    print,
    share,
    pinPurpose,
    cancelPin,
    onPinSuccess,
    voidOpen,
    cancelVoid,
    confirmVoid,
  } = useSaleDetailHandler();

  if (!sale) {
    return (
      <View style={styles.screen}>
        <View style={styles.header}>
          <Pressable onPress={back} accessibilityRole="button" accessibilityLabel="Back" style={styles.backBtn}>
            <Text style={styles.backText}>‹</Text>
          </Pressable>
          <Text style={styles.headerTitle}>Sale</Text>
        </View>
        <Text style={styles.missing}>That sale is no longer in history.</Text>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Pressable onPress={back} accessibilityRole="button" accessibilityLabel="Back" style={styles.backBtn}>
          <Text style={styles.backText}>‹</Text>
        </Pressable>
        <Text style={styles.headerTitle}>Sale {sale.no}</Text>
        <View style={[styles.badge, voidedish && styles.badgeOn]}>
          <Text style={[styles.badgeText, voidedish && styles.badgeTextOn]}>{status}</Text>
        </View>
      </View>

      <ScrollView style={styles.body} contentContainerStyle={styles.bodyContent}>
        <Text style={styles.meta}>{meta}</Text>

        {items.map((item) => (
          <View key={item.key} style={styles.itemRow}>
            <Text style={styles.itemQty}>{item.qty}×</Text>
            <Text style={styles.itemName}>{item.name}</Text>
            <Text style={styles.itemTotal}>{item.total}</Text>
          </View>
        ))}

        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>{total}</Text>
        </View>
        <Text style={styles.payLine}>{payLine}</Text>

        {reason ? (
          <View style={styles.reason}>
            <Text style={styles.reasonText}>{reason}</Text>
          </View>
        ) : null}

        <View style={styles.actions}>
          <Pressable onPress={print} accessibilityRole="button" style={styles.secondary}>
            <Text style={styles.secondaryText}>Reprint receipt</Text>
          </Pressable>
          <Pressable onPress={share} accessibilityRole="button" style={styles.secondary}>
            <Text style={styles.secondaryText}>Share as image</Text>
          </Pressable>

          {canVoid ? (
            <View style={styles.pair}>
              <Pressable onPress={askVoid} accessibilityRole="button" style={styles.primary}>
                <Text style={styles.primaryText}>Void sale</Text>
              </Pressable>
              <Pressable onPress={askRefund} accessibilityRole="button" style={styles.primary}>
                <Text style={styles.primaryText}>Refund</Text>
              </Pressable>
            </View>
          ) : null}

          {lockNote ? <Text style={styles.lockNote}>{lockNote}</Text> : null}
        </View>
      </ScrollView>

      <PinSheet purpose={pinPurpose} onCancel={cancelPin} onSuccess={onPinSuccess} />
      <VoidSheet
        visible={voidOpen}
        saleNo={sale.no}
        saleTotal={total}
        onCancel={cancelVoid}
        onConfirm={confirmVoid}
      />
      <GlobalToast />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: color.bg },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: color.hairline,
  },
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
  headerTitle: { fontFamily: font.medium, fontSize: 15, color: color.text },
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

  missing: { padding: 22, fontFamily: font.regular, fontSize: 13, color: color.textFaint },
  body: { flex: 1, minHeight: 0 },
  bodyContent: { padding: 12, paddingBottom: 24 },
  meta: { fontFamily: font.regular, fontSize: 12, lineHeight: 19, color: color.textFaint, marginBottom: 12 },

  itemRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 10,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: color.hairlineSoft,
  },
  itemQty: { minWidth: 26, fontFamily: font.medium, fontSize: 12.5, color: '#9690c9' },
  itemName: { flex: 1, minWidth: 0, fontFamily: font.regular, fontSize: 13, color: color.text },
  itemTotal: { fontFamily: font.medium, fontSize: 13, color: color.text, ...tabularNums },

  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    paddingTop: 12,
    paddingBottom: 2,
  },
  totalLabel: { fontFamily: font.medium, fontSize: 13, color: color.textMuted },
  totalValue: { fontFamily: font.medium, fontSize: 20, color: color.text, ...tabularNums },
  payLine: { fontFamily: font.regular, fontSize: 11.5, lineHeight: 18, color: color.textFaint, marginBottom: 14 },

  reason: {
    paddingVertical: 11,
    paddingHorizontal: 12,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: color.accentLine,
    backgroundColor: color.accentInk,
    marginBottom: 14,
  },
  reasonText: { fontFamily: font.regular, fontSize: 12, lineHeight: 18, color: color.textBright },

  actions: { gap: 9 },
  secondary: {
    minHeight: 48,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: color.lineStrong,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryText: { fontFamily: font.medium, fontSize: 13.5, color: '#cfd3e5' },
  pair: { flexDirection: 'row', gap: 9 },
  primary: {
    flex: 1,
    minHeight: 48,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: color.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryText: { fontFamily: font.medium, fontSize: 13.5, color: color.textBright },
  lockNote: { fontFamily: font.regular, fontSize: 11.5, lineHeight: 17, color: color.textFaint },
});
