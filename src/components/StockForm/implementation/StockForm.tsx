import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { FilterChips } from '@/components/FilterChips/implementation/FilterChips';
import { color, font, radius } from '@/theme/tokens';

import { useStockFormHandler } from './useStockFormHandler';

/** Stock in (received goods) or a stock adjustment with a reason. */
export function StockForm() {
  const {
    cancel,
    title,
    productName,
    onHand,
    qtyLabel,
    qty,
    setQty,
    bumps,
    isStockIn,
    cost,
    setCost,
    reasons,
    reason,
    setReason,
    canSave,
    saveLabel,
    save,
  } = useStockFormHandler();

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Pressable onPress={cancel} accessibilityRole="button" accessibilityLabel="Back" style={styles.backBtn}>
          <Text style={styles.backText}>‹</Text>
        </Pressable>
        <Text style={styles.headerTitle}>{title}</Text>
      </View>

      <ScrollView style={styles.body} contentContainerStyle={styles.bodyContent} keyboardShouldPersistTaps="handled">
        <View style={styles.card}>
          <Text style={styles.cardName}>{productName}</Text>
          <Text style={styles.cardStock}>{onHand}</Text>
        </View>

        <Text style={styles.label}>{qtyLabel}</Text>
        <View style={styles.qtyRow}>
          <TextInput
            value={qty}
            onChangeText={setQty}
            placeholder="0"
            placeholderTextColor={color.textFaint}
            keyboardType="numbers-and-punctuation"
            style={[styles.input, styles.qtyInput]}
          />
          {bumps.map((bump) => (
            <Pressable key={bump.label} onPress={bump.press} accessibilityRole="button" style={styles.bump}>
              <Text style={styles.bumpText}>{bump.label}</Text>
            </Pressable>
          ))}
        </View>

        {isStockIn ? (
          <View>
            <Text style={styles.label}>Cost per unit (optional)</Text>
            <TextInput
              value={cost}
              onChangeText={setCost}
              placeholder="0.00"
              placeholderTextColor={color.textFaint}
              keyboardType="decimal-pad"
              style={styles.input}
            />
            <Text style={styles.hint}>
              Entering cost is what turns on the profit figure in Reports.
            </Text>
          </View>
        ) : (
          <View>
            <Text style={styles.label}>Reason</Text>
            <FilterChips options={reasons} selected={reason ?? ''} onSelect={setReason} />
            <Text style={styles.hint}>
              Use a negative number to take stock out, e.g. −3 for damaged goods.
            </Text>
          </View>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <Pressable
          onPress={save}
          disabled={!canSave}
          accessibilityRole="button"
          accessibilityState={{ disabled: !canSave }}
          style={[styles.saveBtn, canSave ? styles.saveOn : styles.saveOff]}>
          <Text style={[styles.saveText, !canSave && styles.saveTextOff]}>{saveLabel}</Text>
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
  bodyContent: { padding: 12, paddingBottom: 24 },
  card: {
    paddingVertical: 11,
    paddingHorizontal: 12,
    borderRadius: radius.md,
    backgroundColor: color.surfaceSunken,
    borderWidth: 1,
    borderColor: color.line,
    marginBottom: 14,
  },
  cardName: { fontFamily: font.medium, fontSize: 13.5, lineHeight: 18, color: color.text },
  cardStock: { fontFamily: font.regular, fontSize: 11.5, color: color.textFaint, marginTop: 4 },

  label: { fontFamily: font.regular, fontSize: 11.5, color: color.textDim, marginBottom: 6 },
  input: {
    height: 46,
    paddingHorizontal: 12,
    borderRadius: radius.md,
    backgroundColor: color.surfaceSunken,
    borderWidth: 1,
    borderColor: color.line,
    color: color.text,
    fontFamily: font.regular,
    fontSize: 15,
  },
  qtyRow: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  qtyInput: { flex: 1, minWidth: 0 },
  bump: {
    minWidth: 48,
    height: 46,
    borderRadius: radius.md,
    backgroundColor: color.surface,
    borderWidth: 1,
    borderColor: color.line,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bumpText: { fontFamily: font.medium, fontSize: 12.5, color: color.text },
  hint: { fontFamily: font.regular, fontSize: 11.5, lineHeight: 18, color: color.textFaint, marginTop: 9 },

  footer: {
    paddingTop: 10,
    paddingHorizontal: 12,
    paddingBottom: 12,
    borderTopWidth: 1,
    borderTopColor: color.hairline,
  },
  saveBtn: {
    width: '100%',
    minHeight: 52,
    borderRadius: 11,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveOn: { backgroundColor: color.accentInk, borderColor: color.accent },
  saveOff: { borderColor: color.line, opacity: 0.7 },
  saveText: { fontFamily: font.medium, fontSize: 15, color: color.textBright },
  saveTextOff: { color: color.lineStrong },
});
