import React from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { SalesHistory } from '@/components/SalesHistory/implementation/SalesHistory';
import { color } from '@/theme/tokens';

export default function SalesScreen() {
  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <SalesHistory />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({ safe: { flex: 1, backgroundColor: color.bg } });
