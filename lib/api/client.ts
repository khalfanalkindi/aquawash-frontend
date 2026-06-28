import type { Locale } from '@/i18n/routing'
import { apiLocaleHeader } from '@/lib/localized'

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000/api'

const TOKEN_KEY = 'aquawash_access_token'
const REFRESH_KEY = 'aquawash_refresh_token'

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public body?: unknown,
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

export function getAccessToken(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem(TOKEN_KEY)
}

export function getRefreshToken(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem(REFRESH_KEY)
}

export function setTokens(access: string, refresh: string) {
  localStorage.setItem(TOKEN_KEY, access)
  localStorage.setItem(REFRESH_KEY, refresh)
}

export function clearTokens() {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(REFRESH_KEY)
}

type SessionExpiredHandler = () => void

let sessionExpiredHandler: SessionExpiredHandler | null = null
let refreshPromise: Promise<string | null> | null = null

export function onSessionExpired(handler: SessionExpiredHandler) {
  sessionExpiredHandler = handler
  return () => {
    if (sessionExpiredHandler === handler) {
      sessionExpiredHandler = null
    }
  }
}

function notifySessionExpired() {
  clearTokens()
  sessionExpiredHandler?.()
}

function isAuthRefreshPath(path: string) {
  return path.includes('/auth/refresh/') || path.includes('/auth/login/')
}

export async function refreshAccessToken(): Promise<string | null> {
  if (refreshPromise) return refreshPromise

  refreshPromise = (async () => {
    const refresh = getRefreshToken()
    if (!refresh) return null

    try {
      const response = await fetch(`${API_BASE}/auth/refresh/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh }),
      })

      if (!response.ok) return null

      const data = (await response.json()) as { access: string; refresh?: string }
      setTokens(data.access, data.refresh ?? refresh)
      return data.access
    } catch {
      return null
    } finally {
      refreshPromise = null
    }
  })()

  return refreshPromise
}

export interface ApiClientOptions extends Omit<RequestInit, 'body'> {
  locale?: Locale
  body?: unknown
  auth?: boolean
  /** Internal — prevents infinite refresh/retry loops */
  _retry?: boolean
}

async function parseResponse<T>(response: Response): Promise<T> {
  if (response.status === 204) return undefined as T
  return response.json() as Promise<T>
}

async function parseErrorResponse(response: Response): Promise<ApiError> {
  let errorBody: unknown
  try {
    errorBody = await response.json()
  } catch {
    errorBody = await response.text()
  }
  const message =
    typeof errorBody === 'object' && errorBody !== null && 'detail' in errorBody
      ? String((errorBody as { detail: unknown }).detail)
      : `Request failed (${response.status})`
  return new ApiError(response.status, message, errorBody)
}

export async function apiClient<T>(
  path: string,
  options: ApiClientOptions = {},
): Promise<T> {
  const { locale, body, auth = true, headers: customHeaders, _retry = false, ...rest } = options

  const headers = new Headers(customHeaders)
  headers.set('Content-Type', 'application/json')

  if (locale) {
    Object.entries(apiLocaleHeader(locale)).forEach(([k, v]) => headers.set(k, v))
  }

  if (auth) {
    const token = getAccessToken()
    if (token) headers.set('Authorization', `Bearer ${token}`)
  }

  const response = await fetch(`${API_BASE}${path}`, {
    ...rest,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })

  if (response.status === 401 && auth && !_retry && !isAuthRefreshPath(path)) {
    const newAccess = await refreshAccessToken()
    if (newAccess) {
      return apiClient<T>(path, { ...options, _retry: true })
    }
    notifySessionExpired()
    throw new ApiError(401, 'Session expired')
  }

  if (!response.ok) {
    throw await parseErrorResponse(response)
  }

  return parseResponse<T>(response)
}

export { API_BASE }
