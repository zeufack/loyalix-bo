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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { useState } from 'react';
import { createLoyaltyProgram } from '@/app/api/loyalty-program';
import { getBusinesses } from '@/app/api/business';
import AddItemButton from '@/components/ui/add-item-btn';
import { toast } from 'sonner';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getApiErrorMessage } from '@/lib/api-error';
import { z } from 'zod';
import type { CreateLoyaltyProgramDto } from '@loyal-ix/loyalix-shared-types';

const createLoyaltyProgramSchema = z.object({
  businessId: z.string().min(1, 'Please select a business'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  isActive: z.boolean().optional()
});

export function CreateLoyaltyProgramForm() {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<CreateLoyaltyProgramDto>({
    businessId: '',
    name: '',
    isActive: true
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const queryClient = useQueryClient();

  const { data: businessesData } = useQuery({
    queryKey: ['businesses'],
    queryFn: () => getBusinesses({ limit: 100 }),
    enabled: open
  });

  const businesses = businessesData?.data || [];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
    if (errors[id]) {
      setErrors({ ...errors, [id]: '' });
    }
  };

  const resetForm = () => {
    setFormData({ businessId: '', name: '', isActive: true });
    setErrors({});
  };

  const handleSubmit = async () => {
    setLoading(true);
    setErrors({});

    const result = createLoyaltyProgramSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as string] = err.message;
        }
      });
      setErrors(fieldErrors);
      setLoading(false);
      return;
    }

    try {
      await createLoyaltyProgram(result.data);
      toast.success('Loyalty program created successfully');
      await queryClient.invalidateQueries({ queryKey: ['loyalty-programs'] });
      resetForm();
      setOpen(false);
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      setOpen(isOpen);
      if (!isOpen) resetForm();
    }}>
      <DialogTrigger asChild>
        <AddItemButton title="Create Loyalty Program" />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Loyalty Program</DialogTitle>
          <DialogDescription>
            Fill in the details below to create a new loyalty program.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="businessId">Business *</Label>
            <div className="col-span-3 space-y-1">
              <Select
                value={formData.businessId}
                onValueChange={(value) => {
                  setFormData({ ...formData, businessId: value });
                  if (errors.businessId) setErrors({ ...errors, businessId: '' });
                }}
              >
                <SelectTrigger className={errors.businessId ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Select a business" />
                </SelectTrigger>
                <SelectContent>
                  {businesses.map((business) => (
                    <SelectItem key={business.id} value={business.id}>
                      {business.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.businessId && (
                <p className="text-sm text-red-500">{errors.businessId}</p>
              )}
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name">Name *</Label>
            <div className="col-span-3 space-y-1">
              <Input
                id="name"
                placeholder="e.g., Premium Rewards"
                value={formData.name}
                onChange={handleChange}
                className={errors.name ? 'border-red-500' : ''}
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name}</p>
              )}
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="isActive">Active</Label>
            <Switch
              id="isActive"
              checked={formData.isActive}
              onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? 'Creating...' : 'Create'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
