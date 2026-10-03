import type { WalletSummary, WalletStats } from '#shared/types/fintrack'

const zero = (): WalletStats => ({ totalIncome: 0, totalExpense: 0, balance: 0 })

export default defineEventHandler(async () => {
  const rows = await dbQuery<{ wallet: 'cash' | 'digital', totalIncome: number, totalExpense: number }>(
    `SELECT
       wallet,
       COALESCE(SUM(CASE WHEN type = 'income'  THEN amount ELSE 0 END), 0)::float8 AS "totalIncome",
       COALESCE(SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END), 0)::float8 AS "totalExpense"
     FROM transactions
     GROUP BY wallet`,
  )

  // Both keys are always present, even for a wallet with no rows — the topbar
  // and the dashboard cards read them unconditionally.
  const summary: WalletSummary = { cash: zero(), digital: zero() }

  for (const r of rows) {
    if (r.wallet !== 'cash' && r.wallet !== 'digital') continue
    summary[r.wallet] = {
      totalIncome: r.totalIncome,
      totalExpense: r.totalExpense,
      balance: r.totalIncome - r.totalExpense,
    }
  }

  return summary
})
