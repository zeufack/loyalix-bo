'use client';

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
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-dots-horizontal"><path d="M8 12h.01"/><path d="M12 12h.01"/><path d="M16 12h.01"/></svg>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Promotion</DialogTitle>
          <DialogDescription>
            Fill in the details below to edit the promotion.
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
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="startDate">Start Date</Label>
            <Input
              id="startDate"
              type="date"
              className="col-span-3"
              value={new Date(formData.startDate).toISOString().split('T')[0]}
              onChange={handleChange}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="endDate">End Date</Label>
            <Input
              id="endDate"
              type="date"
              className="col-span-3"
              value={new Date(formData.endDate).toISOString().split('T')[0]}
              onChange={handleChange}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="discount">Discount</Label>
            <Input
              id="discount"
              type="number"
              className="col-span-3"
              value={formData.discount}
              onChange={handleChange}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="businessId">Business ID</Label>
            <Input
              id="businessId"
              className="col-span-3"
              value={formData.businessId}
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


