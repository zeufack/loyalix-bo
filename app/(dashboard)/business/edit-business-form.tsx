'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { FormImageField } from '@/components/ui/form-image-field';
import { useEffect, useState } from 'react';
import { updateBusiness, uploadBusinessProfileImage } from '@/app/api/business';
import { Business } from '@/types/business';
import { updateBusinessSchema } from '@/lib/validations';
import { useImageUpload } from '@/hooks/use-image-upload';
import { useEntityForm } from '@/hooks/use-entity-form';
import type { UpdateBusinessDto } from '@loyal-ix/loyalix-shared-types';

interface EditBusinessFormProps {
  business: Business;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditBusinessForm({ business, open, onOpenChange }: EditBusinessFormProps) {
  const [formData, setFormData] = useState<UpdateBusinessDto>({
    name: '',
    email: '',
    phone: '',
    description: '',
    address: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { 
    file: profileImage, 
    previewUrl: profilePreview, 
    handleChange: handleProfileChange, 
    setPreviewUrl 
  } = useImageUpload(business.profileImage?.url);

  const { loading, error, setError, handleUpdate } = useEntityForm<Business, UpdateBusinessDto>({
    createEntity: async () => business,
    updateEntity: updateBusiness,
    uploadImage: uploadBusinessProfileImage,
    queryKey: 'business',
    successMessage: 'Business updated successfully'
  });

  useEffect(() => {
    if (business && open) {
      setFormData({
        name: business.name || '',
        email: business.email || '',
        phone: business.phone || '',
        description: business.description || '',
        address: business.address || ''
      });
      setPreviewUrl(business.profileImage?.url || null);
      setErrors({});
      setError(null);
    }
  }, [business, open, setPreviewUrl, setError]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
    if (errors[id]) {
      setErrors({ ...errors, [id]: '' });
    }
  };

  const validate = () => {
    const result = updateBusinessSchema.safeParse(formData);
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
    const result = await handleUpdate(business.id, formData, profileImage, validate);
    if (result) {
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Business</DialogTitle>
          <DialogDescription>
            Update the business details below.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name">Name</Label>
            <div className="col-span-3 space-y-1">
              <Input
                id="name"
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
            <Label htmlFor="email">Email</Label>
            <div className="col-span-3 space-y-1">
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className={errors.email ? 'border-red-500' : ''}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email}</p>
              )}
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="phone">Phone</Label>
            <div className="col-span-3 space-y-1">
              <Input
                id="phone"
                value={formData.phone}
                onChange={handleChange}
                className={errors.phone ? 'border-red-500' : ''}
              />
              {errors.phone && (
                <p className="text-sm text-red-500">{errors.phone}</p>
              )}
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="address">Address</Label>
            <div className="col-span-3 space-y-1">
              <Input
                id="address"
                value={formData.address || ''}
                onChange={handleChange}
                className={errors.address ? 'border-red-500' : ''}
              />
              {errors.address && (
                <p className="text-sm text-red-500">{errors.address}</p>
              )}
            </div>
          </div>
          <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="description" className="pt-2">Description</Label>
            <div className="col-span-3 space-y-1">
              <Textarea
                id="description"
                value={formData.description || ''}
                onChange={handleChange}
                className={errors.description ? 'border-red-500' : ''}
                rows={3}
              />
              {errors.description && (
                <p className="text-sm text-red-500">{errors.description}</p>
              )}
            </div>
          </div>
          <FormImageField
            label="Profile Image"
            value={profilePreview}
            onChange={handleProfileChange}
            disabled={loading}
            uploadLabel="Upload a profile image"
          />
          {error && <p className="text-sm text-destructive text-center">{error}</p>}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? 'Updating...' : 'Update'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
