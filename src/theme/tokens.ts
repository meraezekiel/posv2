/**
 * Design tokens taken from the Nocturne design system and the
 * "Mobile POS Prototype" handoff. Values are copied verbatim from the
 * prototype so the app matches the mockup.
 */
export const color = {
  bg: '#161826',
  bgDeep: '#0d0e16',
  surface: '#232532',
  surfaceSunken: '#1c1e2b',
  navBar: '#13141f',

  text: '#e9e9ed',
  textBright: '#f5f4ff',
  textMuted: '#b2b6ca',
  textDim: '#9397ab',
  textFaint: '#75798c',

  accent: '#9184d9',
  accentSoft: '#b5abfc',
  accentPale: '#d2cefd',
  accentInk: '#2b2741',
  accentLine: '#5d5294',
  accentDeep: '#423a6a',

  line: '#3f424d',
  lineStrong: '#595d6c',
  hairline: 'rgba(233,233,237,0.1)',
  hairlineSoft: 'rgba(233,233,237,0.07)',
} as const;

export const radius = {
  sm: 8,
  md: 10,
  lg: 12,
  xl: 14,
  pill: 24,
} as const;

/** Inter is loaded at the root layout; these are the family names it registers. */
export const font = {
  regular: 'Inter_400Regular',
  medium: 'Inter_500Medium',
  semibold: 'Inter_600SemiBold',
  mono: 'monospace',
} as const;

export const tabularNums = { fontVariant: ['tabular-nums' as const] };
