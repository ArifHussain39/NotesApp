const BASE_URL = 'http://localhost:3001'

export const getToken = () =>
  typeof window !== 'undefined' ? localStorage.getItem('token') : null

export const authHeaders = (): Record<string, string> => {
  const token = getToken()
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }
}

export const apiFetch = (path: string, options?: RequestInit) =>
  fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: { ...authHeaders(), ...(options?.headers as Record<string, string>) },
  })
