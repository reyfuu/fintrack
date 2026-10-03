/**
 * Single definition of the IDR formatter. This was previously duplicated
 * verbatim in App.vue, Dashboard.vue and TransactionList.vue.
 * Auto-imported by Nuxt in both the app and the server.
 */
export function formatIDR(value: number | string): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(Number(value))
}
