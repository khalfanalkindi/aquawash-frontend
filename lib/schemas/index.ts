import { z } from 'zod'

export const phoneSchema = z
  .string()
  .min(8, 'Phone must be at least 8 digits')
  .regex(/^[0-9+\s-]+$/, 'Invalid phone number')

export const customerSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  phone: phoneSchema,
  email: z.string().email().optional().or(z.literal('')),
  type: z.enum(['individual', 'company']).default('individual'),
})

export const branchSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  code: z.string().min(2, 'Code is required'),
  nameAr: z.string().optional(),
  address: z.string().optional(),
  phone: z.string().optional(),
  isActive: z.boolean().default(true),
})

export const checkoutSchema = z.object({
  paymentMethod: z.enum(['cash', 'card', 'transfer']),
  orderTag: z.string().optional(),
  notes: z.string().optional(),
})

export const userSchema = z.object({
  username: z.string().min(2, 'Username is required'),
  fullName: z.string().min(1, 'Full name is required'),
  role: z.enum(['admin', 'holder', 'cashier']),
  branchIds: z.array(z.string()).min(1, 'Select at least one branch'),
  isActive: z.boolean().default(true),
})

export type CustomerFormData = z.infer<typeof customerSchema>
export type BranchFormData = z.infer<typeof branchSchema>
export type CheckoutFormData = z.infer<typeof checkoutSchema>
export type UserFormData = z.infer<typeof userSchema>
