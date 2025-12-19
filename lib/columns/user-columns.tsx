'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '../../components/ui/badge';
import { DataTableColumnHeader } from '../../components/data-table/data-table-column-header';
import { User } from '../../types/user';
import { copyToClipboard } from '../utils';
import { Check, X, MoreHorizontal } from 'lucide-react';
import { createSelectColumn } from '@/components/data-table/data-table-bulk-actions';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
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
import { deleteUser } from '@/app/api/user';
import { useQueryClient } from '@tanstack/react-query';
import { EditUserForm } from '@/app/(dashboard)/users/edit-user-form';

import { toast } from 'sonner';
import { getApiErrorMessage } from '@/lib/api-error';
import { useState } from 'react';

const ActionsCell = ({ user }: { user: User }) => {
  const queryClient = useQueryClient();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleCopyId = () => {
    copyToClipboard(user.id);
    toast.success('User ID copied to clipboard');
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      await deleteUser(user.id);
      toast.success('User deleted successfully');
      await queryClient.invalidateQueries({ queryKey: ['users'] });
      setDeleteOpen(false);
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem onClick={handleCopyId}>
            Copy user ID
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <EditUserForm user={user} />
          <DropdownMenuSeparator />
          <AlertDialogTrigger asChild>
            <DropdownMenuItem className="text-destructive">
              Delete user
            </DropdownMenuItem>
          </AlertDialogTrigger>
        </DropdownMenuContent>
      </DropdownMenu>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete User?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the user
            &quot;{user.email}&quot;.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={loading}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {loading ? 'Deleting...' : 'Delete'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export const userColumns: ColumnDef<User>[] = [
  createSelectColumn<User>(),
  {
    accessorKey: 'email',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <a
          href={`mailto:${row.getValue('email')}`}
          className="text-primary hover:underline"
        >
          {row.getValue('email')}
        </a>
        {row.original.isEmailVerified && (
          <Badge variant="secondary" className="gap-1">
            <Check className="h-3 w-3" />
            Verified
          </Badge>
        )}
      </div>
    ),
    filterFn: (row, id, value) => {
      return String(row.getValue(id))
        .toLowerCase()
        .includes(String(value).toLowerCase());
    }
  },
  {
    accessorKey: 'firstName',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="First Name" />
    ),
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue('firstName') || 'N/A'}</div>
    )
  },
  {
    accessorKey: 'lastName',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Last Name" />
    ),
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue('lastName') || 'N/A'}</div>
    )
  },
  {
    accessorKey: 'phoneNumber',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Phone" />
    ),
    cell: ({ row }) =>
      row.getValue('phoneNumber') ? (
        <a
          href={`tel:${row.getValue('phoneNumber')}`}
          className="text-primary hover:underline"
        >
          {row.getValue('phoneNumber')}
        </a>
      ) : (
        <div className="text-muted-foreground">N/A</div>
      )
  },
  {
    accessorKey: 'isActive',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => (
      <Badge variant={row.getValue('isActive') ? 'default' : 'destructive'}>
        {row.getValue('isActive') ? (
          <span className="flex items-center gap-1">
            <Check className="h-3 w-3" />
            Active
          </span>
        ) : (
          <span className="flex items-center gap-1">
            <X className="h-3 w-3" />
            Inactive
          </span>
        )}
      </Badge>
    ),
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    }
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Joined" />
    ),
    cell: ({ row }) => (
      <div className="whitespace-nowrap">
        {new Date(row.getValue('createdAt')).toLocaleDateString()}
      </div>
    ),
    sortingFn: 'datetime'
  },
  {
    accessorKey: 'updatedAt',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Last Updated"
        className="hidden lg:table-cell"
      />
    ),
    cell: ({ row }) => (
      <div className="hidden lg:table-cell whitespace-nowrap">
        {new Date(row.getValue('updatedAt')).toLocaleDateString()}
      </div>
    ),
    sortingFn: 'datetime'
  },
  {
    id: 'actions',
    cell: ({ row }) => <ActionsCell user={row.original} />,
    enableSorting: false,
    enableHiding: false
  }
];
