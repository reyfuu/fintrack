<script setup lang="ts">
const colorMode = useColorMode()

// `preference` is what the user chose ('system' | 'light' | 'dark');
// `value` is what that resolved to. Toggling writes an explicit preference.
const isDark = computed(() => colorMode.value === 'dark')

const toggle = () => {
  colorMode.preference = isDark.value ? 'light' : 'dark'
}
</script>

<template>
  <button
    type="button"
    class="flex items-center justify-center p-1.5 rounded text-muted hover:text-fg hover:bg-fg/[0.04] transition-colors cursor-pointer"
    :title="isDark ? 'Mode terang' : 'Mode gelap'"
    :aria-label="isDark ? 'Mode terang' : 'Mode gelap'"
    @click="toggle"
  >
    <!-- ClientOnly: the icon depends on the resolved theme, which is only known
         in the browser. Without it the button flickers on first paint. -->
    <ClientOnly>
      <svg
        v-if="isDark"
        xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24"
        fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
      >
        <circle cx="12" cy="12" r="5" />
        <line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" />
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
        <line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" />
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
      </svg>
      <svg
        v-else
        xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24"
        fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
      >
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
      </svg>
      <template #fallback>
        <span class="block w-[17px] h-[17px]" />
      </template>
    </ClientOnly>
  </button>
</template>
