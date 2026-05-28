<template>
  <div class="dashboard-layout">
    <!-- Sidebar -->
    <aside class="sidebar" :class="{ 'sidebar--open': sidebarOpen }">
      <div class="sidebar__brand">
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
        <span class="brand-name">Fintrack</span>
      </div>

      <nav class="sidebar__nav">
        <button
          v-for="item in navItems"
          :key="item.id"
          class="nav-item"
          :class="{ 'nav-item--active': activeView === item.id }"
          @click="activeView = item.id; sidebarOpen = false"
        >
          <span class="nav-icon" v-html="item.icon"></span>
          <span>{{ item.label }}</span>
        </button>
      </nav>

      <div class="sidebar__footer">
        <div class="user-info">
          <div class="user-avatar">U</div>
          <div>
            <div class="user-name">User</div>
            <div class="user-email">user@fintrack.io</div>
          </div>
        </div>
      </div>
    </aside>

    <!-- Overlay for mobile -->
    <div class="sidebar-overlay" :class="{ 'sidebar-overlay--active': sidebarOpen }" @click="sidebarOpen = false"></div>

    <!-- Main content -->
    <div class="main-wrapper">
      <!-- Top bar -->
      <header class="topbar">
        <button class="topbar__hamburger" @click="sidebarOpen = !sidebarOpen">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
        </button>
        <div class="topbar__title">
          <h1>{{ currentNavLabel }}</h1>
          <span class="topbar__date">{{ todayDate }}</span>
        </div>
        <div class="topbar__actions">
          <div class="balance-chip">
            <span class="balance-chip__label">Balance</span>
            <span class="balance-chip__value" :class="summary.balance >= 0 ? 'pos' : 'neg'">
              ${{ Math.abs(summary.balance).toLocaleString('en-US', { minimumFractionDigits: 2 }) }}
            </span>
          </div>
        </div>
      </header>

      <!-- Page views -->
      <main class="page-content">
        <!-- Overview -->
        <section v-if="activeView === 'overview'" class="view">
          <Dashboard :summary="summary" :transactions="transactions" />
        </section>

        <!-- Transactions -->
        <section v-else-if="activeView === 'transactions'" class="view">
          <div class="two-col">
            <TransactionForm @transaction-added="fetchData" />
            <TransactionList :transactions="transactions" @transaction-deleted="fetchData" />
          </div>
        </section>

        <!-- Add transaction shortcut -->
        <section v-else-if="activeView === 'add'" class="view view--centered">
          <TransactionForm @transaction-added="() => { fetchData(); activeView = 'transactions'; }" />
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
  return new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
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
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

*, *::before, *::after { box-sizing: border-box; }

:root {
  --sidebar-w: 240px;
  --topbar-h: 64px;

  --bg: #090a0f;
  --surface: #11131c;
  --surface-2: #171a26;
  --border: #222533;

  --text-primary: #f3f4f6;
  --text-secondary: #9ca3af;

  --accent: #6366f1;
  --accent-dim: rgba(99, 102, 241, 0.08);
  --accent-hover: rgba(99, 102, 241, 0.15);

  --green: #10b981;
  --green-dim: rgba(16, 185, 129, 0.08);
  --red: #f43f5e;
  --red-dim: rgba(244, 63, 94, 0.08);

  --radius-sm: 4px;
  --radius-md: 6px;
  --radius-lg: 8px; /* Crisper look, no bubble feel */
}

html, body {
  margin: 0; padding: 0;
  background: var(--bg);
  color: var(--text-primary);
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  height: 100%;
  -webkit-font-smoothing: antialiased;
}

#app {
  height: 100vh;
  overflow: hidden;
}

/* ─── LAYOUT ─────────────────────────── */
.dashboard-layout {
  display: flex;
  height: 100vh;
  overflow: hidden;
  background: var(--bg);
}

/* ─── SIDEBAR ─────────────────────────── */
.sidebar {
  width: var(--sidebar-w);
  background: var(--surface);
  border-right: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  z-index: 100;
  transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

.sidebar__brand {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 24px;
  height: var(--topbar-h);
  border-bottom: 1px solid var(--border);
  color: var(--text-primary);
  font-weight: 700;
  font-size: 1.1rem;
  letter-spacing: -0.02em;
}

.brand-name {
  background: linear-gradient(135deg, #fff 30%, var(--accent) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.sidebar__nav {
  flex: 1;
  padding: 24px 16px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 16px;
  border: 1px solid transparent;
  background: transparent;
  color: var(--text-secondary);
  border-radius: var(--radius-md);
  cursor: pointer;
  font-size: 0.88rem;
  font-weight: 500;
  text-align: left;
  width: 100%;
  transition: all 0.15s ease;
}

.nav-item:hover {
  background: var(--surface-2);
  color: var(--text-primary);
}

.nav-item--active {
  background: var(--accent-dim);
  color: var(--text-primary);
  border-color: rgba(99, 102, 241, 0.2);
}

.nav-item--active .nav-icon {
  color: var(--accent);
}

.nav-icon {
  display: flex;
  align-items: center;
  flex-shrink: 0;
  color: var(--text-secondary);
  transition: color 0.15s ease;
}

.sidebar__footer {
  padding: 16px 20px;
  border-top: 1px solid var(--border);
  background: rgba(0, 0, 0, 0.15);
}

.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-avatar {
  width: 32px;
  height: 32px;
  border-radius: var(--radius-sm);
  background: var(--surface-2);
  border: 1px solid var(--border);
  color: var(--text-primary);
  font-weight: 600;
  font-size: 0.85rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.user-name {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--text-primary);
}

.user-email {
  font-size: 0.75rem;
  color: var(--text-secondary);
}

.sidebar-overlay {
  display: none;
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.6);
  z-index: 99;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.25s ease;
}

/* ─── MAIN WRAPPER ─────────────────────── */
.main-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  min-width: 0;
}

/* ─── TOPBAR ─────────────────────────── */
.topbar {
  height: var(--topbar-h);
  background: var(--surface);
  border-bottom: 1px solid var(--border);
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 0 32px;
  flex-shrink: 0;
}

.topbar__hamburger {
  display: none;
  background: none;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  padding: 6px;
  border-radius: var(--radius-sm);
  transition: color 0.15s;
  align-items: center;
}

.topbar__hamburger:hover { color: var(--text-primary); }

.topbar__title {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.topbar__title h1 {
  margin: 0;
  font-size: 1.05rem;
  font-weight: 600;
  color: var(--text-primary);
  letter-spacing: -0.01em;
}

.topbar__date {
  font-size: 0.75rem;
  color: var(--text-secondary);
}

.topbar__actions { display: flex; align-items: center; }

.balance-chip {
  display: flex;
  align-items: center;
  gap: 8px;
  background: var(--surface-2);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  padding: 6px 12px;
}

.balance-chip__label {
  font-size: 0.75rem;
  color: var(--text-secondary);
}

.balance-chip__value {
  font-size: 0.88rem;
  font-weight: 700;
}

.balance-chip__value.pos { color: var(--green); }
.balance-chip__value.neg { color: var(--red); }

/* ─── PAGE CONTENT ─────────────────────── */
.page-content {
  flex: 1;
  overflow-y: auto;
  padding: 32px;
}

.view { animation: fadeIn 0.15s ease-out; }

.view--centered {
  display: flex;
  justify-content: center;
}

.view--centered > * {
  max-width: 480px;
  width: 100%;
}

.two-col {
  display: grid;
  grid-template-columns: 360px 1fr;
  gap: 24px;
  align-items: start;
}

/* ─── SHARED CARD ─────────────────────── */
.card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 24px;
}

.card-title {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin: 0 0 16px 0;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(4px); }
  to { opacity: 1; transform: translateY(0); }
}

/* ─── RESPONSIVE ─────────────────────── */
@media (max-width: 900px) {
  .two-col {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .sidebar {
    position: fixed;
    top: 0; left: 0; bottom: 0;
    transform: translateX(-100%);
  }

  .sidebar--open {
    transform: translateX(0);
  }

  .sidebar-overlay {
    display: block;
  }

  .sidebar-overlay--active {
    opacity: 1;
    pointer-events: auto;
  }

  .topbar__hamburger {
    display: flex;
  }

  .page-content {
    padding: 16px;
  }
}
</style>
