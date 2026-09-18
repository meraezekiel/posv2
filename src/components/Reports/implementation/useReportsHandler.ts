import { useRouter } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';

import { money } from '@/domain/catalog';
import { usePosStore } from '@/store/pos-store';

import { useReportTotalsHandler } from './handler/useReportTotalsHandler';

const RANGES = [
  { key: 'Today', label: 'Today' },
  { key: '7 days', label: '7 days' },
  { key: '30 days', label: '30 days' },
  { key: 'Custom', label: 'Custom' },
];

export function useReportsHandler() {
  const router = useRouter();
  const { products, dayClosed, showGlobalToast } = usePosStore();
  const [range, setRange] = useState('Today');

  const { total, stats, bestSellers, byMethod } = useReportTotalsHandler(range);

  const lowList = useMemo(
    () => products.filter((p) => !p.quick && p.stock <= p.low),
    [products],
  );

  const onSelectRange = useCallback(
    (key: string) => {
      // The custom range needs a date picker, which isn't in this build.
      if (key === 'Custom') {
        showGlobalToast('Date picker comes with the custom range');
        return;
      }
      setRange(key);
    },
    [showGlobalToast],
  );

  return {
    ranges: RANGES,
    range,
    setRange: onSelectRange,
    rangeLabel: range === 'Today' ? 'Today at a glance' : `Last ${range}`,
    total: money(total),
    stats,
    bestSellers,
    byMethod,
    lowCount: `${lowList.length} items`,
    lowList: lowList.map((p) => ({ name: p.name, left: `${p.stock} left` })),
    eodCta: dayClosed ? 'Day closed · view summary' : 'End of day · cash count',
    goEod: useCallback(() => router.push('/reports/end-of-day'), [router]),
    exportCsv: useCallback(
      () => showGlobalToast('CSV ready — share sheet opens next'),
      [showGlobalToast],
    ),
  };
}
