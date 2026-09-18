import { useCallback, useMemo } from 'react';

import { color } from '@/theme/tokens';

import type { TabIconName } from '../TabIcon/implementation/TabIcon';

/**
 * The slice of the navigator's tabBar props this bar uses. Typed here so the
 * component doesn't depend on @react-navigation/bottom-tabs directly.
 */
export type PosTabBarProps = {
  state: { index: number; routes: { key: string; name: string }[] };
  navigation: { navigate: (name: string) => void };
};

type TabSpec = {
  key: string;
  label: string;
  icon: TabIconName;
  /** Route name in the tab navigator. */
  route: string;
};

const TABS: TabSpec[] = [
  { key: 'sell', label: 'Sell', icon: 'cart', route: 'sell' },
  { key: 'products', label: 'Products', icon: 'box', route: 'products' },
  { key: 'sales', label: 'Sales', icon: 'receipt', route: 'sales' },
  { key: 'reports', label: 'Reports', icon: 'bars', route: 'reports' },
  { key: 'more', label: 'More', icon: 'dots', route: 'more' },
];

export function usePosTabBarHandler({ state, navigation }: PosTabBarProps) {
  const current = state.routes[state.index]?.name;

  const press = useCallback(
    (tab: TabSpec) => navigation.navigate(tab.route),
    [navigation],
  );

  const tabs = useMemo(
    () =>
      TABS.map((tab) => {
        const active = tab.route === current;
        return {
          ...tab,
          active,
          tint: active ? color.accentSoft : color.textDim,
          onPress: () => press(tab),
        };
      }),
    [current, press],
  );

  return { tabs };
}
