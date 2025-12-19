import { z } from 'zod';

// Business validation schemas
export const businessSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(8, 'Phone number must be at least 8 characters'),
  address: z.string().optional(),
  businessType: z.string().optional()
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
