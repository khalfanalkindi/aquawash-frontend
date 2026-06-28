import type { Permission } from '@/lib/types'
import {
  PERMISSION_CODES,
  PERMISSION_DEFINITIONS,
  type PermissionCode,
} from '@/lib/permission-registry.generated'

export type { PermissionCode }
export { PERMISSION_CODES, PERMISSION_DEFINITIONS }

export function isPermissionCode(code: string): code is PermissionCode {
  return (PERMISSION_CODES as readonly string[]).includes(code)
}

export function hasPermissionCode(codes: readonly string[], code: PermissionCode): boolean {
  return codes.includes(code)
}

export function hasPermission(permissions: Permission[], code: PermissionCode): boolean {
  return permissions.some((p) => p.code === code && p.isActive)
}

export function can(codes: readonly string[], code: PermissionCode): boolean {
  return hasPermissionCode(codes, code)
}

export function canFromPermissions(permissions: Permission[], code: PermissionCode): boolean {
  return hasPermission(permissions, code)
}

export function canAny(codes: readonly string[], required: PermissionCode[]): boolean {
  return required.some((code) => hasPermissionCode(codes, code))
}

export function canAll(codes: readonly string[], required: PermissionCode[]): boolean {
  return required.every((code) => hasPermissionCode(codes, code))
}
