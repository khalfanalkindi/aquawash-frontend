import { apiClient } from './client'
import { toNumId } from './constants'
import {
  mapList,
  mapOne,
  mapPermission,
  mapRole,
  mapRolePermission,
  mapUser,
  mapUserPermission,
} from './mappers'
import type { Permission, Role, RolePermission, User, UserPermission } from '@/lib/types'
import { roleCodeFromName } from './role-utils'

export async function fetchUsers() {
  const data = await apiClient<unknown[]>('/auth/users/')
  return mapList(data, mapUser)
}

export async function createUser(user: {
  username: string
  fullName: string
  roleId?: string
  isActive: boolean
  branchIds: string[]
  defaultBranchId?: string
  password?: string
}) {
  const data = await apiClient<unknown>('/auth/users/', {
    method: 'POST',
    body: {
      username: user.username,
      full_name: user.fullName,
      role: user.roleId ? toNumId(user.roleId) : null,
      is_active: user.isActive,
      branch_ids: user.branchIds.map(toNumId),
      default_branch_id: user.defaultBranchId ? toNumId(user.defaultBranchId) : null,
      password: user.password,
    },
  })
  return mapOne(data, mapUser)
}

export async function updateUser(
  id: string,
  user: Partial<{
    fullName: string
    roleId: string
    isActive: boolean
    branchIds: string[]
    defaultBranchId: string
    password: string
  }>,
) {
  const body: Record<string, unknown> = {}
  if (user.fullName !== undefined) body.full_name = user.fullName
  if (user.roleId !== undefined) body.role = toNumId(user.roleId)
  if (user.isActive !== undefined) body.is_active = user.isActive
  if (user.branchIds !== undefined) body.branch_ids = user.branchIds.map(toNumId)
  if (user.defaultBranchId !== undefined) {
    body.default_branch_id = user.defaultBranchId ? toNumId(user.defaultBranchId) : null
  }
  if (user.password !== undefined) body.password = user.password

  const data = await apiClient<unknown>(`/auth/users/${id}/`, { method: 'PATCH', body })
  return mapOne(data, mapUser)
}

export async function deleteUser(id: string) {
  return apiClient<void>(`/auth/users/${id}/`, { method: 'DELETE' })
}

export async function fetchRoles() {
  const data = await apiClient<unknown[]>('/auth/roles/')
  return mapList(data, mapRole)
}

export async function createRole(role: Omit<Role, 'id' | 'createdAt'>) {
  const data = await apiClient<unknown>('/auth/roles/', {
    method: 'POST',
    body: {
      code: role.code ?? roleCodeFromName(role.name),
      name: role.name,
      description: role.description ?? '',
      is_active: role.isActive,
    },
  })
  return mapOne(data, mapRole)
}

export async function updateRole(id: string, role: Partial<Role>) {
  const body: Record<string, unknown> = {}
  if (role.name !== undefined) body.name = role.name
  if (role.description !== undefined) body.description = role.description
  if (role.isActive !== undefined) body.is_active = role.isActive
  const data = await apiClient<unknown>(`/auth/roles/${id}/`, { method: 'PATCH', body })
  return mapOne(data, mapRole)
}

export async function deleteRole(id: string) {
  return apiClient<void>(`/auth/roles/${id}/`, { method: 'DELETE' })
}

export async function fetchPermissions() {
  const data = await apiClient<unknown[]>('/auth/permissions/')
  return mapList(data, mapPermission)
}

export async function fetchRolePermissions() {
  const data = await apiClient<unknown[]>('/auth/role-permissions/')
  return mapList(data, mapRolePermission)
}

export async function createRolePermission(roleId: string, permissionId: string) {
  const data = await apiClient<unknown>('/auth/role-permissions/', {
    method: 'POST',
    body: { role: toNumId(roleId), permission: toNumId(permissionId) },
  })
  return mapOne(data, mapRolePermission)
}

export async function deleteRolePermission(id: string) {
  return apiClient<void>(`/auth/role-permissions/${id}/`, { method: 'DELETE' })
}

export async function fetchUserPermissions() {
  const data = await apiClient<unknown[]>('/auth/user-permissions/')
  return mapList(data, mapUserPermission)
}

export async function createUserPermission(userId: string, permissionId: string) {
  const data = await apiClient<unknown>('/auth/user-permissions/', {
    method: 'POST',
    body: { user: toNumId(userId), permission: toNumId(permissionId) },
  })
  return mapOne(data, mapUserPermission)
}

export async function deleteUserPermission(id: string) {
  return apiClient<void>(`/auth/user-permissions/${id}/`, { method: 'DELETE' })
}

export async function fetchRolePermissionsForRole(roleId: string) {
  const data = await apiClient<unknown[]>(`/auth/role-permissions/?role_id=${roleId}`)
  return mapList(data, mapRolePermission)
}

export async function fetchUserPermissionsForUser(userId: string) {
  const data = await apiClient<unknown[]>(`/auth/user-permissions/?user_id=${userId}`)
  return mapList(data, mapUserPermission)
}

export async function syncRolePermissions(roleId: string, permissionIds: string[]) {
  const current = await fetchRolePermissionsForRole(roleId)
  const currentIds = new Set(current.map((rp) => rp.permissionId))
  const nextIds = new Set(permissionIds)

  await Promise.all(
    current
      .filter((rp) => !nextIds.has(rp.permissionId))
      .map((rp) => deleteRolePermission(rp.id)),
  )
  await Promise.all(
    permissionIds
      .filter((id) => !currentIds.has(id))
      .map((pid) => createRolePermission(roleId, pid)),
  )

  return fetchRolePermissions()
}

export async function syncUserPermissions(userId: string, permissionIds: string[]) {
  const current = await fetchUserPermissionsForUser(userId)
  const currentIds = new Set(current.map((up) => up.permissionId))
  const nextIds = new Set(permissionIds)

  await Promise.all(
    current
      .filter((up) => !nextIds.has(up.permissionId))
      .map((up) => deleteUserPermission(up.id)),
  )
  await Promise.all(
    permissionIds
      .filter((id) => !currentIds.has(id))
      .map((pid) => createUserPermission(userId, pid)),
  )

  return fetchUserPermissions()
}

export type { Permission, Role, RolePermission, User, UserPermission }
