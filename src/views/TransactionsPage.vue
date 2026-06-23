<template>
  <div class="grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-6 items-start animate-fadein">
    <TransactionForm
      :editData="fintrack.editingTransaction.value"
      @transaction-added="fintrack.onSaved"
      @cancel-edit="fintrack.clearEdit()"
    />
    <TransactionList
      :transactions="fintrack.transactions.value"
      :editingId="fintrack.editingTransaction.value?.id"
      @transaction-deleted="fintrack.fetchData"
      @edit-transaction="fintrack.startEdit"
    />
  </div>
</template>

<script setup lang="ts">
import { inject } from 'vue'
import TransactionForm from '../components/TransactionForm.vue'
import TransactionList from '../components/TransactionList.vue'
import { fintrackKey } from '../composables/useFintrack'

const fintrack = inject(fintrackKey)!
</script>
