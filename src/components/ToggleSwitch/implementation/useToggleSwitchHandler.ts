import { color } from '@/theme/tokens';

export function useToggleSwitchHandler(value: boolean) {
  return {
    trackStyle: {
      backgroundColor: value ? color.accentDeep : color.surfaceSunken,
      borderColor: value ? color.accent : color.line,
    },
    knobStyle: {
      left: value ? 20 : 2,
      backgroundColor: value ? color.accentPale : color.lineStrong,
    },
  };
}
