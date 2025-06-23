import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '../../components/ui/badge';
import { DataTableColumnHeader } from '../../components/data-table/data-table-column-header';
import { createActionsColumn } from '../../components/data-table/actions-column';
import { copyToClipboard } from '../utils';
import { LoyaltyProgram } from '../../types/loyalty-programm';

export const loyaltyProgramColumns: ColumnDef<LoyaltyProgram>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Program Name" />
    ),
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue('name')}</div>
    ),
    filterFn: (row, id, value) => {
      return String(row.getValue(id))
        .toLowerCase()
        .includes(String(value).toLowerCase());
    }
  },
  {
    accessorKey: 'business.name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Business" />
    ),
    cell: ({ row }) => (
      <div className="font-medium">{row.original.business?.name || 'N/A'}</div>
    ),
    filterFn: (row, id, value) => {
      return String(row.original.business?.name || '')
        .toLowerCase()
        .includes(String(value).toLowerCase());
    }
  },
  {
    accessorKey: 'isActive',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const isActive = row.getValue('isActive') as boolean;
      return (
        <Badge variant={isActive ? 'default' : 'secondary'}>
          {isActive ? 'Active' : 'Inactive'}
        </Badge>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    }
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Created" />
    ),
    cell: ({ row }) => (
      <div className="whitespace-nowrap">{row.getValue('createdAt')}</div>
    ),
    sortingFn: 'datetime'
  },
  {
    accessorKey: 'rules',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Rules" />
    ),
    cell: ({ row }) => (
      <div className="text-right">{row.original.rules?.length || 0}</div>
    ),
    enableSorting: false
  },
  {
    accessorKey: 'enrollments',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Enrollments" />
    ),
    cell: ({ row }) => (
      <div className="text-right">{row.original.enrollments?.length || 0}</div>
    ),
    enableSorting: false
  },
  createActionsColumn<LoyaltyProgram>(
    [
      {
        label: 'Copy program ID',
        action: (program: LoyaltyProgram) => copyToClipboard(program.id)
      },
      {
        label: 'View program',
        action: (program: LoyaltyProgram) => console.log('View', program.id),
        separatorBefore: true
      },
      {
        label: 'Edit program',
        action: (program: LoyaltyProgram) => console.log('Edit', program.id)
      },
      {
        label: 'Toggle status',
        action: (program: LoyaltyProgram) =>
          console.log('Toggle status', program.id)
      }
    ],
    { enableSorting: false, enableHiding: false }
  )
];
