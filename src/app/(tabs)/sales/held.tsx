import React from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { HeldSales } from '@/components/HeldSales/implementation/HeldSales';
import { color } from '@/theme/tokens';

export default function HeldSalesScreen() {
  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <HeldSales />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({ safe: { flex: 1, backgroundColor: color.bg } });
