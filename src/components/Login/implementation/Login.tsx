import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { PinPad } from '@/components/PinPad/implementation/PinPad';
import { color, font, radius } from '@/theme/tokens';

import { useLoginHandler } from './useLoginHandler';

/** Who's on the counter — pick a user, then the 4-digit PIN. */
export function Login() {
  const { users, pinFilled, error, press, forgot } = useLoginHandler();

  return (
    <View style={styles.screen}>
      <View>
        <Text style={styles.title}>Who&apos;s on the counter?</Text>
        <Text style={styles.sub}>Enter the 4-digit PIN · demo PIN 1234</Text>
        <View style={styles.users}>
          {users.map((user) => (
            <Pressable
              key={user.name}
              onPress={user.pick}
              accessibilityRole="button"
              accessibilityState={{ selected: user.selected }}
              style={[styles.user, user.selected && styles.userOn]}>
              <View style={[styles.avatar, user.selected && styles.avatarOn]}>
                <Text style={[styles.avatarText, user.selected && styles.avatarTextOn]}>
                  {user.initials}
                </Text>
              </View>
              <Text style={[styles.userName, user.selected && styles.userNameOn]}>{user.first}</Text>
              <Text style={styles.userRole}>{user.role}</Text>
            </Pressable>
          ))}
        </View>
      </View>

      <View style={styles.padWrap}>
        <PinPad filled={pinFilled} error={error} onPress={press} />
        <Pressable onPress={forgot} accessibilityRole="button" style={styles.forgot}>
          <Text style={styles.forgotText}>Forgot PIN</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: color.bg, paddingVertical: 16, paddingHorizontal: 14 },
  title: { fontFamily: font.medium, fontSize: 18, lineHeight: 23, color: color.text, marginBottom: 5 },
  sub: { fontFamily: font.regular, fontSize: 12, lineHeight: 19, color: color.textFaint, marginBottom: 14 },
  users: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  user: {
    flex: 1,
    minHeight: 98,
    paddingVertical: 11,
    paddingHorizontal: 8,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: color.line,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userOn: { backgroundColor: color.accentInk, borderColor: color.accent },
  avatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 1,
    borderColor: color.line,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 7,
  },
  avatarOn: { borderColor: color.accent },
  avatarText: { fontFamily: font.medium, fontSize: 12, color: color.textDim },
  avatarTextOn: { color: color.textBright },
  userName: { fontFamily: font.medium, fontSize: 12, color: color.textMuted },
  userNameOn: { color: color.textBright },
  userRole: { fontFamily: font.regular, fontSize: 10.5, color: color.textFaint, marginTop: 3 },

  padWrap: { flex: 1, minHeight: 0, justifyContent: 'flex-end' },
  forgot: {
    marginTop: 11,
    minHeight: 44,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: color.line,
    alignItems: 'center',
    justifyContent: 'center',
  },
  forgotText: { fontFamily: font.medium, fontSize: 12.5, color: color.textDim },
});
