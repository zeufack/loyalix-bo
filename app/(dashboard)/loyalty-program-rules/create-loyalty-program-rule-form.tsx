'use client';

import AddItemButton from '@/components/ui/add-item-btn';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { createLoyaltyProgramRule } from '@/app/api/loyalty-program-rule';
import { getLoyaltyPrograms } from '@/app/api/loyalty-program';
import { getRewards } from '@/app/api/reward';
import { getRuleTypes } from '@/app/api/rule-type';
import { getApiErrorMessage } from '@/lib/api-error';

export function CreateLoyaltyProgramRuleForm() {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    programId: '',
    rewardId: '',
    ruleTypeId: '',
    thresholdValue: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  const handleSubmit = async () => {
    setError(null);
    if (!formData.programId || !formData.rewardId) {
      setError('Program and reward are required.');
      return;
    }
    setLoading(true);
    try {
      await createLoyaltyProgramRule({
        programId: formData.programId,
        rewardId: formData.rewardId,
        ruleTypeId: formData.ruleTypeId || undefined,
        thresholdValue: formData.thresholdValue
          ? Number(formData.thresholdValue)
          : undefined
      });
      queryClient.invalidateQueries({ queryKey: ['loyalty-program-rules'] });
      toast.success('Loyalty program rule created successfully');
      setFormData({
        programId: '',
        rewardId: '',
        ruleTypeId: '',
        thresholdValue: ''
      });
      setOpen(false);
    } catch (error) {
      setError(getApiErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <AddItemButton title="Create Loyalty Program Rule" />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Loyalty Program Rule</DialogTitle>
          <DialogDescription>
            Fill in the details below to create a new loyalty program rule.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="programId">Loyalty Program</Label>
            <Select
              value={formData.programId}
              onValueChange={(value) =>
                setFormData({ ...formData, programId: value })
              }
            >
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
            <Select
              value={formData.rewardId}
              onValueChange={(value) =>
                setFormData({ ...formData, rewardId: value })
              }
            >
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
            <Select
              value={formData.ruleTypeId}
              onValueChange={(value) =>
                setFormData({ ...formData, ruleTypeId: value })
              }
            >
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
              value={formData.thresholdValue}
              onChange={(e) =>
                setFormData({ ...formData, thresholdValue: e.target.value })
              }
            />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
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
