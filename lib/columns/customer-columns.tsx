import { ColumnDef } from '@tanstack/react-table';
import { Customer } from '@/types/customer';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreHorizontal } from 'lucide-react';
import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header';
import { EditCustomerForm } from '@/app/(dashboard)/customers/edit-customer-form';
import { deleteCustomer } from '@/app/api/customer';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog';

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
    cell: ({ row }) => {
      const customer = row.original;

      return (
        <AlertDialog>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem asChild>
                <EditCustomerForm customer={customer} />
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <AlertDialogTrigger asChild>
                <DropdownMenuItem>Delete</DropdownMenuItem>
              </AlertDialogTrigger>
            </DropdownMenuContent>
          </DropdownMenu>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the
                customer and all their data.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={async () => {
                  await deleteCustomer(customer.id);
                  // Optionally, you can refresh the customer list here.
                }}
              >
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      );
    },
    enableSorting: false,
    enableHiding: false
  }
];

