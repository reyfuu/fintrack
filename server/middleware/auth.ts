import { AUTH_COOKIE, verifyToken } from '../utils/auth'

/**
 * The API is single-tenant with no users table, so every route is guarded by one
 * shared passcode. Without this, deploying to Vercel would let anyone who finds
 * the URL POST, PUT and DELETE financial records.
 *
 * Only /api/** is guarded — the SPA shell and its assets must stay reachable so
 * the login page can load.
 */
export default defineEventHandler((event) => {
  const path = getRequestURL(event).pathname

  if (!path.startsWith('/api/')) return
  if (path.startsWith('/api/auth/')) return

  if (!verifyToken(getCookie(event, AUTH_COOKIE))) {
    setResponseStatus(event, 401)
    return { error: 'Unauthorized' }
  }
})
