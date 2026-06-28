import { apiClient } from './client'
import { toNumId } from './constants'
import { mapEntity, mapList, mapOne, mapProduct, mapService } from './mappers'
import type { Entity, LaundryService, Product } from '@/lib/types'

export async function fetchEntities() {
  const data = await apiClient<unknown[]>('/catalog/entities/')
  return mapList(data, mapEntity)
}

export async function createEntity(entity: Omit<Entity, 'id'>) {
  const body: Record<string, unknown> = {
    name: entity.name,
    name_ar: entity.nameAr ?? '',
    description: entity.description ?? '',
    icon: entity.icon ?? '',
    is_active: entity.isActive,
  }
  const data = await apiClient<unknown>('/catalog/entities/', { method: 'POST', body })
  return mapOne(data, mapEntity)
}

export async function updateEntity(id: string, entity: Partial<Entity>) {
  const body: Record<string, unknown> = {}
  if (entity.name !== undefined) body.name = entity.name
  if (entity.nameAr !== undefined) body.name_ar = entity.nameAr
  if (entity.description !== undefined) body.description = entity.description
  if (entity.icon !== undefined) body.icon = entity.icon
  if (entity.isActive !== undefined) body.is_active = entity.isActive
  const data = await apiClient<unknown>(`/catalog/entities/${id}/`, { method: 'PATCH', body })
  return mapOne(data, mapEntity)
}

export async function deleteEntity(id: string) {
  return apiClient<void>(`/catalog/entities/${id}/`, { method: 'DELETE' })
}

export async function fetchLaundryServices() {
  const data = await apiClient<unknown[]>('/catalog/services/')
  return mapList(data, mapService)
}

export async function createLaundryService(service: Omit<LaundryService, 'id'>) {
  const data = await apiClient<unknown>('/catalog/services/', {
    method: 'POST',
    body: {
      name: service.name,
      name_ar: service.nameAr ?? '',
      description: service.description ?? '',
      duration_minutes: service.durationMinutes ?? null,
      icon: service.icon ?? '',
      is_active: service.isActive,
    },
  })
  return mapOne(data, mapService)
}

export async function updateLaundryService(id: string, service: Partial<LaundryService>) {
  const body: Record<string, unknown> = {}
  if (service.name !== undefined) body.name = service.name
  if (service.nameAr !== undefined) body.name_ar = service.nameAr
  if (service.description !== undefined) body.description = service.description
  if (service.durationMinutes !== undefined) body.duration_minutes = service.durationMinutes
  if (service.icon !== undefined) body.icon = service.icon
  if (service.isActive !== undefined) body.is_active = service.isActive
  const data = await apiClient<unknown>(`/catalog/services/${id}/`, { method: 'PATCH', body })
  return mapOne(data, mapService)
}

export async function deleteLaundryService(id: string) {
  return apiClient<void>(`/catalog/services/${id}/`, { method: 'DELETE' })
}

export async function fetchProducts() {
  const data = await apiClient<unknown[]>('/catalog/products/')
  return mapList(data, mapProduct)
}

export async function createProduct(product: Omit<Product, 'id'>) {
  const data = await apiClient<unknown>('/catalog/products/', {
    method: 'POST',
    body: {
      entity: toNumId(product.entityId),
      service: toNumId(product.serviceId),
      name: product.name,
      name_ar: product.nameAr ?? '',
      price: product.price,
      icon: product.icon ?? '',
      is_active: product.isActive,
    },
  })
  return mapOne(data, mapProduct)
}

export async function updateProduct(id: string, product: Partial<Product>) {
  const body: Record<string, unknown> = {}
  if (product.entityId !== undefined) body.entity = toNumId(product.entityId)
  if (product.serviceId !== undefined) body.service = toNumId(product.serviceId)
  if (product.name !== undefined) body.name = product.name
  if (product.nameAr !== undefined) body.name_ar = product.nameAr
  if (product.price !== undefined) body.price = product.price
  if (product.icon !== undefined) body.icon = product.icon
  if (product.isActive !== undefined) body.is_active = product.isActive
  const data = await apiClient<unknown>(`/catalog/products/${id}/`, { method: 'PATCH', body })
  return mapOne(data, mapProduct)
}

export async function deleteProduct(id: string) {
  return apiClient<void>(`/catalog/products/${id}/`, { method: 'DELETE' })
}
