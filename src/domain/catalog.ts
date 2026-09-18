/**
 * Seed catalog and scan sequence, copied from the design prototype.
 * Phase 1 keeps everything on the device; there is no sync yet.
 */
export type Product = {
  id: string;
  name: string;
  price: number;
  /** Optional — entering cost is what turns on the profit figure in Reports. */
  cost?: number;
  stock: number;
  low: number;
  unit: string;
  barcode: string;
  quick?: boolean;
  /** Saved copy of the product photo, in app storage. */
  photo?: string;
};

export type CartLine = {
  id: string;
  name: string;
  price: number;
  unit: string;
  qty: number;
};

export type PaymentMethod = 'cash' | 'wallet' | 'utang' | 'split';

export type Sale = {
  no: string;
  total: number;
  change: number;
  method: string;
};

export const CATALOG: Product[] = [
  { id: 'p1', name: 'Coke Mismo 300ml', price: 20, cost: 16.5, stock: 24, low: 6, unit: 'pc', barcode: '4801981101016' },
  { id: 'p2', name: 'Lucky Me Pancit Canton Kalamansi', price: 18, cost: 14.75, stock: 40, low: 10, unit: 'pc', barcode: '4800016644108' },
  { id: 'p3', name: 'Kopiko Brown 3-in-1 sachet', price: 9, cost: 7.2, stock: 5, low: 12, unit: 'pc', barcode: '8991002103016' },
  { id: 'p4', name: 'Argentina Corned Beef 150g', price: 42, cost: 35, stock: 12, low: 4, unit: 'pc', barcode: '4800092770019' },
  { id: 'p5', name: 'Tide Bar 55g', price: 14, stock: 30, low: 8, unit: 'pc', barcode: '4902430735204' },
  { id: 'p6', name: 'Bear Brand Powdered Milk 33g', price: 15, cost: 12.4, stock: 3, low: 10, unit: 'pc', barcode: '4800361381024' },
  { id: 'p7', name: 'Datu Puti Soy Sauce 200ml', price: 23, cost: 19, stock: 18, low: 6, unit: 'pc', barcode: '4800024570017' },
  { id: 'p8', name: 'Skyflakes Crackers 25g', price: 10, stock: 44, low: 12, unit: 'pc', barcode: '4800016112045' },
  { id: 'q1', name: 'Ice, small bag', price: 10, stock: 0, low: 0, unit: 'pc', barcode: '', quick: true },
  { id: 'q2', name: 'Loose candy', price: 1, stock: 0, low: 0, unit: 'pc', barcode: '', quick: true },
  { id: 'q3', name: 'Pandesal', price: 4, stock: 0, low: 0, unit: 'pc', barcode: '', quick: true },
  { id: 'q4', name: 'Load, ₱20', price: 22, stock: 0, low: 0, unit: 'pc', barcode: '', quick: true },
];

/** Demo scan order used when the viewfinder is tapped. The 4th is unknown on purpose. */
export const DEMO_SEQUENCE = ['p1', 'p2', 'p1', '?', 'p4', 'p8', 'p3', 'p7'];
export const DEMO_UNKNOWN_CODE = '4806508940113';

export const UNITS = ['pc', 'pack', 'kg'];

export const VAT_RATE = 0.12;

/** ₱1,234.00 — formatted by hand because Hermes ignores toLocaleString options. */
export function money(n: number): string {
  const value = Number(n) || 0;
  const sign = value < 0 ? '-' : '';
  const [whole, cents] = Math.abs(value).toFixed(2).split('.');
  const grouped = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return `${sign}₱${grouped}.${cents}`;
}
