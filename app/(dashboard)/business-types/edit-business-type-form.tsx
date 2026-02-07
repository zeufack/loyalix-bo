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
import { ImageUpload } from '@/components/ui/image-upload';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { useEffect, useState } from 'react';
import {
  updateBusinessType,
  uploadBusinessTypeIcon
} from '@/app/api/business-type';
import { BusinessType } from '@/types/business-type';
import { useQueryClient } from '@tanstack/react-query';
import { Pencil } from 'lucide-react';
import { toast } from 'sonner';
import { getApiErrorMessage } from '@/lib/api-error';

interface EditBusinessTypeFormProps {
  businessType: BusinessType;
}

export function EditBusinessTypeForm({
  businessType
}: EditBusinessTypeFormProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<BusinessType>>({
    name: '',
    description: ''
  });
  const [iconFile, setIconFile] = useState<File | null>(null);
  const [existingIconUrl, setExistingIconUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (businessType) {
      setFormData({
        name: businessType.name,
        description: businessType.description || ''
      });
      setExistingIconUrl(businessType.icon?.url || null);
      setIconFile(null);
    }
  }, [businessType]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleIconChange = (file: File | null) => {
    setIconFile(file);
    if (file === null) {
      // User cleared the image
      setExistingIconUrl(null);
    }
  };

  const handleSubmit = async () => {
    if (!formData.name?.trim()) {
      setError('Name is required');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      // Update text fields
      await updateBusinessType(businessType.id, {
        name: formData.name,
        description: formData.description
      });

      // Upload new icon if a file was selected
      if (iconFile) {
        try {
          await uploadBusinessTypeIcon(businessType.id, iconFile);
        } catch (iconErr) {
          toast.warning('Business type updated, but icon upload failed.');
        }
      }

      queryClient.invalidateQueries({ queryKey: ['business-types'] });
      toast.success('Business type updated successfully');
      setOpen(false);
    } catch (err) {
      const message = getApiErrorMessage(err);
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
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
          <DialogTitle>Edit Business Type</DialogTitle>
          <DialogDescription>
            Update the business type details.
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
          <div className="grid grid-cols-4 items-start gap-4">
            <Label className="text-right pt-2">Icon</Label>
            <div className="col-span-3">
              <ImageUpload
                value={existingIconUrl}
                onChange={handleIconChange}
                disabled={loading}
                label="Upload an icon"
              />
            </div>
          </div>
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
