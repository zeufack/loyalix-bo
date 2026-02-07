'use client';

import { ColumnDef } from '@tanstack/react-table';
import { BusinessType } from '@/types/business-type';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { deleteBusinessType } from '@/app/api/business-type';
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
import { EditBusinessTypeForm } from '@/app/(dashboard)/business-types/edit-business-type-form';
import { MoreHorizontal, ImageIcon } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { getApiErrorMessage } from '@/lib/api-error';

const ActionsCell = ({ businessType }: { businessType: BusinessType }) => {
  const queryClient = useQueryClient();

  const handleDelete = async () => {
    try {
      await deleteBusinessType(businessType.id);
      queryClient.invalidateQueries({ queryKey: ['business-types'] });
      toast.success('Business type deleted successfully');
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  };

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
          <EditBusinessTypeForm businessType={businessType} />
          <DropdownMenuSeparator />
          <AlertDialogTrigger asChild>
            <DropdownMenuItem className="text-destructive">
              Delete
            </DropdownMenuItem>
          </AlertDialogTrigger>
        </DropdownMenuContent>
      </DropdownMenu>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the
            business type &quot;{businessType.name}&quot;.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export const businessTypeColumns: ColumnDef<BusinessType>[] = [
  {
    accessorKey: 'icon',
    header: 'Icon',
    cell: ({ row }) => {
      const icon = row.original.icon;
      return icon?.url ? (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          src={icon.thumbnailUrl || icon.url}
          alt={`${row.original.name} icon`}
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
    header: 'Name'
  },
  {
    accessorKey: 'description',
    header: 'Description',
    cell: ({ row }) => row.original.description || '-'
  },
  {
    id: 'actions',
    cell: ({ row }) => <ActionsCell businessType={row.original} />
  }
];
