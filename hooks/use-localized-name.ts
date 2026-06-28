'use client'

import { useLocale } from 'next-intl'
import { localizedName } from '@/lib/localized'

type LocalizedItem = {
  name: string
  nameAr?: string
}

export function useLocalizedName() {
  const locale = useLocale()

  return <T extends LocalizedItem>(item: T) => localizedName(item, locale)
}
