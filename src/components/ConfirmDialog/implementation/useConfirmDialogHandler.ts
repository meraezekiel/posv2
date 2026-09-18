import { useCallback } from 'react';

import { useUiStore } from '@/store/ui-store';

export function useConfirmDialogHandler() {
  const { confirmRequest, closeConfirm } = useUiStore();

  return {
    request: confirmRequest,
    confirm: useCallback(() => {
      const action = confirmRequest?.action;
      closeConfirm();
      action?.();
    }, [closeConfirm, confirmRequest]),
    cancel: closeConfirm,
  };
}
