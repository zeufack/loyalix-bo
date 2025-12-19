'use client';

import { useState } from 'react';
import { MoreHorizontal, Copy, Eye, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Business } from '@/types/business';
import { EditBusinessForm } from './edit-business-form';
import { DeleteDialog } from '@/components/ui/delete-dialog';
import { deleteBusiness } from '@/app/api/business';
import { toast } from 'sonner';
import { copyToClipboard } from '@/lib/utils';

interface BusinessActionsCellProps {
  business: Business;
}

export function BusinessActionsCell({ business }: BusinessActionsCellProps) {
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const handleCopyId = () => {
    copyToClipboard(business.id);
    toast.success('Business ID copied to clipboard');
  };

  return (
    <>
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
            <Copy className="mr-2 h-4 w-4" />
            Copy ID
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setEditOpen(true)}>
            <Pencil className="mr-2 h-4 w-4" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setDeleteOpen(true)}
            className="text-destructive focus:text-destructive"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <EditBusinessForm
        business={business}
        open={editOpen}
        onOpenChange={setEditOpen}
      />

      <DeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Business"
        description={`Are you sure you want to delete "${business.name}"? This action cannot be undone.`}
        onDelete={() => deleteBusiness(business.id)}
        queryKey={['business']}
      />
    </>
  );
}
