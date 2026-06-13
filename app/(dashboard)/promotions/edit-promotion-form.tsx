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
import { updatePromotion } from '@/app/api/promotion';
import { Promotion } from '@/types/promotion';

interface EditPromotionFormProps {
  promotion: Promotion;
}

export function EditPromotionForm({ promotion }: EditPromotionFormProps) {
  const [formData, setFormData] = useState<Partial<Promotion>>({
    name: '',
    description: '',
    startDate: new Date(),
    endDate: new Date(),
    discount: 0,
    businessId: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (promotion) {
      setFormData({
        name: promotion.name,
        description: promotion.description,
        startDate: promotion.startDate,
        endDate: promotion.endDate,
        discount: promotion.discount,
        businessId: promotion.businessId
      });
    }
  }, [promotion]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      await updatePromotion(promotion.id, formData);
      // Optionally, you can close the dialog and refresh the promotion list here.
    } catch (error) {
      setError('Failed to update promotion.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-dots-horizontal"
          >
            <path d="M8 12h.01" />
            <path d="M12 12h.01" />
            <path d="M16 12h.01" />
          </svg>
        </Button>
      </SheetTrigger>
      <SheetContent className="overflow-y-auto sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Edit Promotion</SheetTitle>
          <SheetDescription>
            Fill in the details below to edit the promotion.
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
          <div className="grid gap-2">
            <Label htmlFor="startDate">Start Date</Label>
            <Input
              id="startDate"
              type="date"
              value={
                formData.startDate
                  ? new Date(formData.startDate).toISOString().split('T')[0]
                  : ''
              }
              onChange={handleChange}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="endDate">End Date</Label>
            <Input
              id="endDate"
              type="date"
              value={
                formData.endDate
                  ? new Date(formData.endDate).toISOString().split('T')[0]
                  : ''
              }
              onChange={handleChange}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="discount">Discount</Label>
            <Input
              id="discount"
              type="number"
              value={formData.discount}
              onChange={handleChange}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="businessId">Business ID</Label>
            <Input
              id="businessId"
              value={formData.businessId}
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
