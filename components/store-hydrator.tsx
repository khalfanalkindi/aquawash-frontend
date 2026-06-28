'use client'

import { useEffect } from 'react'
import { useLocale } from 'next-intl'
import { useAuth } from '@/lib/auth-context'
import { isApiMode } from '@/lib/api/constants'
import { getAccessToken } from '@/lib/api/client'
import { useStore } from '@/lib/store'

export function StoreHydrator({ children }: { children: React.ReactNode }) {
  const { user, isLoading: authLoading } = useAuth()
  const locale = useLocale()
  const isHydrated = useStore((s) => s.isHydrated)
  const isHydrating = useStore((s) => s.isHydrating)
  const hydrateFromApi = useStore((s) => s.hydrateFromApi)
  const initBranchForUser = useStore((s) => s.initBranchForUser)

  useEffect(() => {
    if (!isApiMode() || authLoading) return
    if (!user || !getAccessToken()) return
    if (isHydrated || isHydrating) return
    void hydrateFromApi(locale, user)
  }, [user, authLoading, isHydrated, isHydrating, hydrateFromApi, locale])

  useEffect(() => {
    if (!isApiMode() || !isHydrated || !user) return
    initBranchForUser(user)
  }, [isHydrated, user, initBranchForUser])

  if (isApiMode() && user && !isHydrated) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="text-muted-foreground text-sm">
          {locale === 'ar' ? 'جاري تحميل البيانات...' : 'Loading data...'}
        </div>
      </div>
    )
  }

  return <>{children}</>
}
