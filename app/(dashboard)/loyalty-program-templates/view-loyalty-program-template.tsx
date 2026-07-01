'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import {
  LoyaltyProgramTemplate,
  RewardValue
} from '@/types/loyalty-program-template';
import { formatCurrency, formatSlugLabel, getLucideIcon } from '@/lib/utils';

const formatRewardValue = (value: RewardValue): string => {
  switch (value.type) {
    case 'discount':
      if (value.discountPercent != null) return `${value.discountPercent}% off`;
      if (value.discountAmount != null)
        return `${formatCurrency(value.discountAmount)} off`;
      return 'Discount';
    case 'free_item':
      return value.quantity && value.quantity > 1
        ? `${value.quantity}x ${value.itemCode ?? 'item'} free`
        : `Free ${value.itemCode ?? 'item'}`;
    case 'gift_card':
      return value.discountAmount != null
        ? `${formatCurrency(value.discountAmount)} gift card`
        : 'Gift card';
    case 'points':
      return value.pointsValue != null
        ? `${value.pointsValue} points`
        : 'Points';
    default:
      return formatSlugLabel(value.type);
  }
};

interface ViewLoyaltyProgramTemplateProps {
  template: LoyaltyProgramTemplate;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ViewLoyaltyProgramTemplate({
  template,
  open,
  onOpenChange
}: ViewLoyaltyProgramTemplateProps) {
  const TemplateIcon = getLucideIcon(template.icon);
  const sortedRules = [...template.rules].sort(
    (a, b) => a.position - b.position
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <TemplateIcon className="h-5 w-5 text-muted-foreground" />
            {template.name}
          </DialogTitle>
          <DialogDescription>
            Template key: <span className="font-mono">{template.key}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-2">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant={template.isActive ? 'default' : 'secondary'}>
              {template.isActive ? 'Active' : 'Inactive'}
            </Badge>
            {template.isFeatured && <Badge variant="outline">Featured</Badge>}
          </div>

          {template.description && (
            <div className="grid gap-1">
              <Label className="text-muted-foreground">Description</Label>
              <p className="text-sm">{template.description}</p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-1">
              <Label className="text-muted-foreground">Recommended For</Label>
              <div className="flex flex-wrap gap-1">
                {template.recommendedBusinessTypes &&
                template.recommendedBusinessTypes.length > 0 ? (
                  template.recommendedBusinessTypes.map((type) => (
                    <Badge key={type} variant="secondary">
                      {formatSlugLabel(type)}
                    </Badge>
                  ))
                ) : (
                  <Badge variant="secondary">Universal</Badge>
                )}
              </div>
            </div>
            <div className="grid gap-1">
              <Label className="text-muted-foreground">Reward Validity</Label>
              <span className="text-sm">
                {template.rewardValidityDays != null
                  ? `${template.rewardValidityDays} days`
                  : 'Never expires'}
              </span>
            </div>
          </div>

          <Separator />

          <div className="grid gap-3">
            <Label className="text-muted-foreground">
              Rules ({sortedRules.length})
            </Label>
            {sortedRules.length === 0 && (
              <p className="text-sm text-muted-foreground">No rules.</p>
            )}
            {sortedRules.map((rule, index) => (
              <div
                key={rule.id}
                className="rounded-md border p-3 text-sm space-y-1"
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">
                    {index + 1}. {formatSlugLabel(rule.ruleTypeName)} &ge;{' '}
                    {rule.thresholdValue}
                  </span>
                  {rule.isRepeatable && (
                    <Badge variant="outline">Repeatable</Badge>
                  )}
                </div>
                <p className="text-muted-foreground">
                  Reward: {rule.rewardName} &mdash;{' '}
                  {formatRewardValue(rule.rewardValue)} (
                  {formatSlugLabel(rule.rewardTypeName)})
                </p>
                {rule.rewardDescription && (
                  <p className="text-muted-foreground">
                    {rule.rewardDescription}
                  </p>
                )}
                <p className="text-xs text-muted-foreground">
                  Valid for{' '}
                  {rule.validForDays != null
                    ? `${rule.validForDays} days`
                    : 'no expiry'}
                </p>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
