import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';

import { money } from '@/domain/catalog';
import { dayLabel } from '@/domain/sales';
import { usePosStore } from '@/store/pos-store';

const FILTERS = [
  { key: 'All', label: 'All' },
  { key: 'Cash', label: 'Cash' },
  { key: 'GCash', label: 'GCash' },
  { key: 'Utang', label: 'Utang' },
];

export function useSalesHistoryHandler() {
  const router = useRouter();
  const { sales, saleAmount, held } = usePosStore();
  const [filter, setFilter] = useState('All');

  const filtered = useMemo(
    () => sales.filter((s) => filter === 'All' || s.method === filter),
    [filter, sales],
  );

  const rows = useMemo(
    () =>
      filtered.map((sale, i) => {
        const newDay = i === 0 || filtered[i - 1].dayIdx !== sale.dayIdx;
        return {
          no: sale.no,
          time: sale.time,
          status: sale.status,
          meta: `${sale.items.reduce((n, x) => n + x.qty, 0)} items · ${sale.method} · ${sale.cashier}`,
          total: money(saleAmount(sale)),
          dayHeader: newDay ? dayLabel(sale.dayIdx) : null,
          dayTotal: newDay
            ? money(
                sales
                  .filter((x) => x.dayIdx === sale.dayIdx && x.status === 'Completed')
                  .reduce((n, x) => n + saleAmount(x), 0),
              )
            : '',
        };
      }),
    [filtered, saleAmount, sales],
  );

  const summary = useMemo(() => {
    const today = sales.filter((s) => s.dayIdx === 0 && s.status === 'Completed');
    return `${today.length} today · ${money(today.reduce((n, s) => n + saleAmount(s), 0))}`;
  }, [saleAmount, sales]);

  return {
    summary,
    filters: FILTERS,
    filter,
    setFilter,
    rows,
    heldLine: held.length ? `${held.length} parked` : 'none parked',
    openHeld: () => router.push('/sales/held'),
  };
}
