import type { MonthlySummary } from '#shared/types/fintrack'

export default defineEventHandler(async () => {
  const rows = await dbQuery<{ month: string, income: number, expense: number }>(
    `SELECT
       to_char(date, 'YYYY-MM') AS month,
       COALESCE(SUM(CASE WHEN type = 'income'  THEN amount ELSE 0 END), 0)::float8 AS income,
       COALESCE(SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END), 0)::float8 AS expense
     FROM transactions
     GROUP BY to_char(date, 'YYYY-MM')
     ORDER BY month DESC
     LIMIT 12`,
  )

  return rows.map(r => ({
    month: r.month,
    income: r.income,
    expense: r.expense,
    balance: r.income - r.expense,
  })) satisfies MonthlySummary[]
})
