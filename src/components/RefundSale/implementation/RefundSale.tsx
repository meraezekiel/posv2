import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { FilterChips } from '@/components/FilterChips/implementation/FilterChips';
import { color, font, radius, tabularNums } from '@/theme/tokens';

import { useRefundSaleHandler } from './useRefundSaleHandler';

/** Partial or full refund: pick the items going back on the shelf, give a reason. */
export function RefundSale() {
  const {
    cancel,
    saleNo,
    items,
    reasons,
    reason,
    setReason,
    canRefund,
    refundLabel,
    doRefund,
  } = useRefundSaleHandler();

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Pressable onPress={cancel} accessibilityRole="button" accessibilityLabel="Back" style={styles.backBtn}>
          <Text style={styles.backText}>‹</Text>
        </Pressable>
        <Text style={styles.headerTitle}>Refund {saleNo}</Text>
      </View>

      <ScrollView style={styles.body} contentContainerStyle={styles.bodyContent}>
        <Text style={styles.intro}>
          Pick the items going back on the shelf. Stock is added back for each one.
        </Text>

        {items.map((item) => (
          <Pressable
            key={item.key}
            onPress={item.toggle}
            accessibilityRole="checkbox"
            accessibilityState={{ checked: item.selected }}
            style={[styles.item, item.selected && styles.itemOn]}>
            <View style={[styles.check, item.selected && styles.checkOn]}>
              <Text style={styles.checkMark}>{item.selected ? '✓' : ''}</Text>
            </View>
            <Text style={styles.itemName} numberOfLines={2}>
              {item.qty}× {item.name}
            </Text>
            <Text style={styles.itemTotal}>{item.total}</Text>
          </Pressable>
        ))}

        <Text style={styles.label}>Reason</Text>
        <FilterChips options={reasons} selected={reason ?? ''} onSelect={setReason} />
      </ScrollView>

      <View style={styles.footer}>
        <Pressable
          onPress={doRefund}
          disabled={!canRefund}
          accessibilityRole="button"
          accessibilityState={{ disabled: !canRefund }}
          style={[styles.refundBtn, canRefund ? styles.refundOn : styles.refundOff]}>
          <Text style={[styles.refundText, !canRefund && styles.refundTextOff]}>{refundLabel}</Text>
        </Pressable>
      </View>
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

  body: { flex: 1, minHeight: 0 },
  bodyContent: { padding: 12, paddingBottom: 20 },
  intro: { fontFamily: font.regular, fontSize: 12, lineHeight: 19, color: color.textDim, marginBottom: 10 },

  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 10,
    marginBottom: 7,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: color.line,
  },
  itemOn: { borderColor: color.accent, backgroundColor: color.accentInk },
  check: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: color.line,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkOn: { borderColor: color.accent },
  checkMark: { fontFamily: font.semibold, fontSize: 12, color: color.textBright },
  itemName: { flex: 1, minWidth: 0, fontFamily: font.regular, fontSize: 13, color: color.text },
  itemTotal: { fontFamily: font.medium, fontSize: 13, color: color.text, ...tabularNums },

  label: { fontFamily: font.regular, fontSize: 11.5, color: color.textDim, marginTop: 14, marginBottom: 7 },

  footer: {
    paddingTop: 10,
    paddingHorizontal: 12,
    paddingBottom: 12,
    borderTopWidth: 1,
    borderTopColor: color.hairline,
  },
  refundBtn: {
    width: '100%',
    minHeight: 52,
    borderRadius: 11,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  refundOn: { backgroundColor: color.accentInk, borderColor: color.accent },
  refundOff: { borderColor: color.line, opacity: 0.7 },
  refundText: { fontFamily: font.medium, fontSize: 15, color: color.textBright },
  refundTextOff: { color: color.lineStrong },
});
