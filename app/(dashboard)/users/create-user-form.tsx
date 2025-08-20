'use client';

import AddItemButton from '@/components/ui/add-item-btn';
import { useState } from 'react';
import { createCustomer } from '../../api/customer';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '../../../components/ui/dialog';
import { Label } from '../../../components/ui/label';
import { Input } from '../../../components/ui/input';
import { Button } from '../../../components/ui/button';
import { UserRole } from '../../../types/user';
import { createUser } from '../../api/user';

export function CreateUserForm() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    roles: [] as UserRole[]
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const roles = Array.from(
      e.target.selectedOptions,
      (option) => option.value as UserRole
    );
    setFormData({ ...formData, roles });
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      await createUser(formData);
      // Optionally, you can close the dialog and refresh the user list here.
    } catch (error) {
      setError('Failed to create user.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <AddItemButton title="Create User" />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create User</DialogTitle>
          <DialogDescription>
            Fill in the details below to create a new user.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              className="col-span-3"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              className="col-span-3"
              value={formData.password}
              onChange={handleChange}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="firstName">First Name</Label>
            <Input
              id="firstName"
              className="col-span-3"
              value={formData.firstName}
              onChange={handleChange}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              id="lastName"
              className="col-span-3"
              value={formData.lastName}
              onChange={handleChange}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="roles">Roles</Label>
            <select
              multiple
              id="roles"
              onChange={handleRoleChange}
              className="col-span-3"
            >
              {Object.values(UserRole).map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
          </div>
          {error && <p className="text-red-500">{error}</p>}
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
