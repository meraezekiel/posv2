import React from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ProductDetail } from '@/components/ProductDetail/implementation/ProductDetail';
import { color } from '@/theme/tokens';

export default function ProductDetailScreen() {
  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ProductDetail />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({ safe: { flex: 1, backgroundColor: color.bg } });
