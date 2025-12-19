'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import { Customer } from '@/types/customer';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { Eye } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface ViewCustomerFormProps {
  customer: Customer;
}

export function ViewCustomerForm({ customer }: ViewCustomerFormProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
          <Eye className="mr-2 h-4 w-4" />
          View Details
        </DropdownMenuItem>
      </DialogTrigger>
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
  );
}

// Keep backward compatibility
export { ViewCustomerForm as EditCustomerForm };

