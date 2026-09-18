import { Stack } from 'expo-router';
import React from 'react';

import { color } from '@/theme/tokens';

export default function ReportsLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: color.bg } }} />
  );
}
