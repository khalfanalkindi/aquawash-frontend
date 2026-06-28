import type { Locale } from '@/i18n/routing'
import { hasPermissionCode, type PermissionCode } from '@/lib/permissions'
import { resolveUserPermissionCodes } from '@/lib/resolve-user-permissions'
import type { User } from '@/lib/types'
import { useStore } from '@/lib/store'
import * as branchesApi from './branches'
import * as catalogApi from './catalog'
import * as rbacApi from './rbac'
import * as salesApi from './sales'

async function fetchOptional<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await fn()
  } catch {
    return fallback
  }
}

async function whenPermitted<T>(
  codes: readonly string[],
  permission: PermissionCode,
  fn: () => Promise<T>,
  fallback: T,
): Promise<T> {
  if (!hasPermissionCode(codes, permission)) return fallback
  return fetchOptional(fn, fallback)
}

export async function hydrateStoreFromApi(user: User, locale?: Locale) {
  const codes = resolveUserPermissionCodes(user, {
    permissions: useStore.getState().permissions,
    getUserEffectivePermissions: useStore.getState().getUserEffectivePermissions,
  })

  const [
    entities,
    laundryServices,
    products,
    customers,
    stockItems,
    stakeholders,
    users,
    roles,
    permissions,
    rolePermissions,
    userPermissions,
  ] = await Promise.all([
    whenPermitted(codes, 'services.view', () => catalogApi.fetchEntities(), []),
    whenPermitted(codes, 'services.view', () => catalogApi.fetchLaundryServices(), []),
    whenPermitted(codes, 'services.view', () => catalogApi.fetchProducts(), []),
    fetchOptional(() => salesApi.fetchCustomers(), []),
    whenPermitted(codes, 'dashboard.view', () => branchesApi.fetchStockItems(), []),
    whenPermitted(codes, 'dashboard.view', () => branchesApi.fetchStakeholders(), []),
    whenPermitted(codes, 'users.view', () => rbacApi.fetchUsers(), []),
    whenPermitted(codes, 'roles.view', () => rbacApi.fetchRoles(), []),
    whenPermitted(codes, 'permissions.view', () => rbacApi.fetchPermissions(), []),
    whenPermitted(codes, 'permissions.assign', () => rbacApi.fetchRolePermissions(), []),
    whenPermitted(codes, 'permissions.assign', () => rbacApi.fetchUserPermissions(), []),
  ])

  const branches = hasPermissionCode(codes, 'dashboard.view')
    ? await whenPermitted(codes, 'dashboard.view', () => branchesApi.fetchBranches(), [])
    : await fetchOptional(() => branchesApi.fetchMyBranches(), [])

  const inventory = await whenPermitted(codes, 'dashboard.view', () => branchesApi.fetchInventory(), [])
  const invoices = await whenPermitted(codes, 'invoices.view', () => salesApi.fetchInvoices(), [])
  const contracts = await whenPermitted(codes, 'dashboard.view', () => branchesApi.fetchContracts(), [])

  useStore.setState({
    entities,
    laundryServices,
    products,
    branches,
    customers,
    stockItems,
    inventory,
    stakeholders,
    invoices,
    contracts,
    users,
    roles,
    permissions,
    rolePermissions,
    userPermissions,
    isHydrated: true,
    isHydrating: false,
  })

  void locale
}

export function resetStoreData() {
  useStore.getState().resetStore()
}
