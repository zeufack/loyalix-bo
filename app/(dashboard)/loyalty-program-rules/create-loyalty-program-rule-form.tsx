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
import { useState } from 'react';
import { createLoyaltyProgramRule } from '@/app/api/loyalty-program-rule';

export function CreateLoyaltyProgramRuleForm() {
  const [formData, setFormData] = useState({
    ruleName: '',
    ruleType: '',
    points: 0,
    purchaseAmount: 0,
    loyaltyProgramId: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      await createLoyaltyProgramRule(formData);
      // Optionally, you can close the dialog and refresh the loyalty program rule list here.
    } catch (error) {
      setError('Failed to create loyalty program rule.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Create Loyalty Program Rule</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Loyalty Program Rule</DialogTitle>
          <DialogDescription>
            Fill in the details below to create a new loyalty program rule.
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
            {loading ? 'Creating...' : 'Create'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
