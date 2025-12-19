'use client';

import AddItemButton from '@/components/ui/add-item-btn';
import { useState } from 'react';
import { createRole } from '@/app/api/role';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useQueryClient } from '@tanstack/react-query';

export function CreateRoleForm() {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      setError('Role name is required');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await createRole({
        name: formData.name.toLowerCase().replace(/\s+/g, '-'),
        description: formData.description || undefined
      });
      queryClient.invalidateQueries({ queryKey: ['roles'] });
      setFormData({ name: '', description: '' });
      setOpen(false);
    } catch (error) {
      const err = error as { response?: { data?: { message?: string } } };
      setError(err?.response?.data?.message || 'Failed to create role.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <AddItemButton title="Create Role" />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Role</DialogTitle>
          <DialogDescription>
            Create a new role to manage user permissions.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              className="col-span-3"
              placeholder="e.g., manager"
              value={formData.name}
              onChange={handleChange}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              className="col-span-3"
              placeholder="Role description..."
              value={formData.description}
              onChange={handleChange}
            />
          </div>
          <p className="text-xs text-muted-foreground">
            Role name will be converted to lowercase with hyphens (e.g., &quot;Sales Manager&quot; → &quot;sales-manager&quot;)
          </p>
          {error && <p className="text-red-500 text-sm">{error}</p>}
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? 'Creating...' : 'Create'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
