import { AUTH_COOKIE, verifyToken } from '../../utils/auth'

/** Lets the SPA ask whether the httpOnly cookie is still valid. */
export default defineEventHandler(event => ({
  authenticated: verifyToken(getCookie(event, AUTH_COOKIE)),
}))
