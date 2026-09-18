import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { ImageField } from '@/components/ImageField/implementation/ImageField';
import { UNITS } from '@/domain/catalog';
import { color, font, radius } from '@/theme/tokens';

import { useProductFormHandler } from './useProductFormHandler';

/** Add or edit a product. Opened from Products, or from an unknown barcode. */
export function ProductForm() {
  const {
    title,
    cancel,
    values,
    setField,
    generateBarcode,
    warning,
    canSave,
    saveLabel,
    save,
    photoName,
  } = useProductFormHandler();

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Pressable onPress={cancel} accessibilityRole="button" accessibilityLabel="Back" style={styles.backBtn}>
          <Text style={styles.backText}>‹</Text>
        </Pressable>
        <Text style={styles.headerTitle}>{title}</Text>
      </View>

      <ScrollView style={styles.body} contentContainerStyle={styles.bodyContent} keyboardShouldPersistTaps="handled">
        <View style={styles.photoRow}>
          <ImageField
            uri={values.photo}
            onChange={(uri) => setField('photo', uri ?? '')}
            name={photoName}
            label="Photo"
          />
          <Text style={styles.photoHint}>
            Optional — tap to take one or pick from the gallery. Helps cashiers spot no-barcode
            items fast.
          </Text>
        </View>

        <Text style={styles.label}>Product name</Text>
        <TextInput
          value={values.name}
          onChangeText={(v) => setField('name', v)}
          placeholder="e.g. Kopiko Brown 3-in-1"
          placeholderTextColor={color.textFaint}
          style={[styles.input, styles.inputSpaced]}
        />

        <View style={styles.pairRow}>
          <View style={styles.pairCol}>
            <Text style={styles.label}>Selling price</Text>
            <TextInput
              value={values.price}
              onChangeText={(v) => setField('price', v)}
              placeholder="0.00"
              placeholderTextColor={color.textFaint}
              keyboardType="decimal-pad"
              style={styles.input}
            />
          </View>
          <View style={styles.pairCol}>
            <Text style={styles.label}>Stock on hand</Text>
            <TextInput
              value={values.stock}
              onChangeText={(v) => setField('stock', v)}
              placeholder="0"
              placeholderTextColor={color.textFaint}
              keyboardType="number-pad"
              style={styles.input}
            />
          </View>
        </View>

        <Text style={styles.label}>Barcode</Text>
        <View style={styles.barcodeRow}>
          <TextInput
            value={values.barcode}
            onChangeText={(v) => setField('barcode', v)}
            placeholder="Scan or type"
            placeholderTextColor={color.textFaint}
            style={[styles.input, styles.barcodeInput]}
          />
          <Pressable onPress={generateBarcode} accessibilityRole="button" style={styles.generate}>
            <Text style={styles.generateText}>Generate</Text>
          </Pressable>
        </View>

        <View style={styles.pairRow}>
          <View style={styles.pairCol}>
            <Text style={styles.label}>Unit</Text>
            <View style={styles.units}>
              {UNITS.map((unit) => {
                const active = values.unit === unit;
                return (
                  <Pressable
                    key={unit}
                    onPress={() => setField('unit', unit)}
                    accessibilityRole="button"
                    accessibilityState={{ selected: active }}
                    style={[styles.unit, active && styles.unitOn]}>
                    <Text style={[styles.unitText, active && styles.unitTextOn]}>{unit}</Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
          <View style={styles.pairCol}>
            <Text style={styles.label}>Low-stock alert at</Text>
            <TextInput
              value={values.low}
              onChangeText={(v) => setField('low', v)}
              placeholder="5"
              placeholderTextColor={color.textFaint}
              keyboardType="number-pad"
              style={styles.input}
            />
          </View>
        </View>

        {warning ? (
          <View style={styles.warn}>
            <Text style={styles.warnText}>{warning}</Text>
          </View>
        ) : null}
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

  photoRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 14 },
  photo: {
    width: 62,
    height: 62,
    borderRadius: radius.md,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: color.accentLine,
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoText: { fontFamily: font.regular, fontSize: 10, color: color.textFaint },
  photoHint: { flex: 1, fontFamily: font.regular, fontSize: 11.5, lineHeight: 17, color: color.textFaint },

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
    fontSize: 14,
  },
  inputSpaced: { marginBottom: 12 },
  pairRow: { flexDirection: 'row', gap: 10, marginBottom: 12 },
  pairCol: { flex: 1 },

  barcodeRow: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  barcodeInput: { flex: 1, minWidth: 0, fontFamily: font.mono, fontSize: 13.5 },
  generate: {
    height: 46,
    paddingHorizontal: 13,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: color.lineStrong,
    alignItems: 'center',
    justifyContent: 'center',
  },
  generateText: { fontFamily: font.medium, fontSize: 12.5, color: '#cfd3e5' },

  units: { flexDirection: 'row', gap: 6 },
  unit: {
    flex: 1,
    minHeight: 46,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: color.line,
    alignItems: 'center',
    justifyContent: 'center',
  },
  unitOn: { backgroundColor: color.accentInk, borderColor: color.accent },
  unitText: { fontFamily: font.medium, fontSize: 12.5, color: color.textMuted },
  unitTextOn: { color: color.textBright },

  warn: {
    paddingVertical: 11,
    paddingHorizontal: 12,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: color.accentLine,
    backgroundColor: color.accentInk,
    marginBottom: 12,
  },
  warnText: { fontFamily: font.regular, fontSize: 12, lineHeight: 18, color: color.textBright },

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
  saveOff: { backgroundColor: 'transparent', borderColor: color.line, opacity: 0.7 },
  saveText: { fontFamily: font.medium, fontSize: 15, color: color.textBright },
  saveTextOff: { color: color.lineStrong },
});
