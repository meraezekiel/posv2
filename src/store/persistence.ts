import AsyncStorage from '@react-native-async-storage/async-storage';

import type { CartLine, Product } from '@/domain/catalog';
import type { SaleRecord } from '@/domain/sales';
import type { HeldSale, PrinterState, ScannerState, StoreProfile, StoreUser } from '@/domain/settings';

/** Bump when the shape changes; an older blob is ignored rather than migrated. */
const STORAGE_KEY = 'posv2:state:v1';
const SAVE_DEBOUNCE_MS = 400;

/**
 * What survives a restart. Deliberately excluded: whether someone is signed in
 * (the PIN screen should greet every launch) and the half-typed payment state.
 */
export type PersistedState = {
  onboarded: boolean;
  store: StoreProfile;
  vatEnabled: boolean;
  ownerPin: string;
  products: Product[];
  cart: CartLine[];
  sales: SaleRecord[];
  saleSeq: number;
  categories: string[];
  held: HeldSale[];
  printer: PrinterState;
  scanner: ScannerState;
  users: StoreUser[];
  backupLast: string;
  eodStart: string;
  eodActual: string;
  dayClosed: boolean;
};

export async function loadState(): Promise<Partial<PersistedState> | null> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    // A hand-edited or half-written blob shouldn't wedge the app on launch.
    return parsed && typeof parsed === 'object' ? (parsed as Partial<PersistedState>) : null;
  } catch {
    return null;
  }
}

let saveTimer: ReturnType<typeof setTimeout> | null = null;

/** Debounced so a keystroke in the cash count doesn't hit the disk each time. */
export function saveState(state: PersistedState): void {
  if (saveTimer) clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state)).catch(() => {
      // A failed write just means this change isn't on disk yet; the next one retries.
    });
  }, SAVE_DEBOUNCE_MS);
}

/** Wipes the saved store — used by "Start fresh" in Settings. */
export async function clearState(): Promise<void> {
  if (saveTimer) clearTimeout(saveTimer);
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
  } catch {
    // Nothing to do — the caller resets to defaults in memory either way.
  }
}
