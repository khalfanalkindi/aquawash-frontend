import type { Locale } from '@/i18n/routing'
import type { User } from '@/lib/types'
import { dummyUsers } from '@/lib/dummy-data'
import { apiClient, setTokens, clearTokens } from './client'
import type { LoginRequest, LoginResponse } from './types'
import { mapApiUserToUser } from './types'

const USE_API = process.env.NEXT_PUBLIC_USE_API === 'true'

/** Demo login — used until backend is connected (NEXT_PUBLIC_USE_API=true) */
function demoLogin(username: string, password: string): User | null {
  if (username === 'demo' && password === 'demo') {
    return dummyUsers.find((u) => u.username === 'demo') ?? null
  }
  const found = dummyUsers.find((u) => u.username === username && u.isActive)
  if (found && password === username) return found
  return null
}

export async function login(
  credentials: LoginRequest,
  locale?: Locale,
): Promise<User> {
  if (!USE_API) {
    const user = demoLogin(credentials.username, credentials.password)
    if (!user) throw new Error('Invalid username or password')
    return user
  }

  const data = await apiClient<LoginResponse>('/auth/login/', {
    method: 'POST',
    body: credentials,
    auth: false,
    locale,
  })
  setTokens(data.access, data.refresh)
  return mapApiUserToUser(data.user)
}

export async function fetchMe(locale?: Locale): Promise<User> {
  const data = await apiClient<LoginResponse['user']>('/auth/me/', { locale })
  return mapApiUserToUser(data)
}

export async function changePassword(currentPassword: string, newPassword: string) {
  await apiClient('/auth/change-password/', {
    method: 'POST',
    body: {
      current_password: currentPassword,
      new_password: newPassword,
    },
  })
}

export function logoutApi() {
  clearTokens()
}
