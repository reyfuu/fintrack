import type {
  MonthlySummary,
  Summary,
  Transaction,
  WalletSummary,
} from '#shared/types/fintrack'

const emptySummary = (): Summary => ({ totalIncome: 0, totalExpense: 0, balance: 0 })

/**
 * Replaces the provide/inject store. useState is keyed-global and auto-imported,
 * so pages no longer need an InjectionKey import, and the old `inject(key)!`
 * non-null assertion — which was only safe because App.vue happened to provide
 * first — is gone.
 *
 * The returned shape is deliberately unchanged (a plain object of refs) so
 * existing templates keep reading fintrack.summary.value etc.
 */
export function useFintrack() {
  const router = useRouter()

  const transactions = useState<Transaction[]>('fintrack:transactions', () => [])
  const summary = useState<Summary>('fintrack:summary', emptySummary)
  const walletSummary = useState<WalletSummary>('fintrack:wallets', () => ({
    cash: emptySummary(),
    digital: emptySummary(),
  }))
  const monthlySummary = useState<MonthlySummary[]>('fintrack:monthly', () => [])
  const editingTransaction = useState<Transaction | null>('fintrack:editing', () => null)

  const fetchData = async () => {
    try {
      const [tx, sum, wallets, monthly] = await Promise.all([
        $fetch<Transaction[]>('/api/transactions'),
        $fetch<Summary>('/api/summary'),
        $fetch<WalletSummary>('/api/summary/wallets'),
        $fetch<MonthlySummary[]>('/api/summary/monthly'),
      ])
      transactions.value = tx
      summary.value = sum
      walletSummary.value = wallets
      monthlySummary.value = monthly
    } catch (error) {
      console.error('Failed to fetch data:', error)
    }
  }

  const startEdit = (tx: Transaction) => {
    editingTransaction.value = tx
    router.push('/transactions')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const clearEdit = () => {
    editingTransaction.value = null
  }

  const onSaved = async () => {
    await fetchData()
    editingTransaction.value = null
  }

  const goToAdd = () => router.push('/add')
  const goToTransactions = () => router.push('/transactions')

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
