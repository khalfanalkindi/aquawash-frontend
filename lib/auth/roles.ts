import type { User, UserRole } from '@/lib/types'

/** All active users can use the holder (mobile) portal */
export function canAccessHolderPortal(user: User | null): boolean {
  return !!user?.isActive
}

/** Holder role is restricted to the mobile portal; all other roles can use admin */
export function canAccessAdminPortal(user: User | null): boolean {
  return !!user?.isActive && user.role !== 'holder'
}

/** Default portal when redirecting away from an unauthorized area */
export function portalForRole(role: UserRole): 'admin' | 'holder' | null {
  if (role === 'holder') return 'holder'
  return 'admin'
}
