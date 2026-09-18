import { Image } from 'expo-image';
import React from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';

import { color, font, radius } from '@/theme/tokens';

import { useImageFieldHandler } from './useImageFieldHandler';

type ImageFieldProps = {
  /** Current image, or undefined for the empty dashed box. */
  uri?: string;
  /** Saved copy of the picked image — persist this. */
  onChange: (uri: string | undefined) => void;
  /** File name stem for the saved copy, e.g. a product id. */
  name: string;
  /** Empty-state caption inside the box. */
  label: string;
  size?: number;
};

/** Tap to take a photo or pick one from the gallery; long-press-free, one sheet. */
export function ImageField({ uri, onChange, name, label, size = 62 }: ImageFieldProps) {
  const { open, close, isOpen, takePhoto, pickFromGallery, remove } = useImageFieldHandler({
    onChange,
    name,
    uri,
  });

  return (
    <>
      <Pressable
        onPress={open}
        accessibilityRole="button"
        accessibilityLabel={uri ? `Change ${label.toLowerCase()}` : `Add ${label.toLowerCase()}`}
        style={[styles.box, { width: size, height: size }, uri && styles.boxFilled]}>
        {uri ? (
          <Image source={{ uri }} style={styles.image} contentFit="cover" />
        ) : (
          <Text style={styles.label}>{label}</Text>
        )}
      </Pressable>

      <Modal visible={isOpen} transparent animationType="slide" onRequestClose={close}>
        <View style={styles.backdrop}>
          <Pressable style={styles.backdropFill} onPress={close} accessibilityLabel="Dismiss" />
          <View style={styles.sheet}>
            <View style={styles.grabber} />
            <Text style={styles.title}>{label}</Text>

            <Pressable onPress={takePhoto} accessibilityRole="button" style={styles.primary}>
              <Text style={styles.primaryText}>Take a photo</Text>
            </Pressable>
            <Pressable onPress={pickFromGallery} accessibilityRole="button" style={styles.secondary}>
              <Text style={styles.secondaryText}>Choose from gallery</Text>
            </Pressable>
            {uri ? (
              <Pressable onPress={remove} accessibilityRole="button" style={styles.tertiary}>
                <Text style={styles.tertiaryText}>Remove photo</Text>
              </Pressable>
            ) : null}
            <Pressable onPress={close} accessibilityRole="button" style={styles.tertiary}>
              <Text style={styles.tertiaryText}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  box: {
    borderRadius: radius.md,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: color.accentLine,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  boxFilled: { borderStyle: 'solid', borderColor: color.line },
  image: { width: '100%', height: '100%' },
  label: { fontFamily: font.regular, fontSize: 10, color: color.textFaint },

  backdrop: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(11,12,20,0.72)' },
  backdropFill: { position: 'absolute', inset: 0 },
  sheet: {
    backgroundColor: color.surface,
    borderTopWidth: 1,
    borderTopColor: color.lineStrong,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 16,
    gap: 9,
  },
  grabber: {
    width: 38,
    height: 4,
    borderRadius: 2,
    backgroundColor: color.line,
    alignSelf: 'center',
    marginBottom: 10,
  },
  title: { fontFamily: font.medium, fontSize: 15, color: color.text, marginBottom: 5 },
  primary: {
    minHeight: 50,
    borderRadius: radius.md,
    backgroundColor: color.accentInk,
    borderWidth: 1,
    borderColor: color.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryText: { fontFamily: font.medium, fontSize: 14, color: color.textBright },
  secondary: {
    minHeight: 50,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: color.lineStrong,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryText: { fontFamily: font.medium, fontSize: 13.5, color: '#cfd3e5' },
  tertiary: {
    minHeight: 46,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: color.line,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tertiaryText: { fontFamily: font.medium, fontSize: 13, color: color.textDim },
});
