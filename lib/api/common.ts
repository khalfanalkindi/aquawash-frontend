import type { Locale } from '@/i18n/routing'
import { apiClient } from './client'
import type { ShopSettingsResponse } from './types'

export async function fetchShopSettings(locale?: Locale) {
  return apiClient<ShopSettingsResponse>('/common/shop-settings/', { auth: false, locale })
}

export async function fetchListChildren(parent: string) {
  return apiClient<unknown[]>(`/common/lists/children/?parent=${parent}`, { auth: false })
}
