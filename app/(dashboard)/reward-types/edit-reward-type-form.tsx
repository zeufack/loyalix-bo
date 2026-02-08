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
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { useEffect, useState } from 'react';
import { updateRewardType, uploadRewardTypeIcon } from '@/app/api/reward-type';
import { RewardType } from '@/types/reward-type';
import { Pencil } from 'lucide-react';
import { useImageUpload } from '@/hooks/use-image-upload';
import { useEntityForm } from '@/hooks/use-entity-form';

interface EditRewardTypeFormProps {
  rewardType: RewardType;
}

export function EditRewardTypeForm({ rewardType }: EditRewardTypeFormProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<RewardType>>({
    name: '',
    description: ''
  });

  const { 
    file: iconFile, 
    previewUrl: iconPreview, 
    handleChange: handleIconChange, 
    setPreviewUrl 
  } = useImageUpload(rewardType.icon?.url);

  const { loading, error, setError, handleUpdate } = useEntityForm<RewardType, Partial<RewardType>>({
    createEntity: async () => rewardType,
    updateEntity: updateRewardType,
    uploadImage: uploadRewardTypeIcon,
    queryKey: 'reward-types',
    successMessage: 'Reward type updated successfully'
  });

  useEffect(() => {
    if (rewardType) {
      setFormData({
        name: rewardType.name,
        description: rewardType.description || ''
      });
      setPreviewUrl(rewardType.icon?.url || null);
    }
  }, [rewardType, setPreviewUrl]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const validate = () => {
    if (!formData.name?.trim()) {
      return 'Name is required';
    }
    return null;
  };

  const handleSubmit = async () => {
    const result = await handleUpdate(
      rewardType.id, 
      { name: formData.name, description: formData.description }, 
      iconFile, 
      validate
    );
    if (result) {
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
          <Pencil className="mr-2 h-4 w-4" />
          Edit
        </DropdownMenuItem>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Reward Type</DialogTitle>
          <DialogDescription>
            Update the reward type details.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
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
              className="col-span-3"
              value={formData.description || ''}
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
            {loading ? 'Saving...' : 'Save Changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
