<template>
  <div class="grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-6 items-start animate-fadein">
    <!--
      ?? undefined: TransactionForm declares editData with `type: Object`, so its
      external prop type is Object | undefined rather than Object | null. Its
      watch treats both as "not editing".
    -->
    <TransactionForm
      :edit-data="fintrack.editingTransaction.value ?? undefined"
      @transaction-added="fintrack.onSaved"
      @cancel-edit="fintrack.clearEdit()"
    />
    <TransactionList
      :transactions="fintrack.transactions.value"
      :editing-id="fintrack.editingTransaction.value?.id"
      @transaction-deleted="fintrack.fetchData"
      @edit-transaction="fintrack.startEdit"
    />
  </div>
</template>

<script setup lang="ts">
useHead({ title: 'Transactions' })
const fintrack = useFintrack()
</script>
