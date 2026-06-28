'use client'

import { useEffect, useState } from 'react'
import { useLocale } from 'next-intl'
import { isApiMode } from '@/lib/api/constants'
import { fetchShopSettings } from '@/lib/api/common'
import {
  DEFAULT_SHOP_INFO,
  mapShopSettingsResponse,
  type ShopInfo,
} from '@/lib/shop-info'

let cachedShopInfo: ShopInfo | null = null

export function useShopSettings(): ShopInfo {
  const locale = useLocale()
  const [shopInfo, setShopInfo] = useState<ShopInfo>(cachedShopInfo ?? DEFAULT_SHOP_INFO)

  useEffect(() => {
    if (!isApiMode()) {
      setShopInfo(DEFAULT_SHOP_INFO)
      return
    }

    if (cachedShopInfo) {
      setShopInfo(cachedShopInfo)
      return
    }

    let cancelled = false

    void fetchShopSettings(locale as 'en' | 'ar')
      .then((data) => {
        if (cancelled) return
        const mapped = mapShopSettingsResponse(data)
        cachedShopInfo = mapped
        setShopInfo(mapped)
      })
      .catch(() => {
        if (!cancelled) setShopInfo(DEFAULT_SHOP_INFO)
      })

    return () => {
      cancelled = true
    }
  }, [locale])

  return shopInfo
}

export function clearShopSettingsCache() {
  cachedShopInfo = null
}
