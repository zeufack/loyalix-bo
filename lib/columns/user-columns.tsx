import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '../../components/ui/badge';
import { DataTableColumnHeader } from '../../components/data-table/data-table-column-header';
import { User } from '../../types/user';
import { createActionsColumn } from '../../components/data-table/actions-column';
import { copyToClipboard } from '../utils';
import { Check, X } from 'lucide-react';

export const userColumns: ColumnDef<User>[] = [
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
  createActionsColumn<User>(
    [
      {
        label: 'Copy user ID',
        action: (user: User) => copyToClipboard(user.id)
      },
      {
        label: 'View user',
        action: (user: User) => console.log('View', user.id),
        separatorBefore: true
      },
      {
        label: 'Edit user',
        action: (user: User) => console.log('Edit', user.id)
      }
    ],
    { enableSorting: false, enableHiding: false }
  )
];
