'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { z } from 'zod';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { getBusinesses } from '@/app/api/business';
import { instantiateLoyaltyProgramTemplate } from '@/app/api/loyalty-program-templates';
import { LoyaltyProgramTemplate } from '@/types/loyalty-program-template';
import { useEntityForm } from '@/hooks/use-entity-form';
import type { InstantiatedProgramResponseDto } from '@loyal-ix/loyalix-shared-types';

const instantiateSchema = z.object({
  businessId: z.string().min(1, 'Please select a business'),
  name: z.string().max(255, 'Name must be 255 characters or fewer').optional(),
  description: z.string().optional(),
  rewardValidityDays: z
    .number()
    .int()
    .positive('Reward validity must be a positive number of days')
    .optional()
});

interface InstantiateLoyaltyProgramTemplateProps {
  template: LoyaltyProgramTemplate;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function InstantiateLoyaltyProgramTemplate({
  template,
  open,
  onOpenChange
}: InstantiateLoyaltyProgramTemplateProps) {
  const [businessId, setBusinessId] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [rewardValidityDays, setRewardValidityDays] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const router = useRouter();

  const { data: businessesData } = useQuery({
    queryKey: ['businesses'],
    queryFn: () => getBusinesses({ limit: 100 }),
    enabled: open
  });
  const businesses = businessesData?.data || [];

  const { loading, error, setError, handleCreate } = useEntityForm<
    InstantiatedProgramResponseDto,
    Parameters<typeof instantiateLoyaltyProgramTemplate>[1]
  >({
    createEntity: (data) =>
      instantiateLoyaltyProgramTemplate(template.id, data),
    queryKey: 'loyalty-program',
    successMessage: 'Loyalty program created from template'
  });

  const resetForm = () => {
    setBusinessId('');
    setName('');
    setDescription('');
    setRewardValidityDays('');
    setErrors({});
    setError(null);
  };

  const buildPayload = () => {
    const payload: Record<string, unknown> = { businessId };
    if (name.trim()) payload.name = name.trim();
    if (description.trim()) payload.description = description.trim();
    if (rewardValidityDays.trim())
      payload.rewardValidityDays = Number(rewardValidityDays);
    return payload as Parameters<typeof instantiateLoyaltyProgramTemplate>[1];
  };

  const validate = () => {
    const result = instantiateSchema.safeParse(buildPayload());
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
    const result = await handleCreate(buildPayload(), null, validate);
    if (result) {
      resetForm();
      onOpenChange(false);
      router.push('/loyalty-program');
    }
  };

  if (!template.isActive) return null;

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        onOpenChange(isOpen);
        if (!isOpen) resetForm();
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Instantiate &quot;{template.name}&quot;</DialogTitle>
          <DialogDescription>
            Clones this template into a new, independent loyalty program for the
            selected business. Later edits to the template will not affect it.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="businessId">Target Business *</Label>
            <div className="space-y-1">
              <Select
                value={businessId}
                onValueChange={(value) => {
                  setBusinessId(value);
                  if (errors.businessId)
                    setErrors({ ...errors, businessId: '' });
                }}
              >
                <SelectTrigger
                  className={errors.businessId ? 'border-border-error' : ''}
                >
                  <SelectValue placeholder="Select a business" />
                </SelectTrigger>
                <SelectContent>
                  {businesses.map((business) => (
                    <SelectItem key={business.id} value={business.id}>
                      {business.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.businessId && (
                <p className="text-sm text-foreground-error">
                  {errors.businessId}
                </p>
              )}
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="name">Program Name</Label>
            <Input
              id="name"
              placeholder={template.name}
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={errors.name ? 'border-border-error' : ''}
            />
            {errors.name && (
              <p className="text-sm text-foreground-error">{errors.name}</p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description" className="pt-2">
              Description
            </Label>
            <Textarea
              id="description"
              placeholder={template.description || 'Program description...'}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="rewardValidityDays">Reward Validity (days)</Label>
            <Input
              id="rewardValidityDays"
              type="number"
              min={1}
              placeholder={
                template.rewardValidityDays != null
                  ? `${template.rewardValidityDays} (template default)`
                  : 'Never expires (template default)'
              }
              value={rewardValidityDays}
              onChange={(e) => setRewardValidityDays(e.target.value)}
              className={errors.rewardValidityDays ? 'border-border-error' : ''}
            />
            {errors.rewardValidityDays ? (
              <p className="text-sm text-foreground-error">
                {errors.rewardValidityDays}
              </p>
            ) : (
              <p className="text-xs text-muted-foreground">
                Leave blank to use the template&apos;s default.
              </p>
            )}
          </div>
          {error && (
            <p className="text-sm text-destructive text-center">{error}</p>
          )}
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => {
              onOpenChange(false);
              resetForm();
            }}
          >
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? 'Creating...' : 'Create Program'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
