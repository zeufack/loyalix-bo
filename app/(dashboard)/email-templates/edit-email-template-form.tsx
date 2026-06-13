'use client';

import { useState } from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTrigger,
  SheetTitle,
  SheetDescription,
  SheetFooter
} from '@/components/ui/sheet';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { updateEmailTemplate, EmailTemplate } from '@/app/api/email-template';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';
import { Edit } from 'lucide-react';
import { z } from 'zod';

interface EditEmailTemplateFormProps {
  template: EmailTemplate;
}

const updateEmailTemplateSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  subject: z.string().min(1, 'Subject is required'),
  body: z.string().min(1, 'Body is required'),
  description: z.string().optional(),
  templateType: z.string().optional()
});

export function EditEmailTemplateForm({
  template
}: EditEmailTemplateFormProps) {
  const [formData, setFormData] = useState({
    name: template.name,
    subject: template.subject,
    body: template.body,
    description: template.description || '',
    templateType: template.templateType
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

  const handleSubmit = async () => {
    setLoading(true);
    setErrors({});

    const result = updateEmailTemplateSchema.safeParse(formData);
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
      await updateEmailTemplate(template.id, formData);
      toast.success('Email template updated successfully');
      queryClient.invalidateQueries({ queryKey: ['emailTemplates'] });
      setOpen(false);
    } catch (error) {
      toast.error('Failed to update email template');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button className="p-2 hover:bg-muted rounded-md" title="Edit">
          <Edit className="h-4 w-4" />
        </button>
      </SheetTrigger>
      <SheetContent className="overflow-y-auto sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Edit Email Template</SheetTitle>
          <SheetDescription>Update the email template</SheetDescription>
        </SheetHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" value={formData.name} onChange={handleChange} />
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
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="body">Body (HTML)</Label>
            <Textarea
              id="body"
              value={formData.body}
              onChange={handleChange}
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
        <SheetFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? 'Saving...' : 'Save'}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
