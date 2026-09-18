import React from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Settings } from '@/components/Settings/implementation/Settings';
import { color } from '@/theme/tokens';

export default function SettingsScreen() {
  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <Settings />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({ safe: { flex: 1, backgroundColor: color.bg } });
