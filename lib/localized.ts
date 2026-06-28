import type { Locale } from '@/i18n/routing'

type LocalizedFields = {
  name: string
  nameAr?: string
}

export function localizedName<T extends LocalizedFields>(item: T, locale: string): string {
  if (locale === 'ar' && item.nameAr) {
    return item.nameAr
  }
  return item.name
}

export function isRtl(locale: string): boolean {
  return locale === 'ar'
}

export function localeDirection(locale: string): 'rtl' | 'ltr' {
  return isRtl(locale) ? 'rtl' : 'ltr'
}

export function apiLocaleHeader(locale: Locale): Record<string, string> {
  return { 'Accept-Language': locale === 'ar' ? 'ar' : 'en' }
}
