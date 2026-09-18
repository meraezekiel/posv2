import { useRouter } from 'expo-router';
import { useCallback, useState } from 'react';

import { usePosStore } from '@/store/pos-store';

export function useCategoriesHandler() {
  const router = useRouter();
  const { categories, addCategory, renameCategory, moveCategory, showGlobalToast } = usePosStore();

  const [selected, setSelected] = useState<string | null>(null);
  const [draft, setDraft] = useState('');

  const save = useCallback(() => {
    const value = draft.trim();
    if (!value) return;
    if (selected) {
      renameCategory(selected, value);
      showGlobalToast('Category renamed');
    } else {
      addCategory(value);
      showGlobalToast('Category added');
    }
    setSelected(null);
    setDraft('');
  }, [addCategory, draft, renameCategory, selected, showGlobalToast]);

  return {
    back: useCallback(() => router.back(), [router]),
    rows: categories.map((name, i) => ({
      name,
      // Placeholder counts, as in the prototype — products carry no category yet.
      count: `${((i * 3) % 7) + 1} items`,
      selected: selected === name,
      pick: () => {
        setSelected(name);
        setDraft(name);
      },
      up: () => moveCategory(i, -1),
      down: () => moveCategory(i, 1),
    })),
    draft,
    setDraft,
    fieldLabel: selected ? `Rename “${selected}”` : 'New category',
    saveLabel: selected ? 'Rename' : 'Add',
    canSave: !!draft.trim(),
    save,
  };
}
