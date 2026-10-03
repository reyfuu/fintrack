import { checkPasscode, issueToken, setSessionCookie } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  const body = await readBody<{ passcode?: unknown }>(event) ?? {}

  if (!checkPasscode(body.passcode)) {
    // Flat delay on failure. There is no rate limiter here, so this is the only
    // thing slowing a brute force attempt against a short passcode.
    await new Promise(resolve => setTimeout(resolve, 600))
    setResponseStatus(event, 401)
    return { error: 'Passcode salah.' }
  }

  setSessionCookie(event, issueToken())
  return { ok: true }
})
