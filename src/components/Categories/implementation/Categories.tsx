import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { color, font, radius } from '@/theme/tokens';

import { useCategoriesHandler } from './useCategoriesHandler';

/** Add, rename and reorder the product categories. */
export function Categories() {
  const { back, rows, draft, setDraft, fieldLabel, saveLabel, canSave, save } =
    useCategoriesHandler();

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Pressable onPress={back} accessibilityRole="button" accessibilityLabel="Back" style={styles.backBtn}>
          <Text style={styles.backText}>‹</Text>
        </Pressable>
        <Text style={styles.headerTitle}>Categories</Text>
      </View>

      <ScrollView style={styles.body} contentContainerStyle={styles.bodyContent} keyboardShouldPersistTaps="handled">
        {rows.map((row) => (
          <View key={row.name} style={styles.row}>
            <Text style={styles.name} numberOfLines={1}>
              {row.name}
            </Text>
            <Text style={styles.count}>{row.count}</Text>
            <Pressable onPress={row.up} accessibilityRole="button" accessibilityLabel={`Move ${row.name} up`} style={styles.iconBtn}>
              <Text style={styles.iconText}>↑</Text>
            </Pressable>
            <Pressable onPress={row.down} accessibilityRole="button" accessibilityLabel={`Move ${row.name} down`} style={styles.iconBtn}>
              <Text style={styles.iconText}>↓</Text>
            </Pressable>
            <Pressable
              onPress={row.pick}
              accessibilityRole="button"
              style={[styles.renameBtn, row.selected && styles.renameOn]}>
              <Text style={styles.renameText}>Rename</Text>
            </Pressable>
          </View>
        ))}

        <Text style={styles.fieldLabel}>{fieldLabel}</Text>
        <View style={styles.editRow}>
          <TextInput
            value={draft}
            onChangeText={setDraft}
            placeholder="e.g. Frozen"
            placeholderTextColor={color.textFaint}
            style={styles.input}
          />
          <Pressable
            onPress={save}
            disabled={!canSave}
            accessibilityRole="button"
            accessibilityState={{ disabled: !canSave }}
            style={[styles.saveBtn, canSave ? styles.saveOn : styles.saveOff]}>
            <Text style={[styles.saveText, !canSave && styles.saveTextOff]}>{saveLabel}</Text>
          </Pressable>
        </View>
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
  headerTitle: { fontFamily: font.medium, fontSize: 15, color: color.text },

  body: { flex: 1, minHeight: 0 },
  bodyContent: { padding: 12, paddingBottom: 24 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 9,
    borderBottomWidth: 1,
    borderBottomColor: color.hairlineSoft,
  },
  name: { flex: 1, minWidth: 0, fontFamily: font.regular, fontSize: 13, color: color.text },
  count: { fontFamily: font.regular, fontSize: 11, color: color.textFaint },
  iconBtn: {
    width: 34,
    height: 34,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: color.line,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: { fontFamily: font.regular, fontSize: 13, color: color.textDim },
  renameBtn: {
    minHeight: 34,
    paddingHorizontal: 10,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: color.line,
    alignItems: 'center',
    justifyContent: 'center',
  },
  renameOn: { backgroundColor: color.accentInk, borderColor: color.accent },
  renameText: { fontFamily: font.medium, fontSize: 11.5, color: '#cfd3e5' },

  fieldLabel: { fontFamily: font.regular, fontSize: 11.5, color: color.textDim, marginTop: 16, marginBottom: 6 },
  editRow: { flexDirection: 'row', gap: 8 },
  input: {
    flex: 1,
    minWidth: 0,
    height: 46,
    paddingHorizontal: 12,
    borderRadius: radius.md,
    backgroundColor: color.surfaceSunken,
    borderWidth: 1,
    borderColor: color.line,
    color: color.text,
    fontFamily: font.regular,
    fontSize: 14,
  },
  saveBtn: {
    minHeight: 46,
    paddingHorizontal: 16,
    borderRadius: radius.md,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveOn: { backgroundColor: color.accentInk, borderColor: color.accent },
  saveOff: { borderColor: color.line },
  saveText: { fontFamily: font.medium, fontSize: 13, color: color.textBright },
  saveTextOff: { color: color.lineStrong },
});
