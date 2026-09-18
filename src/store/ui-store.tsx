import React, { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';

/**
 * App-wide overlays: the confirmation dialog and the busy spinner.
 * Kept apart from the POS data so screens can raise one from anywhere.
 */
export type ConfirmRequest = {
  title: string;
  body: string;
  label: string;
  action: () => void;
};

type UiStore = {
  confirmRequest: ConfirmRequest | null;
  askConfirm: (request: ConfirmRequest) => void;
  closeConfirm: () => void;

  busyLabel: string | null;
  runBusy: (label: string, ms: number, then?: () => void) => void;
};

const UiStoreContext = createContext<UiStore | null>(null);

export function UiStoreProvider({ children }: { children: React.ReactNode }) {
  const [confirmRequest, setConfirmRequest] = useState<ConfirmRequest | null>(null);
  const [busyLabel, setBusyLabel] = useState<string | null>(null);
  const busyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const runBusy = useCallback((label: string, ms: number, then?: () => void) => {
    if (busyTimer.current) clearTimeout(busyTimer.current);
    setBusyLabel(label);
    busyTimer.current = setTimeout(() => {
      setBusyLabel(null);
      then?.();
    }, ms);
  }, []);

  const value = useMemo<UiStore>(
    () => ({
      confirmRequest,
      askConfirm: setConfirmRequest,
      closeConfirm: () => setConfirmRequest(null),
      busyLabel,
      runBusy,
    }),
    [busyLabel, confirmRequest, runBusy],
  );

  return <UiStoreContext.Provider value={value}>{children}</UiStoreContext.Provider>;
}

export function useUiStore(): UiStore {
  const store = useContext(UiStoreContext);
  if (!store) throw new Error('useUiStore must be used inside <UiStoreProvider>');
  return store;
}
