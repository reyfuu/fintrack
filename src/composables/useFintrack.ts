import { ref, type InjectionKey, type Ref } from 'vue'
import { useRouter } from 'vue-router'

export interface Summary {
  totalIncome: number
  totalExpense: number
  balance: number
}

export interface WalletStats {
  totalIncome: number
  totalExpense: number
  balance: number
}

export interface Transaction {
  id: number
  type: 'income' | 'expense'
  amount: number
  category: string
  date: string
  description?: string
  wallet?: 'cash' | 'digital'
}

export interface MonthlySummary {
  month: string
  income: number
  expense: number
  balance: number
}

export interface FintrackContext {
  transactions: Ref<Transaction[]>
  summary: Ref<Summary>
  walletSummary: Ref<{ cash: WalletStats; digital: WalletStats }>
  monthlySummary: Ref<MonthlySummary[]>
  editingTransaction: Ref<Transaction | null>
  fetchData: () => Promise<void>
  startEdit: (tx: Transaction) => void
  clearEdit: () => void
  onSaved: () => Promise<void>
  goToAdd: () => void
  goToTransactions: () => void
}

export const fintrackKey: InjectionKey<FintrackContext> = Symbol('fintrack')

export function useFintrackProvider(): FintrackContext {
  const router = useRouter()

  const transactions = ref<Transaction[]>([])
  const summary = ref<Summary>({ totalIncome: 0, totalExpense: 0, balance: 0 })
  const walletSummary = ref({
    cash: { totalIncome: 0, totalExpense: 0, balance: 0 },
    digital: { totalIncome: 0, totalExpense: 0, balance: 0 },
  })
  const monthlySummary = ref<MonthlySummary[]>([])
  const editingTransaction = ref<Transaction | null>(null)

  const fetchData = async () => {
    try {
      const [txRes, sumRes, walletRes, monthlyRes] = await Promise.all([
        fetch('/api/transactions'),
        fetch('/api/summary'),
        fetch('/api/summary/wallets'),
        fetch('/api/summary/monthly'),
      ])

      if (!txRes.ok || !sumRes.ok || !walletRes.ok || !monthlyRes.ok) {
        throw new Error('API response not ok')
      }

      transactions.value = await txRes.json()
      summary.value = await sumRes.json()
      walletSummary.value = await walletRes.json()
      monthlySummary.value = await monthlyRes.json()
    } catch (error) {
      console.error('Failed to fetch data:', error)
    }
  }

  const startEdit = (tx: Transaction) => {
    editingTransaction.value = tx
    router.push({ name: 'transactions' })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const clearEdit = () => {
    editingTransaction.value = null
  }

  const onSaved = async () => {
    await fetchData()
    editingTransaction.value = null
  }

  const goToAdd = () => router.push({ name: 'add' })
  const goToTransactions = () => router.push({ name: 'transactions' })

  return {
    transactions,
    summary,
    walletSummary,
    monthlySummary,
    editingTransaction,
    fetchData,
    startEdit,
    clearEdit,
    onSaved,
    goToAdd,
    goToTransactions,
  }
}
