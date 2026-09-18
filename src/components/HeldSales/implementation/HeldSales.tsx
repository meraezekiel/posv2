import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { GlobalToast } from '@/components/GlobalToast/implementation/GlobalToast';
import { color, font, radius, tabularNums } from '@/theme/tokens';

import { useHeldSalesHandler } from './useHeldSalesHandler';

/** Parked sales: resume one at the counter, or throw it away. */
export function HeldSales() {
  const { back, list } = useHeldSalesHandler();

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Pressable onPress={back} accessibilityRole="button" accessibilityLabel="Back" style={styles.backBtn}>
          <Text style={styles.backText}>‹</Text>
        </Pressable>
        <Text style={styles.headerTitle}>Held sales</Text>
      </View>

      <ScrollView style={styles.body} contentContainerStyle={styles.bodyContent}>
        {list.length ? (
          list.map((held) => (
            <View key={held.id} style={styles.card}>
              <View style={styles.cardTop}>
                <Text style={styles.cardLabel}>{held.label}</Text>
                <Text style={styles.cardTotal}>{held.total}</Text>
              </View>
              <Text style={styles.cardItems}>{held.items}</Text>
              <View style={styles.actions}>
                <Pressable onPress={held.resume} accessibilityRole="button" style={styles.resume}>
                  <Text style={styles.resumeText}>Resume</Text>
                </Pressable>
                <Pressable onPress={held.discard} accessibilityRole="button" style={styles.discard}>
                  <Text style={styles.discardText}>Discard</Text>
                </Pressable>
              </View>
            </View>
          ))
        ) : (
          <View style={styles.empty}>
            <View style={styles.emptyMark} />
            <Text style={styles.emptyTitle}>Nothing on hold</Text>
            <Text style={styles.emptyBody}>
              When a customer runs back for one more item, tap Hold on the cart and serve the next
              person.
            </Text>
          </View>
        )}
      </ScrollView>

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

  body: { flex: 1, minHeight: 0 },
  bodyContent: { padding: 12, paddingBottom: 24 },
  card: {
    padding: 12,
    borderRadius: radius.lg,
    backgroundColor: color.surfaceSunken,
    borderWidth: 1,
    borderColor: color.line,
    marginBottom: 10,
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  cardLabel: { fontFamily: font.medium, fontSize: 13.5, color: color.text },
  cardTotal: { fontFamily: font.medium, fontSize: 14, color: color.text, ...tabularNums },
  cardItems: { fontFamily: font.regular, fontSize: 11.5, lineHeight: 17, color: color.textFaint, marginBottom: 11 },
  actions: { flexDirection: 'row', gap: 9 },
  resume: {
    flex: 1,
    minHeight: 44,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: color.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resumeText: { fontFamily: font.medium, fontSize: 12.5, color: color.textBright },
  discard: {
    minHeight: 44,
    paddingHorizontal: 14,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: color.lineStrong,
    alignItems: 'center',
    justifyContent: 'center',
  },
  discardText: { fontFamily: font.medium, fontSize: 12.5, color: '#cfd3e5' },

  empty: { paddingVertical: 26, paddingHorizontal: 18, alignItems: 'center' },
  emptyMark: {
    width: 44,
    height: 44,
    marginBottom: 12,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: color.accentLine,
  },
  emptyTitle: { fontFamily: font.medium, fontSize: 14, color: color.text, marginBottom: 5 },
  emptyBody: {
    fontFamily: font.regular,
    fontSize: 12,
    lineHeight: 19,
    color: color.textFaint,
    textAlign: 'center',
  },
});
