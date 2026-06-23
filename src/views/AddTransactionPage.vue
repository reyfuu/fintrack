<template>
  <div class="animate-fadein flex justify-center">
    <div class="w-full max-w-[480px]">
      <TransactionForm @transaction-added="onAdded" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { inject } from 'vue'
import TransactionForm from '../components/TransactionForm.vue'
import { fintrackKey } from '../composables/useFintrack'

const fintrack = inject(fintrackKey)!

const onAdded = async () => {
  await fintrack.fetchData()
  fintrack.goToTransactions()
}
</script>
