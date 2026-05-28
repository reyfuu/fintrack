<template>
  <div class="card list-card-flat">
    <div class="list-header-flat">
      <div>
        <h3 class="list-title-text">All Transactions</h3>
        <p class="list-subtitle-text">Manage and monitor all transaction records</p>
      </div>
      <span class="badge-flat">{{ transactions.length }} total</span>
    </div>

    <!-- Filter & Search Bar -->
    <div class="toolbar-flat">
      <div class="filter-group-flat">
        <button
          v-for="f in filters"
          :key="f.id"
          class="filter-btn-flat"
          :class="{ 'filter-btn-flat--active': activeFilter === f.id }"
          @click="activeFilter = f.id"
        >
          {{ f.label }}
        </button>
      </div>

      <div class="search-wrapper-flat">
        <div class="search-icon-flat">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
        </div>
        <input v-model="search" class="search-input-flat" type="text" placeholder="Search transaction…" />
      </div>
    </div>

    <div v-if="filtered.length === 0" class="empty-state-view">
      <div class="empty-icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
      </div>
      <span>No matching records found.</span>
    </div>

    <div v-else class="table-container">
      <table class="tx-table-flat">
        <thead>
          <tr>
            <th>Transaction</th>
            <th>Category</th>
            <th>Date</th>
            <th class="text-right">Amount</th>
            <th class="td-action"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="tx in filtered" :key="tx.id" class="tx-row-flat">
            <td>
              <div class="tx-description-cell">
                <span class="tx-type-dot" :class="tx.type"></span>
                <span class="tx-desc-title">{{ tx.description || '—' }}</span>
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
            <td class="td-action">
              <button @click="remove(tx.id)" class="del-btn-flat" title="Delete record">
                <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  transactions: { type: Array, required: true }
});

const emit = defineEmits(['transaction-deleted']);

const activeFilter = ref('all');
const search = ref('');

const filters = [
  { id: 'all', label: 'All' },
  { id: 'income', label: 'Income' },
  { id: 'expense', label: 'Expense' },
];

const filtered = computed(() => {
  let list = props.transactions;
  if (activeFilter.value !== 'all') {
    list = list.filter(t => t.type === activeFilter.value);
  }
  if (search.value.trim()) {
    const q = search.value.toLowerCase();
    list = list.filter(t =>
      t.category.toLowerCase().includes(q) ||
      (t.description || '').toLowerCase().includes(q)
    );
  }
  return list;
});

const formatDate = (d) => {
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const remove = async (id) => {
  if (!confirm('Permanently delete this transaction record?')) return;
  try {
    const res = await fetch(`/api/transactions/${id}`, { method: 'DELETE' });
    if (res.ok) emit('transaction-deleted');
  } catch (e) {
    console.error('Delete failed:', e);
  }
};
</script>

<style scoped>
.list-card-flat {
  display: flex;
  flex-direction: column;
}

.list-header-flat {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
}

.list-title-text {
  margin: 0;
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--text-primary);
}

.list-subtitle-text {
  margin: 2px 0 0 0;
  font-size: 0.75rem;
  color: var(--text-secondary);
}

.badge-flat {
  font-size: 0.72rem;
  background: var(--surface-2);
  border: 1px solid var(--border);
  color: var(--text-secondary);
  padding: 3px 8px;
  border-radius: 4px;
  font-weight: 500;
}

/* Toolbar: Filters and Search */
.toolbar-flat {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.filter-group-flat {
  display: flex;
  background: var(--surface-2);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  padding: 3px;
  gap: 4px;
}

.filter-btn-flat {
  padding: 6px 12px;
  border: 1px solid transparent;
  background: transparent;
  color: var(--text-secondary);
  border-radius: var(--radius-sm);
  font-size: 0.8rem;
  font-weight: 500;
  font-family: inherit;
  cursor: pointer;
  transition: all 0.15s ease;
}

.filter-btn-flat:hover:not(.filter-btn-flat--active) {
  color: var(--text-primary);
  background: rgba(255, 255, 255, 0.02);
}

.filter-btn-flat--active {
  background: var(--accent-dim);
  color: var(--accent);
  border-color: rgba(99, 102, 241, 0.2);
  font-weight: 600;
}

.search-wrapper-flat {
  position: relative;
  display: flex;
  align-items: center;
  flex-grow: 0;
  width: 240px;
}

.search-input-flat {
  width: 100%;
  padding: 8px 12px 8px 32px;
  background: var(--surface-2);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  color: var(--text-primary);
  font-size: 0.85rem;
  font-family: inherit;
  outline: none;
  transition: all 0.15s ease;
}

.search-input-flat:focus {
  border-color: rgba(99, 102, 241, 0.5);
  background: var(--surface);
  box-shadow: 0 0 0 1px rgba(99, 102, 241, 0.15);
}

.search-input-flat::placeholder {
  color: var(--text-secondary);
  opacity: 0.5;
}

.search-icon-flat {
  position: absolute;
  left: 12px;
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  pointer-events: none;
  opacity: 0.7;
}

/* Flat Table Styling */
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
  padding: 11px 12px;
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

.td-action {
  width: 40px;
  text-align: center;
  padding: 0;
}

.del-btn-flat {
  background: transparent;
  border: 1px solid transparent;
  color: var(--text-secondary);
  cursor: pointer;
  padding: 6px;
  border-radius: var(--radius-sm);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s ease;
  opacity: 0;
}

.tx-row-flat:hover .del-btn-flat {
  opacity: 1;
}

.del-btn-flat:hover {
  background: var(--red-dim);
  border-color: rgba(244, 63, 94, 0.2);
  color: var(--red);
}

/* Empty State */
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

@media (max-width: 768px) {
  .toolbar-flat {
    flex-direction: column;
    align-items: stretch;
  }
  
  .search-wrapper-flat {
    width: 100%;
  }
}

@media (max-width: 640px) {
  .tx-table-flat th:nth-child(2),
  .tx-table-flat td:nth-child(2) {
    display: none;
  }
}
</style>
