import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { FilterChips } from '@/components/FilterChips/implementation/FilterChips';
import { ImageField } from '@/components/ImageField/implementation/ImageField';
import { PinPad } from '@/components/PinPad/implementation/PinPad';
import { color, font, radius } from '@/theme/tokens';

import { useOnboardingHandler } from './useOnboardingHandler';

/** First-run setup: welcome, store, tax, owner PIN, camera, first products. */
export function Onboarding() {
  const {
    dots,
    kicker,
    title,
    body,
    step,
    store,
    setStoreField,
    vatOptions,
    vat,
    setVat,
    vatNote,
    pinFilled,
    pinError,
    pressPin,
    cameraDenied,
    allowCamera,
    denyCamera,
    openSettings,
    scanFirst,
    addFirst,
    canBack,
    back,
    canNext,
    nextLabel,
    next,
  } = useOnboardingHandler();

  return (
    <View style={styles.screen}>
      <View style={styles.dotsRow}>
        {dots.map((on, i) => (
          <View key={i} style={[styles.dot, on && styles.dotOn]} />
        ))}
      </View>

      <ScrollView style={styles.body} contentContainerStyle={styles.bodyContent} keyboardShouldPersistTaps="handled">
        <Text style={styles.kicker}>{kicker}</Text>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.intro}>{body}</Text>

        {step === 1 ? (
          <View>
            <Text style={styles.label}>Store name</Text>
            <TextInput
              value={store.name}
              onChangeText={(v) => setStoreField('name', v)}
              placeholder="e.g. Aling Nena's Store"
              placeholderTextColor={color.textFaint}
              style={[styles.input, styles.inputSpaced]}
            />
            <Text style={styles.label}>Address</Text>
            <TextInput
              value={store.address}
              onChangeText={(v) => setStoreField('address', v)}
              placeholder="Purok 3, Barangay San Roque"
              placeholderTextColor={color.textFaint}
              style={[styles.input, styles.inputSpaced]}
            />
            <Text style={styles.label}>Contact number</Text>
            <TextInput
              value={store.phone}
              onChangeText={(v) => setStoreField('phone', v)}
              placeholder="09xx xxx xxxx"
              placeholderTextColor={color.textFaint}
              keyboardType="phone-pad"
              style={[styles.input, styles.inputSpaced]}
            />
            <View style={styles.logoRow}>
              <ImageField
                uri={store.logo}
                onChange={(uri) => setStoreField('logo', uri)}
                name="store-logo"
                label="Logo"
                size={54}
              />
              <Text style={styles.hint}>
                Optional — tap to take a photo or pick one. It prints at the top of every receipt.
              </Text>
            </View>
          </View>
        ) : null}

        {step === 2 ? (
          <View>
            <View style={styles.card}>
              <View style={styles.cardText}>
                <Text style={styles.cardTitle}>Currency</Text>
                <Text style={styles.cardSub}>Philippine peso · ₱1,234.00</Text>
              </View>
              <Text style={styles.cardValue}>PHP</Text>
            </View>
            <Text style={[styles.label, styles.labelSpaced]}>Does VAT apply to your prices?</Text>
            <FilterChips options={vatOptions} selected={vat ? 'yes' : 'no'} onSelect={setVat} />
            <Text style={styles.hint}>{vatNote}</Text>
          </View>
        ) : null}

        {step === 3 ? <PinPad filled={pinFilled} error={pinError} onPress={pressPin} /> : null}

        {step === 4 ? (
          <View>
            <View style={styles.viewfinder}>
              <View style={styles.reticle}>
                <View style={[styles.corner, styles.cornerTL]} />
                <View style={[styles.corner, styles.cornerTR]} />
                <View style={[styles.corner, styles.cornerBL]} />
                <View style={[styles.corner, styles.cornerBR]} />
              </View>
            </View>
            {cameraDenied ? (
              <View style={styles.denied}>
                <Text style={styles.deniedTitle}>Camera is blocked</Text>
                <Text style={styles.deniedBody}>
                  Without it you can still sell — search items by name, use quick items, or pair a
                  Bluetooth scanner later.
                </Text>
                <Pressable onPress={openSettings} accessibilityRole="button" style={styles.deniedBtn}>
                  <Text style={styles.deniedBtnText}>Open phone settings</Text>
                </Pressable>
              </View>
            ) : null}
            <View style={styles.pairRow}>
              <Pressable onPress={allowCamera} accessibilityRole="button" style={styles.primaryHalf}>
                <Text style={styles.primaryText}>Allow camera</Text>
              </Pressable>
              <Pressable onPress={denyCamera} accessibilityRole="button" style={styles.secondaryHalf}>
                <Text style={styles.secondaryText}>Deny</Text>
              </Pressable>
            </View>
          </View>
        ) : null}

        {step === 5 ? (
          <View style={styles.firstActions}>
            <Pressable onPress={scanFirst} accessibilityRole="button" style={styles.primaryFull}>
              <Text style={styles.primaryText}>Scan a product</Text>
            </Pressable>
            <Pressable onPress={addFirst} accessibilityRole="button" style={styles.secondaryFull}>
              <Text style={styles.secondaryText}>Add manually</Text>
            </Pressable>
            <Pressable onPress={next} accessibilityRole="button" style={styles.tertiaryFull}>
              <Text style={styles.tertiaryText}>Skip for now</Text>
            </Pressable>
            <Text style={styles.hint}>
              You can also let products build themselves — any unknown barcode you scan at the
              counter offers a quick add.
            </Text>
          </View>
        ) : null}
      </ScrollView>

      <View style={styles.footer}>
        {canBack ? (
          <Pressable onPress={back} accessibilityRole="button" style={styles.backBtn}>
            <Text style={styles.secondaryText}>Back</Text>
          </Pressable>
        ) : null}
        <Pressable
          onPress={next}
          disabled={!canNext}
          accessibilityRole="button"
          accessibilityState={{ disabled: !canNext }}
          style={[styles.nextBtn, canNext ? styles.nextOn : styles.nextOff]}>
          <Text style={[styles.nextText, !canNext && styles.nextTextOff]}>{nextLabel}</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: color.bg },
  dotsRow: { flexDirection: 'row', gap: 4, paddingTop: 12, paddingHorizontal: 14 },
  dot: { flex: 1, height: 3, borderRadius: 2, backgroundColor: color.line },
  dotOn: { backgroundColor: color.accent },

  body: { flex: 1, minHeight: 0 },
  bodyContent: { paddingVertical: 16, paddingHorizontal: 14 },
  kicker: {
    fontFamily: font.semibold,
    fontSize: 10.5,
    letterSpacing: 1.15,
    textTransform: 'uppercase',
    color: '#9690c9',
    marginBottom: 10,
  },
  title: { fontFamily: font.medium, fontSize: 20, lineHeight: 25, color: color.text, marginBottom: 8 },
  intro: { fontFamily: font.regular, fontSize: 12.5, lineHeight: 20, color: color.textMuted, marginBottom: 16 },

  label: { fontFamily: font.regular, fontSize: 11.5, color: color.textDim, marginBottom: 6 },
  labelSpaced: { marginTop: 14, marginBottom: 7 },
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
  inputSpaced: { marginBottom: 11 },
  logoRow: { flexDirection: 'row', alignItems: 'center', gap: 11 },
  logo: {
    width: 54,
    height: 54,
    borderRadius: radius.md,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: color.accentLine,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: { fontFamily: font.regular, fontSize: 10, color: color.textFaint },
  hint: { flex: 1, fontFamily: font.regular, fontSize: 11.5, lineHeight: 18, color: color.textFaint, marginTop: 10 },

  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 13,
    paddingHorizontal: 12,
    borderRadius: radius.md,
    backgroundColor: color.surfaceSunken,
    borderWidth: 1,
    borderColor: color.line,
  },
  cardText: { flex: 1, minWidth: 0 },
  cardTitle: { fontFamily: font.medium, fontSize: 13, color: color.text },
  cardSub: { fontFamily: font.regular, fontSize: 11.5, color: color.textFaint, marginTop: 3 },
  cardValue: { fontFamily: font.medium, fontSize: 12, color: color.accentSoft },

  viewfinder: {
    height: 132,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: color.line,
    backgroundColor: color.bgDeep,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
    overflow: 'hidden',
  },
  reticle: { width: '58%', aspectRatio: 1.6 },
  corner: { position: 'absolute', width: 20, height: 20, borderColor: color.accentSoft },
  cornerTL: { left: 0, top: 0, borderTopWidth: 2, borderLeftWidth: 2, borderTopLeftRadius: 8 },
  cornerTR: { right: 0, top: 0, borderTopWidth: 2, borderRightWidth: 2, borderTopRightRadius: 8 },
  cornerBL: { left: 0, bottom: 0, borderBottomWidth: 2, borderLeftWidth: 2, borderBottomLeftRadius: 8 },
  cornerBR: { right: 0, bottom: 0, borderBottomWidth: 2, borderRightWidth: 2, borderBottomRightRadius: 8 },

  denied: {
    padding: 12,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: color.accentLine,
    backgroundColor: color.accentInk,
    marginBottom: 12,
  },
  deniedTitle: { fontFamily: font.medium, fontSize: 13, color: color.textBright, marginBottom: 5 },
  deniedBody: { fontFamily: font.regular, fontSize: 12, lineHeight: 19, color: color.accentPale, marginBottom: 11 },
  deniedBtn: {
    minHeight: 44,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: color.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deniedBtnText: { fontFamily: font.medium, fontSize: 13, color: color.textBright },

  pairRow: { flexDirection: 'row', gap: 9 },
  primaryHalf: {
    flex: 1,
    minHeight: 46,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: color.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryHalf: {
    flex: 1,
    minHeight: 46,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: color.lineStrong,
    alignItems: 'center',
    justifyContent: 'center',
  },
  firstActions: { gap: 9 },
  primaryFull: {
    minHeight: 50,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: color.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryFull: {
    minHeight: 50,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: color.lineStrong,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tertiaryFull: {
    minHeight: 50,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: color.line,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryText: { fontFamily: font.medium, fontSize: 13.5, color: color.textBright },
  secondaryText: { fontFamily: font.medium, fontSize: 13.5, color: '#cfd3e5' },
  tertiaryText: { fontFamily: font.medium, fontSize: 13.5, color: color.textDim },

  footer: {
    flexDirection: 'row',
    gap: 9,
    paddingTop: 10,
    paddingHorizontal: 12,
    paddingBottom: 12,
    borderTopWidth: 1,
    borderTopColor: color.hairline,
  },
  backBtn: {
    minWidth: 70,
    minHeight: 50,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: color.lineStrong,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextBtn: {
    flex: 1,
    minHeight: 50,
    borderRadius: 11,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextOn: { backgroundColor: color.accentInk, borderColor: color.accent },
  nextOff: { borderColor: color.line, opacity: 0.7 },
  nextText: { fontFamily: font.medium, fontSize: 15, color: color.textBright },
  nextTextOff: { color: color.lineStrong },
});
