'use client';

import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '@/components/ui/sheet';
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
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
          <Eye className="mr-2 h-4 w-4" />
          View Details
        </DropdownMenuItem>
      </SheetTrigger>
      <SheetContent className="overflow-y-auto sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Customer Details</SheetTitle>
          <SheetDescription>
            View customer information linked to their user account.
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label className="text-muted-foreground">Email</Label>
            <div className="font-medium">{customer.user?.email || 'N/A'}</div>
          </div>
          <div className="grid gap-2">
            <Label className="text-muted-foreground">Name</Label>
            <div className="font-medium">
              {customer.user?.firstName || ''} {customer.user?.lastName || ''}
            </div>
          </div>
          <div className="grid gap-2">
            <Label className="text-muted-foreground">Status</Label>
            <div>
              <Badge
                variant={customer.user?.isVerified ? 'default' : 'secondary'}
              >
                {customer.user?.isVerified ? 'Verified' : 'Unverified'}
              </Badge>
            </div>
          </div>
          <div className="grid gap-2">
            <Label className="text-muted-foreground">Joined</Label>
            <div>{new Date(customer.createdAt).toLocaleDateString()}</div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

// Keep backward compatibility
export { ViewCustomerForm as EditCustomerForm };
