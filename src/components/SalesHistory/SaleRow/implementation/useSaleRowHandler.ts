import { useRouter } from 'expo-router';
import { useCallback } from 'react';

import type { SaleStatus } from '@/domain/sales';

export type SaleRowData = {
  no: string;
  time: string;
  status: SaleStatus;
  meta: string;
  total: string;
  dayHeader: string | null;
  dayTotal: string;
};

export function useSaleRowHandler(row: SaleRowData) {
  const router = useRouter();

  return {
    voidedish: row.status !== 'Completed',
    open: useCallback(
      () => router.push({ pathname: '/sales/detail', params: { no: row.no } }),
      [router, row.no],
    ),
  };
}
