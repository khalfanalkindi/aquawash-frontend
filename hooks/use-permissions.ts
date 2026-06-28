'use client'

import { useCallback, useMemo } from 'react'
import { useAuth } from '@/lib/auth-context'
import { useStore } from '@/lib/store'
import { can, type PermissionCode } from '@/lib/permissions'
import {
  resolveUserPermissionCodes,
  resolveUserPermissions,
} from '@/lib/resolve-user-permissions'

export function usePermissions() {
  const { user } = useAuth()
  const storePermissions = useStore((s) => s.permissions)
  const getUserEffectivePermissions = useStore((s) => s.getUserEffectivePermissions)

  const storeSlice = useMemo(
    () => ({ permissions: storePermissions, getUserEffectivePermissions }),
    [storePermissions, getUserEffectivePermissions],
  )

  const permissionCodes = useMemo(
    () => resolveUserPermissionCodes(user, storeSlice),
    [user, storeSlice],
  )

  const permissions = useMemo(
    () => resolveUserPermissions(user, storeSlice),
    [user, storeSlice],
  )

  const check = useCallback(
    (code: PermissionCode) => can(permissionCodes, code),
    [permissionCodes],
  )

  return {
    permissions,
    permissionCodes,
    can: check,
    user,
  }
}
