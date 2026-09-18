/** Store profile, hardware and people — everything Settings and onboarding own. */
export type StoreProfile = {
  name: string;
  address: string;
  phone: string;
  /** Saved copy of the store logo, printed on receipts. */
  logo?: string;
};

export type PrinterState = {
  status: 'none' | 'scanning' | 'paired';
  devices: string[];
  paper: '58' | '80';
  auto: boolean;
};

export type ScannerState = {
  beep: boolean;
  vibrate: boolean;
  mode: 'continuous' | 'single';
};

export type StoreUser = {
  name: string;
  role: 'Owner' | 'Cashier';
  active: boolean;
};

export type HeldSale = {
  id: string;
  label: string;
  items: { id: string; name: string; price: number; unit: string; qty: number }[];
};

export const DEFAULT_CATEGORIES = ['Drinks', 'Noodles', 'Canned goods', 'Household', 'Coffee'];

export const DEFAULT_USERS: StoreUser[] = [
  { name: 'Store owner', role: 'Owner', active: true },
  { name: 'Ana Reyes', role: 'Cashier', active: true },
];

export const PRINTER_DEVICES = ['POS-58 Thermal', 'XP-P323B'];
