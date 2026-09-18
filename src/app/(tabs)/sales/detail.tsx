import React from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { SaleDetail } from '@/components/SaleDetail/implementation/SaleDetail';
import { color } from '@/theme/tokens';

export default function SaleDetailScreen() {
  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <SaleDetail />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({ safe: { flex: 1, backgroundColor: color.bg } });
