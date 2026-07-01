'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle
} from '@/components/ui/sheet';
import { updateLoyaltyProgramTemplate } from '@/app/api/loyalty-program-templates';
import { LoyaltyProgramTemplate } from '@/types/loyalty-program-template';
import { useEntityForm } from '@/hooks/use-entity-form';
import { loyaltyProgramTemplateSchema } from '@/lib/validations';
import type { UpdateLoyaltyProgramTemplateDto } from '@loyal-ix/loyalix-shared-types';
import {
  TemplateMetadataFields,
  TemplateMetadataDraft
} from './template-metadata-fields';
import {
  TemplateRulesField,
  RuleDraft,
  createEmptyRuleDraft,
  ruleDraftFromRule,
  ruleDraftToPayload
} from './template-rules-field';

const metadataFromTemplate = (
  template: LoyaltyProgramTemplate
): TemplateMetadataDraft => ({
  key: template.key,
  name: template.name,
  description: template.description || '',
  icon: template.icon || '',
  recommendedBusinessTypes: template.recommendedBusinessTypes || [],
  rewardValidityDays:
    template.rewardValidityDays != null
      ? String(template.rewardValidityDays)
      : '',
  isFeatured: template.isFeatured,
  isActive: template.isActive
});

interface EditLoyaltyProgramTemplateFormProps {
  template: LoyaltyProgramTemplate;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditLoyaltyProgramTemplateForm({
  template,
  open,
  onOpenChange
}: EditLoyaltyProgramTemplateFormProps) {
  const [metadata, setMetadata] = useState<TemplateMetadataDraft>(
    metadataFromTemplate(template)
  );
  const [rules, setRules] = useState<RuleDraft[]>(
    template.rules.length
      ? [...template.rules]
          .sort((a, b) => a.position - b.position)
          .map(ruleDraftFromRule)
      : [createEmptyRuleDraft()]
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [ruleErrors, setRuleErrors] = useState<
    Record<number, Record<string, string>>
  >({});

  const { loading, error, setError, handleUpdate } = useEntityForm<
    LoyaltyProgramTemplate,
    UpdateLoyaltyProgramTemplateDto
  >({
    createEntity: async () => template,
    updateEntity: updateLoyaltyProgramTemplate,
    queryKey: 'loyalty-program-templates',
    successMessage: 'Loyalty program template updated successfully'
  });

  useEffect(() => {
    if (open) {
      setMetadata(metadataFromTemplate(template));
      setRules(
        template.rules.length
          ? [...template.rules]
              .sort((a, b) => a.position - b.position)
              .map(ruleDraftFromRule)
          : [createEmptyRuleDraft()]
      );
      setErrors({});
      setRuleErrors({});
    }
  }, [open, template]);

  const buildPayload = (): UpdateLoyaltyProgramTemplateDto => ({
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
    const result = await handleUpdate(
      template.id,
      buildPayload(),
      null,
      validate
    );
    if (result) {
      onOpenChange(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="overflow-y-auto sm:max-w-2xl">
        <SheetHeader>
          <SheetTitle>Edit &quot;{template.name}&quot;</SheetTitle>
          <SheetDescription>
            Editing this template does not change programs already instantiated
            from it &mdash; those are independent snapshots.
          </SheetDescription>
        </SheetHeader>
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
        <SheetFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? 'Saving...' : 'Save Changes'}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
