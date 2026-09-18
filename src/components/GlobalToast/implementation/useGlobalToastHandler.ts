import { usePosStore } from '@/store/pos-store';

export function useGlobalToastHandler() {
  const { globalToast } = usePosStore();
  return { message: globalToast };
}
