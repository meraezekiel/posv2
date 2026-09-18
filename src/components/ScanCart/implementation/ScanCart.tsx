import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Toast } from '@/components/Toast/implementation/Toast';
import { color, font, radius } from '@/theme/tokens';

import { CameraPane } from '../CameraPane/implementation/CameraPane';
import { CartLineRow } from '../CartLineRow/implementation/CartLineRow';
import { ChargeBar } from '../ChargeBar/implementation/ChargeBar';
import { LineSheet } from '../LineSheet/implementation/LineSheet';
import { QuickItems } from '../QuickItems/implementation/QuickItems';
import { UnknownCodeSheet } from '../UnknownCodeSheet/implementation/UnknownCodeSheet';
import { useScanCartHandler } from './useScanCartHandler';

/**
 * Sell — the screen the day is spent on. Viewfinder on top (or hidden),
 * cart below, sticky total and Charge button at the bottom.
 */
export function ScanCart() {
  const {
    cart,
    cartEmpty,
    countLabel,
    cameraVisible,
    cameraHeight,
    onContentLayout,
    onDetected,
    onSimulate,
    hideCamera,
    showCamera,
    askClear,
    holdSale,
    unknownCode,
    addUnknownAsNew,
    dismissUnknown,
    openLineId,
    openLine,
    closeLine,
  } = useScanCartHandler();

  return (
    <View style={styles.screen} onLayout={onContentLayout}>
      {cameraVisible ? (
        <CameraPane
          height={cameraHeight}
          onDetected={onDetected}
          onSimulate={onSimulate}
          onHide={hideCamera}
        />
      ) : null}

      <ScrollView style={styles.list} contentContainerStyle={styles.listContent}>
        <View style={styles.listHeader}>
          <Text style={styles.listHeaderText}>Cart · {countLabel}</Text>
          <View style={styles.headerActions}>
            <Pressable onPress={holdSale} accessibilityRole="button">
              <Text style={styles.hold}>Hold</Text>
            </Pressable>
            <Pressable onPress={askClear} accessibilityRole="button">
              <Text style={styles.clear}>Clear</Text>
            </Pressable>
          </View>
        </View>

        {cartEmpty ? (
          <View style={styles.empty}>
            <View style={styles.emptyMark} />
            <Text style={styles.emptyTitle}>Scan an item to start</Text>
            <Text style={styles.emptyBody}>
              Point the camera at a barcode, or search by name below.
            </Text>
          </View>
        ) : (
          cart.map((line) => (
            <CartLineRow key={line.id} line={line} onOpen={() => openLine(line.id)} />
          ))
        )}

        {!cameraVisible ? <QuickItems /> : null}

        <View style={styles.searchWrap}>
          <View style={styles.search}>
            <View style={styles.searchDot} />
            <Text style={styles.searchText}>Search name, SKU or type a barcode</Text>
          </View>
        </View>
      </ScrollView>

      {!cameraVisible ? (
        <Pressable onPress={showCamera} accessibilityRole="button" style={styles.fab}>
          <Text style={styles.fabText}>Scan</Text>
        </Pressable>
      ) : null}

      <Toast bottom={82} />
      <ChargeBar />

      <UnknownCodeSheet
        code={unknownCode}
        onAddAsNew={addUnknownAsNew}
        onDismiss={dismissUnknown}
      />
      <LineSheet lineId={openLineId} onClose={closeLine} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: color.bg },
  list: { flex: 1, minHeight: 0 },
  listContent: { paddingBottom: 4 },
  listHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    paddingTop: 10,
    paddingHorizontal: 14,
    paddingBottom: 8,
    backgroundColor: color.bg,
  },
  listHeaderText: {
    fontFamily: font.semibold,
    fontSize: 11,
    letterSpacing: 1.1,
    textTransform: 'uppercase',
    color: color.textFaint,
  },
  headerActions: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  hold: { fontFamily: font.medium, fontSize: 11.5, color: color.accentSoft },
  clear: { fontFamily: font.medium, fontSize: 11.5, color: color.textDim },

  empty: { paddingVertical: 26, paddingHorizontal: 22, alignItems: 'center' },
  emptyMark: {
    width: 46,
    height: 46,
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
    lineHeight: 18,
    color: color.textFaint,
    textAlign: 'center',
  },

  searchWrap: { paddingTop: 12, paddingHorizontal: 14, paddingBottom: 16 },
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    height: 44,
    paddingHorizontal: 12,
    borderRadius: radius.md,
    backgroundColor: color.surfaceSunken,
    borderWidth: 1,
    borderColor: color.line,
  },
  searchDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 1.6,
    borderColor: color.textFaint,
  },
  searchText: { fontFamily: font.regular, fontSize: 13, color: color.textFaint },

  fab: {
    position: 'absolute',
    right: 14,
    // Sits clear of the charge bar's total line; the mockup's 84 covered it.
    bottom: 112,
    zIndex: 5,
    height: 48,
    paddingHorizontal: 18,
    borderRadius: radius.pill,
    backgroundColor: color.accentInk,
    borderWidth: 1,
    borderColor: color.accent,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
  },
  fabText: { fontFamily: font.medium, fontSize: 13, color: color.textBright },
});
