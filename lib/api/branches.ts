import { apiClient } from './client'
import { toNumId } from './constants'
import {
  mapBranch,
  mapContract,
  mapInventory,
  mapList,
  mapOne,
  mapStakeholder,
  mapStockItem,
} from './mappers'
import type { Branch, Contract, Inventory, Stakeholder, StockItem } from '@/lib/types'

export async function fetchBranches() {
  const data = await apiClient<unknown[]>('/branches/')
  return mapList(data, mapBranch)
}

export async function fetchMyBranches() {
  const data = await apiClient<unknown[]>('/branches/mine/')
  return mapList(data, mapBranch)
}

export async function createBranch(branch: Omit<Branch, 'id' | 'createdAt'>) {
  const data = await apiClient<unknown>('/branches/', {
    method: 'POST',
    body: {
      name: branch.name,
      name_ar: branch.nameAr ?? '',
      code: branch.code,
      address: branch.address ?? '',
      phone: branch.phone ?? '',
      is_active: branch.isActive,
    },
  })
  return mapOne(data, mapBranch)
}

export async function updateBranch(id: string, branch: Partial<Branch>) {
  const body: Record<string, unknown> = {}
  if (branch.name !== undefined) body.name = branch.name
  if (branch.nameAr !== undefined) body.name_ar = branch.nameAr
  if (branch.code !== undefined) body.code = branch.code
  if (branch.address !== undefined) body.address = branch.address
  if (branch.phone !== undefined) body.phone = branch.phone
  if (branch.isActive !== undefined) body.is_active = branch.isActive
  const data = await apiClient<unknown>(`/branches/${id}/`, { method: 'PATCH', body })
  return mapOne(data, mapBranch)
}

export async function deleteBranch(id: string) {
  return apiClient<void>(`/branches/${id}/`, { method: 'DELETE' })
}

export async function fetchStockItems() {
  const data = await apiClient<unknown[]>('/inventory/items/')
  return mapList(data, mapStockItem)
}

export async function createStockItem(item: Omit<StockItem, 'id'>) {
  const data = await apiClient<unknown>('/inventory/items/', {
    method: 'POST',
    body: {
      name: item.name,
      name_ar: item.nameAr ?? '',
      sku: item.sku,
      category: item.category,
      unit: item.unit,
      min_quantity: item.minQuantity ?? null,
      is_active: item.isActive,
    },
  })
  return mapOne(data, mapStockItem)
}

export async function updateStockItem(id: string, item: Partial<StockItem>) {
  const body: Record<string, unknown> = {}
  if (item.name !== undefined) body.name = item.name
  if (item.nameAr !== undefined) body.name_ar = item.nameAr
  if (item.sku !== undefined) body.sku = item.sku
  if (item.category !== undefined) body.category = item.category
  if (item.unit !== undefined) body.unit = item.unit
  if (item.minQuantity !== undefined) body.min_quantity = item.minQuantity
  if (item.isActive !== undefined) body.is_active = item.isActive
  const data = await apiClient<unknown>(`/inventory/items/${id}/`, { method: 'PATCH', body })
  return mapOne(data, mapStockItem)
}

export async function deleteStockItem(id: string) {
  return apiClient<void>(`/inventory/items/${id}/`, { method: 'DELETE' })
}

export async function fetchInventory(branchId?: string) {
  const query = branchId ? `?branch_id=${branchId}` : ''
  const data = await apiClient<unknown[]>(`/inventory/${query}`)
  return mapList(data, mapInventory)
}

export async function upsertInventoryRecord(
  branchId: string,
  stockItemId: string,
  quantity: number,
  existingId?: string,
) {
  const body = {
    branch: toNumId(branchId),
    stock_item: toNumId(stockItemId),
    quantity,
  }
  if (existingId) {
    const data = await apiClient<unknown>(`/inventory/${existingId}/`, {
      method: 'PATCH',
      body: { quantity },
    })
    return mapOne(data, mapInventory)
  }
  const data = await apiClient<unknown>('/inventory/', { method: 'POST', body })
  return mapOne(data, mapInventory)
}

export async function fetchStakeholders() {
  const data = await apiClient<unknown[]>('/stakeholders/')
  return mapList(data, mapStakeholder)
}

export async function createStakeholder(s: Omit<Stakeholder, 'id' | 'createdAt'>) {
  const data = await apiClient<unknown>('/stakeholders/', {
    method: 'POST',
    body: {
      type: s.type,
      name: s.name,
      name_ar: s.nameAr ?? '',
      phone: s.phone ?? '',
      email: s.email ?? '',
      contact_person: s.contactPerson ?? '',
      address: s.address ?? '',
      tax_id: s.taxId ?? '',
      notes: s.notes ?? '',
      is_active: s.isActive,
    },
  })
  return mapOne(data, mapStakeholder)
}

export async function updateStakeholder(id: string, s: Partial<Stakeholder>) {
  const body: Record<string, unknown> = {}
  if (s.type !== undefined) body.type = s.type
  if (s.name !== undefined) body.name = s.name
  if (s.nameAr !== undefined) body.name_ar = s.nameAr
  if (s.phone !== undefined) body.phone = s.phone
  if (s.email !== undefined) body.email = s.email
  if (s.contactPerson !== undefined) body.contact_person = s.contactPerson
  if (s.address !== undefined) body.address = s.address
  if (s.taxId !== undefined) body.tax_id = s.taxId
  if (s.notes !== undefined) body.notes = s.notes
  if (s.isActive !== undefined) body.is_active = s.isActive
  const data = await apiClient<unknown>(`/stakeholders/${id}/`, { method: 'PATCH', body })
  return mapOne(data, mapStakeholder)
}

export async function deleteStakeholder(id: string) {
  return apiClient<void>(`/stakeholders/${id}/`, { method: 'DELETE' })
}

export async function fetchContracts(branchId?: string) {
  const query = branchId ? `?branch_id=${branchId}` : ''
  const data = await apiClient<unknown[]>(`/contracts/${query}`)
  return mapList(data, mapContract)
}

export async function createContract(c: Omit<Contract, 'id' | 'createdAt'>) {
  const data = await apiClient<unknown>('/contracts/', {
    method: 'POST',
    body: {
      contract_number: c.contractNumber,
      party_type: c.partyType,
      party_id: toNumId(c.partyId),
      branch: toNumId(c.branchId),
      purpose: c.purpose,
      title: c.title,
      start_date: c.startDate.toISOString().slice(0, 10),
      end_date: c.endDate ? c.endDate.toISOString().slice(0, 10) : null,
      status: c.status,
      monthly_value: c.monthlyValue ?? null,
      terms: c.terms ?? '',
      notes: c.notes ?? '',
    },
  })
  return mapOne(data, mapContract)
}

export async function updateContract(id: string, c: Partial<Contract>) {
  const body: Record<string, unknown> = {}
  if (c.contractNumber !== undefined) body.contract_number = c.contractNumber
  if (c.partyType !== undefined) body.party_type = c.partyType
  if (c.partyId !== undefined) body.party_id = toNumId(c.partyId)
  if (c.branchId !== undefined) body.branch = toNumId(c.branchId)
  if (c.purpose !== undefined) body.purpose = c.purpose
  if (c.title !== undefined) body.title = c.title
  if (c.startDate !== undefined) body.start_date = c.startDate.toISOString().slice(0, 10)
  if (c.endDate !== undefined) body.end_date = c.endDate ? c.endDate.toISOString().slice(0, 10) : null
  if (c.status !== undefined) body.status = c.status
  if (c.monthlyValue !== undefined) body.monthly_value = c.monthlyValue
  if (c.terms !== undefined) body.terms = c.terms
  if (c.notes !== undefined) body.notes = c.notes
  const data = await apiClient<unknown>(`/contracts/${id}/`, { method: 'PATCH', body })
  return mapOne(data, mapContract)
}

export async function deleteContract(id: string) {
  return apiClient<void>(`/contracts/${id}/`, { method: 'DELETE' })
}
