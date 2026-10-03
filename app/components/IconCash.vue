<script setup lang="ts">
// Banknote. Feather-style to match the inline SVGs already used across the app,
// and stroke="currentColor" so it inherits the surrounding accent class —
// something the 💵 emoji it replaced could not do.
withDefaults(defineProps<{ size?: number }>(), { size: 16 })
</script>

<template>
  <svg
    xmlns="http://www.w3.org/2000/svg" :width="size" :height="size"
    viewBox="0 0 24 24" fill="none" stroke="currentColor"
    stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
    class="shrink-0" aria-hidden="true"
  >
    <rect x="2" y="6" width="20" height="12" rx="2" />
    <circle cx="12" cy="12" r="2" />
    <path d="M6 12h.01M18 12h.01" />
  </svg>
</template>
