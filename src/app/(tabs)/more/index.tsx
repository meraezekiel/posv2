import React from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { More } from '@/components/More/implementation/More';
import { color } from '@/theme/tokens';

export default function MoreScreen() {
  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <More />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({ safe: { flex: 1, backgroundColor: color.bg } });
