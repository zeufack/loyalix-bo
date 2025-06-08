import { ColumnDef } from '@tanstack/react-table';
import { Customer } from '../../types/customer';
import { Badge } from '../../components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '../../components/ui/dropdown-menu';
import { Button } from '../../components/ui/button';
import { MoreHorizontal } from 'lucide-react';
import { DataTableColumnHeader } from '../../components/data-table/data-table-column-header';

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
  {
    id: 'actions',
    header: () => <span className="sr-only">Actions</span>,
    cell: ({ row }) => {
      const customer = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(customer.id)}
            >
              Copy customer ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View customer</DropdownMenuItem>
            <DropdownMenuItem>Edit customer</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
    enableSorting: false,
    enableHiding: false
  }
];
