import { createHmac, randomBytes, timingSafeEqual } from 'node:crypto'

export const AUTH_COOKIE = 'fintrack_auth'

const SESSION_MAX_AGE = 60 * 60 * 24 * 30 // 30 days

/** Fail closed: without these configured, nothing can authenticate. */
function requireEnv(name: 'APP_PASSCODE' | 'AUTH_SECRET'): string {
  const value = process.env[name]
  if (!value) {
    console.error(`[auth] ${name} is not configured — refusing all requests`)
    throw createError({ statusCode: 500, statusMessage: 'Server auth is not configured' })
  }
  return value
}

/** Constant-time string compare that does not leak length via early return. */
function safeEqual(a: string, b: string): boolean {
  const ha = createHmac('sha256', 'cmp').update(a).digest()
  const hb = createHmac('sha256', 'cmp').update(b).digest()
  return timingSafeEqual(ha, hb)
}

/**
 * Session token: <issuedAt>.<nonce>.<hmac>. The HMAC covers the first two
 * parts, so the cookie cannot be forged without AUTH_SECRET and carries its own
 * expiry — no server-side session store needed.
 */
export function issueToken(): string {
  const payload = `${Date.now()}.${randomBytes(12).toString('base64url')}`
  const mac = createHmac('sha256', requireEnv('AUTH_SECRET')).update(payload).digest('base64url')
  return `${payload}.${mac}`
}

export function verifyToken(token: string | undefined): boolean {
  if (!token) return false

  const parts = token.split('.')
  if (parts.length !== 3) return false

  const [issuedAt, nonce, mac] = parts as [string, string, string]
  const payload = `${issuedAt}.${nonce}`

  const expected = createHmac('sha256', requireEnv('AUTH_SECRET')).update(payload).digest('base64url')
  if (!safeEqual(mac, expected)) return false

  const age = (Date.now() - Number(issuedAt)) / 1000
  return Number.isFinite(age) && age >= 0 && age < SESSION_MAX_AGE
}

export function checkPasscode(candidate: unknown): boolean {
  if (typeof candidate !== 'string' || candidate.length === 0) return false
  return safeEqual(candidate, requireEnv('APP_PASSCODE'))
}

export function setSessionCookie(event: Parameters<typeof setCookie>[0], token: string): void {
  setCookie(event, AUTH_COOKIE, token, {
    httpOnly: true,
    // import.meta.dev is false in the Vercel build, so this is secure in prod
    // and still works over plain http on localhost.
    secure: !import.meta.dev,
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_MAX_AGE,
  })
}
