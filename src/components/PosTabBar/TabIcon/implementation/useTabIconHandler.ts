import { useMemo } from 'react';

import type { TabIconName } from './TabIcon';

type IconShape = {
  paths: string[];
  circles: { cx: number; cy: number; r: number }[];
};

const ICONS: Record<TabIconName, IconShape> = {
  cart: {
    paths: ['M3 5h2l2.2 10.2a2 2 0 0 0 2 1.6h7.3a2 2 0 0 0 2-1.5L20 8H6'],
    circles: [
      { cx: 10, cy: 20, r: 1.2 },
      { cx: 17, cy: 20, r: 1.2 },
    ],
  },
  box: {
    paths: ['M4 8.5 12 4l8 4.5v7L12 20l-8-4.5z', 'M4 8.5 12 13l8-4.5M12 13v7'],
    circles: [],
  },
  receipt: {
    paths: ['M6 3h12v18l-3-2-3 2-3-2-3 2z', 'M9 8h6M9 12h6'],
    circles: [],
  },
  bars: {
    paths: ['M4 20V10M10 20V4M16 20v-7M22 20H3'],
    circles: [],
  },
  dots: {
    paths: [],
    circles: [
      { cx: 5, cy: 12, r: 1.3 },
      { cx: 12, cy: 12, r: 1.3 },
      { cx: 19, cy: 12, r: 1.3 },
    ],
  },
};

export function useTabIconHandler(name: TabIconName): IconShape {
  return useMemo(() => ICONS[name], [name]);
}
