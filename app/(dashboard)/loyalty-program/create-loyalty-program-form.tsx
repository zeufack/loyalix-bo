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
import { Textarea } from '@/components/ui/textarea';
import { FormImageField } from '@/components/ui/form-image-field';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { useState } from 'react';
import { createLoyaltyProgram, uploadLoyaltyProgramCoverImage } from '@/app/api/loyalty-program';
import { getBusinesses } from '@/app/api/business';
import AddItemButton from '@/components/ui/add-item-btn';
import { useQuery } from '@tanstack/react-query';
import { z } from 'zod';
import { useImageUpload } from '@/hooks/use-image-upload';
import { useEntityForm } from '@/hooks/use-entity-form';
import type { CreateLoyaltyProgramDto } from '@loyal-ix/loyalix-shared-types';
import type { LoyaltyProgram } from '@/types/loyalty-program';

const createLoyaltyProgramSchema = z.object({
  businessId: z.string().min(1, 'Please select a business'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  description: z.string().optional(),
  isActive: z.boolean().optional()
});

export function CreateLoyaltyProgramForm() {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<CreateLoyaltyProgramDto & { description?: string }>({
    businessId: '',
    name: '',
    description: '',
    isActive: true
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { file: coverFile, previewUrl: coverPreview, handleChange: handleCoverChange, reset: resetCover } = useImageUpload();

  const { data: businessesData } = useQuery({
    queryKey: ['businesses'],
    queryFn: () => getBusinesses({ limit: 100 }),
    enabled: open
  });

  const businesses = businessesData?.data || [];

  const { loading, error, setError, handleCreate } = useEntityForm<LoyaltyProgram, typeof formData>({
    createEntity: createLoyaltyProgram,
    uploadImage: uploadLoyaltyProgramCoverImage,
    queryKey: 'loyalty-programs',
    successMessage: 'Loyalty program created successfully',
    imageUploadErrorMessage: 'Loyalty program created, but cover image upload failed. You can add a cover image by editing it.'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
    if (errors[id]) {
      setErrors({ ...errors, [id]: '' });
    }
  };

  const resetForm = () => {
    setFormData({ businessId: '', name: '', description: '', isActive: true });
    resetCover();
    setErrors({});
    setError(null);
  };

  const validate = () => {
    const result = createLoyaltyProgramSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as string] = err.message;
        }
      });
      setErrors(fieldErrors);
      return 'Validation failed';
    }
    return null;
  };

  const handleSubmit = async () => {
    const { description, ...submitData } = formData;
    const result = await handleCreate(submitData, coverFile, validate);
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
            <Label htmlFor="businessId" className="text-right">Business *</Label>
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
            <Label htmlFor="name" className="text-right">Name *</Label>
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
          <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="description" className="text-right pt-2">Description</Label>
            <div className="col-span-3 space-y-1">
              <Textarea
                id="description"
                placeholder="Program description..."
                value={formData.description || ''}
                onChange={handleChange}
                rows={3}
              />
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="isActive" className="text-right">Active</Label>
            <Switch
              id="isActive"
              checked={formData.isActive}
              onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
            />
          </div>
          <FormImageField
            label="Cover Image"
            value={coverPreview}
            onChange={handleCoverChange}
            disabled={loading}
            uploadLabel="Upload a cover image"
          />
          {error && <p className="text-sm text-destructive text-center">{error}</p>}
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
