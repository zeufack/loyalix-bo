import { ColumnDef } from '@tanstack/react-table';
import { Customer } from '../../types/customer';
import { Badge } from '../../components/ui/badge';
import { DataTableColumnHeader } from '../../components/data-table/data-table-column-header';
import { createActionsColumn } from '../../components/data-table/actions-column';
import { copyToClipboard } from '../utils';

export const customerColumns: ColumnDef<Customer>[] = [
  {
    id: 'image',
    header: () => <span className="sr-only">Image</span>,
    cell: () => (
      <div className="hidden sm:table-cell w-[100px]">
        {/*TODO Add image component here */}
        <div className="h-10 w-10 rounded-full bg-muted" />
      </div>
    ),
    enableSorting: false,
    enableHiding: false
  },
  {
    accessorKey: 'user.firstName',
    id: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => {
      const customer = row.original;
      return (
        <div className="font-medium">
          {customer.user.firstName} {customer.user.lastName}
        </div>
      );
    },
    filterFn: (row, id, value) => {
      const customer = row.original;
      const fullName =
        `${customer.user.firstName} ${customer.user.lastName}`.toLowerCase();
      return fullName.includes(value.toLowerCase());
    }
  },
  {
    accessorKey: 'user.isActive',
    id: 'status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const isActive = row.getValue('status') as boolean;
      return (
        <Badge variant={isActive ? 'default' : 'destructive'}>
          {isActive ? 'Active' : 'Inactive'}
        </Badge>
      );
    },
    filterFn: (row, id, value) => {
      if (value === 'all') return true;
      const isActive = row.getValue(id) as boolean;
      return value === 'active' ? isActive : !isActive;
    }
  },
  {
    accessorKey: 'price',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Price"
        className="hidden md:table-cell"
      />
    ),
    cell: ({ row }) => {
      const price = row.getValue('price') as number;
      return (
        <div className="hidden md:table-cell">
          {price ? `$${price.toFixed(2)}` : '-'}
        </div>
      );
    }
  },
  {
    accessorKey: 'totalSales',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Total Sales"
        className="hidden md:table-cell"
      />
    ),
    cell: ({ row }) => {
      const sales = row.getValue('totalSales') as number;
      return (
        <div className="hidden md:table-cell">
          {sales ? `$${sales.toFixed(2)}` : '-'}
        </div>
      );
    }
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Created At"
        className="hidden md:table-cell"
      />
    ),
    cell: ({ row }) => {
      const date = row.getValue('createdAt') as Date;
      return (
        <div className="hidden md:table-cell">
          {new Date(date).toLocaleDateString()}
        </div>
      );
    }
  },
  createActionsColumn<Customer>(
    [
      {
        label: 'Copy customer ID',
        action: (customer: Customer) => copyToClipboard(customer.id)
      },
      {
        label: 'View customer',
        action: (customer: Customer) => console.log('View', customer.id),
        separatorBefore: true
      },
      {
        label: 'Edit customer',
        action: (customer: Customer) => console.log('Edit', customer.id)
      }
    ],
    { enableSorting: false, enableHiding: false }
  )
];
