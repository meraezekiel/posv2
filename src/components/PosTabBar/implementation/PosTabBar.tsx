import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { color, font } from '@/theme/tokens';

import { TabIcon } from '../TabIcon/implementation/TabIcon';
import { PosTabBarProps, usePosTabBarHandler } from './usePosTabBarHandler';

/**
 * The five-tab bar from the mockup. Sales, Reports and More are dimmed —
 * they are not part of Phase 1 and only raise a toast.
 */
export function PosTabBar(props: PosTabBarProps) {
  const insets = useSafeAreaInsets();
  const { tabs } = usePosTabBarHandler(props);

  return (
    <View style={[styles.bar, { paddingBottom: Math.max(insets.bottom, 10) }]}>
      {tabs.map((tab) => (
        <Pressable
          key={tab.key}
          onPress={tab.onPress}
          android_ripple={{ color: 'rgba(181,171,252,0.12)' }}
          accessibilityRole="tab"
          accessibilityState={{ selected: tab.active }}
          accessibilityLabel={tab.label}
          style={[styles.tab, tab.active && styles.tabActive]}>
          <TabIcon name={tab.icon} color={tab.tint} />
          <Text style={[styles.label, { color: tab.tint }]}>{tab.label}</Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'stretch',
    backgroundColor: color.navBar,
    borderTopWidth: 1,
    borderTopColor: color.hairline,
  },
  tab: {
    flex: 1,
    minWidth: 0,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
    minHeight: 56,
    paddingVertical: 6,
    paddingHorizontal: 2,
  },
  tabActive: { borderTopWidth: 2, borderTopColor: color.accent },
  label: { fontFamily: font.medium, fontSize: 10 },
});
