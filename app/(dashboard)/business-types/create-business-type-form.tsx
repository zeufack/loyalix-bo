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
import { useState } from 'react';
import {
  createBusinessType,
  uploadBusinessTypeIcon
} from '@/app/api/business-type';
import { useQueryClient } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';
import { getApiErrorMessage } from '@/lib/api-error';

export function CreateBusinessTypeForm() {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });
  const [iconFile, setIconFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const resetForm = () => {
    setFormData({ name: '', description: '' });
    setIconFile(null);
    setError(null);
  };

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      setError('Name is required');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const created = await createBusinessType(formData);

      // Upload icon if a file was selected
      if (iconFile) {
        try {
          await uploadBusinessTypeIcon(created.id, iconFile);
        } catch (iconErr) {
          // Business type was created, but icon upload failed
          toast.warning(
            'Business type created, but icon upload failed. You can add an icon by editing it.'
          );
        }
      }

      queryClient.invalidateQueries({ queryKey: ['business-types'] });
      toast.success('Business type created successfully');
      resetForm();
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
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        setOpen(isOpen);
        if (!isOpen) resetForm();
      }}
    >
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Business Type
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Business Type</DialogTitle>
          <DialogDescription>
            Add a new business type category. Examples: Restaurant, Salon, Gym,
            Spa.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              placeholder="e.g., Restaurant"
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
          <div className="grid grid-cols-4 items-start gap-4">
            <Label className="text-right pt-2">Icon</Label>
            <div className="col-span-3">
              <ImageUpload
                onChange={setIconFile}
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
            {loading ? 'Creating...' : 'Create'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
