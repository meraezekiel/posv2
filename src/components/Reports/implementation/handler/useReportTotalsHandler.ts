import { useMemo } from 'react';

import { money } from '@/domain/catalog';
import { usePosStore } from '@/store/pos-store';

const RANGE_DAYS: Record<string, number> = { Today: 1, '7 days': 7, '30 days': 30 };

/**
 * Crunches the numbers behind Reports: range total, the three stat tiles,
 * best sellers and the payment split. Profit only shows for the owner, and
 * only for the share of sales whose products carry a cost.
 */
export function useReportTotalsHandler(range: string) {
  const { sales, products, saleAmount, itemPrice, productName, role } = usePosStore();

  return useMemo(() => {
    const days = RANGE_DAYS[range] ?? 1;
    const inRange = sales.filter((s) => s.status === 'Completed' && s.dayIdx < days);
    const total = inRange.reduce((n, s) => n + saleAmount(s), 0);

    let profit = 0;
    let costedRevenue = 0;
    inRange.forEach((sale) =>
      sale.items.forEach((item) => {
        const product = products.find((p) => p.id === item.pid);
        const price = itemPrice(item);
        if (product && product.cost != null) {
          profit += (price - product.cost) * item.qty;
          costedRevenue += price * item.qty;
        }
      }),
    );
    const costedPct = total ? Math.round((costedRevenue / total) * 100) : 0;

    const tally: Record<string, number> = {};
    inRange.forEach((sale) =>
      sale.items.forEach((item) => {
        const key = item.name || productName(item.pid);
        tally[key] = (tally[key] || 0) + itemPrice(item) * item.qty;
      }),
    );
    const ranked = Object.keys(tally)
      .map((name) => ({ name, amount: tally[name] }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5);
    const top = ranked.length ? ranked[0].amount : 1;

    const itemsSold = inRange.reduce(
      (n, s) => n + s.items.reduce((m, i) => m + i.qty, 0),
      0,
    );

    return {
      total,
      stats: [
        { value: String(inRange.length), label: 'sales' },
        { value: money(inRange.length ? total / inRange.length : 0), label: 'average sale' },
        role !== 'owner'
          ? { value: String(itemsSold), label: 'items sold' }
          : costedRevenue > 0
            ? {
                value: money(profit),
                label: costedPct < 100 ? `profit · ${costedPct}% of sales costed` : 'profit',
              }
            : { value: '—', label: 'add costs to see profit' },
      ],
      bestSellers: ranked.map((r) => ({
        name: r.name,
        value: money(r.amount),
        pct: Math.round((r.amount / top) * 100),
      })),
      byMethod: ['Cash', 'GCash', 'Utang'].map((method) => ({
        label: method,
        value: money(
          inRange.filter((s) => s.method === method).reduce((n, s) => n + saleAmount(s), 0),
        ),
      })),
    };
  }, [itemPrice, productName, products, range, role, saleAmount, sales]);
}
