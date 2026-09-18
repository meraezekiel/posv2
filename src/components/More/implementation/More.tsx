import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { GlobalToast } from '@/components/GlobalToast/implementation/GlobalToast';
import { color, font, radius } from '@/theme/tokens';

import { useMoreHandler } from './useMoreHandler';

/** Settings hub: who's signed in, store, hardware, data and people. */
export function More() {
  const { initials, userName, userRole, switchUser, groups } = useMoreHandler();

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.title}>More</Text>
      </View>

      <ScrollView style={styles.body} contentContainerStyle={styles.bodyContent}>
        <View style={styles.user}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
          <View style={styles.userText}>
            <Text style={styles.userName}>{userName}</Text>
            <Text style={styles.userRole}>{userRole}</Text>
          </View>
          <Pressable onPress={switchUser} accessibilityRole="button" style={styles.switch}>
            <Text style={styles.switchText}>Switch</Text>
          </Pressable>
        </View>

        {groups.map((group) => (
          <View key={group.title} style={styles.group}>
            <Text style={styles.groupTitle}>{group.title}</Text>
            {group.rows.map((row) => (
              <Pressable
                key={row.label}
                onPress={row.tap}
                accessibilityRole="button"
                style={styles.row}>
                <View style={styles.rowText}>
                  <Text style={styles.rowLabel}>{row.label}</Text>
                  {row.sub ? <Text style={styles.rowSub}>{row.sub}</Text> : null}
                </View>
                <Text style={styles.chevron}>›</Text>
              </Pressable>
            ))}
          </View>
        ))}
      </ScrollView>

      <GlobalToast />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: color.bg },
  header: {
    paddingTop: 12,
    paddingHorizontal: 12,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: color.hairline,
  },
  title: { fontFamily: font.medium, fontSize: 16, color: color.text },
  body: { flex: 1, minHeight: 0 },
  bodyContent: { padding: 12, paddingBottom: 24 },

  user: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 11,
    padding: 12,
    borderRadius: radius.lg,
    backgroundColor: color.surfaceSunken,
    borderWidth: 1,
    borderColor: color.line,
    marginBottom: 14,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: color.accentLine,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { fontFamily: font.medium, fontSize: 14, color: color.accentSoft },
  userText: { flex: 1, minWidth: 0 },
  userName: { fontFamily: font.medium, fontSize: 13.5, color: color.text },
  userRole: { fontFamily: font.regular, fontSize: 11.5, color: color.textFaint, marginTop: 3 },
  switch: {
    minHeight: 36,
    paddingHorizontal: 11,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: color.lineStrong,
    alignItems: 'center',
    justifyContent: 'center',
  },
  switchText: { fontFamily: font.medium, fontSize: 12, color: '#cfd3e5' },

  group: { marginBottom: 16 },
  groupTitle: {
    fontFamily: font.semibold,
    fontSize: 10.5,
    letterSpacing: 1.15,
    textTransform: 'uppercase',
    color: color.textFaint,
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: color.hairlineSoft,
  },
  rowText: { flex: 1, minWidth: 0 },
  rowLabel: { fontFamily: font.regular, fontSize: 13, color: color.text },
  rowSub: { fontFamily: font.regular, fontSize: 11.5, color: color.textFaint, marginTop: 3 },
  chevron: { fontFamily: font.regular, fontSize: 14, color: color.lineStrong },
});
