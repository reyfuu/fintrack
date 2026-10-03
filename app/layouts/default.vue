<template>
  <div class="flex h-screen overflow-hidden bg-bg">
    <!-- Sidebar Overlay (mobile) -->
    <div
      v-if="sidebarOpen"
      class="fixed inset-0 bg-black/60 z-[99] md:hidden"
      @click="sidebarOpen = false"
    />

    <!-- Sidebar -->
    <aside
      class="fixed md:static top-0 left-0 bottom-0 w-60 bg-surface border-r border-border flex flex-col z-[100] transition-transform duration-250 ease-[cubic-bezier(0.4,0,0.2,1)]"
      :class="sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'"
    >
      <!-- Brand -->
      <div class="flex items-center gap-2.5 px-6 h-16 border-b border-border shrink-0">
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-brand shrink-0"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
        <span class="font-bold text-[1.1rem] tracking-tight bg-gradient-to-br from-fg to-brand bg-clip-text text-transparent">Fintrack</span>
      </div>

      <!-- Nav -->
      <nav class="flex-1 px-4 py-6 flex flex-col gap-1.5">
        <NuxtLink
          v-for="item in navItems"
          :key="item.path"
          :to="item.path"
          class="flex items-center gap-3 px-4 py-2.5 rounded-md text-[0.88rem] font-medium text-left w-full transition-all duration-150 cursor-pointer border no-underline"
          :class="route.path === item.path
            ? 'bg-brand/8 text-fg border-brand/20'
            : 'text-muted border-transparent hover:bg-elevated hover:text-fg'"
          @click="sidebarOpen = false"
        >
          <span
            class="flex items-center shrink-0 transition-colors duration-150"
            :class="route.path === item.path ? 'text-brand' : 'text-muted'"
            v-html="item.icon"
          />
          <span>{{ item.label }}</span>
        </NuxtLink>
      </nav>

      <!-- User footer -->
      <div class="px-5 py-4 border-t border-border bg-bg/40 shrink-0">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 rounded bg-elevated border border-border text-fg font-semibold text-[0.85rem] flex items-center justify-center shrink-0">U</div>
          <div class="min-w-0">
            <div class="text-[0.85rem] font-semibold text-fg">User</div>
            <div class="text-[0.75rem] text-muted truncate">user@fintrack.io</div>
          </div>
        </div>
      </div>
    </aside>

    <!-- Main wrapper -->
    <div class="flex-1 flex flex-col overflow-hidden min-w-0">
      <!-- Topbar -->
      <header class="h-16 bg-surface border-b border-border flex items-center gap-4 px-4 md:px-8 shrink-0">
        <button
          class="md:hidden flex items-center justify-center p-1.5 rounded text-muted hover:text-fg transition-colors"
          @click="sidebarOpen = !sidebarOpen"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
        </button>

        <div class="flex-1 flex flex-col gap-0.5">
          <h1 class="m-0 text-[1.05rem] font-semibold text-fg tracking-tight">{{ currentNavLabel }}</h1>
          <span class="text-[0.75rem] text-muted">{{ todayDate }}</span>
        </div>

        <div class="flex items-center gap-2">
          <ThemeToggle />

          <NuxtLink
            to="/add"
            class="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-[0.8rem] font-semibold text-white bg-brand hover:opacity-90 transition-opacity no-underline"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            Tambah
          </NuxtLink>

          <div class="flex items-center gap-1.5 bg-elevated border border-border rounded px-2.5 py-1.5">
            <IconCash :size="13" class="text-cash" />
            <span class="text-[0.7rem] text-muted hidden sm:inline">Cash</span>
            <span class="text-[0.82rem] font-bold" :class="fintrack.walletSummary.value.cash.balance >= 0 ? 'text-cash' : 'text-expense'">
              {{ formatIDR(Math.abs(fintrack.walletSummary.value.cash.balance)) }}
            </span>
          </div>

          <div class="flex items-center gap-1.5 bg-elevated border border-border rounded px-2.5 py-1.5">
            <IconCard :size="13" class="text-digital" />
            <span class="text-[0.7rem] text-muted hidden sm:inline">Digital</span>
            <span class="text-[0.82rem] font-bold" :class="fintrack.walletSummary.value.digital.balance >= 0 ? 'text-digital' : 'text-expense'">
              {{ formatIDR(Math.abs(fintrack.walletSummary.value.digital.balance)) }}
            </span>
          </div>
        </div>
      </header>

      <!-- Page content -->
      <main class="flex-1 overflow-y-auto p-4 md:p-8">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const sidebarOpen = ref(false)
const fintrack = useFintrack()

const navItems = [
  {
    path: '/',
    label: 'Overview',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>`,
  },
  {
    path: '/transactions',
    label: 'Transactions',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>`,
  },
  {
    path: '/add',
    label: 'Add Transaction',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line></svg>`,
  },
]

// Matched on path, not route.name: Nuxt derives names from filenames, so '/'
// is 'index' and the old 'overview' name no longer exists.
const currentNavLabel = computed(() => navItems.find(n => n.path === route.path)?.label ?? '')

const todayDate = computed(() =>
  new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
)

onMounted(() => {
  fintrack.fetchData()
})
</script>
