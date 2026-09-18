import { useRouter } from 'expo-router';
import { useCallback, useMemo } from 'react';

import { usePosStore } from '@/store/pos-store';

export function useMoreHandler() {
  const router = useRouter();
  const {
    products,
    vatEnabled,
    role,
    toggleRole,
    showGlobalToast,
    store,
    categories,
    held,
    printer,
    scanner,
    users,
    backupLast,
    signOut,
  } = usePosStore();

  const lowCount = useMemo(
    () => products.filter((p) => !p.quick && p.stock <= p.low).length,
    [products],
  );

  /**
   * The prototype flips owner/cashier from its Tweaks panel; on the phone the
   * Switch button is the only way in, so it toggles the role for real.
   */
  const switchUser = useCallback(() => {
    toggleRole();
    showGlobalToast(
      role === 'owner' ? 'Switched to Ana · cashier access' : 'Switched to the owner · full access',
    );
  }, [role, showGlobalToast, toggleRole]);

  const groups = useMemo(
    () => [
      {
        title: 'Store',
        rows: [
          {
            label: 'Store profile',
            sub: `${store.name || "Aling Nena's Store"} · receipt header`,
            tap: () => router.push('/onboarding'),
          },
          {
            label: 'Inventory',
            sub: `${lowCount} items need restocking`,
            tap: () => router.push('/products/inventory'),
          },
          {
            label: 'Categories',
            sub: `${categories.length} categories`,
            tap: () => router.push('/products/categories'),
          },
          {
            label: 'Held sales',
            sub: held.length ? `${held.length} parked` : 'none parked',
            tap: () => router.push('/sales/held'),
          },
          {
            label: 'Tax and currency',
            sub: vatEnabled ? 'PHP · VAT 12% inclusive' : 'PHP · no VAT',
            tap: () => router.push('/onboarding'),
          },
        ],
      },
      {
        title: 'Hardware',
        rows: [
          {
            label: 'Printer',
            sub:
              printer.status === 'paired'
                ? `POS-58 Thermal · ${printer.paper} mm`
                : 'No printer paired',
            tap: () => router.push({ pathname: '/more/settings', params: { page: 'printer' } }),
          },
          {
            label: 'Scanner',
            sub: `Camera · ${scanner.beep ? 'beep on' : 'silent'} · ${scanner.mode}`,
            tap: () => router.push({ pathname: '/more/settings', params: { page: 'scanner' } }),
          },
        ],
      },
      {
        title: 'Data and people',
        rows: [
          {
            label: 'Users and PINs',
            sub: `${users.filter((u) => u.active).length} active users`,
            tap: () => router.push({ pathname: '/more/settings', params: { page: 'users' } }),
          },
          {
            label: 'Backup and restore',
            sub: `Last backup ${backupLast}`,
            tap: () => router.push({ pathname: '/more/settings', params: { page: 'backup' } }),
          },
          { label: 'Web dashboard', sub: 'Coming in Phase 2', tap: () => showGlobalToast('Phase 2 · web dashboard') },
          {
            label: 'Phone setup help',
            sub: 'Battery saver and autostart',
            tap: () => showGlobalToast('Xiaomi / HyperOS guide'),
          },
          {
            label: 'Log out · switch user',
            sub: 'Back to the PIN screen',
            tap: () => {
              signOut();
              router.replace('/login');
            },
          },
        ],
      },
    ],
    [
      backupLast,
      categories.length,
      held.length,
      lowCount,
      printer.paper,
      printer.status,
      router,
      scanner.beep,
      scanner.mode,
      showGlobalToast,
      signOut,
      store.name,
      users,
      vatEnabled,
    ],
  );

  return {
    initials: role === 'cashier' ? 'AR' : 'SO',
    userName: role === 'cashier' ? 'Ana Reyes' : 'Store owner',
    userRole: role === 'cashier' ? 'Cashier · limited access' : 'Owner · full access',
    switchUser,
    groups,
  };
}
