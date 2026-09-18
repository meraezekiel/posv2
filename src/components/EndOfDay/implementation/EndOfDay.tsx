import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { color, font, radius, tabularNums } from '@/theme/tokens';

import { useEndOfDayHandler } from './useEndOfDayHandler';

/** Cash count: starting float against today's cash sales, then close the day. */
export function EndOfDay() {
  const {
    back,
    start,
    setStart,
    cashSales,
    expected,
    actual,
    setActual,
    difference,
    differenceColor,
    note,
    canClose,
    closeLabel,
    close,
  } = useEndOfDayHandler();

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Pressable onPress={back} accessibilityRole="button" accessibilityLabel="Back" style={styles.backBtn}>
          <Text style={styles.backText}>‹</Text>
        </Pressable>
        <Text style={styles.headerTitle}>End of day</Text>
      </View>

      <ScrollView style={styles.body} contentContainerStyle={styles.bodyContent} keyboardShouldPersistTaps="handled">
        <Text style={styles.intro}>
          Count the drawer and we&apos;ll show the difference. Nothing is locked until you close the
          day.
        </Text>

        <Text style={styles.label}>Starting cash</Text>
        <TextInput
          value={start}
          onChangeText={setStart}
          placeholder="0.00"
          placeholderTextColor={color.textFaint}
          keyboardType="decimal-pad"
          style={[styles.input, styles.inputSpaced]}
        />

        <View style={styles.card}>
          <View style={styles.cardRow}>
            <Text style={styles.cardLabel}>Cash sales today</Text>
            <Text style={styles.cardValue}>{cashSales}</Text>
          </View>
          <View style={styles.cardRow}>
            <Text style={styles.cardLabel}>Expected in drawer</Text>
            <Text style={styles.cardValue}>{expected}</Text>
          </View>
        </View>

        <Text style={styles.label}>Actual cash counted</Text>
        <TextInput
          value={actual}
          onChangeText={setActual}
          placeholder="0.00"
          placeholderTextColor={color.textFaint}
          keyboardType="decimal-pad"
          style={styles.input}
        />

        <View style={styles.diffRow}>
          <Text style={styles.diffLabel}>Difference</Text>
          <Text style={[styles.diffValue, { color: differenceColor }]}>{difference}</Text>
        </View>
        <Text style={styles.note}>{note}</Text>
      </ScrollView>

      <View style={styles.footer}>
        <Pressable
          onPress={close}
          disabled={!canClose}
          accessibilityRole="button"
          accessibilityState={{ disabled: !canClose }}
          style={[styles.closeBtn, canClose ? styles.closeOn : styles.closeOff]}>
          <Text style={[styles.closeText, !canClose && styles.closeTextOff]}>{closeLabel}</Text>
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
  intro: { fontFamily: font.regular, fontSize: 12, lineHeight: 19, color: color.textDim, marginBottom: 12 },
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
  inputSpaced: { marginBottom: 12 },
  card: {
    padding: 12,
    borderRadius: radius.md,
    backgroundColor: color.surfaceSunken,
    borderWidth: 1,
    borderColor: color.line,
    marginBottom: 12,
  },
  cardRow: { flexDirection: 'row', justifyContent: 'space-between' },
  cardLabel: { fontFamily: font.regular, fontSize: 12.5, lineHeight: 24, color: color.textMuted },
  cardValue: { fontFamily: font.regular, fontSize: 12.5, lineHeight: 24, color: color.textMuted, ...tabularNums },

  diffRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginTop: 14,
  },
  diffLabel: { fontFamily: font.regular, fontSize: 12.5, color: color.textDim },
  diffValue: { fontFamily: font.medium, fontSize: 20, ...tabularNums },
  note: { fontFamily: font.regular, fontSize: 11.5, lineHeight: 18, color: color.textFaint, marginTop: 8 },

  footer: {
    paddingTop: 10,
    paddingHorizontal: 12,
    paddingBottom: 12,
    borderTopWidth: 1,
    borderTopColor: color.hairline,
  },
  closeBtn: {
    width: '100%',
    minHeight: 52,
    borderRadius: 11,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeOn: { backgroundColor: color.accentInk, borderColor: color.accent },
  closeOff: { borderColor: color.line, opacity: 0.7 },
  closeText: { fontFamily: font.medium, fontSize: 15, color: color.textBright },
  closeTextOff: { color: color.lineStrong },
});
