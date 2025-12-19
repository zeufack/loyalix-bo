import { ColumnDef } from '@tanstack/react-table';
import { Customer } from '@/types/customer';
import { Badge } from '@/components/ui/badge';
import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header';
import { CustomerActionsCell } from '@/app/(dashboard)/customers/customer-actions-cell';

export const customerColumns: ColumnDef<Customer>[] = [
  {
    id: 'image',
    header: () => <span className="sr-only">Image</span>,
    cell: () => (
      <div className="hidden sm:table-cell w-[100px]">
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
          {customer.user?.firstName || ''} {customer.user?.lastName || ''}
        </div>
      );
    },
    filterFn: (row, id, value) => {
      const customer = row.original;
      const fullName =
        `${customer.user?.firstName || ''} ${customer.user?.lastName || ''}`.toLowerCase();
      return fullName.includes(value.toLowerCase());
    }
  },
  {
    accessorKey: 'user.email',
    id: 'email',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
    cell: ({ row }) => {
      const customer = row.original;
      return (
        <a
          href={`mailto:${customer.user?.email}`}
          className="text-primary hover:underline"
        >
          {customer.user?.email || 'N/A'}
        </a>
      );
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
  {
    id: 'actions',
    header: () => <span className="sr-only">Actions</span>,
    cell: ({ row }) => <CustomerActionsCell customer={row.original} />,
    enableSorting: false,
    enableHiding: false
  }
];


