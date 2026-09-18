import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { color, font, radius } from '@/theme/tokens';

import { useUsersSettingsHandler } from './useUsersSettingsHandler';

/** The people on the counter and what a cashier may not touch. */
export function UsersSettings() {
  const { users, addCashier } = useUsersSettingsHandler();

  return (
    <View>
      {users.map((user) => (
        <View key={user.name} style={styles.row}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{user.initials}</Text>
          </View>
          <View style={styles.text}>
            <Text style={[styles.name, !user.active && styles.nameOff]}>{user.name}</Text>
            <Text style={styles.sub}>{user.sub}</Text>
          </View>
          <Pressable onPress={user.toggle} accessibilityRole="button" style={styles.action}>
            <Text style={styles.actionText}>{user.action}</Text>
          </Pressable>
        </View>
      ))}

      <Pressable onPress={addCashier} accessibilityRole="button" style={styles.add}>
        <Text style={styles.addText}>Add a cashier</Text>
      </Pressable>

      <View style={styles.note}>
        <Text style={styles.noteText}>
          Cashiers can ring up sales and add products. They can&apos;t void or refund, edit prices,
          see profit, or open settings.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 11,
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: color.hairlineSoft,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: color.accentLine,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { fontFamily: font.medium, fontSize: 12, color: color.accentSoft },
  text: { flex: 1, minWidth: 0 },
  name: { fontFamily: font.regular, fontSize: 13, color: color.text },
  nameOff: { color: color.textFaint },
  sub: { fontFamily: font.regular, fontSize: 11, color: color.textFaint, marginTop: 3 },
  action: {
    minHeight: 36,
    paddingHorizontal: 11,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: color.line,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionText: { fontFamily: font.medium, fontSize: 11.5, color: color.textDim },

  add: {
    minHeight: 48,
    marginTop: 14,
    marginBottom: 12,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: color.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addText: { fontFamily: font.medium, fontSize: 13.5, color: color.textBright },
  note: {
    padding: 12,
    borderRadius: radius.md,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: color.accentLine,
  },
  noteText: { fontFamily: font.regular, fontSize: 11.5, lineHeight: 19, color: color.textDim },
});
