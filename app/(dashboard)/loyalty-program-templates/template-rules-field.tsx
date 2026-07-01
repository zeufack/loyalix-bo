'use client';

import { useQuery } from '@tanstack/react-query';
import { ArrowDown, ArrowUp, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { getRuleTypes } from '@/app/api/rule-type';
import { getRewardTypes } from '@/app/api/reward-type';
import {
  LoyaltyProgramTemplateRule,
  RewardValue
} from '@/types/loyalty-program-template';

const REWARD_KINDS: { value: RewardValue['type']; label: string }[] = [
  { value: 'free_item', label: 'Free Item' },
  { value: 'discount', label: 'Discount' },
  { value: 'gift_card', label: 'Gift Card' },
  { value: 'points', label: 'Points' }
];

export interface RuleDraft {
  clientKey: string;
  ruleTypeName: string;
  thresholdValue: string;
  isRepeatable: boolean;
  validForDays: string;
  rewardName: string;
  rewardDescription: string;
  rewardTypeName: string;
  rewardKind: RewardValue['type'] | '';
  itemCode: string;
  quantity: string;
  discountPercent: string;
  discountAmount: string;
  pointsValue: string;
}

let ruleKeyCounter = 0;
const nextRuleClientKey = () => `rule-${Date.now()}-${ruleKeyCounter++}`;

export const createEmptyRuleDraft = (): RuleDraft => ({
  clientKey: nextRuleClientKey(),
  ruleTypeName: '',
  thresholdValue: '',
  isRepeatable: false,
  validForDays: '',
  rewardName: '',
  rewardDescription: '',
  rewardTypeName: '',
  rewardKind: 'free_item',
  itemCode: '',
  quantity: '',
  discountPercent: '',
  discountAmount: '',
  pointsValue: ''
});

export const ruleDraftFromRule = (
  rule: LoyaltyProgramTemplateRule
): RuleDraft => {
  const rv = rule.rewardValue as RewardValue | undefined;
  return {
    clientKey: rule.id,
    ruleTypeName: rule.ruleTypeName,
    thresholdValue: String(rule.thresholdValue),
    isRepeatable: rule.isRepeatable,
    validForDays: rule.validForDays != null ? String(rule.validForDays) : '',
    rewardName: rule.rewardName,
    rewardDescription: rule.rewardDescription || '',
    rewardTypeName: rule.rewardTypeName,
    rewardKind: rv?.type || 'free_item',
    itemCode: rv?.itemCode || '',
    quantity: rv?.quantity != null ? String(rv.quantity) : '',
    discountPercent:
      rv?.discountPercent != null ? String(rv.discountPercent) : '',
    discountAmount:
      rv?.discountAmount != null ? String(rv.discountAmount) : '',
    pointsValue: rv?.pointsValue != null ? String(rv.pointsValue) : ''
  };
};

const buildRewardValue = (draft: RuleDraft): RewardValue => {
  switch (draft.rewardKind) {
    case 'discount':
      return {
        type: 'discount',
        ...(draft.discountPercent.trim()
          ? { discountPercent: Number(draft.discountPercent) }
          : {}),
        ...(draft.discountAmount.trim()
          ? { discountAmount: Number(draft.discountAmount) }
          : {})
      };
    case 'gift_card':
      return {
        type: 'gift_card',
        ...(draft.discountAmount.trim()
          ? { discountAmount: Number(draft.discountAmount) }
          : {})
      };
    case 'points':
      return {
        type: 'points',
        ...(draft.pointsValue.trim()
          ? { pointsValue: Number(draft.pointsValue) }
          : {})
      };
    case 'free_item':
    default:
      return {
        type: 'free_item',
        itemCode: draft.itemCode.trim(),
        ...(draft.quantity.trim() ? { quantity: Number(draft.quantity) } : {})
      };
  }
};

/** Converts a rule draft into the shape the create/update DTOs expect. */
export const ruleDraftToPayload = (draft: RuleDraft, position: number) => ({
  ruleTypeName: draft.ruleTypeName,
  thresholdValue: Number(draft.thresholdValue),
  isRepeatable: draft.isRepeatable,
  position,
  validForDays: draft.validForDays.trim()
    ? Number(draft.validForDays)
    : null,
  rewardName: draft.rewardName.trim(),
  rewardDescription: draft.rewardDescription.trim() || undefined,
  rewardTypeName: draft.rewardTypeName,
  rewardValue: buildRewardValue(draft)
});

interface TemplateRulesFieldProps {
  rules: RuleDraft[];
  onChange: (rules: RuleDraft[]) => void;
  errors?: Record<number, Record<string, string>>;
  enabled?: boolean;
}

export function TemplateRulesField({
  rules,
  onChange,
  errors = {},
  enabled = true
}: TemplateRulesFieldProps) {
  const { data: ruleTypesData } = useQuery({
    queryKey: ['rule-types-all'],
    queryFn: () => getRuleTypes({ limit: 100 }),
    enabled
  });
  const { data: rewardTypesData } = useQuery({
    queryKey: ['reward-types-all'],
    queryFn: () => getRewardTypes({ limit: 100 }),
    enabled
  });
  const ruleTypes = ruleTypesData?.data || [];
  const rewardTypes = rewardTypesData?.data || [];

  const updateRule = (index: number, patch: Partial<RuleDraft>) => {
    onChange(
      rules.map((rule, i) => (i === index ? { ...rule, ...patch } : rule))
    );
  };

  const removeRule = (index: number) => {
    onChange(rules.filter((_, i) => i !== index));
  };

  const moveRule = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= rules.length) return;
    const next = [...rules];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  };

  const addRule = () => {
    onChange([...rules, createEmptyRuleDraft()]);
  };

  return (
    <div className="grid gap-3">
      {rules.map((rule, index) => {
        const ruleErrors = errors[index] || {};
        return (
          <Card key={rule.clientKey}>
            <CardContent className="grid gap-3 pt-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Rule {index + 1}</span>
                <div className="flex items-center gap-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    disabled={index === 0}
                    onClick={() => moveRule(index, -1)}
                  >
                    <ArrowUp className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    disabled={index === rules.length - 1}
                    onClick={() => moveRule(index, 1)}
                  >
                    <ArrowDown className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-destructive"
                    onClick={() => removeRule(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="grid gap-1">
                  <Label>Rule Type *</Label>
                  <Select
                    value={rule.ruleTypeName}
                    onValueChange={(value) =>
                      updateRule(index, { ruleTypeName: value })
                    }
                  >
                    <SelectTrigger
                      className={
                        ruleErrors.ruleTypeName ? 'border-border-error' : ''
                      }
                    >
                      <SelectValue placeholder="Select rule type" />
                    </SelectTrigger>
                    <SelectContent>
                      {ruleTypes.map((rt) => (
                        <SelectItem key={rt.id} value={rt.name}>
                          {rt.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {ruleErrors.ruleTypeName && (
                    <p className="text-sm text-foreground-error">
                      {ruleErrors.ruleTypeName}
                    </p>
                  )}
                </div>

                <div className="grid gap-1">
                  <Label>Threshold *</Label>
                  <Input
                    type="number"
                    min={1}
                    value={rule.thresholdValue}
                    onChange={(e) =>
                      updateRule(index, { thresholdValue: e.target.value })
                    }
                    className={
                      ruleErrors.thresholdValue ? 'border-border-error' : ''
                    }
                  />
                  {ruleErrors.thresholdValue && (
                    <p className="text-sm text-foreground-error">
                      {ruleErrors.thresholdValue}
                    </p>
                  )}
                </div>

                <div className="grid gap-1">
                  <Label>Valid For (days)</Label>
                  <Input
                    type="number"
                    min={1}
                    placeholder="Never expires"
                    value={rule.validForDays}
                    onChange={(e) =>
                      updateRule(index, { validForDays: e.target.value })
                    }
                  />
                </div>

                <div className="flex items-center justify-between rounded-md border px-3">
                  <Label htmlFor={`repeatable-${rule.clientKey}`}>
                    Repeatable
                  </Label>
                  <Switch
                    id={`repeatable-${rule.clientKey}`}
                    checked={rule.isRepeatable}
                    onCheckedChange={(checked) =>
                      updateRule(index, { isRepeatable: checked })
                    }
                  />
                </div>
              </div>

              <div className="grid gap-1">
                <Label>Reward Name *</Label>
                <Input
                  value={rule.rewardName}
                  onChange={(e) =>
                    updateRule(index, { rewardName: e.target.value })
                  }
                  className={
                    ruleErrors.rewardName ? 'border-border-error' : ''
                  }
                />
                {ruleErrors.rewardName && (
                  <p className="text-sm text-foreground-error">
                    {ruleErrors.rewardName}
                  </p>
                )}
              </div>

              <div className="grid gap-1">
                <Label>Reward Description</Label>
                <Textarea
                  rows={2}
                  value={rule.rewardDescription}
                  onChange={(e) =>
                    updateRule(index, { rewardDescription: e.target.value })
                  }
                />
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="grid gap-1">
                  <Label>Reward Type *</Label>
                  <Select
                    value={rule.rewardTypeName}
                    onValueChange={(value) =>
                      updateRule(index, { rewardTypeName: value })
                    }
                  >
                    <SelectTrigger
                      className={
                        ruleErrors.rewardTypeName ? 'border-border-error' : ''
                      }
                    >
                      <SelectValue placeholder="Select reward type" />
                    </SelectTrigger>
                    <SelectContent>
                      {rewardTypes.map((rt) => (
                        <SelectItem key={rt.id} value={rt.name}>
                          {rt.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {ruleErrors.rewardTypeName && (
                    <p className="text-sm text-foreground-error">
                      {ruleErrors.rewardTypeName}
                    </p>
                  )}
                </div>

                <div className="grid gap-1">
                  <Label>Reward Value Kind *</Label>
                  <Select
                    value={rule.rewardKind}
                    onValueChange={(value) =>
                      updateRule(index, {
                        rewardKind: value as RewardValue['type']
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select reward kind" />
                    </SelectTrigger>
                    <SelectContent>
                      {REWARD_KINDS.map((kind) => (
                        <SelectItem key={kind.value} value={kind.value}>
                          {kind.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {rule.rewardKind === 'free_item' && (
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="grid gap-1">
                    <Label>Item Code *</Label>
                    <Input
                      value={rule.itemCode}
                      onChange={(e) =>
                        updateRule(index, { itemCode: e.target.value })
                      }
                      className={
                        ruleErrors.itemCode ? 'border-border-error' : ''
                      }
                    />
                    {ruleErrors.itemCode && (
                      <p className="text-sm text-foreground-error">
                        {ruleErrors.itemCode}
                      </p>
                    )}
                  </div>
                  <div className="grid gap-1">
                    <Label>Quantity</Label>
                    <Input
                      type="number"
                      min={1}
                      value={rule.quantity}
                      onChange={(e) =>
                        updateRule(index, { quantity: e.target.value })
                      }
                    />
                  </div>
                </div>
              )}

              {rule.rewardKind === 'discount' && (
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="grid gap-1">
                    <Label>Discount Percent</Label>
                    <Input
                      type="number"
                      min={1}
                      max={100}
                      value={rule.discountPercent}
                      onChange={(e) =>
                        updateRule(index, { discountPercent: e.target.value })
                      }
                      className={
                        ruleErrors.discountPercent ? 'border-border-error' : ''
                      }
                    />
                  </div>
                  <div className="grid gap-1">
                    <Label>Discount Amount</Label>
                    <Input
                      type="number"
                      min={0.01}
                      step="0.01"
                      value={rule.discountAmount}
                      onChange={(e) =>
                        updateRule(index, { discountAmount: e.target.value })
                      }
                    />
                  </div>
                  {ruleErrors.discountPercent && (
                    <p className="text-sm text-foreground-error sm:col-span-2">
                      {ruleErrors.discountPercent}
                    </p>
                  )}
                </div>
              )}

              {rule.rewardKind === 'gift_card' && (
                <div className="grid gap-1">
                  <Label>Gift Card Amount *</Label>
                  <Input
                    type="number"
                    min={0.01}
                    step="0.01"
                    value={rule.discountAmount}
                    onChange={(e) =>
                      updateRule(index, { discountAmount: e.target.value })
                    }
                    className={
                      ruleErrors.discountAmount ? 'border-border-error' : ''
                    }
                  />
                  {ruleErrors.discountAmount && (
                    <p className="text-sm text-foreground-error">
                      {ruleErrors.discountAmount}
                    </p>
                  )}
                </div>
              )}

              {rule.rewardKind === 'points' && (
                <div className="grid gap-1">
                  <Label>Points Value *</Label>
                  <Input
                    type="number"
                    min={1}
                    value={rule.pointsValue}
                    onChange={(e) =>
                      updateRule(index, { pointsValue: e.target.value })
                    }
                    className={
                      ruleErrors.pointsValue ? 'border-border-error' : ''
                    }
                  />
                  {ruleErrors.pointsValue && (
                    <p className="text-sm text-foreground-error">
                      {ruleErrors.pointsValue}
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}

      <Button
        type="button"
        variant="outline"
        size="sm"
        className="justify-self-start"
        onClick={addRule}
      >
        <Plus className="mr-2 h-4 w-4" />
        Add Rule
      </Button>
    </div>
  );
}
