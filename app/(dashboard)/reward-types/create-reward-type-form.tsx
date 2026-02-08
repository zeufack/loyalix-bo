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
import { Textarea } from '@/components/ui/textarea';
import { FormImageField } from '@/components/ui/form-image-field';
import { useState } from 'react';
import { createRewardType, uploadRewardTypeIcon } from '@/app/api/reward-type';
import { Plus } from 'lucide-react';
import { useImageUpload } from '@/hooks/use-image-upload';
import { useEntityForm } from '@/hooks/use-entity-form';
import type { RewardType } from '@/types/reward-type';

export function CreateRewardTypeForm() {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });

  const { file: iconFile, previewUrl: iconPreview, handleChange: handleIconChange, reset: resetIcon } = useImageUpload();

  const { loading, error, setError, handleCreate } = useEntityForm<RewardType, typeof formData>({
    createEntity: createRewardType,
    uploadImage: uploadRewardTypeIcon,
    queryKey: 'reward-types',
    successMessage: 'Reward type created successfully',
    imageUploadErrorMessage: 'Reward type created, but icon upload failed. You can add an icon by editing it.'
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const resetForm = () => {
    setFormData({ name: '', description: '' });
    resetIcon();
    setError(null);
  };

  const validate = () => {
    if (!formData.name.trim()) {
      return 'Name is required';
    }
    return null;
  };

  const handleSubmit = async () => {
    const result = await handleCreate(formData, iconFile, validate);
    if (result) {
      resetForm();
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      setOpen(isOpen);
      if (!isOpen) resetForm();
    }}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Reward Type
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Reward Type</DialogTitle>
          <DialogDescription>
            Add a new reward type for loyalty programs. Examples: Free Item,
            Discount, Points Bonus.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              placeholder="e.g., Free Item"
              className="col-span-3"
              value={formData.name}
              onChange={handleChange}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Description
            </Label>
            <Textarea
              id="description"
              placeholder="Optional description..."
              className="col-span-3"
              value={formData.description}
              onChange={handleChange}
            />
          </div>
          <FormImageField
            label="Icon"
            value={iconPreview}
            onChange={handleIconChange}
            disabled={loading}
            uploadLabel="Upload an icon"
          />
          {error && (
            <p className="text-sm text-destructive text-center">{error}</p>
          )}
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
