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
import { Label } from '@/components/ui/label';
import { useEffect, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { updateLoyaltyProgramRule } from '@/app/api/loyalty-program-rule';
import { getLoyaltyPrograms } from '@/app/api/loyalty-program';
import { getRewards } from '@/app/api/reward';
import { getRuleTypes } from '@/app/api/rule-type';
import { getApiErrorMessage } from '@/lib/api-error';
import { LoyaltyProgramRule } from '@/types/loyalty-program-rule';

interface EditLoyaltyProgramRuleFormProps {
  loyaltyProgramRule: LoyaltyProgramRule;
}

export function EditLoyaltyProgramRuleForm({
  loyaltyProgramRule
}: EditLoyaltyProgramRuleFormProps) {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [programId, setProgramId] = useState('');
  const [rewardId, setRewardId] = useState('');
  const [ruleTypeId, setRuleTypeId] = useState('');
  const [thresholdValue, setThresholdValue] = useState('');

  const { data: programs } = useQuery({
    queryKey: ['loyalty-program', 'all'],
    queryFn: () => getLoyaltyPrograms({ page: 1, limit: 100 })
  });
  const { data: rewards } = useQuery({
    queryKey: ['reward', 'all'],
    queryFn: () => getRewards({ page: 1, limit: 100 })
  });
  const { data: ruleTypes } = useQuery({
    queryKey: ['rule-type', 'all'],
    queryFn: () => getRuleTypes({ page: 1, limit: 100 })
  });

  useEffect(() => {
    if (!loyaltyProgramRule) return;
    setProgramId(loyaltyProgramRule.program?.id ?? '');
    setRewardId(loyaltyProgramRule.reward?.id ?? '');
    setRuleTypeId(loyaltyProgramRule.ruleType?.id ?? '');
    setThresholdValue(
      loyaltyProgramRule.thresholdValue === undefined ||
        loyaltyProgramRule.thresholdValue === null
        ? ''
        : String(loyaltyProgramRule.thresholdValue)
    );
  }, [loyaltyProgramRule]);

  const handleSubmit = async () => {
    setError(null);
    if (!programId || !rewardId) {
      setError('Program and reward are required.');
      return;
    }
    setLoading(true);
    try {
      await updateLoyaltyProgramRule(loyaltyProgramRule.id, {
        programId,
        rewardId,
        ruleTypeId: ruleTypeId || undefined,
        thresholdValue:
          thresholdValue.trim() === '' ? undefined : Number(thresholdValue)
      });
      queryClient.invalidateQueries({ queryKey: ['loyalty-program-rules'] });
      toast.success('Loyalty program rule updated successfully');
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
          <SheetTitle>Edit Loyalty Program Rule</SheetTitle>
          <SheetDescription>
            Fill in the details below to edit the loyalty program rule.
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="programId">Loyalty Program</Label>
            <Select value={programId} onValueChange={setProgramId}>
              <SelectTrigger>
                <SelectValue placeholder="Select a program" />
              </SelectTrigger>
              <SelectContent>
                {programs?.data?.map((program) => (
                  <SelectItem key={program.id} value={program.id}>
                    {program.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="rewardId">Reward</Label>
            <Select value={rewardId} onValueChange={setRewardId}>
              <SelectTrigger>
                <SelectValue placeholder="Select a reward" />
              </SelectTrigger>
              <SelectContent>
                {rewards?.data?.map((reward) => (
                  <SelectItem key={reward.id} value={reward.id}>
                    {reward.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="ruleTypeId">Rule Type</Label>
            <Select value={ruleTypeId} onValueChange={setRuleTypeId}>
              <SelectTrigger>
                <SelectValue placeholder="Select a rule type (optional)" />
              </SelectTrigger>
              <SelectContent>
                {ruleTypes?.data?.map((ruleType) => (
                  <SelectItem key={ruleType.id} value={ruleType.id}>
                    {ruleType.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="thresholdValue">Threshold Value</Label>
            <Input
              id="thresholdValue"
              type="number"
              value={thresholdValue}
              onChange={(e) => setThresholdValue(e.target.value)}
            />
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
