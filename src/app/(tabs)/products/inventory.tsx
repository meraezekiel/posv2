import React from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Inventory } from '@/components/Inventory/implementation/Inventory';
import { color } from '@/theme/tokens';

export default function InventoryScreen() {
  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <Inventory />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({ safe: { flex: 1, backgroundColor: color.bg } });
