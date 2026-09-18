import React from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ProductList } from '@/components/ProductList/implementation/ProductList';
import { color } from '@/theme/tokens';

export default function ProductsScreen() {
  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ProductList />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({ safe: { flex: 1, backgroundColor: color.bg } });
