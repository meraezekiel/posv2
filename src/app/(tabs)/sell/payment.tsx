import React from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Payment } from '@/components/Payment/implementation/Payment';
import { color } from '@/theme/tokens';

export default function PaymentScreen() {
  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <Payment />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({ safe: { flex: 1, backgroundColor: color.bg } });
