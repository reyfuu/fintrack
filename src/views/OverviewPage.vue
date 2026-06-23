<template>
  <Dashboard
    :summary="fintrack.summary.value"
    :transactions="fintrack.transactions.value"
    :walletSummary="fintrack.walletSummary.value"
    :monthlySummary="fintrack.monthlySummary.value"
    @add-transaction="fintrack.goToAdd()"
  />
</template>

<script setup lang="ts">
import { inject } from 'vue'
import Dashboard from '../components/Dashboard.vue'
import { fintrackKey } from '../composables/useFintrack'

const fintrack = inject(fintrackKey)!
</script>
