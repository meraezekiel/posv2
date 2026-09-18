import React from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ProductForm } from '@/components/ProductForm/implementation/ProductForm';
import { color } from '@/theme/tokens';

/**
 * Quick-add after an unknown barcode. It lives in the Sell stack so saving
 * returns straight to the cart instead of stranding the Products tab on a form.
 */
export default function QuickAddScreen() {
  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <KeyboardAvoidingView
        style={styles.fill}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ProductForm />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: color.bg },
  fill: { flex: 1 },
});
