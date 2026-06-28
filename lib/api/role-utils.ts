import type { Role, UserRole } from '@/lib/types'

const PORTAL_ROLE_CODES: Record<UserRole, string> = {
  admin: 'admin',
  cashier: 'cashier',
  holder: 'holder',
}

export function resolveRoleId(roles: Role[], portalRole: UserRole): string | undefined {
  const code = PORTAL_ROLE_CODES[portalRole]
  return roles.find((r) => r.code === code)?.id
}

export function roleCodeFromName(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_|_$/g, '')
}
