import React from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ScanCart } from '@/components/ScanCart/implementation/ScanCart';
import { color } from '@/theme/tokens';

export default function SellScreen() {
  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScanCart />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({ safe: { flex: 1, backgroundColor: color.bg } });
