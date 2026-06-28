'use client'

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react'
import { User } from './types'
import { login as apiLogin, fetchMe, logoutApi } from './api/auth'
import { isApiMode } from './api/constants'
import { getAccessToken, getRefreshToken, onSessionExpired, refreshAccessToken } from './api/client'
import { useStore } from './store'
import type { Locale } from '@/i18n/routing'

interface AuthContextType {
  user: User | null
  login: (username: string, password: string) => Promise<boolean>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const USER_STORAGE_KEY = 'pos_user'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const resetStore = useStore((s) => s.resetStore)

  useEffect(() => {
    let cancelled = false

    async function restoreSession() {
      try {
        if (isApiMode()) {
          const locale =
            (typeof document !== 'undefined'
              ? document.documentElement.lang
              : 'en') as Locale

          if (!getAccessToken() && getRefreshToken()) {
            await refreshAccessToken()
          }

          if (getAccessToken()) {
            const me = await fetchMe(locale)
            if (!cancelled) {
              setUser(me)
              localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(me))
            }
          } else {
            localStorage.removeItem(USER_STORAGE_KEY)
          }
        } else {
          const stored = localStorage.getItem(USER_STORAGE_KEY)
          if (stored) {
            const parsed = JSON.parse(stored) as User
            if (!cancelled) {
              setUser(parsed)
              useStore.getState().initBranchForUser(parsed)
            }
          }
        }
      } catch {
        localStorage.removeItem(USER_STORAGE_KEY)
        logoutApi()
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }

    void restoreSession()
    return () => {
      cancelled = true
    }
  }, [])

  const login = useCallback(
    async (username: string, password: string): Promise<boolean> => {
      try {
        const locale =
          (typeof document !== 'undefined'
            ? document.documentElement.lang
            : 'en') as Locale
        const loggedIn = await apiLogin({ username, password }, locale)
        setUser(loggedIn)
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(loggedIn))
        if (isApiMode()) {
          useStore.setState({ isHydrated: false, isHydrating: false })
        }
        return true
      } catch {
        return false
      }
    },
    [],
  )

  const logout = useCallback(() => {
    setUser(null)
    localStorage.removeItem(USER_STORAGE_KEY)
    logoutApi()
    resetStore()
  }, [resetStore])

  useEffect(() => {
    return onSessionExpired(() => {
      setUser(null)
      localStorage.removeItem(USER_STORAGE_KEY)
      resetStore()
    })
  }, [resetStore])

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
