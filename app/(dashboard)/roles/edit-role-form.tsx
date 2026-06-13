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
import { useEffect, useState } from 'react';
import { updateRole } from '@/app/api/role';
import { Role } from '@/types/role';
import { useQueryClient } from '@tanstack/react-query';

interface EditRoleFormProps {
  role: Role;
}

export function EditRoleForm({ role }: EditRoleFormProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (role) {
      setFormData({
        name: role.name,
        description: role.description || ''
      });
    }
  }, [role]);

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
      await updateRole(role.id, {
        name: formData.name.toLowerCase().replace(/\s+/g, '-'),
        description: formData.description || undefined
      });
      queryClient.invalidateQueries({ queryKey: ['roles'] });
      setOpen(false);
    } catch (error) {
      const err = error as { response?: { data?: { message?: string } } };
      setError(err?.response?.data?.message || 'Failed to update role.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <span className="w-full cursor-pointer">Edit</span>
      </SheetTrigger>
      <SheetContent className="overflow-y-auto sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Edit Role</SheetTitle>
          <SheetDescription>Update the role details.</SheetDescription>
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
              value={formData.description}
              onChange={handleChange}
            />
          </div>
          {error && <p className="text-foreground-error text-sm">{error}</p>}
        </div>
        <SheetFooter>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? 'Updating...' : 'Update'}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
