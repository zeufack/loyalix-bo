'use client';

import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '@/components/ui/sheet';
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
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <span className="w-full cursor-pointer">Edit</span>
      </SheetTrigger>
      <SheetContent className="overflow-y-auto sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Edit Loyalty Program Type</SheetTitle>
          <SheetDescription>
            Update the details of this loyalty program type.
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" value={formData.name} onChange={handleChange} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              value={formData.description}
              onChange={handleChange}
            />
          </div>
          {error && <p className="text-foreground-error">{error}</p>}
        </div>
        <SheetFooter>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? 'Updating...' : 'Update'}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
