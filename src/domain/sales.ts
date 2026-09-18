/**
 * Sales history, seeded with the prototype's placeholder days.
 * `dayIdx` counts back from today: 0 = today, 1 = yesterday, and so on.
 */
export type SaleStatus = 'Completed' | 'Voided' | 'Refunded';

export type SaleItem = {
  pid: string;
  qty: number;
  /** Price and name are snapshotted for sales rung up in the app. */
  price?: number;
  name?: string;
};

export type SaleRecord = {
  no: string;
  dayIdx: number;
  time: string;
  method: string;
  cashier: string;
  status: SaleStatus;
  reason?: string;
  /** Cash half of a split payment — the drawer count needs it. */
  cashPart?: number;
  items: SaleItem[];
};

export type Role = 'owner' | 'cashier';

export const OWNER_PIN = '1234';
export const PIN_MAX_TRIES = 5;
export const PIN_LOCK_MS = 30000;

export const VOID_REASONS = ['Wrong item', 'Changed mind', 'Cashier error', 'Test sale'];
export const ADJUST_REASONS = ['Damaged', 'Expired', 'Lost', 'Count correction'];
export const REFUND_REASONS = ['Expired', 'Damaged', 'Wrong item', 'Other'];

const DAY_LABELS: Record<number, string> = { 0: 'Today', 1: 'Yesterday' };

export function dayLabel(dayIdx: number): string {
  return DAY_LABELS[dayIdx] || `${dayIdx} days ago`;
}

export const SALES: SaleRecord[] = [
  { no: '#1041', dayIdx: 0, time: '3:12 PM', method: 'Cash', cashier: 'Ana', status: 'Completed', items: [{ pid: 'p2', qty: 3 }, { pid: 'p8', qty: 2 }] },
  { no: '#1040', dayIdx: 0, time: '2:48 PM', method: 'GCash', cashier: 'Ana', status: 'Completed', items: [{ pid: 'p4', qty: 1 }, { pid: 'p7', qty: 1 }] },
  { no: '#1039', dayIdx: 0, time: '1:30 PM', method: 'Cash', cashier: 'Owner', status: 'Voided', reason: 'Voided · cashier error', items: [{ pid: 'p1', qty: 2 }] },
  { no: '#1038', dayIdx: 0, time: '11:05 AM', method: 'Utang', cashier: 'Owner', status: 'Completed', items: [{ pid: 'p6', qty: 4 }, { pid: 'p3', qty: 6 }] },
  { no: '#1037', dayIdx: 1, time: '6:40 PM', method: 'Cash', cashier: 'Ana', status: 'Completed', items: [{ pid: 'p1', qty: 4 }, { pid: 'p5', qty: 2 }] },
  { no: '#1036', dayIdx: 1, time: '4:15 PM', method: 'Cash', cashier: 'Ana', status: 'Refunded', reason: 'Refunded · expired stock', items: [{ pid: 'p2', qty: 2 }] },
  { no: '#1035', dayIdx: 1, time: '9:22 AM', method: 'GCash', cashier: 'Owner', status: 'Completed', items: [{ pid: 'p4', qty: 2 }, { pid: 'p8', qty: 5 }] },
  { no: '#1029', dayIdx: 4, time: '5:02 PM', method: 'Cash', cashier: 'Ana', status: 'Completed', items: [{ pid: 'p7', qty: 3 }, { pid: 'p3', qty: 8 }] },
  { no: '#1014', dayIdx: 18, time: '12:44 PM', method: 'Cash', cashier: 'Owner', status: 'Completed', items: [{ pid: 'p5', qty: 6 }, { pid: 'p1', qty: 3 }] },
];
