import { useRouter } from 'expo-router';
import { useCallback } from 'react';

import { usePosStore } from '@/store/pos-store';
import { useUiStore } from '@/store/ui-store';

export function useBackupSettingsHandler() {
  const router = useRouter();
  const { backupLast, setBackupLast, showGlobalToast, resetAll } = usePosStore();
  const { askConfirm, runBusy } = useUiStore();

  return {
    state: `Last backup ${backupLast}`,
    sub: 'Products, sales and settings · about 240 KB',
    backup: useCallback(
      () =>
        runBusy('Writing backup…', 1400, () => {
          setBackupLast('just now');
          showGlobalToast('Backup saved to this phone');
        }),
      [runBusy, setBackupLast, showGlobalToast],
    ),
    restore: useCallback(
      () =>
        askConfirm({
          title: 'Restore from a backup?',
          body: "Everything on this phone is replaced by the backup's data. Sales rung up since then are lost.",
          label: 'Choose a file',
          action: () =>
            runBusy('Restoring…', 1500, () => showGlobalToast('Restored from the 2-day-old backup')),
        }),
      [askConfirm, runBusy, showGlobalToast],
    ),
    /** Everything is kept on this phone, so there has to be a way to wipe it. */
    startFresh: useCallback(
      () =>
        askConfirm({
          title: 'Start fresh?',
          body: 'Products, sales, settings and the owner PIN are erased from this phone, and setup starts over. This cannot be undone.',
          label: 'Erase and start over',
          action: () => {
            resetAll();
            router.replace('/onboarding');
          },
        }),
      [askConfirm, resetAll, router],
    ),
  };
}
