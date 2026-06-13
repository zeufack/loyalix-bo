'use client';

import { useState } from 'react';
import { DataTableToolbar } from '@/components/data-table/data-table-toolbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTable } from '@/hooks/useCustomerTable';
import { ColumnDef } from '@tanstack/react-table';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getSubscriptionPlans,
  updateSubscriptionPlan,
  SubscriptionPlanDto
} from '@/app/api/subscription';
import { DataTable } from '@/components/data-table/data-table';
import { Badge } from '@/components/ui/badge';
import { StatusBadge } from '@/components/ui/status-badge';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Pencil } from 'lucide-react';
import { toast } from 'sonner';
import { EditSubscriptionPlanForm } from './edit-subscription-plan-form';

const featureSummary = (plan: SubscriptionPlanDto): string => {
  const f = plan.features;
  if (!f) return '-';
  const parts: string[] = [];
  parts.push(
    f.maxPrograms === -1 ? 'Unlimited programs' : `${f.maxPrograms} programs`
  );
  parts.push(
    f.maxCustomers === -1
      ? 'Unlimited customers'
      : `${f.maxCustomers} customers`
  );
  if (f.promotions) parts.push('Promotions');
  if (f.advancedAnalytics) parts.push('Analytics');
  if (f.prioritySupport) parts.push('Priority support');
  if (f.customBranding) parts.push('Custom branding');
  return parts.join(', ');
};

const planColumns: ColumnDef<SubscriptionPlanDto>[] = [
  {
    accessorKey: 'position',
    header: '#',
    cell: ({ row }) => (
      <span className="text-muted-foreground">{row.original.position}</span>
    )
  },
  {
    accessorKey: 'displayName',
    header: 'Plan',
    cell: ({ row }) => (
      <div>
        <div className="font-medium">{row.original.displayName}</div>
        <div className="text-xs text-muted-foreground">{row.original.name}</div>
      </div>
    )
  },
  {
    id: 'pricing',
    header: 'Pricing',
    cell: ({ row }) => (
      <div className="text-sm">
        <div>${Number(row.original.monthlyPriceUsd).toFixed(2)}/mo</div>
        <div className="text-muted-foreground">
          ${Number(row.original.yearlyPriceUsd).toFixed(2)}/yr
        </div>
      </div>
    )
  },
  {
    accessorKey: 'trialDays',
    header: 'Trial',
    cell: ({ row }) => (
      <span>
        {row.original.trialDays > 0 ? `${row.original.trialDays} days` : '-'}
      </span>
    )
  },
  {
    id: 'features',
    header: 'Features',
    cell: ({ row }) => (
      <div
        className="text-xs text-muted-foreground max-w-[300px] truncate"
        title={featureSummary(row.original)}
      >
        {featureSummary(row.original)}
      </div>
    )
  },
  {
    accessorKey: 'isActive',
    header: 'Status',
    cell: ({ row }) => (
      <StatusBadge status={row.original.isActive ? 'active' : 'inactive'} />
    )
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => <ActionsCell plan={row.original} />
  }
];

function ActionsCell({ plan }: { plan: SubscriptionPlanDto }) {
  const queryClient = useQueryClient();
  const [toggling, setToggling] = useState(false);

  const handleToggleActive = async () => {
    setToggling(true);
    try {
      await updateSubscriptionPlan(plan.id, { isActive: !plan.isActive });
      toast.success(`Plan ${plan.isActive ? 'deactivated' : 'activated'}`);
      queryClient.invalidateQueries({ queryKey: ['subscriptionPlans'] });
    } catch {
      toast.error('Failed to update plan');
    } finally {
      setToggling(false);
    }
  };

  return (
    <div className="flex items-center gap-1">
      <EditSubscriptionPlanForm plan={plan} />
      <Button
        variant="ghost"
        size="sm"
        onClick={handleToggleActive}
        disabled={toggling}
        title={plan.isActive ? 'Deactivate' : 'Activate'}
      >
        {plan.isActive ? (
          <XCircle className="h-4 w-4 text-destructive" />
        ) : (
          <CheckCircle className="h-4 w-4 text-green-600" />
        )}
      </Button>
    </div>
  );
}

export default function SubscriptionPlanDataTable() {
  const {
    data: plans,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['subscriptionPlans'],
    queryFn: getSubscriptionPlans
  });

  const table = useTable({
    data: plans || [],
    columns: planColumns,
    pageCount: 1
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Subscription Plans</CardTitle>
      </CardHeader>
      <CardContent>
        <DataTable
          table={table}
          columns={planColumns}
          isLoading={isLoading}
          error={error}
          onRetry={() => refetch()}
          emptyMessage="No subscription plans yet."
        />
      </CardContent>
    </Card>
  );
}
