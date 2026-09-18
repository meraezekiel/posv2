import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { color, font, radius, tabularNums } from '@/theme/tokens';

import { Keypad } from '../Keypad/implementation/Keypad';
import { SplitPayment } from '../SplitPayment/implementation/SplitPayment';
import { usePaymentHandler } from './usePaymentHandler';

/** Payment: order summary, method choice, cash pad or e-wallet reference. */
export function Payment() {
  const {
    back,
    countLabel,
    vatLine,
    subtotalLabel,
    vatLabel,
    totalLabel,
    method,
    setMethod,
    tenderLabel,
    changeLabel,
    changeColor,
    refNo,
    setRefNo,
    canComplete,
    completeLabel,
    complete,
  } = usePaymentHandler();

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Pressable onPress={back} accessibilityRole="button" accessibilityLabel="Back" style={styles.backBtn}>
          <Text style={styles.backText}>‹</Text>
        </Pressable>
        <Text style={styles.headerTitle}>Payment</Text>
      </View>

      <ScrollView style={styles.body} contentContainerStyle={styles.bodyContent} keyboardShouldPersistTaps="handled">
        <View style={styles.summary}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>{countLabel}</Text>
            <Text style={styles.summaryValue}>{subtotalLabel}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>{vatLine}</Text>
            <Text style={styles.summaryValue}>{vatLabel}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>{totalLabel}</Text>
          </View>
        </View>

        <View style={styles.methods}>
          {(
            [
              { key: 'cash', label: 'Cash' },
              { key: 'wallet', label: 'GCash' },
              { key: 'utang', label: 'Utang' },
              { key: 'split', label: 'Split' },
            ] as const
          ).map((m) => {
            const active = method === m.key;
            return (
              <Pressable
                key={m.key}
                onPress={() => setMethod(m.key)}
                accessibilityRole="button"
                accessibilityState={{ selected: active }}
                style={[styles.method, active && styles.methodOn]}>
                <Text style={[styles.methodText, active && styles.methodTextOn]}>{m.label}</Text>
              </Pressable>
            );
          })}
        </View>

        {method === 'split' ? <SplitPayment /> : null}

        {method === 'cash' ? (
          <View>
            <View style={styles.tender}>
              <Text style={styles.tenderLabel}>Cash received</Text>
              <Text style={styles.tenderValue}>{tenderLabel}</Text>
            </View>
            <Keypad />
            <View style={styles.changeRow}>
              <Text style={styles.changeLabel}>Change due</Text>
              <Text style={[styles.changeValue, { color: changeColor }]}>{changeLabel}</Text>
            </View>
          </View>
        ) : null}

        {method === 'wallet' ? (
          <View>
            <Text style={styles.fieldLabel}>Reference number (optional)</Text>
            <TextInput
              value={refNo}
              onChangeText={setRefNo}
              placeholder="e.g. 0093 2211 4456"
              placeholderTextColor={color.textFaint}
              keyboardType="number-pad"
              style={styles.input}
            />
            <Text style={styles.fieldHint}>
              Logged manually — the customer pays in their own wallet app, you record it here.
            </Text>
          </View>
        ) : null}

        {method === 'utang' ? (
          <View style={styles.utang}>
            <Text style={styles.utangTitle}>Charge to a customer&apos;s tab</Text>
            <Text style={styles.utangBody}>
              Pick a customer or add a new one. Owner PIN is required to settle an utang later.
            </Text>
          </View>
        ) : null}
      </ScrollView>

      <View style={styles.footer}>
        <Pressable
          onPress={complete}
          disabled={!canComplete}
          accessibilityRole="button"
          accessibilityState={{ disabled: !canComplete }}
          style={[styles.completeBtn, canComplete ? styles.completeOn : styles.completeOff]}>
          <Text style={[styles.completeText, !canComplete && styles.completeTextOff]}>
            {completeLabel}
          </Text>
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
  bodyContent: { padding: 12 },

  summary: {
    borderWidth: 1,
    borderColor: color.line,
    borderRadius: radius.lg,
    padding: 12,
    marginBottom: 12,
    backgroundColor: color.surfaceSunken,
  },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between' },
  summaryLabel: { fontFamily: font.regular, fontSize: 12.5, lineHeight: 24, color: color.textMuted },
  summaryValue: {
    fontFamily: font.regular,
    fontSize: 12.5,
    lineHeight: 24,
    color: color.textMuted,
    ...tabularNums,
  },
  divider: { height: 1, backgroundColor: 'rgba(233,233,237,0.12)', marginVertical: 8 },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' },
  totalLabel: { fontFamily: font.medium, fontSize: 13, color: color.text },
  totalValue: { fontFamily: font.medium, fontSize: 22, color: color.text, ...tabularNums },

  // Four methods now, so they wrap to a 2×2 grid.
  methods: { flexDirection: 'row', flexWrap: 'wrap', gap: 7, marginBottom: 12 },
  method: {
    width: '48.4%',
    flexGrow: 1,
    minHeight: 46,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: color.line,
    alignItems: 'center',
    justifyContent: 'center',
  },
  methodOn: { backgroundColor: color.accentInk, borderColor: color.accent },
  methodText: { fontFamily: font.medium, fontSize: 13, color: color.textMuted },
  methodTextOn: { color: color.textBright },

  tender: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: radius.md,
    backgroundColor: color.accentInk,
    borderWidth: 1,
    borderColor: color.accentDeep,
    marginBottom: 10,
  },
  tenderLabel: { fontFamily: font.regular, fontSize: 12, color: color.accentPale },
  tenderValue: { fontFamily: font.medium, fontSize: 18, color: color.textBright, ...tabularNums },
  changeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginTop: 12,
  },
  changeLabel: { fontFamily: font.regular, fontSize: 12.5, color: color.textDim },
  changeValue: { fontFamily: font.medium, fontSize: 20, ...tabularNums },

  fieldLabel: { fontFamily: font.regular, fontSize: 12, color: color.textDim, marginBottom: 7 },
  input: {
    height: 48,
    paddingHorizontal: 12,
    borderRadius: radius.md,
    backgroundColor: color.surfaceSunken,
    borderWidth: 1,
    borderColor: color.line,
    color: color.text,
    fontFamily: font.regular,
    fontSize: 14,
  },
  fieldHint: {
    fontFamily: font.regular,
    fontSize: 12,
    lineHeight: 19,
    color: color.textFaint,
    marginTop: 9,
  },

  utang: { padding: 14, borderRadius: radius.md, borderWidth: 1, borderStyle: 'dashed', borderColor: color.accentLine },
  utangTitle: { fontFamily: font.medium, fontSize: 13.5, color: color.text, marginBottom: 5 },
  utangBody: { fontFamily: font.regular, fontSize: 12, lineHeight: 19, color: color.textDim },

  footer: {
    paddingTop: 10,
    paddingHorizontal: 12,
    paddingBottom: 12,
    borderTopWidth: 1,
    borderTopColor: color.hairline,
  },
  completeBtn: {
    width: '100%',
    minHeight: 52,
    borderRadius: 11,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  completeOn: { backgroundColor: color.accentInk, borderColor: color.accent },
  completeOff: { backgroundColor: 'transparent', borderColor: color.line, opacity: 0.7 },
  completeText: { fontFamily: font.medium, fontSize: 15, color: color.textBright },
  completeTextOff: { color: color.lineStrong },
});
