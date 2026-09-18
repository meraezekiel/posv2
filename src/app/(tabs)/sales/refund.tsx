import React from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { RefundSale } from '@/components/RefundSale/implementation/RefundSale';
import { color } from '@/theme/tokens';

export default function RefundScreen() {
  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <RefundSale />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({ safe: { flex: 1, backgroundColor: color.bg } });
