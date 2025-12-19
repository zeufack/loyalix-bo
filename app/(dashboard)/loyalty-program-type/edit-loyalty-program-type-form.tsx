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
import { useEffect, useState } from 'react';
import { updateLoyaltyProgramType } from '@/app/api/loyalty-program-type';
import { LoyaltyProgramType } from '@/types/loyalty-program-type';
import { useQueryClient } from '@tanstack/react-query';

interface EditLoyaltyProgramTypeFormProps {
  loyaltyProgramType: LoyaltyProgramType;
}

export function EditLoyaltyProgramTypeForm({
  loyaltyProgramType
}: EditLoyaltyProgramTypeFormProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<LoyaltyProgramType>>({
    name: '',
    description: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (loyaltyProgramType) {
      setFormData({
        name: loyaltyProgramType.name,
        description: loyaltyProgramType.description
      });
    }
  }, [loyaltyProgramType]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      await updateLoyaltyProgramType(loyaltyProgramType.id, formData);
      queryClient.invalidateQueries({ queryKey: ['loyalty-program-type'] });
      setOpen(false);
    } catch (error) {
      setError('Failed to update loyalty program type.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <span className="w-full cursor-pointer">Edit</span>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Loyalty Program Type</DialogTitle>
          <DialogDescription>
            Update the details of this loyalty program type.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              className="col-span-3"
              value={formData.name}
              onChange={handleChange}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              className="col-span-3"
              value={formData.description}
              onChange={handleChange}
            />
          </div>
          {error && <p className="text-red-500">{error}</p>}
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? 'Updating...' : 'Update'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
