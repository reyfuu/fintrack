<template>
  <div class="dashboard-view">
    <!-- KPI Row -->
    <div class="kpi-grid">
      <div class="kpi-card" v-for="kpi in kpiCards" :key="kpi.label">
        <div class="kpi-card__main">
          <span class="kpi-card__label">{{ kpi.label }}</span>
          <div class="kpi-card__value" :class="kpi.className">
            ${{ kpi.value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}
          </div>
        </div>
        <div class="kpi-card__icon" :class="kpi.className">
          <span v-html="kpi.icon"></span>
        </div>
      </div>
    </div>

    <!-- Main Grid -->
    <div class="dashboard-grid">
      <!-- Recent Activity Table -->
      <div class="card recent-activity">
        <div class="card-header">
          <div>
            <h3 class="card-title-text">Recent Activity</h3>
            <p class="card-subtitle-text">Latest financial events this month</p>
          </div>
          <span class="activity-badge">{{ transactions.length }} total</span>
        </div>

        <div v-if="recentTx.length === 0" class="empty-state-view">
          <div class="empty-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
          </div>
          <span>No activity logged yet.</span>
        </div>

        <div v-else class="table-container">
          <table class="tx-table-flat">
            <thead>
              <tr>
                <th>Transaction</th>
                <th>Category</th>
                <th>Date</th>
                <th class="text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="tx in recentTx" :key="tx.id" class="tx-row-flat">
                <td>
                  <div class="tx-description-cell">
                    <span class="tx-type-dot" :class="tx.type"></span>
                    <span class="tx-desc-title">{{ tx.description || tx.category }}</span>
                  </div>
                </td>
                <td>
                  <span class="tx-cat-label">{{ tx.category }}</span>
                </td>
                <td>
                  <span class="tx-date-label">{{ formatDate(tx.date) }}</span>
                </td>
                <td class="text-right">
                  <span class="tx-amount-label" :class="tx.type">
                    {{ tx.type === 'income' ? '+' : '-' }}${{ tx.amount.toFixed(2) }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Expense Breakdown -->
      <div class="card expense-breakdown">
        <div class="card-header">
          <div>
            <h3 class="card-title-text">Expense Breakdown</h3>
            <p class="card-subtitle-text">Distribution of spending by category</p>
          </div>
        </div>

        <div v-if="categoryBreakdown.length === 0" class="empty-state-view">
          <span>No expense breakdown available.</span>
        </div>

        <div v-else class="breakdown-container">
          <div v-for="cat in categoryBreakdown" :key="cat.name" class="breakdown-row">
            <div class="breakdown-info">
              <span class="breakdown-name">{{ cat.name }}</span>
              <span class="breakdown-value">${{ cat.amount.toFixed(2) }} <span class="breakdown-pct">({{ cat.pct.toFixed(0) }}%)</span></span>
            </div>
            <div class="breakdown-bar-bg">
              <div class="breakdown-bar-fill" :style="{ width: cat.pct + '%' }"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  summary: { type: Object, required: true },
  transactions: { type: Array, required: true }
});

const kpiCards = computed(() => [
  {
    label: 'Total Balance',
    value: props.summary.balance,
    className: props.summary.balance >= 0 ? 'income' : 'expense',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"></rect><line x1="2" y1="10" x2="22" y2="10"></line></svg>`
  },
  {
    label: 'Total Income',
    value: props.summary.totalIncome,
    className: 'income',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="19" x2="12" y2="5"></line><polyline points="5 12 12 5 19 12"></polyline></svg>`
  },
  {
    label: 'Total Expense',
    value: props.summary.totalExpense,
    className: 'expense',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><polyline points="19 12 12 19 5 12"></polyline></svg>`
  },
]);

const recentTx = computed(() => props.transactions.slice(0, 7));

const categoryBreakdown = computed(() => {
  const map = {};
  props.transactions
    .filter(t => t.type === 'expense')
    .forEach(t => {
      map[t.category] = (map[t.category] || 0) + t.amount;
    });

  const total = Object.values(map).reduce((s, v) => s + v, 0) || 1;
  return Object.entries(map)
    .sort((a, b) => b[1] - a[1])
    .map(([name, amount]) => ({ name, amount, pct: (amount / total) * 100 }));
});

const formatDate = (d) => {
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};
</script>

<style scoped>
.dashboard-view {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* KPI Cards Layout */
.kpi-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.kpi-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 20px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.15s ease;
}

.kpi-card:hover {
  border-color: rgba(255, 255, 255, 0.15);
  background: var(--surface-2);
}

.kpi-card__main {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.kpi-card__label {
  font-size: 0.72rem;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-weight: 600;
}

.kpi-card__value {
  font-size: 1.5rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  font-variant-numeric: tabular-nums;
  color: var(--text-primary);
}

.kpi-card__value.income {
  color: var(--green);
}

.kpi-card__value.expense {
  color: var(--red);
}

.kpi-card__icon {
  width: 36px;
  height: 36px;
  border-radius: var(--radius-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--surface-2);
  border: 1px solid var(--border);
  color: var(--text-secondary);
}

.kpi-card__icon.income {
  border-color: rgba(16, 185, 129, 0.2);
  color: var(--green);
  background: var(--green-dim);
}

.kpi-card__icon.expense {
  border-color: rgba(244, 63, 94, 0.2);
  color: var(--red);
  background: var(--red-dim);
}

/* Dashboard Content Grid */
.dashboard-grid {
  display: grid;
  grid-template-columns: 1.6fr 1fr;
  gap: 24px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
}

.card-title-text {
  margin: 0;
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--text-primary);
}

.card-subtitle-text {
  margin: 2px 0 0 0;
  font-size: 0.75rem;
  color: var(--text-secondary);
}

.activity-badge {
  font-size: 0.72rem;
  background: var(--surface-2);
  border: 1px solid var(--border);
  color: var(--text-secondary);
  padding: 3px 8px;
  border-radius: 4px;
  font-weight: 500;
}

/* Flat Sleek Table */
.table-container {
  overflow-x: auto;
}

.tx-table-flat {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
}

.tx-table-flat th {
  font-size: 0.7rem;
  font-weight: 600;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  padding: 10px 12px;
  border-bottom: 1px solid var(--border);
}

.tx-table-flat td {
  padding: 12px 12px;
  font-size: 0.85rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.03);
  vertical-align: middle;
}

.tx-table-flat tr:last-child td {
  border-bottom: none;
}

.tx-row-flat:hover td {
  background: rgba(255, 255, 255, 0.02);
}

.tx-description-cell {
  display: flex;
  align-items: center;
  gap: 10px;
}

.tx-type-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  flex-shrink: 0;
}

.tx-type-dot.income {
  background: var(--green);
}

.tx-type-dot.expense {
  background: var(--red);
}

.tx-desc-title {
  font-weight: 500;
  color: var(--text-primary);
}

.tx-cat-label {
  color: var(--text-secondary);
  background: var(--surface-2);
  border: 1px solid var(--border);
  padding: 2px 6px;
  border-radius: 3px;
  font-size: 0.75rem;
}

.tx-date-label {
  color: var(--text-secondary);
  font-size: 0.8rem;
}

.tx-amount-label {
  font-weight: 600;
  font-variant-numeric: tabular-nums;
}

.tx-amount-label.income {
  color: var(--green);
}

.tx-amount-label.expense {
  color: var(--text-primary);
}

.text-right {
  text-align: right;
}

/* Expense Breakdown */
.breakdown-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.breakdown-row {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.breakdown-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.85rem;
}

.breakdown-name {
  font-weight: 500;
  color: var(--text-primary);
}

.breakdown-value {
  font-weight: 600;
  color: var(--text-primary);
}

.breakdown-pct {
  font-weight: 400;
  color: var(--text-secondary);
  font-size: 0.75rem;
}

.breakdown-bar-bg {
  height: 4px;
  background: var(--surface-2);
  border-radius: 1px;
  overflow: hidden;
}

.breakdown-bar-fill {
  height: 100%;
  background: var(--accent);
  border-radius: 1px;
  transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Empty & Loader States */
.empty-state-view {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px 16px;
  color: var(--text-secondary);
  font-size: 0.82rem;
  gap: 8px;
}

.empty-icon {
  color: var(--text-secondary);
  opacity: 0.5;
}

@media (max-width: 900px) {
  .dashboard-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .kpi-grid {
    grid-template-columns: 1fr;
    gap: 12px;
  }
  
  .tx-table-flat th:nth-child(2),
  .tx-table-flat td:nth-child(2) {
    display: none;
  }
}
</style>
