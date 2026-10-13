// Thin client for api-contract.md. Every error arrives as { code, message, details }.
const BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1'

export class ApiError extends Error {
  constructor(status, body) {
    super(body?.message || 'Error inesperado.')
    this.status = status
    this.code = body?.code
    this.details = body?.details || []
  }
}

export function getSession() {
  try {
    return JSON.parse(sessionStorage.getItem('session')) || null
  } catch {
    return null
  }
}

export function setSession(session) {
  if (session) sessionStorage.setItem('session', JSON.stringify(session))
  else sessionStorage.removeItem('session')
}

export async function api(path, { method = 'GET', body, query } = {}) {
  const url = new URL(BASE + path)
  Object.entries(query || {}).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') url.searchParams.set(k, v)
  })
  const session = getSession()
  const headers = { Accept: 'application/json' }
  if (body !== undefined) headers['Content-Type'] = 'application/json'
  if (session?.token) headers.Authorization = `Bearer ${session.token}`

  const res = await fetch(url, { method, headers, body: body === undefined ? undefined : JSON.stringify(body) })
  if (res.status === 204) return null
  const data = await res.json().catch(() => null)
  if (!res.ok) {
    if (res.status === 401 && path !== '/auth/login') setSession(null)
    throw new ApiError(res.status, data)
  }
  return data
}
