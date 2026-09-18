import React from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Reports } from '@/components/Reports/implementation/Reports';
import { color } from '@/theme/tokens';

export default function ReportsScreen() {
  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <Reports />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({ safe: { flex: 1, backgroundColor: color.bg } });
