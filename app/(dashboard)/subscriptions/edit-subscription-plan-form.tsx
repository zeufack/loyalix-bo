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
import { Switch } from '@/components/ui/switch';
import {
  updateSubscriptionPlan,
  SubscriptionPlanDto
} from '@/app/api/subscription';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';
import { Pencil } from 'lucide-react';

const featuresSchema = z.object({
  maxPrograms: z.number().int(),
  maxCustomers: z.number().int(),
  maxStaff: z.number().int(),
  promotions: z.boolean(),
  advancedAnalytics: z.boolean(),
  prioritySupport: z.boolean(),
  customBranding: z.boolean()
});

const updatePlanSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  displayName: z.string().min(1, 'Display name is required'),
  description: z.string().optional(),
  monthlyPriceUsd: z.number().min(0, 'Must be >= 0'),
  yearlyPriceUsd: z.number().min(0, 'Must be >= 0'),
  trialDays: z.number().int().min(0).optional(),
  position: z.number().int().min(0).optional(),
  features: featuresSchema,
  stripePriceIdMonthly: z.string().optional(),
  stripePriceIdYearly: z.string().optional(),
  flutterwavePlanIdMonthly: z.string().optional(),
  flutterwavePlanIdYearly: z.string().optional()
});

interface EditSubscriptionPlanFormProps {
  plan: SubscriptionPlanDto;
}

export function EditSubscriptionPlanForm({
  plan
}: EditSubscriptionPlanFormProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    name: plan.name,
    displayName: plan.displayName,
    description: plan.description || '',
    monthlyPriceUsd: Number(plan.monthlyPriceUsd),
    yearlyPriceUsd: Number(plan.yearlyPriceUsd),
    trialDays: plan.trialDays,
    position: plan.position,
    features: {
      maxPrograms: plan.features?.maxPrograms ?? 1,
      maxCustomers: plan.features?.maxCustomers ?? 50,
      maxStaff: plan.features?.maxStaff ?? 1,
      promotions: plan.features?.promotions ?? false,
      advancedAnalytics: plan.features?.advancedAnalytics ?? false,
      prioritySupport: plan.features?.prioritySupport ?? false,
      customBranding: plan.features?.customBranding ?? false
    },
    stripePriceIdMonthly: plan.stripePriceIdMonthly || '',
    stripePriceIdYearly: plan.stripePriceIdYearly || '',
    flutterwavePlanIdMonthly: plan.flutterwavePlanIdMonthly || '',
    flutterwavePlanIdYearly: plan.flutterwavePlanIdYearly || ''
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value, type } = e.target as HTMLInputElement;
    setFormData((prev) => ({
      ...prev,
      [id]: type === 'number' ? Number(value) : value
    }));
    if (errors[id]) setErrors((prev) => ({ ...prev, [id]: '' }));
  };

  const handleFeatureChange = (key: string, value: number | boolean) => {
    setFormData((prev) => ({
      ...prev,
      features: { ...prev.features, [key]: value }
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setErrors({});

    const result = updatePlanSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        const path = err.path.join('.');
        fieldErrors[path] = err.message;
      });
      setErrors(fieldErrors);
      setLoading(false);
      return;
    }

    try {
      await updateSubscriptionPlan(plan.id, formData);
      toast.success('Plan updated successfully');
      queryClient.invalidateQueries({ queryKey: ['subscriptionPlans'] });
      setOpen(false);
    } catch {
      toast.error('Failed to update plan');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="sm" title="Edit plan">
          <Pencil className="h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent className="overflow-y-auto sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Edit Subscription Plan</SheetTitle>
          <SheetDescription>
            Update plan details, pricing, and feature limits
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-4 py-4">
          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Internal Name</Label>
              <Input id="name" value={formData.name} onChange={handleChange} />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name}</p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="displayName">Display Name</Label>
              <Input
                id="displayName"
                value={formData.displayName}
                onChange={handleChange}
              />
              {errors.displayName && (
                <p className="text-sm text-destructive">{errors.displayName}</p>
              )}
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          {/* Pricing */}
          <div className="grid grid-cols-3 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="monthlyPriceUsd">Monthly ($)</Label>
              <Input
                id="monthlyPriceUsd"
                type="number"
                step="0.01"
                value={formData.monthlyPriceUsd}
                onChange={handleChange}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="yearlyPriceUsd">Yearly ($)</Label>
              <Input
                id="yearlyPriceUsd"
                type="number"
                step="0.01"
                value={formData.yearlyPriceUsd}
                onChange={handleChange}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="trialDays">Trial Days</Label>
              <Input
                id="trialDays"
                type="number"
                value={formData.trialDays}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Features */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">Feature Limits</Label>
            <div className="grid grid-cols-3 gap-4">
              <div className="grid gap-2">
                <Label>Max Programs (-1=unlimited)</Label>
                <Input
                  type="number"
                  value={formData.features.maxPrograms}
                  onChange={(e) =>
                    handleFeatureChange('maxPrograms', Number(e.target.value))
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label>Max Customers (-1=unlimited)</Label>
                <Input
                  type="number"
                  value={formData.features.maxCustomers}
                  onChange={(e) =>
                    handleFeatureChange('maxCustomers', Number(e.target.value))
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label>Max Staff (-1=unlimited)</Label>
                <Input
                  type="number"
                  value={formData.features.maxStaff}
                  onChange={(e) =>
                    handleFeatureChange('maxStaff', Number(e.target.value))
                  }
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {(
                [
                  'promotions',
                  'advancedAnalytics',
                  'prioritySupport',
                  'customBranding'
                ] as const
              ).map((key) => (
                <div
                  key={key}
                  className="flex items-center justify-between rounded-lg border p-3"
                >
                  <Label className="capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </Label>
                  <Switch
                    checked={formData.features[key]}
                    onCheckedChange={(checked) =>
                      handleFeatureChange(key, checked)
                    }
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Provider IDs (collapsible) */}
          <details className="space-y-3">
            <summary className="cursor-pointer text-sm font-medium text-muted-foreground">
              Payment Provider IDs (optional)
            </summary>
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="grid gap-2">
                <Label htmlFor="stripePriceIdMonthly">
                  Stripe Monthly Price ID
                </Label>
                <Input
                  id="stripePriceIdMonthly"
                  value={formData.stripePriceIdMonthly}
                  onChange={handleChange}
                  placeholder="price_..."
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="stripePriceIdYearly">
                  Stripe Yearly Price ID
                </Label>
                <Input
                  id="stripePriceIdYearly"
                  value={formData.stripePriceIdYearly}
                  onChange={handleChange}
                  placeholder="price_..."
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="flutterwavePlanIdMonthly">
                  Flutterwave Monthly Plan ID
                </Label>
                <Input
                  id="flutterwavePlanIdMonthly"
                  value={formData.flutterwavePlanIdMonthly}
                  onChange={handleChange}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="flutterwavePlanIdYearly">
                  Flutterwave Yearly Plan ID
                </Label>
                <Input
                  id="flutterwavePlanIdYearly"
                  value={formData.flutterwavePlanIdYearly}
                  onChange={handleChange}
                />
              </div>
            </div>
          </details>

          {/* Position */}
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="position">Display Position</Label>
              <Input
                id="position"
                type="number"
                value={formData.position}
                onChange={handleChange}
              />
            </div>
          </div>
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
