import type { PaymentMethod, User, UserRole } from '@/lib/types'

/** API response shapes — align with Django serializers */

export interface AuthTokens {
  access: string
  refresh: string
}

export interface LoginRequest {
  username: string
  password: string
}

export interface LoginResponse {
  access: string
  refresh: string
  user: ApiUser
}

export interface ApiUser {
  id: number | string
  username: string
  full_name: string
  role: UserRole
  role_id?: number | string | null
  role_name?: string
  is_active: boolean
  branch_ids?: (number | string)[]
  default_branch_id?: number | string | null
  permissions?: string[]
  last_login?: string | null
}

export interface ShopSettingsResponse {
  shop_name: string
  shop_name_ar?: string
  tagline?: string
  phone?: string
  address?: string
  currency: string
  invoice_prefix: string
  receipt_footer?: string
  display_shop_name?: string
}

export interface CreateInvoiceRequest {
  branch_id: string
  customer_phone?: string
  customer_name?: string
  order_tag?: string
  items: {
    product_id: string
    quantity: number
    line_discount?: number
  }[]
  discount: number
  payment_method: PaymentMethod
  notes?: string
  status?: 'pending' | 'completed' | 'cancelled'
}

export function mapApiUserToUser(apiUser: ApiUser): User {
  return {
    id: String(apiUser.id),
    username: apiUser.username,
    fullName: apiUser.full_name,
    role: apiUser.role,
    roleId: apiUser.role_id != null ? String(apiUser.role_id) : undefined,
    isActive: apiUser.is_active,
    branchIds: (apiUser.branch_ids ?? []).map(String),
    defaultBranchId:
      apiUser.default_branch_id != null ? String(apiUser.default_branch_id) : undefined,
    permissionCodes: apiUser.permissions,
  }
}
