/** Shared between the Vue app and the Nitro handlers (auto-imported via #shared). */

export interface Summary {
  totalIncome: number
  totalExpense: number
  balance: number
}

export type WalletStats = Summary

export type Wallet = 'cash' | 'digital'

export interface Transaction {
  id: number
  type: 'income' | 'expense'
  amount: number
  /** Plain calendar date, 'YYYY-MM-DD' — never a timestamp. See server/utils/transactions.ts. */
  date: string
  category: string
  description?: string
  wallet?: Wallet
  created_at?: string
}

export interface MonthlySummary {
  /** 'YYYY-MM' */
  month: string
  income: number
  expense: number
  balance: number
}

export interface WalletSummary {
  cash: WalletStats
  digital: WalletStats
}
