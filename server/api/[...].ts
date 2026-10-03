/**
 * Catch-all so /api/** always answers with JSON. Without it, an unmatched API
 * path or method (e.g. PATCH /api/transactions) falls through to Nitro's SPA
 * fallback and returns the app shell HTML with a 200.
 *
 * Nitro matches specific routes first, so this only runs when nothing else did.
 */
export default defineEventHandler((event) => {
  setResponseStatus(event, 404)
  return { error: 'Endpoint tidak ditemukan.' }
})
