import type { PermissionCode } from '@/lib/permissions'
import type { UserRole } from '@/lib/types'
import {
  ADMIN_ACCOUNT_NAV,
  ADMIN_OPERATIONS_NAV,
  ADMIN_PLATFORM_NAV,
  ADMIN_PUBLIC_PATHS,
  navItemToRouteGuard,
} from '@/lib/admin-nav'

export type AdminRouteGuard = {
  permission?: PermissionCode
  adminOnly?: boolean
}

const ALL_NAV = [...ADMIN_PLATFORM_NAV, ...ADMIN_OPERATIONS_NAV, ...ADMIN_ACCOUNT_NAV]

export const ADMIN_ROUTE_GUARDS: Record<string, AdminRouteGuard> = Object.fromEntries(
  ALL_NAV.flatMap((item) => {
    const guard = navItemToRouteGuard(item)
    return guard ? [[item.href, guard]] : []
  }),
)

export function normalizeAdminPath(pathname: string): string {
  const path = pathname.replace(/\/$/, '') || pathname
  return path.startsWith('/admin') ? path : `/admin${path}`
}

export function getAdminRouteGuard(pathname: string): AdminRouteGuard | null {
  const path = normalizeAdminPath(pathname)
  if (ADMIN_PUBLIC_PATHS.has(path)) return null

  if (ADMIN_ROUTE_GUARDS[path]) return ADMIN_ROUTE_GUARDS[path]

  for (const [route, guard] of Object.entries(ADMIN_ROUTE_GUARDS)) {
    if (path.startsWith(`${route}/`)) return guard
  }

  return null
}

export function canAccessAdminRoute(
  pathname: string,
  can: (code: PermissionCode) => boolean,
  userRole: UserRole,
): boolean {
  const guard = getAdminRouteGuard(pathname)
  if (!guard) return true
  if (guard.adminOnly && userRole !== 'admin') return false
  if (guard.permission && !can(guard.permission)) return false
  return true
}

export function getDefaultAdminRoute(can: (code: PermissionCode) => boolean): string {
  if (can('dashboard.view')) return '/admin/dashboard'
  if (can('pos.access')) return '/admin/pos'
  if (can('services.view')) return '/admin/services'
  if (can('invoices.view')) return '/admin/invoices'
  if (can('reports.view')) return '/admin/reports'
  return '/admin/pos'
}
