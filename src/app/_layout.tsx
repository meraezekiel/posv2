import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  useFonts,
} from '@expo-google-fonts/inter';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { BusyOverlay } from '@/components/BusyOverlay/implementation/BusyOverlay';
import { ConfirmDialog } from '@/components/ConfirmDialog/implementation/ConfirmDialog';
import { PosStoreProvider, usePosStore } from '@/store/pos-store';
import { UiStoreProvider } from '@/store/ui-store';
import { color } from '@/theme/tokens';

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
  });

  return (
    <SafeAreaProvider>
      <PosStoreProvider>
        <UiStoreProvider>
          <StatusBar style="light" />
          <AppShell fontsLoaded={fontsLoaded} />
        </UiStoreProvider>
      </PosStoreProvider>
    </SafeAreaProvider>
  );
}

/**
 * Holds the splash until the fonts are in and the saved store has been read,
 * so a returning user never sees first-run setup flash past.
 */
function AppShell({ fontsLoaded }: { fontsLoaded: boolean }) {
  const { hydrated } = usePosStore();

  if (!fontsLoaded || !hydrated) return <View style={styles.blank} />;

  return (
    <>
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: color.bg } }}>
        <Stack.Screen name="(tabs)" />
      </Stack>
      {/* Overlays live above every screen, including onboarding and login. */}
      <ConfirmDialog />
      <BusyOverlay />
    </>
  );
}

const styles = StyleSheet.create({ blank: { flex: 1, backgroundColor: color.bg } });
