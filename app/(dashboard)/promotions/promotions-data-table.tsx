'use client';

import { useQuery } from '@tanstack/react-query';
import { DataTable } from '@/components/data-table/data-table';
import { getPromotions } from '@/app/api/promotion';
import { promotionColumns } from '@/lib/columns/promotion-columns';
import { useTable } from '@/hooks/useCustomerTable';

export function PromotionsDataTable() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['promotions'],
    queryFn: () => getPromotions()
  });

  const table = useTable({
    data: data || [],
    columns: promotionColumns
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading promotions</div>;

  return <DataTable table={table} columns={promotionColumns} />;
}
