<template>
  <Dashboard
    :summary="fintrack.summary.value"
    :transactions="fintrack.transactions.value"
    :wallet-summary="fintrack.walletSummary.value"
    :monthly-summary="fintrack.monthlySummary.value"
    @add-transaction="fintrack.goToAdd()"
  />
</template>

<script setup lang="ts">
useHead({ title: 'Overview' })
const fintrack = useFintrack()
</script>
