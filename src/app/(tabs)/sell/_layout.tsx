import { Stack } from 'expo-router';
import React from 'react';

import { color } from '@/theme/tokens';

/** Sell keeps the tab bar visible while it steps to Payment and Receipt. */
export default function SellLayout() {
  return (
    <Stack
      screenOptions={{ headerShown: false, contentStyle: { backgroundColor: color.bg } }}
    />
  );
}
