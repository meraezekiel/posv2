import { CameraView } from 'expo-camera';
import React from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';

import { color, font, radius } from '@/theme/tokens';

import { useCameraPaneHandler } from './useCameraPaneHandler';

export type CameraPaneProps = {
  /** Pixel height of the viewfinder — a share of the Sell area, measured by the parent. */
  height: number;
  /** Rounded framing used by the cart-first overlay. */
  rounded?: boolean;
  onDetected: (code: string) => void;
  onSimulate: () => void;
  onHide?: () => void;
};

/**
 * Live viewfinder: the real camera under the mockup's reticle, corner
 * brackets, scanline and control chips.
 */
export function CameraPane({
  height,
  rounded = false,
  onDetected,
  onSimulate,
  onHide,
}: CameraPaneProps) {
  const {
    granted,
    canAsk,
    requestAccess,
    openSettings,
    torch,
    toggleTorch,
    continuous,
    toggleContinuous,
    onBarcodeScanned,
    scanLineStyle,
    onReticleLayout,
  } = useCameraPaneHandler({ onDetected });

  return (
    <View
      style={[styles.pane, rounded ? styles.paneRounded : styles.paneInline, { height }]}>
      {granted ? (
        <>
          <Pressable style={StyleSheet.absoluteFill} onPress={onSimulate}>
            <CameraView
              style={StyleSheet.absoluteFill}
              facing="back"
              enableTorch={torch}
              barcodeScannerSettings={{
                barcodeTypes: ['ean13', 'ean8', 'upc_a', 'upc_e', 'code128', 'code39', 'qr', 'itf14'],
              }}
              onBarcodeScanned={onBarcodeScanned}
            />
            <View style={styles.vignette} pointerEvents="none" />

            <View style={styles.reticleWrap} pointerEvents="none">
              <View style={styles.reticle} onLayout={onReticleLayout}>
                <View style={[styles.corner, styles.cornerTL]} />
                <View style={[styles.corner, styles.cornerTR]} />
                <View style={[styles.corner, styles.cornerBL]} />
                <View style={[styles.corner, styles.cornerBR]} />
                <Animated.View style={[styles.scanLine, scanLineStyle]} />
              </View>
            </View>
          </Pressable>

          <View style={styles.chipsLeft}>
            <Pressable
              onPress={toggleTorch}
              accessibilityRole="button"
              accessibilityLabel={torch ? 'Turn torch off' : 'Turn torch on'}
              style={[styles.chip, torch && styles.chipOn]}>
              <Text style={[styles.chipText, torch && styles.chipTextOn]}>Torch</Text>
            </Pressable>
            <Pressable
              onPress={toggleContinuous}
              accessibilityRole="button"
              accessibilityLabel="Toggle scan mode"
              style={styles.chip}>
              <Text style={styles.chipTextDim}>{continuous ? 'Continuous' : 'Single'}</Text>
            </Pressable>
          </View>

          {onHide ? (
            <Pressable
              onPress={onHide}
              accessibilityRole="button"
              accessibilityLabel="Hide camera"
              style={[styles.chip, styles.chipRight]}>
              <Text style={styles.chipTextDim}>Hide</Text>
            </Pressable>
          ) : null}

          <Text style={styles.hint} pointerEvents="none">
            Point at a barcode · tap to simulate a scan
          </Text>
        </>
      ) : (
        <View style={styles.permission}>
          <Text style={styles.permissionTitle}>Camera off</Text>
          <Text style={styles.permissionBody}>
            The camera is the scanner. Allow it and barcodes drop straight into the cart.
          </Text>
          <Pressable
            onPress={canAsk ? requestAccess : openSettings}
            accessibilityRole="button"
            style={styles.permissionBtn}>
            <Text style={styles.permissionBtnText}>
              {canAsk ? 'Allow camera' : 'Open Settings'}
            </Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  pane: { position: 'relative', overflow: 'hidden', backgroundColor: color.bgDeep },
  paneInline: { borderBottomWidth: 1, borderBottomColor: '#292b31' },
  paneRounded: { borderRadius: radius.xl, borderWidth: 1, borderColor: color.line },
  vignette: { position: 'absolute', inset: 0, backgroundColor: 'rgba(13,14,22,0.18)' },

  reticleWrap: { position: 'absolute', inset: 0, alignItems: 'center', justifyContent: 'center' },
  reticle: { width: '62%', aspectRatio: 1.6, maxHeight: '78%' },
  corner: { position: 'absolute', width: 22, height: 22, borderColor: color.accentSoft },
  cornerTL: { left: 0, top: 0, borderTopWidth: 2, borderLeftWidth: 2, borderTopLeftRadius: 8 },
  cornerTR: { right: 0, top: 0, borderTopWidth: 2, borderRightWidth: 2, borderTopRightRadius: 8 },
  cornerBL: { left: 0, bottom: 0, borderBottomWidth: 2, borderLeftWidth: 2, borderBottomLeftRadius: 8 },
  cornerBR: { right: 0, bottom: 0, borderBottomWidth: 2, borderRightWidth: 2, borderBottomRightRadius: 8 },
  scanLine: {
    position: 'absolute',
    left: '6%',
    right: '6%',
    height: 2,
    backgroundColor: color.accentSoft,
  },

  chipsLeft: { position: 'absolute', left: 10, top: 8, flexDirection: 'row', gap: 6 },
  chipRight: { position: 'absolute', right: 10, top: 8 },
  chip: {
    height: 30,
    minWidth: 30,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 9,
    borderRadius: radius.sm,
    backgroundColor: 'rgba(22,24,38,0.72)',
    borderWidth: 1,
    borderColor: color.line,
  },
  chipOn: { borderColor: color.accent, backgroundColor: color.accentInk },
  chipText: { fontFamily: font.medium, fontSize: 11, color: color.text },
  chipTextOn: { color: color.textBright },
  chipTextDim: { fontFamily: font.medium, fontSize: 11, color: color.textMuted },

  hint: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 7,
    textAlign: 'center',
    fontFamily: font.medium,
    fontSize: 10.5,
    color: '#cfd3e5',
  },

  permission: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 22 },
  permissionTitle: { fontFamily: font.medium, fontSize: 15, color: color.text, marginBottom: 6 },
  permissionBody: {
    fontFamily: font.regular,
    fontSize: 12,
    lineHeight: 18,
    color: color.textFaint,
    textAlign: 'center',
    marginBottom: 12,
  },
  permissionBtn: {
    height: 44,
    paddingHorizontal: 18,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: color.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  permissionBtnText: { fontFamily: font.medium, fontSize: 13.5, color: color.textBright },
});
