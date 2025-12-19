'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { useState } from 'react';
import { createCustomerEnrollment } from '@/app/api/customer-enrollment';
import { getCustomers } from '@/app/api/customer';
import { getLoyaltyPrograms } from '@/app/api/loyalty-program';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import { CreateCustomerEnrollmentDto } from '@/types/customer-enrollment';

export function CreateCustomerEnrollmentForm() {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<CreateCustomerEnrollmentDto>({
    customerId: '',
    programId: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const { data: customersData } = useQuery({
    queryKey: ['customers'],
    queryFn: () => getCustomers({ page: 1, limit: 100 })
  });
  const customers = customersData?.data || [];

  const { data: programs } = useQuery({
    queryKey: ['loyalty-programs'],
    queryFn: () => getLoyaltyPrograms({ page: 1, limit: 100 })
  });

  const handleSubmit = async () => {
    if (!formData.customerId || !formData.programId) {
      setError('Please select both a customer and a program');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await createCustomerEnrollment(formData);
      queryClient.invalidateQueries({ queryKey: ['customer-enrollments'] });
      setFormData({ customerId: '', programId: '' });
      setOpen(false);
    } catch (err: unknown) {
      const error = err as { response?: { status?: number } };
      if (error?.response?.status === 409) {
        setError('This customer is already enrolled in this program');
      } else {
        setError('Failed to create enrollment');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Enrollment
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Customer Enrollment</DialogTitle>
          <DialogDescription>
            Enroll a customer in a loyalty program.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="customer" className="text-right">
              Customer
            </Label>
            <Select
              value={formData.customerId}
              onValueChange={(value) =>
                setFormData({ ...formData, customerId: value })
              }
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select a customer" />
              </SelectTrigger>
              <SelectContent>
                {customers.map((customer) => (
                  <SelectItem key={customer.id} value={customer.id}>
                    {customer.user?.firstName} {customer.user?.lastName} (
                    {customer.user?.email})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="program" className="text-right">
              Program
            </Label>
            <Select
              value={formData.programId}
              onValueChange={(value) =>
                setFormData({ ...formData, programId: value })
              }
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select a program" />
              </SelectTrigger>
              <SelectContent>
                {programs?.data?.map((program) => (
                  <SelectItem key={program.id} value={program.id}>
                    {program.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {error && (
            <p className="text-sm text-destructive text-center">{error}</p>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? 'Creating...' : 'Create Enrollment'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
