import { z } from 'zod';

// Business validation schemas
export const businessSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  description: z.string().optional(),
  industryType: z.string().min(1, 'Industry type is required'),
  address: z.string().optional(),
  owner: z.string().uuid('Owner must be a valid user')
});

export const createBusinessSchema = businessSchema;
export const updateBusinessSchema = businessSchema.partial();

// User validation schemas
export const userSchema = z.object({
  email: z.string().email('Invalid email address'),
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  phone: z.string().optional(),
  role: z.string().optional()
});

export const createUserSchema = userSchema;
export const updateUserSchema = userSchema.partial().omit({ password: true });

// Customer validation schemas
export const customerSchema = z.object({
  email: z.string().email('Invalid email address'),
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  phone: z.string().optional()
});

export const createCustomerSchema = customerSchema;
export const updateCustomerSchema = customerSchema.partial();

// Loyalty Program validation schemas
export const loyaltyProgramSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  description: z.string().optional(),
  businessId: z.string().min(1, 'Business is required'),
  rewardValidityDays: z
    .number()
    .int()
    .positive('Reward validity must be a positive number of days')
    .nullable()
    .optional(),
  status: z.enum(['active', 'draft', 'archived']).optional()
});

export const createLoyaltyProgramSchema = loyaltyProgramSchema;
export const updateLoyaltyProgramSchema = loyaltyProgramSchema.partial();

// Program Rule validation schemas
export const programRuleSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  description: z.string().optional(),
  loyaltyProgramId: z.string().min(1, 'Loyalty program is required'),
  ruleTypeId: z.string().min(1, 'Rule type is required'),
  rewardTypeId: z.string().min(1, 'Reward type is required'),
  threshold: z.number().min(1, 'Threshold must be at least 1'),
  rewardValue: z.number().min(0, 'Reward value must be non-negative')
});

export const createProgramRuleSchema = programRuleSchema;
export const updateProgramRuleSchema = programRuleSchema.partial();

// Reward validation schemas
export const rewardSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  description: z.string().optional(),
  value: z.number().min(0, 'Value must be non-negative')
});

export const createRewardSchema = rewardSchema;
export const updateRewardSchema = rewardSchema.partial();

// Reward Type validation schemas
export const rewardTypeSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  description: z.string().optional()
});

export const createRewardTypeSchema = rewardTypeSchema;
export const updateRewardTypeSchema = rewardTypeSchema.partial();

// Rule Type validation schemas
export const ruleTypeSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  description: z.string().optional()
});

export const createRuleTypeSchema = ruleTypeSchema;
export const updateRuleTypeSchema = ruleTypeSchema.partial();

// Event Type validation schemas
export const eventTypeSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  description: z.string().optional()
});

export const createEventTypeSchema = eventTypeSchema;
export const updateEventTypeSchema = eventTypeSchema.partial();

// Promotion validation schemas
export const promotionSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  description: z.string().optional(),
  businessId: z.string().min(1, 'Business is required'),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  discountType: z.string().optional(),
  discountValue: z.number().min(0, 'Discount value must be non-negative').optional()
});

export const createPromotionSchema = promotionSchema;
export const updatePromotionSchema = promotionSchema.partial();

// Customer Enrollment validation schemas
export const customerEnrollmentSchema = z.object({
  customerId: z.string().min(1, 'Customer is required'),
  loyaltyProgramId: z.string().min(1, 'Loyalty program is required')
});

export const createCustomerEnrollmentSchema = customerEnrollmentSchema;
export const updateCustomerEnrollmentSchema = customerEnrollmentSchema.partial();

// Loyalty Program Template validation schemas
export const rewardValueSchema = z
  .discriminatedUnion('type', [
    z.object({
      type: z.literal('free_item'),
      itemCode: z.string().min(1, 'Item code is required'),
      quantity: z.number().int().positive().optional()
    }),
    z.object({
      type: z.literal('discount'),
      discountPercent: z.number().positive().max(100).optional(),
      discountAmount: z.number().positive().optional()
    }),
    z.object({
      type: z.literal('gift_card'),
      discountAmount: z.number().positive('Gift card amount is required')
    }),
    z.object({
      type: z.literal('points'),
      pointsValue: z.number().int().positive('Points value is required')
    })
  ])
  .superRefine((value, ctx) => {
    if (
      value.type === 'discount' &&
      value.discountPercent == null &&
      value.discountAmount == null
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Provide a discount percent or amount',
        path: ['discountPercent']
      });
    }
  });

export const templateRuleSchema = z.object({
  ruleTypeName: z.string().min(1, 'Rule type is required'),
  thresholdValue: z.number().positive('Threshold must be greater than 0'),
  isRepeatable: z.boolean().optional(),
  validForDays: z
    .number()
    .int()
    .positive('Valid-for days must be a positive number')
    .nullable()
    .optional(),
  rewardName: z
    .string()
    .min(1, 'Reward name is required')
    .max(255, 'Reward name must be 255 characters or fewer'),
  rewardDescription: z.string().optional(),
  rewardTypeName: z.string().min(1, 'Reward type is required'),
  rewardValue: rewardValueSchema
});

export const loyaltyProgramTemplateSchema = z.object({
  key: z
    .string()
    .min(1, 'Key is required')
    .max(100, 'Key must be 100 characters or fewer')
    .regex(
      /^[a-z0-9-]+$/,
      'Key may only contain lowercase letters, numbers, and hyphens'
    ),
  name: z
    .string()
    .min(1, 'Name is required')
    .max(255, 'Name must be 255 characters or fewer'),
  description: z.string().optional(),
  recommendedBusinessTypes: z.array(z.string()).optional(),
  rewardValidityDays: z
    .number()
    .int()
    .positive('Reward validity must be a positive number of days')
    .nullable()
    .optional(),
  icon: z.string().optional(),
  isFeatured: z.boolean().optional(),
  isActive: z.boolean().optional(),
  rules: z.array(templateRuleSchema).min(1, 'At least one rule is required')
});

export type TemplateRuleFormData = z.infer<typeof templateRuleSchema>;
export type LoyaltyProgramTemplateFormData = z.infer<
  typeof loyaltyProgramTemplateSchema
>;

// Permission validation schemas
export const permissionSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  description: z.string().optional()
});

export const createPermissionSchema = permissionSchema;
export const updatePermissionSchema = permissionSchema.partial();

// Activity validation schemas
export const activitySchema = z.object({
  type: z.string().min(1, 'Type is required'),
  description: z.string().optional(),
  businessId: z.string().optional()
});

export const createActivitySchema = activitySchema;
export const updateActivitySchema = activitySchema.partial();

// Type exports
export type BusinessFormData = z.infer<typeof businessSchema>;
export type UserFormData = z.infer<typeof userSchema>;
export type CustomerFormData = z.infer<typeof customerSchema>;
export type LoyaltyProgramFormData = z.infer<typeof loyaltyProgramSchema>;
export type ProgramRuleFormData = z.infer<typeof programRuleSchema>;
export type RewardFormData = z.infer<typeof rewardSchema>;
export type RewardTypeFormData = z.infer<typeof rewardTypeSchema>;
export type RuleTypeFormData = z.infer<typeof ruleTypeSchema>;
export type EventTypeFormData = z.infer<typeof eventTypeSchema>;
export type PromotionFormData = z.infer<typeof promotionSchema>;
export type CustomerEnrollmentFormData = z.infer<typeof customerEnrollmentSchema>;
export type PermissionFormData = z.infer<typeof permissionSchema>;
export type ActivityFormData = z.infer<typeof activitySchema>;
