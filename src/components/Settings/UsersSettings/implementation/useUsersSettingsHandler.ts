import { useCallback } from 'react';

import { usePosStore } from '@/store/pos-store';

export function useUsersSettingsHandler() {
  const { users, toggleUser, addCashier, showGlobalToast } = usePosStore();

  return {
    users: users.map((user, i) => ({
      name: user.name,
      active: user.active,
      initials: user.name
        .split(' ')
        .map((w) => w[0])
        .join('')
        .slice(0, 2)
        .toUpperCase(),
      sub: `${user.role}${user.active ? ' · PIN set' : ' · deactivated'}`,
      action: user.role === 'Owner' ? 'Change PIN' : user.active ? 'Deactivate' : 'Reactivate',
      toggle: () => {
        // The owner's PIN changes behind the current PIN, not from this row.
        if (user.role === 'Owner') {
          showGlobalToast('Enter the current PIN to change it');
          return;
        }
        toggleUser(i);
        showGlobalToast(user.active ? `${user.name} deactivated` : `${user.name} reactivated`);
      },
    })),
    addCashier: useCallback(() => {
      addCashier();
      showGlobalToast('Cashier added — set their PIN next');
    }, [addCashier, showGlobalToast]),
  };
}
