import React from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Receipt } from '@/components/Receipt/implementation/Receipt';
import { color } from '@/theme/tokens';

export default function ReceiptScreen() {
  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <Receipt />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({ safe: { flex: 1, backgroundColor: color.bg } });
