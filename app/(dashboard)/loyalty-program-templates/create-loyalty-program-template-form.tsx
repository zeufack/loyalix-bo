'use client';

import { useState } from 'react';
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
import AddItemButton from '@/components/ui/add-item-btn';
import { createLoyaltyProgramTemplate } from '@/app/api/loyalty-program-templates';
import { LoyaltyProgramTemplate } from '@/types/loyalty-program-template';
import { useEntityForm } from '@/hooks/use-entity-form';
import { loyaltyProgramTemplateSchema } from '@/lib/validations';
import type { CreateLoyaltyProgramTemplateDto } from '@loyal-ix/loyalix-shared-types';
import {
  TemplateMetadataFields,
  TemplateMetadataDraft,
  createEmptyMetadataDraft
} from './template-metadata-fields';
import {
  TemplateRulesField,
  RuleDraft,
  createEmptyRuleDraft,
  ruleDraftToPayload
} from './template-rules-field';

export function CreateLoyaltyProgramTemplateForm() {
  const [open, setOpen] = useState(false);
  const [metadata, setMetadata] = useState<TemplateMetadataDraft>(
    createEmptyMetadataDraft()
  );
  const [rules, setRules] = useState<RuleDraft[]>([createEmptyRuleDraft()]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [ruleErrors, setRuleErrors] = useState<
    Record<number, Record<string, string>>
  >({});

  const { loading, error, setError, handleCreate } = useEntityForm<
    LoyaltyProgramTemplate,
    CreateLoyaltyProgramTemplateDto
  >({
    createEntity: createLoyaltyProgramTemplate,
    queryKey: 'loyalty-program-templates',
    successMessage: 'Loyalty program template created successfully'
  });

  const resetForm = () => {
    setMetadata(createEmptyMetadataDraft());
    setRules([createEmptyRuleDraft()]);
    setErrors({});
    setRuleErrors({});
    setError(null);
  };

  const buildPayload = (): CreateLoyaltyProgramTemplateDto => ({
    key: metadata.key.trim(),
    name: metadata.name.trim(),
    description: metadata.description.trim() || undefined,
    recommendedBusinessTypes: metadata.recommendedBusinessTypes,
    rewardValidityDays: metadata.rewardValidityDays.trim()
      ? Number(metadata.rewardValidityDays)
      : null,
    icon: metadata.icon.trim() || undefined,
    isFeatured: metadata.isFeatured,
    isActive: metadata.isActive,
    rules: rules.map((rule, index) => ruleDraftToPayload(rule, index))
  });

  const validate = () => {
    const result = loyaltyProgramTemplateSchema.safeParse(buildPayload());
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      const nextRuleErrors: Record<number, Record<string, string>> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0] === 'rules' && typeof err.path[1] === 'number') {
          const index = err.path[1];
          const fieldKey = String(err.path[err.path.length - 1]);
          nextRuleErrors[index] = {
            ...nextRuleErrors[index],
            [fieldKey]: err.message
          };
        } else if (err.path[0]) {
          fieldErrors[String(err.path[0])] = err.message;
        }
      });
      setErrors(fieldErrors);
      setRuleErrors(nextRuleErrors);
      return 'Please fix the highlighted fields';
    }
    setErrors({});
    setRuleErrors({});
    return null;
  };

  const handleSubmit = async () => {
    const result = await handleCreate(buildPayload(), null, validate);
    if (result) {
      resetForm();
      setOpen(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        setOpen(isOpen);
        if (!isOpen) resetForm();
      }}
    >
      <DialogTrigger asChild>
        <AddItemButton title="Create Template" />
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Loyalty Program Template</DialogTitle>
          <DialogDescription>
            Define a reusable, multi-rule blueprint businesses can instantiate
            into their own loyalty program.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          <TemplateMetadataFields
            value={metadata}
            onChange={setMetadata}
            errors={errors}
            enabled={open}
          />
          <div className="grid gap-2">
            <h3 className="text-sm font-medium">Rules</h3>
            {errors.rules && (
              <p className="text-sm text-foreground-error">{errors.rules}</p>
            )}
            <TemplateRulesField
              rules={rules}
              onChange={setRules}
              errors={ruleErrors}
              enabled={open}
            />
          </div>
          {error && (
            <p className="text-sm text-destructive text-center">{error}</p>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? 'Creating...' : 'Create Template'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
