'use client';

import { useQuery } from '@tanstack/react-query';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { getBusinessTypes } from '@/app/api/business-type';
import { getLucideIcon } from '@/lib/utils';

export interface TemplateMetadataDraft {
  key: string;
  name: string;
  description: string;
  icon: string;
  recommendedBusinessTypes: string[];
  rewardValidityDays: string;
  isFeatured: boolean;
  isActive: boolean;
}

export const createEmptyMetadataDraft = (): TemplateMetadataDraft => ({
  key: '',
  name: '',
  description: '',
  icon: '',
  recommendedBusinessTypes: [],
  rewardValidityDays: '',
  isFeatured: false,
  isActive: true
});

interface TemplateMetadataFieldsProps {
  value: TemplateMetadataDraft;
  onChange: (value: TemplateMetadataDraft) => void;
  errors?: Record<string, string>;
  enabled?: boolean;
}

export function TemplateMetadataFields({
  value,
  onChange,
  errors = {},
  enabled = true
}: TemplateMetadataFieldsProps) {
  const { data: businessTypesData } = useQuery({
    queryKey: ['business-types-all'],
    queryFn: () => getBusinessTypes({ limit: 100 }),
    enabled
  });
  const businessTypes = businessTypesData?.data || [];

  const set = (patch: Partial<TemplateMetadataDraft>) =>
    onChange({ ...value, ...patch });

  const toggleBusinessType = (name: string, checked: boolean) => {
    set({
      recommendedBusinessTypes: checked
        ? [...value.recommendedBusinessTypes, name]
        : value.recommendedBusinessTypes.filter((n) => n !== name)
    });
  };

  const IconPreview = getLucideIcon(value.icon || null);

  return (
    <div className="grid gap-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="grid gap-1">
          <Label htmlFor="key">Key *</Label>
          <Input
            id="key"
            placeholder="coffee-punch-card"
            value={value.key}
            onChange={(e) => set({ key: e.target.value })}
            className={errors.key ? 'border-border-error' : ''}
          />
          {errors.key && (
            <p className="text-sm text-foreground-error">{errors.key}</p>
          )}
        </div>
        <div className="grid gap-1">
          <Label htmlFor="name">Name *</Label>
          <Input
            id="name"
            placeholder="Coffee Punch Card"
            value={value.name}
            onChange={(e) => set({ name: e.target.value })}
            className={errors.name ? 'border-border-error' : ''}
          />
          {errors.name && (
            <p className="text-sm text-foreground-error">{errors.name}</p>
          )}
        </div>
      </div>

      <div className="grid gap-1">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          placeholder="Classic buy-10-get-1-free stamp card."
          value={value.description}
          onChange={(e) => set({ description: e.target.value })}
          rows={2}
        />
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="grid gap-1">
          <Label htmlFor="icon">Icon</Label>
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border">
              <IconPreview className="h-4 w-4 text-muted-foreground" />
            </div>
            <Input
              id="icon"
              placeholder="coffee"
              value={value.icon}
              onChange={(e) => set({ icon: e.target.value })}
            />
          </div>
          <p className="text-xs text-muted-foreground">
            A Lucide icon name in kebab-case, e.g. &quot;shopping-bag&quot;.
          </p>
        </div>
        <div className="grid gap-1">
          <Label htmlFor="rewardValidityDays">Reward Validity (days)</Label>
          <Input
            id="rewardValidityDays"
            type="number"
            min={1}
            placeholder="Never expires"
            value={value.rewardValidityDays}
            onChange={(e) => set({ rewardValidityDays: e.target.value })}
            className={
              errors.rewardValidityDays ? 'border-border-error' : ''
            }
          />
          {errors.rewardValidityDays && (
            <p className="text-sm text-foreground-error">
              {errors.rewardValidityDays}
            </p>
          )}
        </div>
      </div>

      <div className="grid gap-1">
        <Label>Recommended Business Types</Label>
        <div className="max-h-40 overflow-y-auto rounded-md border p-3 grid gap-2">
          {businessTypes.length === 0 && (
            <p className="text-sm text-muted-foreground">
              No business types found.
            </p>
          )}
          {businessTypes.map((type) => (
            <div key={type.id} className="flex items-center gap-2">
              <Checkbox
                id={`biz-type-${type.id}`}
                checked={value.recommendedBusinessTypes.includes(type.name)}
                onCheckedChange={(checked) =>
                  toggleBusinessType(type.name, checked === true)
                }
              />
              <Label
                htmlFor={`biz-type-${type.id}`}
                className="font-normal cursor-pointer"
              >
                {type.name}
              </Label>
            </div>
          ))}
        </div>
        <p className="text-xs text-muted-foreground">
          Leave all unchecked to make this a universal template.
        </p>
      </div>

      <div className="flex items-center justify-between rounded-md border px-3 py-2">
        <Label htmlFor="isFeatured">Featured</Label>
        <Switch
          id="isFeatured"
          checked={value.isFeatured}
          onCheckedChange={(checked) => set({ isFeatured: checked })}
        />
      </div>
      <div className="flex items-center justify-between rounded-md border px-3 py-2">
        <Label htmlFor="isActive">Active</Label>
        <Switch
          id="isActive"
          checked={value.isActive}
          onCheckedChange={(checked) => set({ isActive: checked })}
        />
      </div>
    </div>
  );
}
