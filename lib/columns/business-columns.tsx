'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header';
import { Business } from '@/types/business';
import { BusinessActionsCell } from '@/app/(dashboard)/business/business-actions-cell';
import { ImageIcon } from 'lucide-react';

export const businessColumns: ColumnDef<Business>[] = [
  {
    accessorKey: 'profileImage',
    header: 'Image',
    cell: ({ row }) => {
      const profileImage = row.original.profileImage;
      return profileImage?.url ? (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          src={profileImage.thumbnailUrl || profileImage.url}
          alt={`${row.original.name} profile`}
          className="h-8 w-8 rounded-md object-cover"
        />
      ) : (
        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-muted">
          <ImageIcon className="h-4 w-4 text-muted-foreground" />
        </div>
      );
    },
    size: 60
  },
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
      </a>
    )
  },
  {
    accessorKey: 'industryType',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Industry Type" />
    ),
    cell: ({ row }) => (
      <Badge variant="outline" className="capitalize">
        {row.original.industryType?.name || 'N/A'}
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
      <div className="whitespace-nowrap">
        {row.getValue('createdAt')
          ? new Date(row.getValue('createdAt')).toLocaleDateString()
          : 'N/A'}
      </div>
    ),
    sortingFn: 'datetime'
  },
  {
    accessorKey: 'staffMembers',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Staff" />
    ),
    cell: ({ row }) => (
      <div className="text-right">{row.original.staffMembers?.length || 0}</div>
    ),
    enableSorting: false
  },
  {
    accessorKey: 'loyaltyPrograms',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Programs" />
    ),
    cell: ({ row }) => (
      <div className="text-right">{row.original.loyaltyPrograms?.length || 0}</div>
    ),
    enableSorting: false
  },
  {
    id: 'actions',
    header: () => <span className="sr-only">Actions</span>,
    cell: ({ row }) => <BusinessActionsCell business={row.original} />,
    enableSorting: false,
    enableHiding: false
  }
];
