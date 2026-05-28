<template>
  <div class="card form-card-flat">
    <div class="form-header">
      <h3 class="form-title-text">New Transaction</h3>
      <p class="form-subtitle-text">Record a new financial entry</p>
    </div>

    <form @submit.prevent="handleSubmit" class="form-flat">
      <!-- Type selector -->
      <div class="field-flat">
        <label class="field-label-flat">Transaction Type</label>
        <div class="seg-ctrl-flat">
          <button
            type="button"
            class="seg-btn-flat"
            :class="{ 'seg-btn-flat--active income': form.type === 'income' }"
            @click="form.type = 'income'; form.category = ''"
          >
            Income
          </button>
          <button
            type="button"
            class="seg-btn-flat"
            :class="{ 'seg-btn-flat--active expense': form.type === 'expense' }"
            @click="form.type = 'expense'; form.category = ''"
          >
            Expense
          </button>
        </div>
      </div>

      <!-- Amount -->
      <div class="field-flat">
        <label class="field-label-flat" for="amount">Amount</label>
        <div class="input-prefix-wrapper">
          <span class="currency-prefix">$</span>
          <input
            id="amount"
            type="number"
            v-model="form.amount"
            min="0.01"
            step="0.01"
            placeholder="0.00"
            required
            class="input-flat prefix-space"
          />
        </div>
      </div>

      <!-- Category -->
      <div class="field-flat">
        <label class="field-label-flat" for="category">Category</label>
        <div class="select-wrapper">
          <select id="category" v-model="form.category" required class="select-flat">
            <option value="" disabled>Select category…</option>
            <option v-for="c in categories" :key="c" :value="c">{{ c }}</option>
          </select>
          <div class="select-arrow">
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
          </div>
        </div>
      </div>

      <!-- Date -->
      <div class="field-flat">
        <label class="field-label-flat" for="date">Date</label>
        <input id="date" type="date" v-model="form.date" required class="input-flat" />
      </div>

      <!-- Description -->
      <div class="field-flat">
        <div class="label-with-aside">
          <label class="field-label-flat" for="desc">Note</label>
          <span class="aside-text">Optional</span>
        </div>
        <input id="desc" type="text" v-model="form.description" placeholder="Reference note…" class="input-flat" />
      </div>

      <button type="submit" class="submit-btn-flat" :class="form.type" :disabled="loading">
        <span v-if="loading">Processing…</span>
        <span v-else>Save {{ form.type === 'income' ? 'Income' : 'Expense' }}</span>
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const emit = defineEmits(['transaction-added']);
const loading = ref(false);

const form = ref({
  type: 'expense',
  amount: '',
  category: '',
  date: new Date().toISOString().split('T')[0],
  description: ''
});

const incomeCategories = ['Salary', 'Freelance', 'Investments', 'Bonus', 'Other'];
const expenseCategories = ['Food', 'Transport', 'Utilities', 'Entertainment', 'Shopping', 'Health', 'Other'];

const categories = computed(() =>
  form.value.type === 'income' ? incomeCategories : expenseCategories
);

const handleSubmit = async () => {
  if (!form.value.amount || !form.value.category || !form.value.date) return;
  loading.value = true;
  try {
    const res = await fetch('/api/transactions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form.value)
    });
    if (res.ok) {
      emit('transaction-added');
      form.value.amount = '';
      form.value.description = '';
      form.value.category = '';
    }
  } catch (e) {
    console.error('Save failed:', e);
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.form-card-flat {
  height: fit-content;
}

.form-header {
  margin-bottom: 20px;
}

.form-title-text {
  margin: 0;
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--text-primary);
}

.form-subtitle-text {
  margin: 2px 0 0 0;
  font-size: 0.75rem;
  color: var(--text-secondary);
}

.form-flat {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.field-flat {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.field-label-flat {
  font-size: 0.72rem;
  font-weight: 600;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.label-with-aside {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.aside-text {
  font-size: 0.7rem;
  color: var(--text-secondary);
  opacity: 0.6;
}

/* Segmented Control */
.seg-ctrl-flat {
  display: flex;
  background: var(--surface-2);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  padding: 3px;
  gap: 4px;
}

.seg-btn-flat {
  flex: 1;
  padding: 8px;
  border: 1px solid transparent;
  background: transparent;
  color: var(--text-secondary);
  border-radius: var(--radius-sm);
  cursor: pointer;
  font-size: 0.82rem;
  font-weight: 500;
  font-family: inherit;
  transition: all 0.15s ease;
}

.seg-btn-flat:hover:not(.seg-btn-flat--active) {
  color: var(--text-primary);
  background: rgba(255, 255, 255, 0.02);
}

.seg-btn-flat--active.income {
  background: var(--green-dim);
  color: var(--green);
  border-color: rgba(16, 185, 129, 0.2);
  font-weight: 600;
}

.seg-btn-flat--active.expense {
  background: var(--red-dim);
  color: var(--red);
  border-color: rgba(244, 63, 94, 0.2);
  font-weight: 600;
}

/* Inputs & Form Elements */
.input-flat, .select-flat {
  width: 100%;
  padding: 9px 12px;
  background: var(--surface-2);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  color: var(--text-primary);
  font-size: 0.88rem;
  font-family: inherit;
  outline: none;
  transition: all 0.15s ease;
}

.input-flat:focus, .select-flat:focus {
  border-color: rgba(99, 102, 241, 0.5);
  box-shadow: 0 0 0 1px rgba(99, 102, 241, 0.15);
  background: var(--surface);
}

.input-flat::placeholder {
  color: var(--text-secondary);
  opacity: 0.5;
}

.input-prefix-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.currency-prefix {
  position: absolute;
  left: 12px;
  color: var(--text-secondary);
  font-size: 0.88rem;
  pointer-events: none;
  font-weight: 500;
}

.prefix-space {
  padding-left: 24px;
}

/* Select wrapper styling */
.select-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.select-flat {
  appearance: none;
  -webkit-appearance: none;
  padding-right: 32px;
}

.select-arrow {
  position: absolute;
  right: 12px;
  color: var(--text-secondary);
  pointer-events: none;
  display: flex;
  align-items: center;
}

select option {
  background: var(--surface-2);
  color: var(--text-primary);
}

/* Date picker specific dark adjustments */
input[type="date"]::-webkit-calendar-picker-indicator {
  filter: invert(1) opacity(0.5);
  cursor: pointer;
}

/* Action button flat styling */
.submit-btn-flat {
  margin-top: 8px;
  padding: 11px;
  border: 1px solid transparent;
  border-radius: var(--radius-sm);
  font-size: 0.88rem;
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
  color: #ffffff;
  transition: all 0.15s ease;
}

.submit-btn-flat.income {
  background: var(--green);
}

.submit-btn-flat.income:hover:not(:disabled) {
  opacity: 0.9;
}

.submit-btn-flat.expense {
  background: var(--accent);
}

.submit-btn-flat.expense:hover:not(:disabled) {
  opacity: 0.9;
}

.submit-btn-flat:active:not(:disabled) {
  transform: translateY(1px);
}

.submit-btn-flat:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
</style>
