'use client';

import { useState } from 'react';
import { MoreHorizontal, Copy, Eye, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Customer } from '@/types/customer';
import { DeleteDialog } from '@/components/ui/delete-dialog';
import { deleteCustomer } from '@/app/api/customer';
import { toast } from 'sonner';
import { copyToClipboard } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';

interface CustomerActionsCellProps {
  customer: Customer;
}

export function CustomerActionsCell({ customer }: CustomerActionsCellProps) {
  const [viewOpen, setViewOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const handleCopyId = () => {
    copyToClipboard(customer.id);
    toast.success('Customer ID copied to clipboard');
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
          <DropdownMenuItem onClick={() => setViewOpen(true)}>
            <Eye className="mr-2 h-4 w-4" />
            View Details
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

      {/* View Customer Dialog */}
      <Dialog open={viewOpen} onOpenChange={setViewOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Customer Details</DialogTitle>
            <DialogDescription>
              View customer information linked to their user account.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right text-muted-foreground">Email</Label>
              <div className="col-span-3 font-medium">
                {customer.user?.email || 'N/A'}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right text-muted-foreground">Name</Label>
              <div className="col-span-3 font-medium">
                {customer.user?.firstName || ''} {customer.user?.lastName || ''}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right text-muted-foreground">Status</Label>
              <div className="col-span-3">
                <Badge variant={customer.user?.isActive ? 'default' : 'secondary'}>
                  {customer.user?.isActive ? 'Active' : 'Inactive'}
                </Badge>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right text-muted-foreground">Joined</Label>
              <div className="col-span-3">
                {new Date(customer.createdAt).toLocaleDateString()}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <DeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Customer"
        description={`Are you sure you want to delete customer "${customer.user?.firstName} ${customer.user?.lastName}"? This action cannot be undone.`}
        onDelete={() => deleteCustomer(customer.id)}
        queryKey={['customers']}
      />
    </>
  );
}
