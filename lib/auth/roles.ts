import type { User, UserRole } from '@/lib/types'

/** Roles allowed in the admin portal (desktop back-office + POS) */
export const ADMIN_PORTAL_ROLES: UserRole[] = ['admin', 'cashier']

/** Roles allowed in the holder portal (mobile field POS) */
export const HOLDER_PORTAL_ROLES: UserRole[] = ['holder', 'cashier']

export function canAccessAdminPortal(user: User | null): boolean {
  return !!user?.isActive && ADMIN_PORTAL_ROLES.includes(user.role)
}

export function canAccessHolderPortal(user: User | null): boolean {
  return !!user?.isActive && HOLDER_PORTAL_ROLES.includes(user.role)
}

export function portalForRole(role: UserRole): 'admin' | 'holder' | null {
  if (ADMIN_PORTAL_ROLES.includes(role)) return 'admin'
  if (HOLDER_PORTAL_ROLES.includes(role)) return 'holder'
  return null
}
