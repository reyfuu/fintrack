<script setup lang="ts">
// Replaces vue-router's `{ path: '/:pathMatch(.*)*', redirect: '/' }`.
// Done in page middleware rather than setup so it resolves before any render.
definePageMeta({
  middleware: [() => navigateTo('/', { replace: true })],
})
</script>

<template>
  <div />
</template>
