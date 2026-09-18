import React from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Login } from '@/components/Login/implementation/Login';
import { color } from '@/theme/tokens';

export default function LoginScreen() {
  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <Login />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({ safe: { flex: 1, backgroundColor: color.bg } });
