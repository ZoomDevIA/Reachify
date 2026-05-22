const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000').replace(/\/$/, '')

const AUTH_SESSION_KEY = 'reachify.authSession'
const AUTH_USER_KEY = 'reachify.authUser'
const PENDING_VERIFICATION_EMAIL_KEY = 'reachify.pendingVerificationEmail'

async function request(path, options = {}) {
  let response

  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers ?? {}),
      },
      ...options,
    })
  } catch {
    const error = new Error(
      'Nao foi possivel conectar ao backend. Verifique se a API PHP esta rodando em http://localhost:8000.'
    )
    error.code = 'network_error'
    error.status = 0
    error.meta = { api_base_url: API_BASE_URL }
    throw error
  }

  const payload = await response.json().catch(() => ({}))

  if (!response.ok || payload.success === false) {
    const error = new Error(payload.error?.message ?? 'Nao foi possivel concluir a requisicao.')
    error.code = payload.error?.code ?? 'request_failed'
    error.status = response.status
    error.meta = payload.error?.meta ?? {}
    throw error
  }

  return payload.data ?? {}
}

export async function registerUser(email, password) {
  return request('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })
}

export async function verifyEmailCode(email, code) {
  const data = await request('/api/auth/verify-email', {
    method: 'POST',
    body: JSON.stringify({ email, code }),
  })

  persistSession(data)
  clearPendingVerificationEmail()

  return data
}

export async function resendEmailCode(email) {
  return request('/api/auth/resend-code', {
    method: 'POST',
    body: JSON.stringify({ email }),
  })
}

export async function loginUser(email, password) {
  const data = await request('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })

  persistSession(data)

  return data
}

export function persistPendingVerificationEmail(email) {
  window.localStorage.setItem(PENDING_VERIFICATION_EMAIL_KEY, email)
}

export function getPendingVerificationEmail() {
  return window.localStorage.getItem(PENDING_VERIFICATION_EMAIL_KEY)
}

export function clearPendingVerificationEmail() {
  window.localStorage.removeItem(PENDING_VERIFICATION_EMAIL_KEY)
}

export function persistSession(data) {
  if (data.session) {
    window.localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(data.session))
  }

  if (data.user) {
    window.localStorage.setItem(AUTH_USER_KEY, JSON.stringify(data.user))
  }
}

export function getStoredSession() {
  const rawSession = window.localStorage.getItem(AUTH_SESSION_KEY)

  if (!rawSession) {
    return null
  }

  try {
    return JSON.parse(rawSession)
  } catch {
    return null
  }
}

export function getStoredUser() {
  const rawUser = window.localStorage.getItem(AUTH_USER_KEY)

  if (!rawUser) {
    return null
  }

  try {
    return JSON.parse(rawUser)
  } catch {
    return null
  }
}

export function clearStoredSession() {
  window.localStorage.removeItem(AUTH_SESSION_KEY)
  window.localStorage.removeItem(AUTH_USER_KEY)
}

export function getPasswordStrength(password) {
  const normalizedPassword = String(password ?? '')
  const hasMinLength = normalizedPassword.length >= 8
  const hasUppercase = /[A-Z]/.test(normalizedPassword)
  const hasNumber = /[0-9]/.test(normalizedPassword)
  const hasSymbol = /[^A-Za-z0-9]/.test(normalizedPassword)
  const score = [hasMinLength, hasUppercase, hasNumber, hasSymbol].filter(Boolean).length

  if (normalizedPassword.length === 0) {
    return { level: 0, label: 'Minimo de 8 caracteres, letra maiuscula, numero e simbolo.', tone: 'neutral', isStrong: false }
  }

  if (score <= 1) {
    return { level: 1, label: 'Senha fraca', tone: 'weak', isStrong: false }
  }

  if (score <= 3) {
    return { level: 2, label: 'Senha media', tone: 'medium', isStrong: false }
  }

  return { level: 3, label: 'Senha forte', tone: 'strong', isStrong: true }
}
