<template>
  <div class="flex h-screen overflow-hidden bg-[#090a0f]">
    <!-- Sidebar Overlay (mobile) -->
    <div
      v-if="sidebarOpen"
      class="fixed inset-0 bg-black/60 z-[99] md:hidden"
      @click="sidebarOpen = false"
    />

    <!-- Sidebar -->
    <aside
      class="fixed md:static top-0 left-0 bottom-0 w-60 bg-[#11131c] border-r border-[#222533] flex flex-col z-[100] transition-transform duration-250 ease-[cubic-bezier(0.4,0,0.2,1)]"
      :class="sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'"
    >
      <!-- Brand -->
      <div class="flex items-center gap-2.5 px-6 h-16 border-b border-[#222533] shrink-0">
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-[#6366f1] shrink-0"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
        <span class="font-bold text-[1.1rem] tracking-tight bg-gradient-to-br from-white to-[#6366f1] bg-clip-text text-transparent">Fintrack</span>
      </div>

      <!-- Nav -->
      <nav class="flex-1 px-4 py-6 flex flex-col gap-1.5">
        <button
          v-for="item in navItems"
          :key="item.id"
          class="flex items-center gap-3 px-4 py-2.5 rounded-md text-[0.88rem] font-medium text-left w-full transition-all duration-150 cursor-pointer border"
          :class="activeView === item.id
            ? 'bg-[rgba(99,102,241,0.08)] text-[#f3f4f6] border-[rgba(99,102,241,0.2)]'
            : 'text-[#9ca3af] border-transparent hover:bg-[#171a26] hover:text-[#f3f4f6]'"
          @click="activeView = item.id; sidebarOpen = false"
        >
          <span
            class="flex items-center shrink-0 transition-colors duration-150"
            :class="activeView === item.id ? 'text-[#6366f1]' : 'text-[#9ca3af]'"
            v-html="item.icon"
          />
          <span>{{ item.label }}</span>
        </button>
      </nav>

      <!-- User footer -->
      <div class="px-5 py-4 border-t border-[#222533] bg-black/15 shrink-0">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 rounded bg-[#171a26] border border-[#222533] text-[#f3f4f6] font-semibold text-[0.85rem] flex items-center justify-center shrink-0">U</div>
          <div>
            <div class="text-[0.85rem] font-semibold text-[#f3f4f6]">User</div>
            <div class="text-[0.75rem] text-[#9ca3af]">user@fintrack.io</div>
          </div>
        </div>
      </div>
    </aside>

    <!-- Main wrapper -->
    <div class="flex-1 flex flex-col overflow-hidden min-w-0">
      <!-- Topbar -->
      <header class="h-16 bg-[#11131c] border-b border-[#222533] flex items-center gap-4 px-4 md:px-8 shrink-0">
        <!-- Hamburger (mobile only) -->
        <button
          class="md:hidden flex items-center justify-center p-1.5 rounded text-[#9ca3af] hover:text-[#f3f4f6] transition-colors"
          @click="sidebarOpen = !sidebarOpen"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
        </button>

        <div class="flex-1 flex flex-col gap-0.5">
          <h1 class="m-0 text-[1.05rem] font-semibold text-[#f3f4f6] tracking-tight">{{ currentNavLabel }}</h1>
          <span class="text-[0.75rem] text-[#9ca3af]">{{ todayDate }}</span>
        </div>

        <div class="flex items-center">
          <div class="flex items-center gap-2 bg-[#171a26] border border-[#222533] rounded px-3 py-1.5">
            <span class="text-[0.75rem] text-[#9ca3af]">Saldo</span>
            <span class="text-[0.88rem] font-bold" :class="summary.balance >= 0 ? 'text-[#10b981]' : 'text-[#f43f5e]'">
              {{ formatIDR(Math.abs(summary.balance)) }}
            </span>
          </div>
        </div>
      </header>

      <!-- Page content -->
      <main class="flex-1 overflow-y-auto p-4 md:p-8">
        <!-- Overview -->
        <section v-if="activeView === 'overview'" class="animate-fadein">
          <Dashboard :summary="summary" :transactions="transactions" />
        </section>

        <!-- Transactions -->
        <section v-else-if="activeView === 'transactions'" class="animate-fadein">
          <div class="grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-6 items-start">
            <TransactionForm @transaction-added="fetchData" />
            <TransactionList :transactions="transactions" @transaction-deleted="fetchData" />
          </div>
        </section>

        <!-- Add shortcut -->
        <section v-else-if="activeView === 'add'" class="animate-fadein flex justify-center">
          <div class="w-full max-w-[480px]">
            <TransactionForm @transaction-added="() => { fetchData(); activeView = 'transactions'; }" />
          </div>
        </section>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import Dashboard from './components/Dashboard.vue';
import TransactionForm from './components/TransactionForm.vue';
import TransactionList from './components/TransactionList.vue';

const transactions = ref([]);
const summary = ref({ totalIncome: 0, totalExpense: 0, balance: 0 });
const activeView = ref('overview');
const sidebarOpen = ref(false);

const formatIDR = (value) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(value);

const navItems = [
  {
    id: 'overview',
    label: 'Overview',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>`
  },
  {
    id: 'transactions',
    label: 'Transactions',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>`
  },
  {
    id: 'add',
    label: 'Add Transaction',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line></svg>`
  },
];

const currentNavLabel = computed(() => navItems.find(n => n.id === activeView.value)?.label || '');

const todayDate = computed(() => {
  return new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
});

const fetchData = async () => {
  try {
    const [txRes, sumRes] = await Promise.all([
      fetch('/api/transactions'),
      fetch('/api/summary')
    ]);
    transactions.value = await txRes.json();
    summary.value = await sumRes.json();
  } catch (error) {
    console.error('Failed to fetch data:', error);
  }
};

onMounted(() => {
  fetchData();
});
</script>

<style>
@keyframes fadein {
  from { opacity: 0; transform: translateY(4px); }
  to   { opacity: 1; transform: translateY(0); }
}
.animate-fadein { animation: fadein 0.15s ease-out; }

/* Shared card utility */
.card {
  background: #11131c;
  border: 1px solid #222533;
  border-radius: 8px;
  padding: 24px;
}
</style>
