import { useMemo } from 'react';

import type { ChipOption } from './FilterChips';

type Args = {
  options: ChipOption[];
  selected: string;
  onSelect: (key: string) => void;
};

export function useFilterChipsHandler({ options, selected, onSelect }: Args) {
  const chips = useMemo(
    () =>
      options.map((option) => ({
        ...option,
        active: option.key === selected,
        press: () => onSelect(option.key),
      })),
    [onSelect, options, selected],
  );

  return { chips };
}
