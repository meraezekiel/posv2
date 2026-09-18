import { useUiStore } from '@/store/ui-store';

export function useBusyOverlayHandler() {
  const { busyLabel } = useUiStore();
  return { label: busyLabel };
}
