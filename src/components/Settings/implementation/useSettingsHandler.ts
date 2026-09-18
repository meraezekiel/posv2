import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback } from 'react';

export type SettingsPage = 'printer' | 'scanner' | 'users' | 'backup';

const TITLES: Record<SettingsPage, string> = {
  printer: 'Printer',
  scanner: 'Scanner',
  users: 'Users and PINs',
  backup: 'Backup and restore',
};

export function useSettingsHandler() {
  const router = useRouter();
  const { page } = useLocalSearchParams<{ page?: string }>();
  const current = (page ?? 'printer') as SettingsPage;

  return {
    back: useCallback(() => router.back(), [router]),
    title: TITLES[current] ?? 'Settings',
    page: current,
  };
}
