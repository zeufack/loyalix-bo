'use client';

import { ColumnDef } from '@tanstack/react-table';
import { LoyaltyProgram } from '@/types/loyalty-program';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { EditLoyaltyProgramForm } from '@/app/(dashboard)/loyalty-program/edit-loyalty-program-form';
import { deleteLoyaltyProgram } from '@/app/api/loyalty-program';
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
import { Badge } from '@/components/ui/badge';
import { ImageIcon, MoreHorizontal } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { getApiErrorMessage } from '@/lib/api-error';

const ActionsCell = ({ loyaltyProgram }: { loyaltyProgram: LoyaltyProgram }) => {
  const queryClient = useQueryClient();

  const handleDelete = async () => {
    try {
      await deleteLoyaltyProgram(loyaltyProgram.id);
      queryClient.invalidateQueries({ queryKey: ['loyalty-programs'] });
      toast.success('Loyalty program deleted successfully');
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
          <EditLoyaltyProgramForm loyaltyProgram={loyaltyProgram} />
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
            loyalty program &quot;{loyaltyProgram.name}&quot;.
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

export const loyaltyProgramColumns: ColumnDef<LoyaltyProgram>[] = [
  {
    accessorKey: 'coverImage',
    header: 'Cover',
    cell: ({ row }) => {
      const coverImage = row.original.coverImage;
      return coverImage?.url ? (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          src={coverImage.thumbnailUrl || coverImage.url}
          alt={`${row.original.name} cover`}
          className="h-10 w-16 rounded-md object-cover"
        />
      ) : (
        <div className="flex h-10 w-16 items-center justify-center rounded-md bg-muted">
          <ImageIcon className="h-4 w-4 text-muted-foreground" />
        </div>
      );
    },
    size: 80
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
    accessorKey: 'isActive',
    header: 'Status',
    cell: ({ row }) => (
      <Badge variant={row.original.isActive ? 'default' : 'secondary'}>
        {row.original.isActive ? 'Active' : 'Inactive'}
      </Badge>
    )
  },
  {
    id: 'actions',
    cell: ({ row }) => <ActionsCell loyaltyProgram={row.original} />
  }
];
