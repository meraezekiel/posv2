import React from 'react';
import Svg, { Circle, Path } from 'react-native-svg';

import { useTabIconHandler } from './useTabIconHandler';

export type TabIconName = 'cart' | 'box' | 'receipt' | 'bars' | 'dots';

type TabIconProps = {
  name: TabIconName;
  color: string;
  size?: number;
};

/** The five line icons from the mockup, traced from its inline SVG paths. */
export function TabIcon({ name, color, size = 20 }: TabIconProps) {
  const { paths, circles } = useTabIconHandler(name);

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {paths.map((d) => (
        <Path
          key={d}
          d={d}
          stroke={color}
          strokeWidth={1.6}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ))}
      {circles.map((c) => (
        <Circle key={`${c.cx}-${c.cy}`} cx={c.cx} cy={c.cy} r={c.r} stroke={color} strokeWidth={1.6} />
      ))}
    </Svg>
  );
}
