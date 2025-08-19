import { ColumnDef } from '@tanstack/react-table';
import { DataTableColumnHeader } from '../../components/data-table/data-table-column-header';
import { Permission } from '../../types/permission';
import { createActionsColumn } from '../../components/data-table/actions-column';
import { copyToClipboard } from '../utils';
import { EditPermissionForm } from '@/app/(dashboard)/permissions/edit-permission-form';

export const permissionColumns: ColumnDef<Permission>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue('name')}</div>
    )
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Created At" />
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
    cell: ({ row }) => {
      const permission = row.original;
      return <EditPermissionForm permission={permission} />;
    },
    enableSorting: false,
    enableHiding: false,
  },
];
