import type { Transaction } from '#shared/types/fintrack'

export default defineEventHandler(async (event) => {
  const { month, wallet } = getQuery(event)

  const conditions: string[] = []
  const params: unknown[] = []

  if (month !== undefined && month !== '') {
    // Express let a malformed month through to Postgres and returned a 500.
    if (!isMonth(month)) return badRequest(event, 'Query month harus format YYYY-MM.')
    params.push(month)
    conditions.push(`to_char(date, 'YYYY-MM') = $${params.length}`)
  }

  if (wallet !== undefined && wallet !== '') {
    if (!isWallet(wallet)) return badRequest(event, 'Query wallet harus cash atau digital.')
    params.push(wallet)
    conditions.push(`wallet = $${params.length}`)
  }

  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : ''

  return await dbQuery<Transaction>(
    `SELECT ${txColumns} FROM transactions ${where} ORDER BY date DESC, created_at DESC`,
    params,
  )
})
