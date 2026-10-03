<template>
  <div class="animate-fadein flex justify-center">
    <div class="w-full max-w-[480px]">
      <TransactionForm @transaction-added="onAdded" />
    </div>
  </div>
</template>

<script setup lang="ts">
useHead({ title: 'Add Transaction' })
const fintrack = useFintrack()

const onAdded = async () => {
  await fintrack.fetchData()
  fintrack.goToTransactions()
}
</script>
