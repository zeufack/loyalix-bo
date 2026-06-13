'use client';

import { useState } from 'react';
import { DataTableToolbar } from '@/components/data-table/data-table-toolbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTable } from '@/hooks/useCustomerTable';
import {
  PaginationState,
  SortingState,
  ColumnFiltersState
} from '@tanstack/react-table';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getEmailTemplates,
  deleteEmailTemplate,
  EmailTemplate
} from '@/app/api/email-template';
import { DataTable } from '@/components/data-table/data-table';
import { DataTablePagination } from '@/components/data-table/data-table-pagination';
import { toast } from 'sonner';
import { ColumnDef } from '@tanstack/react-table';
import { Trash2, Edit, Eye } from 'lucide-react';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { StatusBadge } from '@/components/ui/status-badge';
import { EditEmailTemplateForm } from './edit-email-template-form';

interface EmailTemplateDataTableProps {
  status?: 'all' | 'active' | 'inactive';
}

const emailTemplateColumns: ColumnDef<EmailTemplate>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
    cell: ({ row }) => <div className="font-medium">{row.original.name}</div>
  },
  {
    accessorKey: 'subject',
    header: 'Subject',
    cell: ({ row }) => (
      <div className="max-w-xs truncate">{row.original.subject}</div>
    )
  },
  {
    accessorKey: 'templateType',
    header: 'Type',
    cell: ({ row }) => (
      <Badge variant="outline">{row.original.templateType}</Badge>
    )
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => <StatusBadge status={row.original.status} />
  },
  {
    accessorKey: 'updatedAt',
    header: 'Last Updated',
    cell: ({ row }) => (
      <div className="text-muted-foreground">
        {format(new Date(row.original.updatedAt), 'MMM d, yyyy HH:mm')}
      </div>
    )
  },
  {
    id: 'actions',
    cell: ({ row }) => <ActionsCell template={row.original} />
  }
];

function ActionsCell({ template }: { template: EmailTemplate }) {
  const queryClient = useQueryClient();

  const handleDelete = async () => {
    try {
      await deleteEmailTemplate(template.id);
      toast.success('Email template deactivated');
      await queryClient.invalidateQueries({ queryKey: ['emailTemplates'] });
    } catch {
      toast.error('Failed to deactivate email template');
    }
  };

  return (
    <div className="flex items-center gap-2">
      <EditEmailTemplateForm template={template} />
      <button
        onClick={handleDelete}
        className="p-2 hover:bg-muted rounded-md text-destructive"
        title="Delete"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );
}

export default function EmailTemplateDataTable({
  status = 'all'
}: EmailTemplateDataTableProps) {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10
  });
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: [
      'emailTemplates',
      pagination.pageIndex,
      pagination.pageSize,
      sorting,
      status
    ],
    queryFn: () =>
      getEmailTemplates({
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
        sortBy: sorting[0]?.id,
        sortOrder: sorting[0]?.desc ? 'desc' : 'asc',
        status: status === 'all' ? undefined : status
      })
  });

  const table = useTable({
    data: data?.data || [],
    columns: emailTemplateColumns,
    pageCount: data?.totalPages || 0,
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    manualPagination: true,
    manualSorting: true,
    manualFiltering: true
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Email Templates</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <DataTableToolbar table={table} />
          <DataTable
            table={table}
            columns={emailTemplateColumns}
            isLoading={isLoading}
            error={error}
            onRetry={() => refetch()}
            emptyMessage="No email templates yet."
          />
          <DataTablePagination
            table={table}
            totalItems={data?.total}
            isLoading={isLoading}
            error={error}
          />
        </div>
      </CardContent>
    </Card>
  );
}
