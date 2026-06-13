'use client';

import AddItemButton from '@/components/ui/add-item-btn';
import { useState } from 'react';
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
import { createEmailTemplate } from '@/app/api/email-template';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';

const createEmailTemplateSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  subject: z.string().min(1, 'Subject is required'),
  body: z.string().min(1, 'Body is required'),
  description: z.string().optional(),
  templateType: z.string().optional()
});

export function CreateEmailTemplateForm() {
  const [formData, setFormData] = useState({
    name: '',
    subject: '',
    body: '',
    description: '',
    templateType: 'custom'
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
    if (errors[id]) {
      setErrors({ ...errors, [id]: '' });
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      subject: '',
      body: '',
      description: '',
      templateType: 'custom'
    });
    setErrors({});
  };

  const handleSubmit = async () => {
    setLoading(true);
    setErrors({});

    const result = createEmailTemplateSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as string] = err.message;
        }
      });
      setErrors(fieldErrors);
      setLoading(false);
      return;
    }

    try {
      await createEmailTemplate(formData);
      toast.success('Email template created successfully');
      queryClient.invalidateQueries({ queryKey: ['emailTemplates'] });
      resetForm();
      setOpen(false);
    } catch (error) {
      toast.error('Failed to create email template');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <AddItemButton title="Create Template" />
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create Email Template</DialogTitle>
          <DialogDescription>
            Create a new email template for your campaigns
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Welcome Email"
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name}</p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="subject">Subject</Label>
            <Input
              id="subject"
              value={formData.subject}
              onChange={handleChange}
              placeholder="Welcome to {{business_name}}!"
            />
            {errors.subject && (
              <p className="text-sm text-destructive">{errors.subject}</p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Email sent to new customers"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="body">Body (HTML)</Label>
            <Textarea
              id="body"
              value={formData.body}
              onChange={handleChange}
              placeholder="<h1>Hello {{customer_name}}!</h1><p>Welcome to {{business_name}}...</p>"
              className="min-h-[200px] font-mono text-sm"
            />
            {errors.body && (
              <p className="text-sm text-destructive">{errors.body}</p>
            )}
            <p className="text-xs text-muted-foreground">
              Use {'{{variable_name}}'} for dynamic content
            </p>
          </div>
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
