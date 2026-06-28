import type { ShopSettingsResponse } from '@/lib/api/types'
import { LAUNDRY_INFO } from '@/lib/laundry-info'

export interface ShopInfo {
  name: string
  nameAr?: string
  tagline?: string
  phone?: string
  address?: string
  currency: string
  receiptFooter?: string
}

export const DEFAULT_SHOP_INFO: ShopInfo = {
  name: LAUNDRY_INFO.name,
  nameAr: LAUNDRY_INFO.nameAr,
  tagline: LAUNDRY_INFO.tagline,
  phone: LAUNDRY_INFO.phone,
  address: LAUNDRY_INFO.address,
  currency: 'OMR',
}

export function mapShopSettingsResponse(data: ShopSettingsResponse): ShopInfo {
  return {
    name: data.shop_name,
    nameAr: data.shop_name_ar || undefined,
    tagline: data.tagline || undefined,
    phone: data.phone || undefined,
    address: data.address || undefined,
    currency: data.currency || 'OMR',
    receiptFooter: data.receipt_footer || undefined,
  }
}

export function shopDisplayName(info: ShopInfo, locale: string): string {
  if (locale === 'ar' && info.nameAr) return info.nameAr
  return info.name
}
