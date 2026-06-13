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
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { FormImageField } from '@/components/ui/form-image-field';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { useEffect, useState } from 'react';
import {
  updateLoyaltyProgram,
  uploadLoyaltyProgramCoverImage
} from '@/app/api/loyalty-program';
import { LoyaltyProgram } from '@/types/loyalty-program';
import { Pencil } from 'lucide-react';
import { useImageUpload } from '@/hooks/use-image-upload';
import { useEntityForm } from '@/hooks/use-entity-form';
import type { UpdateLoyaltyProgramDto } from '@loyal-ix/loyalix-shared-types';

interface EditLoyaltyProgramFormProps {
  loyaltyProgram: LoyaltyProgram;
}

export function EditLoyaltyProgramForm({
  loyaltyProgram
}: EditLoyaltyProgramFormProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<
    UpdateLoyaltyProgramDto & { description?: string }
  >({
    name: '',
    description: '',
    isActive: true
  });

  const {
    file: coverFile,
    previewUrl: coverPreview,
    handleChange: handleCoverChange,
    setPreviewUrl
  } = useImageUpload(loyaltyProgram.coverImage?.url);

  const { loading, error, setError, handleUpdate } = useEntityForm<
    LoyaltyProgram,
    UpdateLoyaltyProgramDto
  >({
    createEntity: async () => loyaltyProgram,
    updateEntity: updateLoyaltyProgram,
    uploadImage: uploadLoyaltyProgramCoverImage,
    queryKey: 'loyalty-programs',
    successMessage: 'Loyalty program updated successfully'
  });

  useEffect(() => {
    if (loyaltyProgram) {
      setFormData({
        name: loyaltyProgram.name,
        description: loyaltyProgram.description || '',
        isActive: loyaltyProgram.isActive
      });
      setPreviewUrl(loyaltyProgram.coverImage?.url || null);
    }
  }, [loyaltyProgram, setPreviewUrl]);

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
    const { description, ...submitData } = formData;
    const result = await handleUpdate(
      loyaltyProgram.id,
      submitData,
      coverFile,
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
          <SheetTitle>Edit Loyalty Program</SheetTitle>
          <SheetDescription>
            Update the loyalty program details.
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={formData.name || ''}
              onChange={handleChange}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description" className="pt-2">
              Description
            </Label>
            <Textarea
              id="description"
              value={formData.description || ''}
              onChange={handleChange}
              rows={3}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="isActive">Active</Label>
            <Switch
              id="isActive"
              checked={formData.isActive || false}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, isActive: checked })
              }
            />
          </div>
          <FormImageField
            label="Cover Image"
            value={coverPreview}
            onChange={handleCoverChange}
            disabled={loading}
            uploadLabel="Upload a cover image"
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
