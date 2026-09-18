import React from 'react';
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { Toast } from '@/components/Toast/implementation/Toast';
import type { Product } from '@/domain/catalog';
import { color, font, radius } from '@/theme/tokens';

import { ProductRow } from '../ProductRow/implementation/ProductRow';
import { useProductListHandler } from './useProductListHandler';

/** Products: search, the list with low-stock badges, and Add a product. */
export function ProductList() {
  const { query, setQuery, list, countLabel, addProduct } = useProductListHandler();

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>Products</Text>
          <Text style={styles.count}>{countLabel}</Text>
        </View>
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search name or SKU"
          placeholderTextColor={color.textFaint}
          style={styles.search}
        />
      </View>

      <FlatList<Product>
        data={list}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ProductRow product={item} />}
        keyboardShouldPersistTaps="handled"
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyTitle}>Nothing matches &quot;{query}&quot;</Text>
            <Text style={styles.emptyBody}>
              Try a shorter word, or add it as a new product.
            </Text>
          </View>
        }
      />

      <Toast bottom={78} />

      <View style={styles.footer}>
        <Pressable onPress={addProduct} accessibilityRole="button" style={styles.addBtn}>
          <Text style={styles.addText}>Add a product</Text>
        </Pressable>
      </View>
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
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  title: { fontFamily: font.medium, fontSize: 16, color: color.text },
  count: { fontFamily: font.regular, fontSize: 11.5, color: color.textFaint },
  search: {
    height: 42,
    paddingHorizontal: 12,
    borderRadius: radius.md,
    backgroundColor: color.surfaceSunken,
    borderWidth: 1,
    borderColor: color.line,
    color: color.text,
    fontFamily: font.regular,
    fontSize: 13,
  },

  empty: { paddingVertical: 28, paddingHorizontal: 22, alignItems: 'center' },
  emptyTitle: { fontFamily: font.medium, fontSize: 14, color: color.text, marginBottom: 5 },
  emptyBody: {
    fontFamily: font.regular,
    fontSize: 12,
    lineHeight: 18,
    color: color.textFaint,
    textAlign: 'center',
  },

  footer: {
    paddingTop: 10,
    paddingHorizontal: 12,
    paddingBottom: 12,
    borderTopWidth: 1,
    borderTopColor: color.hairline,
  },
  addBtn: {
    width: '100%',
    height: 50,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: color.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addText: { fontFamily: font.medium, fontSize: 14.5, color: color.textBright },
});
