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

  const { loading, error, setError, handleUpdate } = useEntityForm<
    RewardType,
    Partial<RewardType>
  >({
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
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
          <Pencil className="mr-2 h-4 w-4" />
          Edit
        </DropdownMenuItem>
      </SheetTrigger>
      <SheetContent className="overflow-y-auto sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Edit Reward Type</SheetTitle>
          <SheetDescription>Update the reward type details.</SheetDescription>
        </SheetHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" value={formData.name} onChange={handleChange} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
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
        <SheetFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? 'Saving...' : 'Save Changes'}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
