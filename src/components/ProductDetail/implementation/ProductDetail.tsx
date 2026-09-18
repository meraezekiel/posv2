import { Image } from 'expo-image';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { color, font, radius, tabularNums } from '@/theme/tokens';

import { useProductDetailHandler } from './useProductDetailHandler';

/** One product: price, margin, stock stats and its movement history. */
export function ProductDetail() {
  const {
    back,
    name,
    photo,
    price,
    costLine,
    barcode,
    stats,
    moves,
    edit,
    stockIn,
    adjust,
    remove,
  } = useProductDetailHandler();

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Pressable onPress={back} accessibilityRole="button" accessibilityLabel="Back" style={styles.backBtn}>
          <Text style={styles.backText}>‹</Text>
        </Pressable>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {name}
        </Text>
        <Pressable onPress={edit} accessibilityRole="button" style={styles.editBtn}>
          <Text style={styles.editText}>Edit</Text>
        </Pressable>
      </View>

      <ScrollView style={styles.body} contentContainerStyle={styles.bodyContent}>
        <View style={styles.topRow}>
          {photo ? (
            <Image source={{ uri: photo }} style={styles.thumb} contentFit="cover" />
          ) : (
            <View style={styles.thumb} />
          )}
          <View style={styles.topText}>
            <Text style={styles.price}>{price}</Text>
            <Text style={styles.costLine}>{costLine}</Text>
            <Text style={styles.barcode}>{barcode}</Text>
          </View>
        </View>

        <View style={styles.statCard}>
          {stats.map((stat) => (
            <View key={stat.label} style={styles.stat}>
              <Text style={[styles.statValue, { color: stat.color }]}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        <View style={styles.actions}>
          <Pressable onPress={stockIn} accessibilityRole="button" style={styles.primary}>
            <Text style={styles.primaryText}>Stock in</Text>
          </Pressable>
          <Pressable onPress={adjust} accessibilityRole="button" style={styles.secondary}>
            <Text style={styles.secondaryText}>Adjust</Text>
          </Pressable>
        </View>

        <Text style={styles.sectionTitle}>Stock movements</Text>
        {moves.map((move, i) => (
          <View key={`${move.label}-${i}`} style={styles.moveRow}>
            <Text style={[styles.moveDelta, { color: move.color }]}>{move.delta}</Text>
            <Text style={styles.moveLabel} numberOfLines={1}>
              {move.label}
            </Text>
            <Text style={styles.moveWhen}>{move.when}</Text>
          </View>
        ))}

        <Pressable onPress={remove} accessibilityRole="button" style={styles.deleteBtn}>
          <Text style={styles.deleteText}>Delete product</Text>
        </Pressable>
        <Text style={styles.footnote}>
          Deleting hides it from the list but keeps it on past sales.
        </Text>
      </ScrollView>
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
  headerTitle: { flex: 1, minWidth: 0, fontFamily: font.medium, fontSize: 14.5, color: color.text },
  editBtn: {
    minHeight: 36,
    paddingHorizontal: 12,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: color.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editText: { fontFamily: font.medium, fontSize: 12, color: color.textBright },

  body: { flex: 1, minHeight: 0 },
  bodyContent: { padding: 12, paddingBottom: 24 },
  topRow: { flexDirection: 'row', gap: 11, marginBottom: 14 },
  thumb: {
    width: 64,
    height: 64,
    borderRadius: radius.md,
    backgroundColor: color.surface,
    borderWidth: 1,
    borderColor: color.line,
  },
  topText: { flex: 1, minWidth: 0 },
  price: { fontFamily: font.medium, fontSize: 20, color: color.text, ...tabularNums },
  costLine: { fontFamily: font.regular, fontSize: 11.5, lineHeight: 18, color: color.textFaint, marginTop: 5 },
  barcode: { fontFamily: font.mono, fontSize: 11.5, lineHeight: 18, color: color.textFaint },

  statCard: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    padding: 12,
    borderRadius: radius.lg,
    backgroundColor: color.surfaceSunken,
    borderWidth: 1,
    borderColor: color.line,
    marginBottom: 14,
  },
  stat: { flexGrow: 1, flexBasis: 88 },
  statValue: { fontFamily: font.medium, fontSize: 15, ...tabularNums },
  statLabel: { fontFamily: font.regular, fontSize: 11, lineHeight: 14, color: color.textFaint, marginTop: 4 },

  actions: { flexDirection: 'row', gap: 9, marginBottom: 16 },
  primary: {
    flex: 1,
    minHeight: 46,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: color.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryText: { fontFamily: font.medium, fontSize: 13, color: color.textBright },
  secondary: {
    flex: 1,
    minHeight: 46,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: color.lineStrong,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryText: { fontFamily: font.medium, fontSize: 13, color: '#cfd3e5' },

  sectionTitle: {
    fontFamily: font.semibold,
    fontSize: 10.5,
    letterSpacing: 1.15,
    textTransform: 'uppercase',
    color: color.textFaint,
    marginBottom: 9,
  },
  moveRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 10,
    paddingVertical: 9,
    borderBottomWidth: 1,
    borderBottomColor: color.hairlineSoft,
  },
  moveDelta: { minWidth: 40, fontFamily: font.medium, fontSize: 12.5, ...tabularNums },
  moveLabel: { flex: 1, minWidth: 0, fontFamily: font.regular, fontSize: 12, color: color.text },
  moveWhen: { fontFamily: font.regular, fontSize: 11, color: color.textFaint },

  deleteBtn: {
    minHeight: 48,
    marginTop: 18,
    marginBottom: 6,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: color.line,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteText: { fontFamily: font.medium, fontSize: 13, color: color.textDim },
  footnote: { fontFamily: font.regular, fontSize: 11, lineHeight: 17, color: color.textFaint },
});
