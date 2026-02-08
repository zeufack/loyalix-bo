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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { useState } from 'react';
import { createBusiness, uploadBusinessProfileImage } from '@/app/api/business';
import { getBusinessTypes } from '@/app/api/business-type';
import { getUsers } from '@/app/api/user';
import AddItemButton from '@/components/ui/add-item-btn';
import { useQuery } from '@tanstack/react-query';
import { createBusinessSchema } from '@/lib/validations';
import { useImageUpload } from '@/hooks/use-image-upload';
import { useEntityForm } from '@/hooks/use-entity-form';
import type { CreateBusinessDto } from '@loyal-ix/loyalix-shared-types';
import type { Business } from '@/types/business';

export function CreateBusinessForm() {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<CreateBusinessDto>>({
    name: '',
    email: '',
    phone: '',
    description: '',
    industryType: '',
    address: '',
    owner: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { file: profileImage, previewUrl: profilePreview, handleChange: handleProfileChange, reset: resetProfile } = useImageUpload();

  const { data: businessTypesData } = useQuery({
    queryKey: ['business-types'],
    queryFn: () => getBusinessTypes({ limit: 100 }),
    enabled: open
  });

  const { data: usersData } = useQuery({
    queryKey: ['users'],
    queryFn: () => getUsers({ limit: 100 }),
    enabled: open
  });

  const businessTypes = businessTypesData?.data || [];
  const users = usersData?.data || [];

  const { loading, error, setError, handleCreate } = useEntityForm<Business, CreateBusinessDto>({
    createEntity: createBusiness,
    uploadImage: uploadBusinessProfileImage,
    queryKey: 'business',
    successMessage: 'Business created successfully',
    imageUploadErrorMessage: 'Business created, but profile image upload failed. You can add a profile image by editing it.'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
    if (errors[id]) {
      setErrors({ ...errors, [id]: '' });
    }
  };

  const handleSelectChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      description: '',
      industryType: '',
      address: '',
      owner: ''
    });
    resetProfile();
    setErrors({});
    setError(null);
  };

  const validate = () => {
    const result = createBusinessSchema.safeParse(formData);
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
    const result = await handleCreate(formData as CreateBusinessDto, profileImage, validate);
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
        <AddItemButton title="Create Business" />
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Business</DialogTitle>
          <DialogDescription>
            Fill in the details below to create a new business.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name">Name *</Label>
            <div className="col-span-3 space-y-1">
              <Input
                id="name"
                placeholder="e.g., Easy Moby"
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
            <Label htmlFor="email">Email *</Label>
            <div className="col-span-3 space-y-1">
              <Input
                id="email"
                type="email"
                placeholder="business@example.com"
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
                placeholder="+1 (555) 123-4567"
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
            <Label htmlFor="industryType">Industry Type *</Label>
            <div className="col-span-3 space-y-1">
              <Select
                value={formData.industryType}
                onValueChange={(value) => handleSelectChange('industryType', value)}
              >
                <SelectTrigger className={errors.industryType ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Select industry type" />
                </SelectTrigger>
                <SelectContent>
                  {businessTypes.map((type) => (
                    <SelectItem key={type.id} value={type.name}>
                      {type.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.industryType && (
                <p className="text-sm text-red-500">{errors.industryType}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="owner">Owner *</Label>
            <div className="col-span-3 space-y-1">
              <Select
                value={formData.owner}
                onValueChange={(value) => handleSelectChange('owner', value)}
              >
                <SelectTrigger className={errors.owner ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Select business owner" />
                </SelectTrigger>
                <SelectContent>
                  {users.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.firstName} {user.lastName} ({user.email})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.owner && (
                <p className="text-sm text-red-500">{errors.owner}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="address">Address</Label>
            <div className="col-span-3 space-y-1">
              <Input
                id="address"
                placeholder="123 Main Street, City"
                value={formData.address}
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
                placeholder="Brief description of the business..."
                value={formData.description}
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
