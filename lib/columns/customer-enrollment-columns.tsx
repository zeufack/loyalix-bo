'use client';

import { ColumnDef } from '@tanstack/react-table';
import { CustomerEnrollment } from '@/types/customer-enrollment';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { deleteCustomerEnrollment } from '@/app/api/customer-enrollment';
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
import { MoreHorizontal } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { Badge } from '@/components/ui/badge';

const ActionsCell = ({ enrollment }: { enrollment: CustomerEnrollment }) => {
  const queryClient = useQueryClient();

  const handleDelete = async () => {
    await deleteCustomerEnrollment(enrollment.id);
    queryClient.invalidateQueries({ queryKey: ['customer-enrollments'] });
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
          <DropdownMenuItem
            onClick={() => navigator.clipboard.writeText(enrollment.id)}
          >
            Copy ID
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <AlertDialogTrigger asChild>
            <DropdownMenuItem className="text-destructive">
              Delete Enrollment
            </DropdownMenuItem>
          </AlertDialogTrigger>
        </DropdownMenuContent>
      </DropdownMenu>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete this
            customer enrollment and remove all associated progress data.
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

export const customerEnrollmentColumns: ColumnDef<CustomerEnrollment>[] = [
  {
    accessorKey: 'customer',
    header: 'Customer',
    cell: ({ row }) => {
      const customer = row.original.customer;
      if (!customer?.user) return '-';
      const name = `${customer.user.firstName || ''} ${customer.user.lastName || ''}`.trim();
      return (
        <div>
          <div className="font-medium">{name || 'N/A'}</div>
          <div className="text-sm text-muted-foreground">
            {customer.user.email}
          </div>
        </div>
      );
    }
  },
  {
    accessorKey: 'program',
    header: 'Loyalty Program',
    cell: ({ row }) => {
      const program = row.original.program;
      if (!program) return '-';
      return (
        <div>
          <div className="font-medium">{program.name}</div>
          <Badge variant="outline" className="mt-1">
            {program.type || 'Standard'}
          </Badge>
        </div>
      );
    }
  },
  {
    accessorKey: 'enrollmentDate',
    header: 'Enrolled On',
    cell: ({ row }) => {
      const date = row.original.enrollmentDate;
      if (!date) return '-';
      return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    }
  },
  {
    id: 'actions',
    cell: ({ row }) => <ActionsCell enrollment={row.original} />
  }
];
