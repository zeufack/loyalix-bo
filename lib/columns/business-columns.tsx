import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '../../components/ui/badge';
import { DataTableColumnHeader } from '../../components/data-table/data-table-column-header';
import { Business } from '../../types/business';
import { createActionsColumn } from '../../components/data-table/actions-column';
import { copyToClipboard } from '../utils';

export const businessColumns: ColumnDef<Business>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Business Name" />
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
    accessorKey: 'email',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
    cell: ({ row }) => (
      <a
        href={`mailto:${row.getValue('email')}`}
        className="text-primary hover:underline"
      >
        {row.getValue('email')}
      </a>
    )
  },
  {
    accessorKey: 'phone',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Phone" />
    ),
    cell: ({ row }) => (
      <a
        href={`tel:${row.getValue('phone')}`}
        className="text-primary hover:underline"
      >
        {row.getValue('phone')}
      }
      </a>
    )
  },
  {
    accessorKey: 'businessType',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Type" />
    ),
    cell: ({ row }) => (
      <Badge variant="outline" className="capitalize">
        {row.getValue('businessType')}
      </Badge>
    ),
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    }
  },
  {
    accessorKey: 'address',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Address"
        className="hidden lg:table-cell"
      />
    ),
    cell: ({ row }) => (
      <div className="hidden lg:table-cell max-w-[200px] truncate">
        {row.getValue('address') || 'N/A'}
      </div>
    )
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
    accessorKey: 'staff',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Staff" />
    ),
    cell: ({ row }) => (
      <div className="text-right">{row.original.staff?.length || 0}</div>
    ),
    enableSorting: false
  },
  {
    accessorKey: 'programs',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Programs" />
    ),
    cell: ({ row }) => (
      <div className="text-right">{row.original.programs?.length || 0}</div>
    ),
    enableSorting: false
  },
  createActionsColumn<Business>(
    [
      {
        label: 'Copy customer ID',
        action: (customer: Business) => copyToClipboard(customer.id)
      },
      {
        label: 'View customer',
        action: (customer: Business) => console.log('View', customer.id),
        separatorBefore: true
      },
      {
        label: 'Edit customer',
        action: (customer: Business) => console.log('Edit', customer.id)
      }
    ],
    { enableSorting: false, enableHiding: false }
  )
];

