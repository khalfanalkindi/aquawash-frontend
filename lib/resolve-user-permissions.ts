import type { Permission, User } from '@/lib/types'

type PermissionStoreSlice = {
  permissions: Permission[]
  getUserEffectivePermissions: (userId: string) => Permission[]
}

/** Resolve effective permission codes for a user (API login codes or dummy RBAC graph). */
export function resolveUserPermissionCodes(
  user: User | null | undefined,
  store: PermissionStoreSlice,
): string[] {
  if (!user) return []
  if (user.permissionCodes?.length) return user.permissionCodes
  return store.getUserEffectivePermissions(user.id).map((p) => p.code)
}

export function resolveUserPermissions(
  user: User | null | undefined,
  store: PermissionStoreSlice,
): Permission[] {
  if (!user) return []

  const codes = resolveUserPermissionCodes(user, store)
  const codeSet = new Set(codes)

  const fromStore = store.permissions.filter((p) => codeSet.has(p.code) && p.isActive)
  if (fromStore.length === codes.length) return fromStore

  const known = new Set(fromStore.map((p) => p.code))
  const extras = codes
    .filter((code) => !known.has(code))
    .map((code) => {
      const [module] = code.split('.')
      return {
        id: code,
        code,
        name: code,
        module: module ?? 'general',
        isActive: true,
      } satisfies Permission
    })

  return [...fromStore, ...extras]
}
