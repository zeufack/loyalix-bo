'use client';

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
import { useEffect, useState } from 'react';
import { updateLoyaltyProgramRule } from '@/app/api/loyalty-program-rule';
import { LoyaltyProgramRule } from '@/types/loyalty-program-rule';

interface EditLoyaltyProgramRuleFormProps {
  loyaltyProgramRule: LoyaltyProgramRule;
}

export function EditLoyaltyProgramRuleForm({ loyaltyProgramRule }: EditLoyaltyProgramRuleFormProps) {
  const [formData, setFormData] = useState<Partial<LoyaltyProgramRule>>({
    ruleName: '',
    ruleType: '',
    points: 0,
    purchaseAmount: 0,
    loyaltyProgramId: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (loyaltyProgramRule) {
      setFormData({
        ruleName: loyaltyProgramRule.ruleName,
        ruleType: loyaltyProgramRule.ruleType,
        points: loyaltyProgramRule.points,
        purchaseAmount: loyaltyProgramRule.purchaseAmount,
        loyaltyProgramId: loyaltyProgramRule.loyaltyProgramId
      });
    }
  }, [loyaltyProgramRule]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      await updateLoyaltyProgramRule(loyaltyProgramRule.id, formData);
      // Optionally, you can close the dialog and refresh the loyalty program rule list here.
    } catch (error) {
      setError('Failed to update loyalty program rule.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-dots-horizontal"><path d="M8 12h.01"/><path d="M12 12h.01"/><path d="M16 12h.01"/></svg>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Loyalty Program Rule</DialogTitle>
          <DialogDescription>
            Fill in the details below to edit the loyalty program rule.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="ruleName">Rule Name</Label>
            <Input
              id="ruleName"
              className="col-span-3"
              value={formData.ruleName}
              onChange={handleChange}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="ruleType">Rule Type</Label>
            <Input
              id="ruleType"
              className="col-span-3"
              value={formData.ruleType}
              onChange={handleChange}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="points">Points</Label>
            <Input
              id="points"
              type="number"
              className="col-span-3"
              value={formData.points}
              onChange={handleChange}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="purchaseAmount">Purchase Amount</Label>
            <Input
              id="purchaseAmount"
              type="number"
              className="col-span-3"
              value={formData.purchaseAmount}
              onChange={handleChange}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="loyaltyProgramId">Loyalty Program ID</Label>
            <Input
              id="loyaltyProgramId"
              className="col-span-3"
              value={formData.loyaltyProgramId}
              onChange={handleChange}
            />
          </div>
          {error && <p className="text-red-500">{error}</p>}
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? 'Updating...' : 'Update'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

