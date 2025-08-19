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
import { updateReward } from '@/app/api/reward';
import { Reward } from '@/types/reward';

interface EditRewardFormProps {
  reward: Reward;
}

export function EditRewardForm({ reward }: EditRewardFormProps) {
  const [formData, setFormData] = useState<Partial<Reward>>({
    name: '',
    description: '',
    pointsRequired: 0,
    businessId: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (reward) {
      setFormData({
        name: reward.name,
        description: reward.description,
        pointsRequired: reward.pointsRequired,
        businessId: reward.businessId
      });
    }
  }, [reward]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      await updateReward(reward.id, formData);
      // Optionally, you can close the dialog and refresh the reward list here.
    } catch (error) {
      setError('Failed to update reward.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-dots-horizontal"><path d="M8 12h.01"/><path d="M12 12h.01"/><path d="M16 12h.01"/></svg>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Reward</DialogTitle>
          <DialogDescription>
            Fill in the details below to edit the reward.
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
            <Label htmlFor="pointsRequired">Points Required</Label>
            <Input
              id="pointsRequired"
              type="number"
              className="col-span-3"
              value={formData.pointsRequired}
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

