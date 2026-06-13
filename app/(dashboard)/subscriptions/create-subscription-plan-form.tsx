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
import { Switch } from '@/components/ui/switch';
import { createSubscriptionPlan } from '@/app/api/subscription';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';

const featuresSchema = z.object({
  maxPrograms: z.number().int(),
  maxCustomers: z.number().int(),
  maxStaff: z.number().int(),
  promotions: z.boolean(),
  advancedAnalytics: z.boolean(),
  prioritySupport: z.boolean(),
  customBranding: z.boolean()
});

const createPlanSchema = z.object({
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

const defaultFormData = {
  name: '',
  displayName: '',
  description: '',
  monthlyPriceUsd: 0,
  yearlyPriceUsd: 0,
  trialDays: 14,
  position: 0,
  features: {
    maxPrograms: 1,
    maxCustomers: 50,
    maxStaff: 1,
    promotions: false,
    advancedAnalytics: false,
    prioritySupport: false,
    customBranding: false
  },
  stripePriceIdMonthly: '',
  stripePriceIdYearly: '',
  flutterwavePlanIdMonthly: '',
  flutterwavePlanIdYearly: ''
};

export function CreateSubscriptionPlanForm() {
  const [formData, setFormData] = useState({ ...defaultFormData });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

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

  const resetForm = () => {
    setFormData({ ...defaultFormData });
    setErrors({});
  };

  const handleSubmit = async () => {
    setLoading(true);
    setErrors({});

    const result = createPlanSchema.safeParse(formData);
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
      // Remove empty strings for optional provider ID fields
      const payload = {
        ...formData,
        stripePriceIdMonthly: formData.stripePriceIdMonthly || undefined,
        stripePriceIdYearly: formData.stripePriceIdYearly || undefined,
        flutterwavePlanIdMonthly:
          formData.flutterwavePlanIdMonthly || undefined,
        flutterwavePlanIdYearly: formData.flutterwavePlanIdYearly || undefined
      };
      await createSubscriptionPlan(payload);
      toast.success('Subscription plan created');
      queryClient.invalidateQueries({ queryKey: ['subscriptionPlans'] });
      resetForm();
      setOpen(false);
    } catch {
      toast.error('Failed to create plan');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <AddItemButton title="Create Plan" />
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Subscription Plan</DialogTitle>
          <DialogDescription>
            Define a new pricing tier with feature limits
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Internal Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="pro"
              />
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
                placeholder="Pro Plan"
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
              placeholder="Best for growing businesses"
            />
          </div>

          {/* Pricing */}
          <div className="grid grid-cols-3 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="monthlyPriceUsd">Monthly Price ($)</Label>
              <Input
                id="monthlyPriceUsd"
                type="number"
                step="0.01"
                value={formData.monthlyPriceUsd}
                onChange={handleChange}
              />
              {errors.monthlyPriceUsd && (
                <p className="text-sm text-destructive">
                  {errors.monthlyPriceUsd}
                </p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="yearlyPriceUsd">Yearly Price ($)</Label>
              <Input
                id="yearlyPriceUsd"
                type="number"
                step="0.01"
                value={formData.yearlyPriceUsd}
                onChange={handleChange}
              />
              {errors.yearlyPriceUsd && (
                <p className="text-sm text-destructive">
                  {errors.yearlyPriceUsd}
                </p>
              )}
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

          {/* Provider IDs */}
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
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? 'Creating...' : 'Create Plan'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
