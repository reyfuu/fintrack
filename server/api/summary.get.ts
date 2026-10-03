import type { Summary } from '#shared/types/fintrack'

export default defineEventHandler(async (event) => {
  const { month, wallet } = getQuery(event)

  const conditions: string[] = []
  const params: unknown[] = []

  if (month !== undefined && month !== '') {
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

  // ::float8 in SQL rather than parseFloat in JS — SUM() over NUMERIC also
  // comes back as a string.
  const [row] = await dbQuery<{ totalIncome: number, totalExpense: number }>(
    `SELECT
       COALESCE(SUM(CASE WHEN type = 'income'  THEN amount ELSE 0 END), 0)::float8 AS "totalIncome",
       COALESCE(SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END), 0)::float8 AS "totalExpense"
     FROM transactions ${where}`,
    params,
  )

  const totalIncome = row?.totalIncome ?? 0
  const totalExpense = row?.totalExpense ?? 0

  return { totalIncome, totalExpense, balance: totalIncome - totalExpense } satisfies Summary
})
