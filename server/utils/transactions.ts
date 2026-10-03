import type { H3Event } from 'h3'
import type { Wallet } from '#shared/types/fintrack'

/**
 * Explicit projection instead of SELECT *.
 *
 * pg returns NUMERIC as a string and BIGSERIAL as a string, and parses DATE to
 * a JS Date at *local* midnight. Shipping those raw caused two live bugs:
 *
 *  - Dashboard's category breakdown did `(map[cat] || 0) + t.amount`, which
 *    string-concatenated ("0150000.00" + "20000.00") and rendered NaN% with a
 *    blank doughnut for any category holding 2+ expenses.
 *  - A DATE serialised to '...T17:00:00.000Z' on a WIB machine, so the edit
 *    form's `date.split('T')[0]` prefilled the previous day.
 *
 * Casting here fixes both without touching the components, and makes the
 * Transaction interface honest.
 */
export const txColumns = `
  id::int                      AS id,
  type,
  amount::float8               AS amount,
  category,
  to_char(date, 'YYYY-MM-DD')  AS date,
  description,
  wallet,
  created_at
`

const WALLETS = ['cash', 'digital'] as const

export const normalizeWallet = (w: unknown): Wallet =>
  WALLETS.includes(w as Wallet) ? (w as Wallet) : 'cash'

export const isWallet = (v: unknown): v is Wallet => WALLETS.includes(v as Wallet)
export const isMonth = (v: unknown): v is string => typeof v === 'string' && /^\d{4}-\d{2}$/.test(v)
export const isDate = (v: unknown): v is string => typeof v === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(v)

/**
 * 400 responses keep Express's `{ error: string }` body shape, which
 * TransactionForm.vue reads as `data.error`. createError() would emit
 * `{ statusCode, statusMessage, message }` instead and every field-level
 * validation message would collapse into the generic "Terjadi kesalahan."
 */
export function badRequest(event: H3Event, message: string) {
  setResponseStatus(event, 400)
  return { error: message }
}

export function notFound(event: H3Event, message = 'Transaksi tidak ditemukan.') {
  setResponseStatus(event, 404)
  return { error: message }
}

/** Shared body validation for POST and PUT. Returns an error string, or null. */
export function validateTxBody(body: Record<string, unknown>): string | null {
  const { type, amount, category, date } = body
  if (!type || !amount || !category || !date) {
    return 'Field type, amount, category, dan date wajib diisi.'
  }
  if (type !== 'income' && type !== 'expense') {
    return 'Type harus income atau expense.'
  }
  const amountNum = Number(amount)
  if (!Number.isFinite(amountNum) || amountNum <= 0) {
    return 'Amount harus lebih dari 0.'
  }
  if (!isDate(date)) {
    return 'Date harus format YYYY-MM-DD.'
  }
  return null
}
