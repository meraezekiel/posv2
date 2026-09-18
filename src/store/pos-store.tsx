import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import {
  CATALOG,
  CartLine,
  PaymentMethod,
  Product,
  Sale,
  VAT_RATE,
  money,
} from '@/domain/catalog';
import { OWNER_PIN, Role, SALES, SaleItem, SaleRecord } from '@/domain/sales';
import {
  DEFAULT_CATEGORIES,
  DEFAULT_USERS,
  HeldSale,
  PrinterState,
  ScannerState,
  StoreProfile,
  StoreUser,
} from '@/domain/settings';
import { clearState, loadState, saveState } from '@/store/persistence';

/** Everything the Sell, Payment, Receipt and Products screens share. */
type PosStore = {
  products: Product[];
  cart: CartLine[];
  count: number;
  subtotal: number;
  vat: number;
  total: number;
  vatEnabled: boolean;
  method: PaymentMethod;
  tendered: string;
  refNo: string;
  sale: Sale | null;
  toast: string | null;

  addProductToCart: (product: Product, note?: string) => void;
  incLine: (id: string) => void;
  decLine: (id: string) => void;
  removeLine: (id: string) => void;
  clearCart: () => void;

  setMethod: (method: PaymentMethod) => void;
  setTendered: (next: string | ((prev: string) => string)) => void;
  splitCash: string;
  splitWallet: string;
  setSplitCash: (value: string) => void;
  setSplitWallet: (value: string) => void;
  setRefNo: (ref: string) => void;
  completeSale: () => Sale | null;
  startNewSale: () => void;

  saveProduct: (product: Product) => void;
  findByBarcode: (barcode: string) => Product | undefined;
  isBarcodeTaken: (barcode: string, exceptId: string | null) => boolean;

  /** Phase 2: history, stock movements, the day's cash count and who is signed in. */
  sales: SaleRecord[];
  saleAmount: (sale: SaleRecord) => number;
  /** Unit price for a sale line — its own snapshot, else the catalog price. */
  itemPrice: (item: SaleItem) => number;
  productName: (pid: string) => string;
  voidSale: (no: string, reason: string) => void;
  refundSale: (no: string, items: SaleItem[], reason: string, partial: boolean) => number;
  applyStockChange: (productId: string, delta: number, cost?: number) => void;

  role: Role;
  toggleRole: () => void;

  eodStart: string;
  eodActual: string;
  dayClosed: boolean;
  setEodStart: (value: string) => void;
  setEodActual: (value: string) => void;
  closeDay: () => void;

  showToast: (message: string) => void;
  /** The wider, longer-lived toast Phase 2 screens use for confirmations. */
  globalToast: string | null;
  showGlobalToast: (message: string) => void;

  /** Phase 3: setup, the people, the hardware and the parked sales. */
  onboarded: boolean;
  finishOnboarding: () => void;
  signedIn: boolean;
  signIn: (user: string) => void;
  signOut: () => void;
  currentUser: string;

  store: StoreProfile;
  setStore: (patch: Partial<StoreProfile>) => void;
  setVatEnabled: (enabled: boolean) => void;
  ownerPin: string;
  setOwnerPin: (pin: string) => void;

  categories: string[];
  addCategory: (name: string) => void;
  renameCategory: (from: string, to: string) => void;
  moveCategory: (index: number, direction: -1 | 1) => void;

  held: HeldSale[];
  holdCart: () => boolean;
  resumeHeld: (id: string) => void;
  discardHeld: (id: string) => void;

  setLinePrice: (id: string, price: number) => void;
  deleteProduct: (id: string) => void;

  printer: PrinterState;
  setPrinter: (patch: Partial<PrinterState>) => void;
  scanner: ScannerState;
  setScanner: (patch: Partial<ScannerState>) => void;
  users: StoreUser[];
  toggleUser: (index: number) => void;
  addCashier: () => void;
  backupLast: string;
  setBackupLast: (value: string) => void;

  /** True once the saved state has been read back from the phone. */
  hydrated: boolean;
  /** Wipes everything on the phone and returns to first-run setup. */
  resetAll: () => void;
};

const PosStoreContext = createContext<PosStore | null>(null);

export function PosStoreProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>(() => CATALOG.map((p) => ({ ...p })));
  const [cart, setCart] = useState<CartLine[]>([]);
  const [method, setMethod] = useState<PaymentMethod>('cash');
  const [tendered, setTenderedState] = useState('');
  const [splitCash, setSplitCash] = useState('');
  const [splitWallet, setSplitWallet] = useState('');
  const [refNo, setRefNo] = useState('');
  const [sale, setSale] = useState<Sale | null>(null);
  const [saleSeq, setSaleSeq] = useState(1042);
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [globalToast, setGlobalToast] = useState<string | null>(null);
  const globalToastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [sales, setSales] = useState<SaleRecord[]>(() =>
    SALES.map((s) => ({ ...s, items: s.items.map((i) => ({ ...i })) })),
  );
  const [role, setRole] = useState<Role>('owner');
  const [eodStart, setEodStart] = useState('1000');
  const [eodActual, setEodActual] = useState('');
  const [dayClosed, setDayClosed] = useState(false);
  const [vatEnabled, setVatEnabled] = useState(true);

  const [onboarded, setOnboarded] = useState(false);
  const [signedIn, setSignedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState('Store owner');
  const [store, setStoreState] = useState<StoreProfile>({ name: '', address: '', phone: '' });
  const [ownerPin, setOwnerPin] = useState(OWNER_PIN);
  const [categories, setCategories] = useState<string[]>(DEFAULT_CATEGORIES);
  const [held, setHeld] = useState<HeldSale[]>([]);
  const [printer, setPrinterState] = useState<PrinterState>({
    status: 'none',
    devices: [],
    paper: '58',
    auto: false,
  });
  const [scanner, setScannerState] = useState<ScannerState>({
    beep: true,
    vibrate: true,
    mode: 'continuous',
  });
  const [users, setUsers] = useState<StoreUser[]>(DEFAULT_USERS);
  const [backupLast, setBackupLast] = useState('2 days ago');
  /** False until the saved state has been read back, so nothing renders early. */
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    let cancelled = false;
    loadState().then((saved) => {
      if (cancelled) return;
      if (saved) {
        if (saved.onboarded != null) setOnboarded(saved.onboarded);
        if (saved.store) setStoreState(saved.store);
        if (saved.vatEnabled != null) setVatEnabled(saved.vatEnabled);
        if (saved.ownerPin) setOwnerPin(saved.ownerPin);
        if (saved.products) setProducts(saved.products);
        if (saved.cart) setCart(saved.cart);
        if (saved.sales) setSales(saved.sales);
        if (saved.saleSeq != null) setSaleSeq(saved.saleSeq);
        if (saved.categories) setCategories(saved.categories);
        if (saved.held) setHeld(saved.held);
        if (saved.printer) setPrinterState(saved.printer);
        if (saved.scanner) setScannerState(saved.scanner);
        if (saved.users) setUsers(saved.users);
        if (saved.backupLast) setBackupLast(saved.backupLast);
        if (saved.eodStart != null) setEodStart(saved.eodStart);
        if (saved.eodActual != null) setEodActual(saved.eodActual);
        if (saved.dayClosed != null) setDayClosed(saved.dayClosed);
      }
      setHydrated(true);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  // Every change lands on disk shortly after it happens.
  useEffect(() => {
    if (!hydrated) return;
    saveState({
      onboarded,
      store,
      vatEnabled,
      ownerPin,
      products,
      cart,
      sales,
      saleSeq,
      categories,
      held,
      printer,
      scanner,
      users,
      backupLast,
      eodStart,
      eodActual,
      dayClosed,
    });
  }, [
    hydrated,
    onboarded,
    store,
    vatEnabled,
    ownerPin,
    products,
    cart,
    sales,
    saleSeq,
    categories,
    held,
    printer,
    scanner,
    users,
    backupLast,
    eodStart,
    eodActual,
    dayClosed,
  ]);

  const showToast = useCallback((message: string) => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToast(message);
    toastTimer.current = setTimeout(() => setToast(null), 2200);
  }, []);

  const showGlobalToast = useCallback((message: string) => {
    if (globalToastTimer.current) clearTimeout(globalToastTimer.current);
    setGlobalToast(message);
    globalToastTimer.current = setTimeout(() => setGlobalToast(null), 2600);
  }, []);

  const addProductToCart = useCallback(
    (product: Product, note?: string) => {
      setCart((prev) => {
        const i = prev.findIndex((l) => l.id === product.id);
        if (i >= 0) {
          const next = prev.slice();
          next[i] = { ...next[i], qty: next[i].qty + 1 };
          return next;
        }
        return prev.concat([
          { id: product.id, name: product.name, price: product.price, unit: product.unit, qty: 1 },
        ]);
      });
      showToast(`${note || '+1 '}${product.name} · ${money(product.price)}`);
    },
    [showToast],
  );

  const incLine = useCallback((id: string) => {
    setCart((prev) => prev.map((l) => (l.id === id ? { ...l, qty: l.qty + 1 } : l)));
  }, []);

  const decLine = useCallback((id: string) => {
    setCart((prev) =>
      prev.flatMap((l) => (l.id !== id ? [l] : l.qty > 1 ? [{ ...l, qty: l.qty - 1 }] : [])),
    );
  }, []);

  const removeLine = useCallback((id: string) => {
    setCart((prev) => prev.filter((l) => l.id !== id));
  }, []);

  const clearCart = useCallback(() => {
    setCart((prev) => {
      if (prev.length) showToast('Cart cleared');
      return [];
    });
  }, [showToast]);

  const setTendered = useCallback((next: string | ((prev: string) => string)) => {
    setTenderedState((prev) => (typeof next === 'function' ? next(prev) : next));
  }, []);

  const totals = useMemo(() => {
    const subtotal = cart.reduce((n, l) => n + l.price * l.qty, 0);
    // VAT-inclusive pricing: the tax is shown as a line, never added on top.
    const vat = subtotal - subtotal / (1 + VAT_RATE);
    return { subtotal, vat, total: subtotal };
  }, [cart]);

  const count = useMemo(() => cart.reduce((n, l) => n + l.qty, 0), [cart]);

  const completeSale = useCallback(() => {
    const change = Number(tendered || 0) - totals.total;
    const label =
      method === 'cash'
        ? 'Cash'
        : method === 'wallet'
          ? 'GCash'
          : method === 'split'
            ? 'Split'
            : 'Utang';
    const cashPart = method === 'split' ? Number(splitCash) || 0 : 0;
    const next: Sale = {
      no: `#${saleSeq}`,
      total: totals.total,
      change: method === 'cash' ? Math.max(0, change) : 0,
      method: label,
    };
    setSale(next);
    setSaleSeq((n) => n + 1);

    // The sale lands in history and comes off the shelf.
    setSales((prev) => [
      {
        no: `#${saleSeq}`,
        dayIdx: 0,
        time: 'Just now',
        method: label,
        cashPart,
        cashier: role === 'cashier' ? 'Ana' : 'Owner',
        status: 'Completed' as const,
        items: cart.map((l) => ({ pid: l.id, qty: l.qty, price: l.price, name: l.name })),
      },
      ...prev,
    ]);
    setProducts((prev) =>
      prev.map((p) => {
        const hit = cart.find((l) => l.id === p.id);
        return hit && !p.quick ? { ...p, stock: Math.max(0, p.stock - hit.qty) } : p;
      }),
    );
    return next;
  }, [cart, method, role, saleSeq, splitCash, tendered, totals.total]);

  const productName = useCallback(
    (pid: string) => products.find((p) => p.id === pid)?.name ?? 'Item',
    [products],
  );

  const itemPrice = useCallback(
    (item: SaleItem) =>
      item.price != null ? item.price : (products.find((p) => p.id === item.pid)?.price ?? 0),
    [products],
  );

  const saleAmount = useCallback(
    (sale: SaleRecord) => sale.items.reduce((n, i) => n + itemPrice(i) * i.qty, 0),
    [itemPrice],
  );

  /** Puts the given items back on the shelf — shared by void and refund. */
  const restock = useCallback((items: SaleItem[]) => {
    setProducts((prev) =>
      prev.map((p) => {
        const hit = items.find((i) => i.pid === p.id);
        return hit ? { ...p, stock: p.stock + hit.qty } : p;
      }),
    );
  }, []);

  const voidSale = useCallback(
    (no: string, reason: string) => {
      const target = sales.find((s) => s.no === no);
      if (!target) return;
      restock(target.items);
      setSales((prev) =>
        prev.map((s) =>
          s.no === no ? { ...s, status: 'Voided' as const, reason: `Voided · ${reason.toLowerCase()}` } : s,
        ),
      );
    },
    [restock, sales],
  );

  const refundSale = useCallback(
    (no: string, items: SaleItem[], reason: string, partial: boolean) => {
      const amount = items.reduce((n, i) => n + itemPrice(i) * i.qty, 0);
      restock(items);
      setSales((prev) =>
        prev.map((s) =>
          s.no === no
            ? {
                ...s,
                status: 'Refunded' as const,
                reason: `${partial ? 'Partly refunded · ' : 'Refunded · '}${reason.toLowerCase()} · ${money(amount)}`,
              }
            : s,
        ),
      );
      return amount;
    },
    [itemPrice, restock],
  );

  const applyStockChange = useCallback((productId: string, delta: number, cost?: number) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === productId
          ? { ...p, stock: Math.max(0, p.stock + delta), cost: cost != null && cost > 0 ? cost : p.cost }
          : p,
      ),
    );
  }, []);

  const resetAll = useCallback(() => {
    void clearState();
    setProducts(CATALOG.map((p) => ({ ...p })));
    setCart([]);
    setSales(SALES.map((s) => ({ ...s, items: s.items.map((i) => ({ ...i })) })));
    setSaleSeq(1042);
    setCategories(DEFAULT_CATEGORIES);
    setHeld([]);
    setPrinterState({ status: 'none', devices: [], paper: '58', auto: false });
    setScannerState({ beep: true, vibrate: true, mode: 'continuous' });
    setUsers(DEFAULT_USERS);
    setBackupLast('2 days ago');
    setStoreState({ name: '', address: '', phone: '' });
    setOwnerPin(OWNER_PIN);
    setVatEnabled(true);
    setEodStart('1000');
    setEodActual('');
    setDayClosed(false);
    setMethod('cash');
    setTenderedState('');
    setSplitCash('');
    setSplitWallet('');
    setRefNo('');
    setSale(null);
    setSignedIn(false);
    setOnboarded(false);
  }, []);

  const closeDay = useCallback(() => setDayClosed(true), []);
  const toggleRole = useCallback(() => setRole((r) => (r === 'owner' ? 'cashier' : 'owner')), []);

  const signIn = useCallback((user: string) => {
    setCurrentUser(user);
    setRole(user === 'Store owner' ? 'owner' : 'cashier');
    setSignedIn(true);
  }, []);

  const holdCart = useCallback(() => {
    let didHold = false;
    setCart((prev) => {
      if (!prev.length) return prev;
      didHold = true;
      setHeld((h) =>
        h.concat([{ id: String(Date.now()), label: 'Held just now', items: prev.map((l) => ({ ...l })) }]),
      );
      return [];
    });
    return didHold;
  }, []);

  const resumeHeld = useCallback(
    (id: string) => {
      const sale = held.find((h) => h.id === id);
      if (!sale) return;
      setCart(sale.items.map((i) => ({ ...i })));
      setHeld((prev) => prev.filter((h) => h.id !== id));
    },
    [held],
  );

  const moveCategory = useCallback((index: number, direction: -1 | 1) => {
    setCategories((prev) => {
      const target = index + direction;
      if (target < 0 || target >= prev.length) return prev;
      const next = prev.slice();
      const [moved] = next.splice(index, 1);
      next.splice(target, 0, moved);
      return next;
    });
  }, []);

  const addCashier = useCallback(() => {
    setUsers((prev) =>
      prev.concat([
        { name: `Cashier ${prev.filter((u) => u.role === 'Cashier').length + 1}`, role: 'Cashier', active: true },
      ]),
    );
  }, []);

  const startNewSale = useCallback(() => {
    setCart([]);
    setTenderedState('');
    setSplitCash('');
    setSplitWallet('');
    setRefNo('');
    setMethod('cash');
    setToast(null);
  }, []);

  const saveProduct = useCallback((product: Product) => {
    setProducts((prev) =>
      prev.some((p) => p.id === product.id)
        ? prev.map((p) => (p.id === product.id ? product : p))
        : prev.concat([product]),
    );
  }, []);

  const findByBarcode = useCallback(
    (barcode: string) => products.find((p) => p.barcode && p.barcode === barcode),
    [products],
  );

  const isBarcodeTaken = useCallback(
    (barcode: string, exceptId: string | null) =>
      !!barcode && products.some((p) => p.barcode === barcode && p.id !== exceptId),
    [products],
  );

  const value = useMemo<PosStore>(
    () => ({
      products,
      cart,
      count,
      subtotal: totals.subtotal,
      vat: totals.vat,
      total: totals.total,
      vatEnabled,
      method,
      tendered,
      splitCash,
      splitWallet,
      refNo,
      sale,
      toast,
      addProductToCart,
      incLine,
      decLine,
      removeLine,
      clearCart,
      setMethod,
      setTendered,
      setSplitCash,
      setSplitWallet,
      setRefNo,
      completeSale,
      startNewSale,
      saveProduct,
      findByBarcode,
      isBarcodeTaken,
      sales,
      saleAmount,
      itemPrice,
      productName,
      voidSale,
      refundSale,
      applyStockChange,
      role,
      toggleRole,
      eodStart,
      eodActual,
      dayClosed,
      setEodStart,
      setEodActual,
      closeDay,
      showToast,
      globalToast,
      showGlobalToast,
      onboarded,
      finishOnboarding: () => setOnboarded(true),
      signedIn,
      signIn,
      signOut: () => setSignedIn(false),
      currentUser,
      store,
      setStore: (patch: Partial<StoreProfile>) => setStoreState((prev) => ({ ...prev, ...patch })),
      setVatEnabled,
      ownerPin,
      setOwnerPin,
      categories,
      addCategory: (name: string) => setCategories((prev) => prev.concat([name])),
      renameCategory: (from: string, to: string) =>
        setCategories((prev) => prev.map((c) => (c === from ? to : c))),
      moveCategory,
      held,
      holdCart,
      resumeHeld,
      discardHeld: (id: string) => setHeld((prev) => prev.filter((h) => h.id !== id)),
      setLinePrice: (id: string, price: number) =>
        setCart((prev) => prev.map((l) => (l.id === id ? { ...l, price } : l))),
      deleteProduct: (id: string) => setProducts((prev) => prev.filter((p) => p.id !== id)),
      printer,
      setPrinter: (patch: Partial<PrinterState>) => setPrinterState((prev) => ({ ...prev, ...patch })),
      scanner,
      setScanner: (patch: Partial<ScannerState>) => setScannerState((prev) => ({ ...prev, ...patch })),
      users,
      toggleUser: (index: number) =>
        setUsers((prev) => prev.map((u, i) => (i === index ? { ...u, active: !u.active } : u))),
      addCashier,
      backupLast,
      setBackupLast,
      hydrated,
      resetAll,
    }),
    [
      products,
      cart,
      count,
      totals,
      vatEnabled,
      method,
      tendered,
      splitCash,
      splitWallet,
      refNo,
      sale,
      toast,
      addProductToCart,
      incLine,
      decLine,
      removeLine,
      clearCart,
      setTendered,
      completeSale,
      startNewSale,
      saveProduct,
      findByBarcode,
      isBarcodeTaken,
      sales,
      saleAmount,
      itemPrice,
      productName,
      voidSale,
      refundSale,
      applyStockChange,
      role,
      toggleRole,
      eodStart,
      eodActual,
      dayClosed,
      closeDay,
      showToast,
      globalToast,
      showGlobalToast,
      onboarded,
      signedIn,
      signIn,
      currentUser,
      store,
      ownerPin,
      categories,
      moveCategory,
      held,
      holdCart,
      resumeHeld,
      printer,
      scanner,
      users,
      addCashier,
      backupLast,
      hydrated,
      resetAll,
    ],
  );

  return <PosStoreContext.Provider value={value}>{children}</PosStoreContext.Provider>;
}

export function usePosStore(): PosStore {
  const store = useContext(PosStoreContext);
  if (!store) throw new Error('usePosStore must be used inside <PosStoreProvider>');
  return store;
}
