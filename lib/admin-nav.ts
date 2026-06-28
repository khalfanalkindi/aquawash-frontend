import type { LucideIcon } from 'lucide-react'
import {
  LayoutGrid,
  ShoppingCart,
  Wrench,
  Users,
  FileText,
  BarChart3,
  Shield,
  Key,
  UserCog,
  ShieldCheck,
  Contact,
  Building2,
  Package,
  FileSignature,
  Handshake,
} from 'lucide-react'
import type { PermissionCode } from '@/lib/permissions'

export type AdminNavLabelKey =
  | 'dashboard'
  | 'pos'
  | 'catalog'
  | 'customers'
  | 'invoices'
  | 'contracts'
  | 'reports'
  | 'branches'
  | 'inventory'
  | 'stakeholders'
  | 'users'
  | 'roles'
  | 'permissions'
  | 'rolePermissions'
  | 'userPermissions'

export type AdminNavItem = {
  href: string
  labelKey: AdminNavLabelKey
  icon: LucideIcon
  permission?: PermissionCode
  /** Restrict to portal role `admin` (includes manager mapped as admin) */
  adminOnly?: boolean
}

export const ADMIN_PLATFORM_NAV: AdminNavItem[] = [
  { href: '/admin/dashboard', labelKey: 'dashboard', icon: LayoutGrid, permission: 'dashboard.view' },
  { href: '/admin/pos', labelKey: 'pos', icon: ShoppingCart, permission: 'pos.access' },
  { href: '/admin/services', labelKey: 'catalog', icon: Wrench, permission: 'services.view' },
  { href: '/admin/customers', labelKey: 'customers', icon: Contact },
  { href: '/admin/invoices', labelKey: 'invoices', icon: FileText, permission: 'invoices.view' },
  { href: '/admin/contracts', labelKey: 'contracts', icon: FileSignature, adminOnly: true },
  { href: '/admin/reports', labelKey: 'reports', icon: BarChart3, permission: 'reports.view' },
]

export const ADMIN_OPERATIONS_NAV: AdminNavItem[] = [
  { href: '/admin/branches', labelKey: 'branches', icon: Building2, adminOnly: true },
  { href: '/admin/inventory', labelKey: 'inventory', icon: Package, adminOnly: true },
  { href: '/admin/stakeholders', labelKey: 'stakeholders', icon: Handshake, adminOnly: true },
]

export const ADMIN_ACCOUNT_NAV: AdminNavItem[] = [
  { href: '/admin/users', labelKey: 'users', icon: Users, permission: 'users.view' },
  { href: '/admin/roles', labelKey: 'roles', icon: Shield, permission: 'roles.view' },
  { href: '/admin/permissions', labelKey: 'permissions', icon: Key, permission: 'permissions.view' },
  {
    href: '/admin/role-permissions',
    labelKey: 'rolePermissions',
    icon: ShieldCheck,
    permission: 'permissions.assign',
  },
  {
    href: '/admin/user-permissions',
    labelKey: 'userPermissions',
    icon: UserCog,
    permission: 'permissions.assign',
  },
]

export const ADMIN_PUBLIC_PATHS = new Set(['/admin/login', '/admin/settings'])

export function navItemToRouteGuard(item: AdminNavItem) {
  if (item.permission) return { permission: item.permission }
  if (item.adminOnly) return { adminOnly: true as const }
  return null
}
