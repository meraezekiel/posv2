import { Redirect, Tabs } from 'expo-router';
import React from 'react';

import { PosTabBar } from '@/components/PosTabBar/implementation/PosTabBar';
import { usePosStore } from '@/store/pos-store';
import { color } from '@/theme/tokens';

export default function TabsLayout() {
  const { onboarded, signedIn } = usePosStore();

  // Setup runs once, then the PIN screen guards the counter.
  if (!onboarded) return <Redirect href="/onboarding" />;
  if (!signedIn) return <Redirect href="/login" />;

  return (
    <Tabs
      tabBar={(props) => <PosTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        sceneStyle: { backgroundColor: color.bg },
      }}>
      <Tabs.Screen name="sell" />
      <Tabs.Screen name="products" />
      <Tabs.Screen name="sales" />
      <Tabs.Screen name="reports" />
      <Tabs.Screen name="more" />
    </Tabs>
  );
}
