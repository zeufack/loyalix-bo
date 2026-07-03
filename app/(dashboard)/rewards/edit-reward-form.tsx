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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useEffect, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { updateReward } from '@/app/api/reward';
import { getBusinesses } from '@/app/api/business';
import { getRewardTypes } from '@/app/api/reward-type';
import { getApiErrorMessage } from '@/lib/api-error';
import { Reward, RewardValue, RewardValueType } from '@/types/reward';

interface EditRewardFormProps {
  reward: Reward;
}

const VALUE_TYPES: { value: RewardValueType; label: string }[] = [
  { value: 'free_item', label: 'Free item' },
  { value: 'discount', label: 'Discount' },
  { value: 'gift_card', label: 'Gift card' },
  { value: 'points', label: 'Points' }
];

const toNum = (v: string): number | undefined =>
  v.trim() === '' ? undefined : Number(v);

const numStr = (v?: number): string =>
  v === undefined || v === null ? '' : String(v);

export function EditRewardForm({ reward }: EditRewardFormProps) {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [businessId, setBusinessId] = useState('');
  const [rewardTypeId, setRewardTypeId] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isActive, setIsActive] = useState(true);

  const [valueType, setValueType] = useState<RewardValueType | ''>('');
  const [itemCode, setItemCode] = useState('');
  const [quantity, setQuantity] = useState('');
  const [discountPercent, setDiscountPercent] = useState('');
  const [discountAmount, setDiscountAmount] = useState('');
  const [pointsValue, setPointsValue] = useState('');

  const { data: businesses } = useQuery({
    queryKey: ['business', 'all'],
    queryFn: () => getBusinesses({ page: 1, limit: 100 })
  });
  const { data: rewardTypes } = useQuery({
    queryKey: ['reward-type', 'all'],
    queryFn: () => getRewardTypes({ page: 1, limit: 100 })
  });

  useEffect(() => {
    if (!reward) return;
    setBusinessId(reward.business?.id ?? '');
    setRewardTypeId(reward.rewardType?.id ?? '');
    setName(reward.name ?? '');
    setDescription(reward.description ?? '');
    setIsActive(reward.isActive ?? true);

    const value = reward.value;
    setValueType(value?.type ?? '');
    setItemCode(value?.itemCode ?? '');
    setQuantity(numStr(value?.quantity));
    setDiscountPercent(numStr(value?.discountPercent));
    setDiscountAmount(numStr(value?.discountAmount));
    setPointsValue(numStr(value?.pointsValue));
  }, [reward]);

  const buildValue = (type: RewardValueType): RewardValue => {
    switch (type) {
      case 'free_item':
        return { type, itemCode: itemCode || undefined, quantity: toNum(quantity) };
      case 'discount':
        return {
          type,
          discountPercent: toNum(discountPercent),
          discountAmount: toNum(discountAmount)
        };
      case 'gift_card':
        return { type, discountAmount: toNum(discountAmount) };
      case 'points':
        return { type, pointsValue: toNum(pointsValue) };
    }
  };

  const handleSubmit = async () => {
    setError(null);
    if (!businessId || !name.trim() || !valueType) {
      setError('Business, name and value type are required.');
      return;
    }
    setLoading(true);
    try {
      await updateReward(reward.id, {
        businessId,
        rewardTypeId: rewardTypeId || undefined,
        name: name.trim(),
        description: description.trim() || undefined,
        value: buildValue(valueType),
        isActive
      });
      queryClient.invalidateQueries({ queryKey: ['rewards'] });
      toast.success('Reward updated successfully');
      setOpen(false);
    } catch (error) {
      setError(getApiErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-dots-horizontal"
          >
            <path d="M8 12h.01" />
            <path d="M12 12h.01" />
            <path d="M16 12h.01" />
          </svg>
        </Button>
      </SheetTrigger>
      <SheetContent className="overflow-y-auto sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Edit Reward</SheetTitle>
          <SheetDescription>
            Fill in the details below to edit the reward.
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="businessId">Business</Label>
            <Select value={businessId} onValueChange={setBusinessId}>
              <SelectTrigger>
                <SelectValue placeholder="Select a business" />
              </SelectTrigger>
              <SelectContent>
                {businesses?.data?.map((business) => (
                  <SelectItem key={business.id} value={business.id}>
                    {business.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="rewardTypeId">Reward Type</Label>
            <Select value={rewardTypeId} onValueChange={setRewardTypeId}>
              <SelectTrigger>
                <SelectValue placeholder="Select a reward type (optional)" />
              </SelectTrigger>
              <SelectContent>
                {rewardTypes?.data?.map((rewardType) => (
                  <SelectItem key={rewardType.id} value={rewardType.id}>
                    {rewardType.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="valueType">Value Type</Label>
            <Select
              value={valueType}
              onValueChange={(v) => setValueType(v as RewardValueType)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a value type" />
              </SelectTrigger>
              <SelectContent>
                {VALUE_TYPES.map((t) => (
                  <SelectItem key={t.value} value={t.value}>
                    {t.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {valueType === 'free_item' && (
            <>
              <div className="grid gap-2">
                <Label htmlFor="itemCode">Item Code</Label>
                <Input
                  id="itemCode"
                  value={itemCode}
                  onChange={(e) => setItemCode(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="quantity">Quantity</Label>
                <Input
                  id="quantity"
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                />
              </div>
            </>
          )}

          {valueType === 'discount' && (
            <>
              <div className="grid gap-2">
                <Label htmlFor="discountPercent">Discount Percent</Label>
                <Input
                  id="discountPercent"
                  type="number"
                  value={discountPercent}
                  onChange={(e) => setDiscountPercent(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="discountAmount">Discount Amount</Label>
                <Input
                  id="discountAmount"
                  type="number"
                  value={discountAmount}
                  onChange={(e) => setDiscountAmount(e.target.value)}
                />
              </div>
            </>
          )}

          {valueType === 'gift_card' && (
            <div className="grid gap-2">
              <Label htmlFor="discountAmount">Amount</Label>
              <Input
                id="discountAmount"
                type="number"
                value={discountAmount}
                onChange={(e) => setDiscountAmount(e.target.value)}
              />
            </div>
          )}

          {valueType === 'points' && (
            <div className="grid gap-2">
              <Label htmlFor="pointsValue">Points Value</Label>
              <Input
                id="pointsValue"
                type="number"
                value={pointsValue}
                onChange={(e) => setPointsValue(e.target.value)}
              />
            </div>
          )}

          <div className="flex items-center gap-2">
            <Switch
              id="isActive"
              checked={isActive}
              onCheckedChange={setIsActive}
            />
            <Label htmlFor="isActive">Active</Label>
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}
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
